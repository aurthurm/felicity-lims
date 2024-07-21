from datetime import datetime
from typing import TypeVar

from domain.analysis.conf import ResultStates, SampleStates
from domain.analysis.ports import ARResultIn
from domain.analysis.ports.repository.result import (
    IAnalysisResultRepository,
    IResultMutationRepository,
)
from domain.analysis.ports.service.result import (
    IResultMutationService,
    IAnalysisResultService,
)
from domain.analysis.schemas import (
    AnalysisResult,
    AnalysisResultCreate,
    AnalysisResultUpdate,
)
from domain.job.conf import JobStates, JobPriorities, JobCategories, JobActions
from domain.job.ports.service import IJobService
from domain.job.schemas import JobCreate
from domain.notification.ports.service import IActivityStreamService
from domain.reflex.ports.service import IReflexEngineService
from domain.setup.ports.service import ILaboratoryService, ILaboratorySettingService
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from domain.user.schemas import User
from domain.worksheet.conf import WSStates
from domain.worksheet.ports.service import IWorkSheetService
from felicity.apps.analysis.entities.results import result_verification

T = TypeVar("T")


class AnalysisResultService(BaseService[AnalysisResult], IAnalysisResultService):
    def __int__(
        self,
        repository: IAnalysisResultRepository,
        job_service: IJobService,
        worksheet_service: IWorkSheetService,
        activity_stream_service: IActivityStreamService,
        result_mutation_service: IResultMutationService,
        reflex_engine_service: IReflexEngineService,
        laboratory_service: ILaboratoryService,
        laboratory_setting_service: ILaboratorySettingService,
    ):
        self.repository = repository
        self.job_service = job_service
        self.worksheet_service = worksheet_service
        self.activity_stream_service = activity_stream_service
        self.result_mutation_service = result_mutation_service
        self.reflex_engine_service = reflex_engine_service
        self.laboratory_service = laboratory_service
        self.laboratory_setting_service = laboratory_setting_service

    async def submit(
        self,
        analysis_results: list[ARResultIn],
        source_object: str,
        source_object_uid: str,
        user: User,
    ) -> str:

        an_results = [result.__dict__ for result in analysis_results]

        # set status of these analysis_results to SUBMITTING
        await self.bulk_update_with_mappings(
            [
                {"uid": _ar["uid"], "status": ResultStates.SUBMITTING}
                for _ar in an_results
            ]
        )

        # submit an results as jobs
        job_schema = JobCreate(
            action=JobActions.RESULT_SUBMIT,
            category=JobCategories.RESULT,
            priority=JobPriorities.MEDIUM,
            job_id="0",
            status=JobStates.PENDING,
            creator_uid=user.uid,
            data=an_results,
        )

        await self.job_service.create(**marshal(job_schema))

        if source_object == "worksheet" and source_object_uid:
            ws = await self.worksheet_service.get(uid=source_object_uid)
            await self.worksheet_service.change_state(ws, WSStates.SUBMITTING, user.uid)
        # elif source_object == "sample" and source_object_uid:
        #     sa = await analysis_models.Sample.get(uid=source_object_uid)
        #     await sa.change_status("processing", user.uid)

        return "Your results are being submitted in the background."

    async def submitter(self, analysis_results: list[dict], submitter):
        return_results = []

        for _ar in analysis_results:
            uid = _ar["uid"]
            a_result = await self.get(uid=uid)
            # only submit results in pending/submitting state
            if a_result.status not in [ResultStates.PENDING, ResultStates.SUBMITTING]:
                return_results.append(a_result)
                continue

            analysis_result = marshal(a_result)
            for field in analysis_result:
                if field in _ar.keys():
                    try:
                        setattr(a_result, field, _ar.get(field, None))
                    except AttributeError as e:
                        pass

            # No Empty Results
            result = getattr(a_result, "result", None)
            if not result or result.strip() == "" or len(result.strip()) == 0:
                setattr(a_result, "result", None)
            else:
                setattr(a_result, "status", ResultStates.RESULTED)

                # set submitter ad date_submitted
                setattr(a_result, "submitted_by_uid", submitter.uid)
                setattr(a_result, "date_submitted", datetime.now())

                # set updated_by
                try:
                    setattr(a_result, "updated_by_uid", submitter.uid)
                except AttributeError:
                    pass

            a_result_in = AnalysisResultUpdate(**marshal(a_result))
            a_result = await super().update(a_result, **marshal(a_result_in))

            # mutate result
            await self.result_mutation_service.mutate(a_result)

            if a_result.status == ResultStates.RESULTED:
                await self.activity_stream_service.stream(
                    a_result, submitter, "submitted", "result"
                )

            # Do Reflex Testing
            await self.reflex_engine_service.do_reflex(
                analysis_result=a_result, user=submitter
            )

            # try to submit sample
            # if a_result.sample:
            #     await a_result.sample.submit(submitted_by=submitter)
            #
            # # try to submit associated worksheet
            # if a_result.worksheet_uid:
            #     await a_result.worksheet.submit(submitter=submitter)

            return_results.append(a_result)
        return return_results

    async def check_verification(
        self, results: list[str | AnalysisResult], verifer: User
    ) -> tuple[list[AnalysisResult] | None, list[AnalysisResult] | None, str, str]:
        """
        splits results into allowed and restricted results.
        allowed results are those that the user is allowed to verify.
        if restricted results are found, the user will be provided with extra messages and suggestions
        """
        message: str = ""
        suggestion: str = ""
        allowed = []
        restricted = []

        laboratory = await self.laboratory_service.get_by_setup_name("felicity")
        settings = await self.laboratory_setting_service.get(
            laboratory_uid=laboratory.uid
        )

        if isinstance(results[0], str):
            results = await self.get_all(uid__in=results)

        for result in results:
            # if allowed globally, or at analysis level: allow
            if settings.allow_self_verification or result.analysis.self_verification:
                allowed.append(result)
            else:
                # First time verifier must not be the submitter
                if (
                    len(result.verified_by) == 0
                    and result.submitted_by_uid == verifer.uid
                ):
                    restricted.append(result)
                else:
                    # cannot co-verify own verifications
                    if verifer.uid in [usr.uid for usr in result.verified_by]:
                        restricted.append(result)
                    else:
                        allowed.append(result)

        _result_data = (
            [
                "(" + r.sample.sample_id + "|" + r.analysis.name + "|" + r.result + ")"
                for r in restricted
            ]
            if restricted
            else []
        )
        if _result_data:
            message = f"Self verification is not allowed for results: {', '.join(_result_data)}."
            suggestion = "The person verifying results must be different from the one who submitted them."

        return allowed, restricted, message, suggestion

    async def _verify(self, analysis_result: AnalysisResult, verifier):
        is_verified = False
        required, current = await self.verifications(analysis_result)
        await self.repository.table_insert(
            table=result_verification,
            mappings={"result_uid": analysis_result.uid, "user_uid": verifier.uid},
        )
        # self.verified_by.append(verifier)
        analysis_result.updated_by_uid = verifier.uid  # noqa
        if current < required and current + 1 == required:
            analysis_result.status = ResultStates.APPROVED
            analysis_result.date_verified = datetime.now()
            is_verified = True
        final = await super().update(analysis_result, **marshal(analysis_result))
        if final.status == ResultStates.APPROVED:
            await self.activity_stream_service.stream(
                final, verifier, "approved", "result"
            )
        return is_verified, final

    async def verify(
        self,
        analyses: list[str],
        source_object: str,
        source_object_uid: str,
        user: User,
    ) -> str:

        # set status of these analysis_results to PROCESSING
        await self.bulk_update_with_mappings(
            [{"uid": uid, "status": ResultStates.APPROVING} for uid in analyses]
        )

        job_schema = JobCreate(
            action=JobActions.RESULT_VERIFY,
            category=JobCategories.RESULT,
            priority=JobPriorities.MEDIUM,
            job_id="0",
            status=JobStates.PENDING,
            creator_uid=user.uid,
            data=analyses,
        )

        await self.job_service.create(**marshal(job_schema))

        if source_object == "worksheet" and source_object_uid:
            ws = await self.worksheet_service.get(uid=source_object_uid)
            await self.worksheet_service.change_state(ws, WSStates.APPROVING, user.uid)
        # elif source_object == "sample" and source_object_uid:
        #     sa = await analysis_models.Sample.get(uid=source_object_uid)
        #     await sa.change_status("APPROVING", user.uid)

        return "Your results are being verified in the background."

    async def verify_from_uids(self, uids: list[str], user):
        to_return = []
        for _ar_uid in uids:
            a_result = await self.get(uid=_ar_uid)
            # No Empty Results
            status = getattr(a_result, "status", None)
            if status in [ResultStates.RESULTED, ResultStates.APPROVING]:
                _, a_result = await self._verify(a_result, verifier=user)
                to_return.append(a_result)
            else:
                continue

            # try to verify associated sample
            # sample_verified = False
            # if a_result.sample:
            #     sample_verified, _ = await a_result.sample.verify(verified_by=user)

            # try to submit associated worksheet
            # if a_result.worksheet_uid:
            #     await a_result.worksheet.verify(verified_by=user)

            # If referral then send results and mark samle as published
            # shipped = await ShippedSample.get(sample_uid=a_result.sample_uid)
            #
            # if shipped:
            #     # 1. create a Job to send the result
            #     job_schema = JobCreate(
            #         action=job_conf.actions.SHIPPED_REPORT,
            #         category=job_conf.categories.SHIPMENT,
            #         priority=job_conf.priorities.MEDIUM,
            #         job_id=shipped.uid,
            #         status=job_conf.states.PENDING,
            #         creator_uid=user.uid,
            #         data={"target": "result", "uid": a_result.uid},
            #     )
            #     await Job.create(job_schema)
            #
            #     # 2. if sample is verifies, then all results are verified, send all samples
            #     if sample_verified:
            #         # 1. create a Job to send results
            #         job_schema = JobCreate(
            #             action=job_conf.actions.SHIPPED_REPORT,
            #             category=job_conf.categories.SHIPMENT,
            #             priority=job_conf.priorities.MEDIUM,
            #             job_id=shipped.uid,
            #             status=job_conf.states.PENDING,
            #             creator_uid=user.uid,
            #             data={"target": "sample", "uid": a_result.sample_uid},
            #         )
            #         await Job.create(job_schema)
            #
            #         # 2. mark sample as published
            #         await a_result.sample.change_status(states.sample.PUBLISHED)

        return to_return

    async def _retract(self, analysis_result: AnalysisResult, retracted_by):
        await self.repository.table_insert(
            table=result_verification,
            mappings={"result_uid": analysis_result.uid, "user_uid": retracted_by.uid},
        )
        analysis_result.status = ResultStates.RETRACTED
        analysis_result.date_verified = datetime.now()
        analysis_result.updated_by_uid = retracted_by.uid  # noqa
        final = await super().update(analysis_result, **marshal(analysis_result))
        if final.status == ResultStates.RETRACTED:
            await self.activity_stream_service.stream(
                final, retracted_by, "retracted", "result"
            )
        return final

    async def retract(self, analyses: list[str], user: User) -> list[AnalysisResult]:

        return_results = []

        for _ar_uid in analyses:
            a_result = await self.get(uid=_ar_uid)

            retest, a_result = await self._retest(
                a_result, retested_by=user, next_action="retract"
            )

            # monkeypatch -> notify of sample state
            # sample = await analysis_models.Sample.get(uid=a_result.sample_uid)
            # await streamer.stream(sample, user, sample.status, "sample")

            # if in worksheet then keep add retest to ws
            if a_result.worksheet_uid:
                retest.worksheet_uid = a_result.worksheet_uid
                retest.worksheet_position = a_result.worksheet_position
                retest.assigned = True
                retest = await super().update(retest, **marshal(retest))

            # add retest
            if retest:
                return_results.append(retest)

            # add original
            return_results.append(a_result)
        return return_results

    async def _retest(
        self, analysis_result: AnalysisResult, retested_by, next_action="verify"
    ):
        retest = None
        if analysis_result.status in [ResultStates.RESULTED]:
            a_result_in = {
                "sample_uid": analysis_result.sample.uid,
                "analysis_uid": analysis_result.analysis_uid,
                "status": ResultStates.PENDING,
                "instrument_uid": analysis_result.instrument_uid,
                "method_uid": analysis_result.method_uid,
                "parent_id": analysis_result.uid,
                "retest": True,
            }
            a_result_schema = AnalysisResultCreate(**a_result_in)
            retest = await super().create(**marshal(a_result_schema))

            await self.hide_report(analysis_result)
            if next_action == "verify":
                _, final = await self._verify(analysis_result, verifier=retested_by)
            elif next_action == "retract":
                final = await self._retract(analysis_result, retracted_by=retested_by)
            else:
                final = analysis_result

            # transition sample back to received state
            # await self.sample.un_submit()
            return retest, final
        return retest, analysis_result

    async def retest(self, analyses: list[str], user: User) -> AnalysisResult:

        retests, originals = await self.retest_from_uids(analyses, user)

        # monkeypatch -> notify of sample state
        # for result in originals:
        #     sample = await analysis_models.Sample.get(uid=result.sample_uid)
        #     await streamer.stream(sample, user, sample.status, "sample")

        return retests + originals

    async def retest_from_uids(self, uids: list[str], user):
        originals = []
        retests = []

        for _ar_uid in uids:
            a_result: AnalysisResult = await self.get(uid=_ar_uid)
            if not a_result:
                raise Exception(f"AnalysisResult with uid {_ar_uid} not found")

            _retest, a_result = await self._retest(
                a_result, retested_by=user, next_action="verify"
            )
            if _retest:
                retests.append(_retest)
            originals.append(a_result)
        return retests, originals

    async def _cancel(self, analysis_result: AnalysisResult, cancelled_by):
        if analysis_result.status in [ResultStates.PENDING]:
            analysis_result.status = ResultStates.CANCELLED
            analysis_result.cancelled_by_uid = cancelled_by.uid
            analysis_result.date_cancelled = datetime.now()
            analysis_result.updated_by_uid = cancelled_by.uid  # noqa
        final = await super().update(analysis_result, **marshal(analysis_result))
        if final.status == ResultStates.CANCELLED:
            await self.activity_stream_service.stream(
                final, cancelled_by, "cancelled", "result"
            )
        return final

    async def cancel(self, analyses: list[str], user: User) -> list[AnalysisResult]:

        return_results = []

        for _ar_uid in analyses:
            a_result = await self.get(uid=_ar_uid)

            # must not belong to a worksheet
            if a_result.assigned:
                return_results.append(a_result)
                continue

            a_result = await self._cancel(a_result, cancelled_by=user)
            if a_result:
                return_results.append(a_result)

        return return_results

    async def _re_instate(self, analysis_result: AnalysisResult, re_instated_by):
        if analysis_result.status in [ResultStates.CANCELLED]:
            analysis_result.status = ResultStates.PENDING
            analysis_result.cancelled_by_uid = None
            analysis_result.date_cancelled = None
            analysis_result.updated_by_uid = re_instated_by.uid  # noqa
        final = await super().update(analysis_result, **marshal(analysis_result))
        if final.status == ResultStates.PENDING:
            await self.activity_stream_service.stream(
                final, re_instated_by, "reinstated", "result"
            )
        return final

    async def re_instate(self, analyses: list[str], user: User) -> list[AnalysisResult]:
        return_results = []

        for _ar_uid in analyses:
            a_result = await self.get(uid=_ar_uid)
            a_result = await self._re_instate(a_result, re_instated_by=user)
            if a_result:
                return_results.append(a_result)

        return return_results

    async def verifications(self, analysis_result: AnalysisResult):
        if analysis_result.analysis.required_verifications:
            required = analysis_result.analysis.required_verifications
        else:
            required = 1
        current = len(analysis_result.verified_by)
        return required, current

    async def last_verificator(self, analysis_result: AnalysisResult):
        _, verifications = await self.verifications(analysis_result)
        if verifications == 0:
            return None
        return analysis_result.verified_by[:-1]

    async def assign(
        self, analysis_result: AnalysisResult, ws_uid, position, instrument_uid
    ):
        analysis_result.worksheet_uid = ws_uid
        analysis_result.assigned = True
        analysis_result.worksheet_position = position
        analysis_result.instrument_uid = instrument_uid if instrument_uid else None
        return await super().update(analysis_result, **marshal(analysis_result))

    async def un_assign(self, analysis_result: AnalysisResult):
        analysis_result.worksheet_uid = None
        analysis_result.assigned = False
        analysis_result.worksheet_position = None
        analysis_result.instrument_uid = None
        return await super().update(analysis_result, **marshal(analysis_result))

    async def change_status(self, analysis_result: AnalysisResult, status):
        analysis_result.status = status
        return await super().update(analysis_result, **marshal(analysis_result))

    async def hide_report(self, analysis_result: AnalysisResult):
        analysis_result.reportable = False
        return await super().update(analysis_result, **marshal(analysis_result))

    async def filter_for_worksheet(
        self,
        analyses_status: str,
        analysis_uid: str,
        sample_type_uid: list[str],
        limit: int,
    ) -> list[AnalysisResult]:

        filters = {
            "status__exact": analyses_status,
            "assigned__exact": False,
            "analysis_uid__exact": analysis_uid,
            "sample___sample_type_uid__exact": sample_type_uid,
            "sample___status": SampleStates.RECEIVED,
        }
        sort_attrs = ["-sample___priority", "sample___sample_id", "-created_at"]

        return await super().filter(filters, sort_attrs, limit)


