import logging
from typing import TYPE_CHECKING

from felicity.apps.analysis.entities.results import AnalysisResult
from felicity.apps.analysis.enum import ResultState, SampleState
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.setup.services import LaboratoryService, LaboratorySettingService
from felicity.core.tenant_context import get_current_lab_uid

if TYPE_CHECKING:
    pass

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AnalysisResultWorkFlowException(Exception): ...


class AnalysisResultWorkFlow:
    """AnalysisResultWorkFlow
    Defines a set of guard that allow or prevent actions taken on AnalysisResult
    """

    def __init__(self):
        self.analysis_result_service = AnalysisResultService()

    async def revert(self, uid: str, by_uid: str) -> None:
        # to_status = ResultState.PENDING
        # await self.analysis_result_service.change_status(uid, to_status)
        raise NotImplementedError()

    async def retest(
            self, uid, retested_by, action="verify"
    ) -> tuple[AnalysisResult, AnalysisResult]:
        result = await self.analysis_result_service.get(uid=uid)
        await self._guard_retest(result)
        return await self.analysis_result_service.retest_result(
            result.uid, retested_by, action
        )

    @staticmethod
    async def _guard_retest(analysis_result: AnalysisResult) -> bool:
        allow = False
        if analysis_result.status == ResultState.RESULTED:
            allow = True

        if not allow:
            raise AnalysisResultWorkFlowException("Cannot retest this Result")
        return True

    async def assign(self, uid, ws_uid, position, laboratory_instrument_uid):
        result = await self.analysis_result_service.get(uid=uid)
        await self._guard_assign(result)
        return await self.analysis_result_service.assign(
            result.uid, ws_uid, position, laboratory_instrument_uid
        )

    @staticmethod
    async def _guard_assign(analysis_result: AnalysisResult) -> bool:
        allow = False
        if (
                analysis_result.status == ResultState.PENDING
                and analysis_result.assigned is False
        ):
            allow = True

        if not allow:
            raise AnalysisResultWorkFlowException("Cannot assign this Result")
        return True

    async def un_assign(self, uid):
        result = await self.analysis_result_service.get(uid=uid)
        await self._guard_un_assign(result)
        return await self.analysis_result_service.un_assign(result.uid)

    @staticmethod
    async def _guard_un_assign(analysis_result: AnalysisResult) -> bool:
        allow = False
        if (
                analysis_result.status == ResultState.PENDING
                and analysis_result.assigned is True
        ):
            allow = True

        if not allow:
            raise AnalysisResultWorkFlowException("Cannot un-assign this Result")
        return True

    async def retract(self, uid, retracted_by):
        result = await self.analysis_result_service.get(uid=uid)
        await self._guard_retract(result)
        return await self.analysis_result_service.retract(result.uid, retracted_by)

    @staticmethod
    async def _guard_retract(analysis_result: AnalysisResult) -> bool:
        allow = analysis_result.status == ResultState.RESULTED
        if not allow:
            raise AnalysisResultWorkFlowException("Cannot retract this Result")
        return True

    async def cancel(self, uid, cancelled_by):
        result = await self.analysis_result_service.get(uid=uid)
        await self._guard_cancel(result)
        return await self.analysis_result_service.cancel(result.uid, cancelled_by)

    @staticmethod
    async def _guard_cancel(analysis_result: AnalysisResult) -> bool:
        allow = analysis_result.status == ResultState.PENDING
        if not allow:
            raise AnalysisResultWorkFlowException("Cannot cancel this Result")
        return True

    async def re_instate(self, uid, re_instated_by):
        result = await self.analysis_result_service.get(uid=uid, related=["sample"])
        await self._guard_re_instate(result)
        return await self.analysis_result_service.re_instate(result.uid, re_instated_by)

    @staticmethod
    async def _guard_re_instate(analysis_result: AnalysisResult) -> bool:
        if analysis_result.sample.status != SampleState.RECEIVED:
            raise Exception("You can only reinstate analytes of received samples")

        allow = analysis_result.status == ResultState.CANCELLED
        if not allow:
            raise AnalysisResultWorkFlowException("Cannot re-instate this Result")
        return True

    async def submit(
            self, data: list[dict], submitter
    ) -> tuple[list[AnalysisResult], list[AnalysisResult]]:
        _skipped = []
        _submitted = []
        for datum in data:
            result = await self.analysis_result_service.get(uid=datum["uid"])
            is_allowed = await self._guard_submit(result)
            if not is_allowed:
                _skipped.append(result)
                continue
            # Submit
            _submitted.append(
                await self.analysis_result_service.submit(result.uid, datum, submitter)
            )
        await self.analysis_result_service.snapshot(_submitted)
        return _skipped, _submitted

    async def _guard_submit(self, result: AnalysisResult) -> bool:
        if result.status not in [ResultState.PENDING]:
            return False
        return True

    async def approve(
            self, result_uids: list[str], approved_by
    ) -> list[AnalysisResult]:
        results = await self.analysis_result_service.get_all(
            related=["analysis"], uid__in=result_uids
        )
        await self._guard_approve(results, approved_by.uid)
        return [
            (await self.analysis_result_service.verify(r.uid, approved_by))
            for r in results
        ]

    async def _guard_approve(
            self, analysis_results: list[AnalysisResult], approved_by_uid
    ) -> bool:
        lab_id = get_current_lab_uid()
        laboratory = await LaboratoryService().get(uid=lab_id)
        settings = await LaboratorySettingService().get(laboratory_uid=laboratory.uid)
        states = [ResultState.RESULTED]

        for result in analysis_results:
            # Self Verification check
            if (
                    settings.allow_self_verification is False
                    and result.analysis.self_verification is False
            ):
                # First time verifier must not be the submitter
                if (
                        len(result.verified_by) == 0
                        and result.submitted_by_uid == approved_by_uid
                ):
                    raise AnalysisResultWorkFlowException(
                        "Cannot approve a result your own work"
                    )
                # Cannot self co-approve
                if approved_by_uid in [usr.uid for usr in result.verified_by]:
                    raise AnalysisResultWorkFlowException("Cannot co-approve a result")

            # Status check
            if result.status not in states:
                raise AnalysisResultWorkFlowException(
                    f"Cannot approve a {result.status} Result"
                )

            # Number of required verifications check
            required, verifiers = await self.analysis_result_service.verifications(
                result.uid
            )
            # if not (current < required and current + 1 == required):
            # TODO: Needs checking
            if required < len(verifiers):
                raise AnalysisResultWorkFlowException(
                    "Required approvals have been met"
                )

        return True
