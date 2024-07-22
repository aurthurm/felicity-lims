from typing import Annotated
from felicity.apps.abstract.service import BaseService
from felicity.apps.analysis.entities.results import AnalysisResult, ResultMutation
from felicity.apps.analysis.repository.results import AnalysisResultRepository, ResultMutationRepository
from felicity.apps.analysis.schemas import AnalysisResultCreate, AnalysisResultUpdate


class AnalysisResultService(BaseService[AnalysisResult, AnalysisResultCreate, AnalysisResultUpdate]):
    def __init__(self):
        super().__init__(AnalysisResultRepository)

    async def verifications(self) -> tuple[
        Annotated[int, "Total number required verifications"],
        Annotated[int, "current number of verifications"]
    ]:
        required = self.analysis.required_verifications if self.analysis.required_verifications else 1
        current = len(self.verified_by)
        return required, current

    # async def last_verificator(self):
    #     _, verifications = await self.verifications()
    #     if verifications == 0:
    #         return None
    #     return self.verified_by[:-1]

    async def retest_result(
            self, retested_by, next_action="verify"
    ) -> tuple[
             Annotated[
                 "AnalysisResult", "Newly Created AnalysisResult"] | None,
             Annotated[
                 "AnalysisResult", "Retested AnalysisResult"]
         ] | None:
        retest = None
        if self.status in [conf.states.result.RESULTED]:
            a_result_in = {
                "sample_uid": self.sample.uid,
                "analysis_uid": self.analysis_uid,
                "status": conf.states.result.PENDING,
                "laboratory_instrument_uid": self.laboratory_instrument_uid,
                "method_uid": self.method_uid,
                "parent_id": self.uid,
                "retest": True,
            }
            a_result_schema = schemas.AnalysisResultCreate(**a_result_in)
            retest = await AnalysisResult.create(a_result_schema)

            await self.hide_report()
            if next_action == "verify":
                _, final = await self.verify(verifier=retested_by)
            elif next_action == "retract":
                final = await self.retract(retracted_by=retested_by)
            else:
                final = self

            # transition sample back to received state
            await self.sample.un_submit()
            return retest, final
        return retest, self

    async def assign(self, ws_uid, position, laboratory_instrument_uid):
        self.worksheet_uid = ws_uid
        self.assigned = True
        self.worksheet_position = position
        self.laboratory_instrument_uid = (
            laboratory_instrument_uid if laboratory_instrument_uid else None
        )
        return await self.save_async()

    async def un_assign(self):
        self.worksheet_uid = None
        self.assigned = False
        self.worksheet_position = None
        self.laboratory_instrument_uid = None
        return await self.save_async()

    async def verify(self, verifier) -> tuple[bool, "AnalysisResult"]:
        is_verified = False
        required, current = await self.verifications()
        self.updated_by_uid = verifier.uid  # noqa
        if current < required and current + 1 == required:
            await self._verify(verifier_uid=verifier.uid)
            self.status = conf.states.result.APPROVED
            self.date_verified = datetime.now()
            is_verified = True
            # self.verified_by.append(verifier)

        final = await self.save_async()
        if final.status == conf.states.result.APPROVED:
            await streamer.stream(final, verifier, "approved", "result")
        return is_verified, final

    async def _verify(self, verifier_uid):
        await AnalysisResult.table_insert(
            table=result_verification,
            mappings={"result_uid": self.uid, "user_uid": verifier_uid}
        )

    async def retract(self, retracted_by) -> "AnalysisResult":
        self.status = conf.states.result.RETRACTED
        self.date_verified = datetime.now()
        self.updated_by_uid = retracted_by.uid  # noqa
        final = await self.save_async()
        if final.status == conf.states.result.RETRACTED:
            await streamer.stream(final, retracted_by, "retracted", "result")
            await self._verify(verifier_uid=retracted_by.uid)
        return final

    async def cancel(self, cancelled_by) -> "AnalysisResult":
        if self.status in [conf.states.result.PENDING]:
            self.status = conf.states.result.CANCELLED
            self.cancelled_by_uid = cancelled_by.uid
            self.date_cancelled = datetime.now()
            self.updated_by_uid = cancelled_by.uid  # noqa
        final = await self.save_async()
        if final.status == conf.states.result.CANCELLED:
            await streamer.stream(final, cancelled_by, "cancelled", "result")
        return final

    async def re_instate(self, re_instated_by) -> "AnalysisResult":
        if self.sample.status not in [
            conf.states.sample.RECEIVED,
            conf.states.sample.EXPECTED,
        ]:
            raise Exception(
                "You can only reinstate analytes of due and received samples"
            )

        if self.status in [conf.states.result.CANCELLED]:
            self.status = conf.states.result.PENDING
            self.cancelled_by_uid = None
            self.date_cancelled = None
            self.updated_by_uid = re_instated_by.uid  # noqa
        final = await self.save_async()
        if final.status == conf.states.result.PENDING:
            await streamer.stream(final, re_instated_by, "reinstated", "result")
        return final

    async def change_status(self, status) -> "AnalysisResult":
        self.status = status
        return await self.save_async()

    async def hide_report(self) -> "AnalysisResult":
        self.reportable = False
        return await self.save_async()

    @classmethod
    async def filter_for_worksheet(
            cls,
            analyses_status: str,
            analysis_uid: str,
            sample_type_uid: list[str],
            limit: int,
    ) -> list["AnalysisResult"]:

        filters = {
            "status__exact": analyses_status,
            "assigned__exact": False,
            "analysis_uid__exact": analysis_uid,
            "sample___sample_type_uid__exact": sample_type_uid,
            "sample___status": conf.states.sample.RECEIVED,
        }
        sort_attrs = ["-sample___priority", "sample___sample_id", "-created_at"]

        analytes_stmt = cls.smart_query(filters=filters, sort_attrs=sort_attrs)
        stmt = analytes_stmt.limit(limit)

        # available: int = await cls.count_where(filters=filters)

        async with async_session_factory() as session:
            analyses_results = (await session.execute(stmt)).scalars().all()

        return analyses_results


class ResultMutationService(BaseService[ResultMutation]):
    def __init__(self):
        super().__init__(ResultMutationRepository)