class ResultMutationService(BaseService[T], IResultMutationService):
    def __init__(
        self,
        repository: IResultMutationRepository,
        analysis_result_service: IAnalysisResultService,
    ):
        self.repository = repository
        self.analysis_result_service = analysis_result_service

    async def mutate(self, result: AnalysisResult):
        result_in = result.result

        correction_factors = result.analysis.correction_factors
        specifications = result.analysis.specifications
        detection_limits = result.analysis.detection_limits
        uncertainties = result.analysis.uncertainties

        if isinstance(result.result, int):
            # Correction factor
            for cf in correction_factors:
                if (
                    cf.instrument_uid == result.instrument_uid
                    and cf.method_uid == result.method_uid
                ):
                    await super().create(
                        **{
                            "result_uid": result.uid,
                            "before": result.result,
                            "after": result.result * cf.factor,
                            "mutation": f"Multiplied the result {result.result} with a correction factor of {cf.factor}",
                            "date": datetime.now(),
                        }
                    )
                    result.result = result.result * cf.factor

            # Specifications: Take more priority than DL
            for spec in specifications:
                # Min
                if result.result < spec.min_warn:
                    await super().create(
                        **{
                            "result_uid": result.uid,
                            "before": result.result,
                            "after": spec.min_report,
                            "mutation": f"Result was less than the minimun warning specification {spec.min_warn} and must be reported as {spec.min_report}",
                            "date": datetime.now(),
                        }
                    )
                    result.result = spec.min_report

                elif result.result < spec.min:
                    result.result = result.result

                # Max
                if result.result > spec.max_warn:
                    await super().create(
                        **{
                            "result_uid": result.uid,
                            "before": result.result,
                            "after": spec.max_report,
                            "mutation": f"Result was greater than the maximun warning specification {spec.max_warn} and must be reported as {spec.max_report}",
                            "date": datetime.now(),
                        }
                    )
                    result.result = spec.max_report

                elif result.result > spec.max:
                    result.result = result.result

            # Detection Limit Check
            for dlim in detection_limits:
                if result.result < dlim.lower_limit:
                    await super().create(
                        **{
                            "result_uid": result.uid,
                            "before": result.result,
                            "after": f"< {dlim.lower_limit}",
                            "mutation": f"Result fell below the Lower Detection Limit {dlim.lower_limit} and must be reported as < {dlim.lower_limit}",
                            "date": datetime.now(),
                        }
                    )
                    result.result = f"< {dlim.lower_limit}"

                if result.result > dlim.upper_limit:
                    await super().create(
                        **{
                            "result_uid": result.uid,
                            "before": result.result,
                            "after": f"> {dlim.upper_limit}",
                            "mutation": f"Result fell Above the Upper Detection Limit {dlim.upper_limit} and must be reported as > {dlim.upper_limit}",
                            "date": datetime.now(),
                        }
                    )
                    result.result = f"> {dlim.upper_limit}"

            # uncertainty
            if isinstance(result.result, int):
                for uncert in uncertainties:
                    if uncert.min <= result.result <= uncert.max:
                        await super().create(
                            **{
                                "result_uid": result.uid,
                                "before": result.result,
                                "after": f"{result.result} +/- {uncert.value}",
                                "mutation": f"Result fell inside the range [{uncert.min},{uncert.max}]  with an un uncertainty of +/- {uncert.value}",
                                "date": datetime.now(),
                            }
                        )
                        result.result = f"{result.result} +/- {uncert.value}"

        elif isinstance(result.result, str):
            for spec in specifications:
                if result.result in spec.warn_values.split(","):
                    await super().create(
                        **{
                            "result_uid": result.uid,
                            "before": result.result,
                            "after": spec.warn_report,
                            "mutation": f"Result with specification (result ::equals:: {result.result}) must be reported as {spec.warn_report}",
                            "date": datetime.now(),
                        }
                    )
                    result.result = spec.warn_report

        if result_in != result.result:
            await self.analysis_result_service.update(result, **marshal(result))
