import asyncio
import logging
from datetime import timedelta
from typing import List

import strawberry  # noqa

from felicity.api.gql.analysis.types import analysis as a_types
from felicity.api.gql.analysis.types import results as r_types
from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import CanVerifySample, IsAuthenticated
from felicity.api.gql.types import (
    OperationError,
    OperationSuccess,
    SuccessErrorResponse,
)
from felicity.apps.analysis import schemas
from felicity.apps.analysis.entities.analysis import (
    sample_analysis,
    sample_profile,
    sample_rejection_reason,
)
from felicity.apps.analysis.enum import ResultState, SamplePriority, SampleState
from felicity.apps.analysis.services.analysis import (
    AnalysisRequestService,
    AnalysisService,
    AnalysisTemplateService,
    ProfileService,
    RejectionReasonService,
    SampleService,
    SampleTypeService,
)
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.analysis.workflow.analysis_result import AnalysisResultWorkFlow
from felicity.apps.analysis.workflow.sample import SampleWorkFlow
from felicity.apps.billing.utils import bill_order
from felicity.apps.client.services import ClientService
from felicity.apps.iol.redis import process_tracker
from felicity.apps.iol.redis.enum import TrackableObject
from felicity.apps.job import schemas as job_schemas
from felicity.apps.job.enum import JobAction, JobCategory, JobPriority, JobState
from felicity.apps.job.services import JobService
from felicity.apps.notification.services import ActivityStreamService
from felicity.apps.patient.services import PatientService
from felicity.apps.reflex.services import ReflexEngineService
from felicity.apps.setup.caches import get_laboratory_setting
from felicity.core.dtz import timenow_dt
from felicity.apps.impress.sample.utils import exclude

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ARSampleInputType:
    sample_type: str
    profiles: List[str]
    analyses: List[str]
    date_collected: str


@strawberry.input
class SampleRejectInputType:
    uid: str
    reasons: List[str]
    other: str | None = ""


@strawberry.input
class SamplePublishInputType:
    uid: str
    action: str = ""


AnalysisRequestResponse = strawberry.union(
    "AnalysisRequestResponse",
    (a_types.AnalysisRequestWithSamples, OperationError),  # noqa
    description="Union of possible outcomes when adding/editing analysis " "requests ",
)


@strawberry.type
class ResultedSampleListingType:
    samples: List[r_types.SamplesWithResults]


ResultedSampleActionResponse = strawberry.union(
    "ResultedSampleActionResponse",
    (ResultedSampleListingType, OperationError),  # noqa
    description="Union of possible outcomes when actioning samples",
)


@strawberry.type
class SampleListingType:
    samples: List[r_types.SampleType]


SampleActionResponse = strawberry.union(
    "SampleActionResponse",
    (SampleListingType, OperationError),  # noqa
    description="Union of possible outcomes when actioning samples",
)


@strawberry.input
class AnalysisRequestInputType:
    patient_uid: str
    client_uid: str
    client_contact_uid: str
    clinicalData: str | None = ""
    samples: List[ARSampleInputType] = None
    client_request_id: str | None = None
    internal_use: bool | None = False
    priority: int = SamplePriority.NORMAL


@strawberry.input
class ManageAnalysisInputType:
    cancel: list[str] | None = None
    add: list[str] | None = None


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_analysis_request(
        info, payload: AnalysisRequestInputType
) -> AnalysisRequestResponse:
    logger.info("Received request to create analysis request")

    felicity_user = await auth_from_info(info)

    # are samples valid
    for _s in payload.samples:
        _valid = [len(_s.profiles) > 0, len(_s.analyses) > 0]
        if not any(_valid):
            return OperationError(
                error="Samples must have either analysis or profiles or both"
            )

    patient = await PatientService().get(uid=payload.patient_uid)
    if not patient:
        return OperationError(error=f"Patient with uid {payload.patient_uid} Not found")

    client = await ClientService().get(uid=payload.client_uid)
    if not client:
        return OperationError(error=f"Client with uid {payload.client_uid} Not found")

    if len(payload.samples) == 0:
        return OperationError(error="Samples are required")

    # create the ar
    incoming = {
        "patient_uid": payload.patient_uid,
        "client_uid": payload.client_uid,
        "request_id": None,
        "client_request_id": payload.client_request_id,
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }

    obj_in = schemas.AnalysisRequestCreate(**incoming)
    analysis_request = await AnalysisRequestService().create(obj_in)

    # 1. create samples
    logger.info(
        f"Adding {len(payload.samples)} samples to the analysis request {analysis_request.client_request_id}"
    )
    for s in payload.samples:
        _st_uid = s.sample_type
        stype = await SampleTypeService().get(uid=_st_uid)
        if not stype:
            return OperationError(
                error=f"Error, failed to retrieve sample type {_st_uid}"
            )

        sample_in = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "analysis_request_uid": analysis_request.uid,
            "date_collected": s.date_collected,
            "sample_type_uid": _st_uid,
            "sample_id": None,
            "priority": payload.priority,
            "status": SampleState.EXPECTED,
            "metadata_snapshot": {}
        }

        profiles = []
        analyses = []
        _profiles_analyses = set()

        for p_uid in s.profiles:
            profile = await ProfileService().get(related=["analyses"], uid=p_uid)
            profiles.append(profile)
            analyses_ = profile.analyses
            for _an in analyses_:
                _profiles_analyses.add(_an)

        # make sure the selected analyses are not part of the selected profiles
        for a_uid in s.analyses:
            analysis = await AnalysisService().get(uid=a_uid)
            if analysis not in _profiles_analyses:
                analyses.append(analysis)
                _profiles_analyses.add(analysis)

        # determine sample due date
        tat_lengths = []
        for anal in _profiles_analyses:
            if anal.tat_length_minutes:
                tat_lengths.append(anal.tat_length_minutes)
        if tat_lengths:
            minutes = max(tat_lengths)
            sample_in["due_date"] = timenow_dt() + timedelta(minutes=minutes)

        sample_schema = schemas.SampleCreate(
            **sample_in
        )
        sample = await SampleService().create(sample_schema)
        sample = await SampleService().snapshot(
            sample, {
                "sample_type": stype.snapshot(),
                "client": client.snapshot(),
                "profiles": [p.snapshot() for p in profiles],
                "analyses": [a.snapshot() for a in analyses]
            }
        )

        # auto receive samples
        _, lab_setting = await get_laboratory_setting()
        if lab_setting.auto_receive_samples:
            await SampleService().receive(sample.uid, received_by=felicity_user)

        # link sample to provided profiles
        for _prof in profiles:
            await SampleService().repository.table_insert(
                table=sample_profile,
                mappings=[{"sample_uid": sample.uid, "profile_uid": _prof.uid}],
            )

        # link sample to provided services
        for _anal in analyses:
            await SampleService().repository.table_insert(
                table=sample_analysis,
                mappings=[{"sample_uid": sample.uid, "analysis_uid": _anal.uid}],
            )

        # create and attach result objects for each Analyses
        logger.info(
            f"Adding {len(_profiles_analyses)} service results to the sample {sample.sample_id}"
        )
        a_result_schema = schemas.AnalysisResultCreate(
            sample_uid=sample.uid,
            status=ResultState.PENDING,
            analysis_uid=None,
            due_date=None,
            metadata_snapshot={},
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )
        result_schemas = []
        for _service in _profiles_analyses:
            result_schemas.append(
                a_result_schema.model_copy(
                    update={
                        "analysis_uid": _service.uid,
                        "due_date": (
                            timenow_dt()
                            + timedelta(minutes=_service.tat_length_minutes)
                            if _service.tat_length_minutes
                            else None
                        ),
                    }
                )
            )
        created = await AnalysisResultService().bulk_create(
            result_schemas, related=["sample", "analysis"]
        )
        await AnalysisResultService().snapshot(created)

        # initialise reflex action if exist
        logger.info("ReflexUtil .... set_reflex_actions ...")
        await ReflexEngineService().set_reflex_actions(created)

    # ! paramount !
    await asyncio.sleep(1)

    analysis_request = await AnalysisRequestService().get(
        related=["samples"], uid=analysis_request.uid
    )

    # auto_bill=True during sample registration
    await bill_order(analysis_request, auto_bill=True)
    _ar = analysis_request.marshal_simple()
    del _ar["client"]
    return a_types.AnalysisRequestWithSamples(**_ar)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def clone_samples(info, samples: List[str]) -> SampleActionResponse:
    felicity_user = await auth_from_info(info)

    if len(samples) == 0:
        return OperationError(error="No Samples to clone are provided!")

    clones = []
    to_clone = await SampleService().get_by_uids(uids=samples)
    for _, _sample in enumerate(to_clone):
        clone = await SampleService().clone_afresh(_sample.uid, felicity_user)
        await SampleService().snapshot(clone, {})

        if clone:
            clones.append(clone)

            # create associated analysis
            _profiles_analyses = set()

            for _prof in clone.profiles:
                analyses_ = _prof.analyses
                for _an in analyses_:
                    _profiles_analyses.add(_an)

            for _anal in clone.analyses:
                if _anal not in _profiles_analyses:
                    _profiles_analyses.add(_anal)

            for _service in _profiles_analyses:
                a_result_in = {
                    "sample_uid": clone.uid,
                    "analysis_uid": _service.uid,
                    "status": ResultState.PENDING,
                    "metadata_snapshot": {}
                }
                a_result_schema = schemas.AnalysisResultCreate(**a_result_in)
                created = await AnalysisResultService().create(
                    a_result_schema, related=["sample", "analysis"]
                )
                await AnalysisResultService().snapshot([created])
                await ReflexEngineService().set_reflex_actions([created])

    clones = [
        (await SampleService().get(related=["sample_type"], uid=clone.uid))
        for clone in clones
    ]
    return SampleListingType(samples=clones)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def cancel_samples(info, samples: List[str]) -> ResultedSampleActionResponse:
    felicity_user = await auth_from_info(info)
    return_samples = []

    if len(samples) == 0:
        return OperationError(error="No Samples to cancel are provided!")

    for _sa_uid in samples:
        sample = await SampleService().get(uid=_sa_uid)
        if not sample:
            return OperationError(error=f"Sample with uid {_sa_uid} not found")

        # only samples with unassigned analyses can be cancelled
        analysis_results = await SampleService().get_analysis_results(sample.uid)
        match = [result.assigned for result in analysis_results]
        if any(match):
            return_samples.append(sample)
            continue

        sample = await SampleWorkFlow().cancel(sample.uid, cancelled_by=felicity_user)
        if sample:
            return_samples.append(sample)

    return ResultedSampleListingType(samples=return_samples)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def re_instate_samples(info, samples: List[str]) -> ResultedSampleActionResponse:
    felicity_user = await auth_from_info(info)

    return_samples = []

    if len(samples) == 0:
        return OperationError(error="No Samples to re instate are provided!")

    for _sa_uid in samples:
        sample = await SampleService().get(uid=_sa_uid)
        if not sample:
            return OperationError(error=f"Sample with uid {_sa_uid} not found")

        sample = await SampleWorkFlow().re_instate(
            sample.uid, re_instated_by=felicity_user
        )
        if sample:
            return_samples.append(sample)

    return ResultedSampleListingType(samples=return_samples)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def receive_samples(info, samples: List[str]) -> ResultedSampleActionResponse:
    felicity_user = await auth_from_info(info)

    return_samples = []

    if len(samples) == 0:
        return OperationError(error="No Samples to receive are provided!")

    for _sa_uid in samples:
        sample = await SampleService().get(uid=_sa_uid)
        if not sample:
            return OperationError(error=f"Sample with uid {_sa_uid} not found")

        sample = await SampleWorkFlow().receive(sample.uid, received_by=felicity_user)
        if sample:
            return_samples.append(sample)

    return ResultedSampleListingType(samples=return_samples)


@strawberry.mutation(permission_classes=[CanVerifySample])
async def verify_samples(info, samples: List[str]) -> SampleActionResponse:
    felicity_user = await auth_from_info(info)

    return_samples = []

    if len(samples) == 0:
        return OperationError(error="No Samples to verify are provided!")

    for _sa_uid in samples:
        sample = await SampleService().get(uid=_sa_uid)
        if not sample:
            return OperationError(error=f"Sample with uid {_sa_uid} not found")

        _, sample = await SampleWorkFlow().approve(
            sample.uid, approved_by=felicity_user
        )
        if sample:
            return_samples.append(sample)

    return SampleListingType(samples=return_samples)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def reject_samples(
        info, samples: List[SampleRejectInputType]
) -> SampleActionResponse:
    felicity_user = await auth_from_info(info)

    return_samples = []

    if len(samples) == 0:
        return OperationError(error="No Samples to verify are provided!")

    for _sam in samples:
        sample = await SampleService().get(uid=_sam.uid)
        if not sample:
            return OperationError(error=f"Sample with uid {_sam.uid} not found")

        for re_uid in _sam.reasons:
            reason = await RejectionReasonService().get(uid=re_uid)
            if not reason:
                return OperationError(
                    error=f"RejectionReason with uid {re_uid} not found"
                )

            # TODO: Transactions
            sample = await SampleWorkFlow().reject(
                sample.uid, rejected_by=felicity_user
            )
            await SampleService().repository.table_insert(
                sample_rejection_reason,
                [{"sample_uid": sample.uid, "rejection_reason_uid": reason.uid}],
            )

            if sample:  # noqa
                return_samples.append(sample)

                if sample.status == SampleState.REJECTED:
                    for analyte in sample.analysis_results:
                        await AnalysisResultWorkFlow().cancel(
                            analyte.uid, cancelled_by=felicity_user
                        )

    return SampleListingType(samples=return_samples)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def publish_samples(
        info, samples: List[SamplePublishInputType]
) -> SuccessErrorResponse:
    felicity_user = await auth_from_info(info)

    if len(samples) == 0:
        return OperationError(error="No samples to impress are provided!")

    # set status of these samples to PUBLISHING for those whose action is "publish" !important
    final_publish = list(filter(lambda p: p.action == "publish", samples))
    not_final = list(filter(lambda p: p.action != "publish", samples))

    data = [{"uid": s.uid, "action": s.action} for s in samples]  # noqa
    job_schema = job_schemas.JobCreate(
        action=JobAction.IMPRESS_REPORT,
        category=JobCategory.IMPRESS,
        priority=JobPriority.NORMAL,
        job_id="0",
        status=JobState.PENDING,
        creator_uid=felicity_user.uid,
        data=data,
    )

    await JobService().create(job_schema)
    if final_publish:
        for sample in final_publish:
            await process_tracker.process(
                uid=sample.uid, object_type=TrackableObject.SAMPLE
            )

    # TODO: clean up below - probably no longer necessary - needs checking
    # !important for frontend
    # unfreeze frontend and return sample to original state since it is a non final publish
    if not_final:
        ns_samples = await SampleService().get_by_uids([nf.uid for nf in not_final])
        for sample in ns_samples:
            await ActivityStreamService().stream(
                sample, felicity_user, sample.status, "sample"
            )

    return OperationSuccess(
        message="Your results are being published in the background."
    )


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def print_samples(info, samples: List[str]) -> SampleActionResponse:
    felicity_user = await auth_from_info(info)

    return_samples = []

    if len(samples) == 0:
        return OperationError(error="No Samples to print are provided!")

    for _sa_uid in samples:
        sample = await SampleService().get(uid=_sa_uid)
        if not sample:
            return OperationError(error=f"Sample with uid {_sa_uid} not found")

        sample = await SampleWorkFlow().print(sample.uid, printed_by=felicity_user)
        if sample:
            return_samples.append(sample)

    return SampleListingType(samples=return_samples)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def invalidate_samples(info, samples: List[str]) -> SampleActionResponse:
    felicity_user = await auth_from_info(info)

    return_samples = []

    if len(samples) == 0:
        return OperationError(error="No Samples to invalidate are provided!")

    for _sa_uid in samples:
        sample = await SampleService().get(uid=_sa_uid)
        if not sample:
            return OperationError(error=f"Sample with uid {_sa_uid} not found")

        copy, invalidated = await SampleWorkFlow().invalidate(
            sample.uid, invalidated_by=felicity_user
        )

        # add invalidated
        if invalidated:
            return_samples.append(invalidated)

        # add copy and create analytes
        if copy:
            return_samples.append(copy)

            # create associated analysis
            _profiles_analyses = set()

            for _prof in copy.profiles:
                analyses_ = _prof.analyses
                for _an in analyses_:
                    _profiles_analyses.add(_an)

            for _anal in copy.analyses:
                if _anal not in _profiles_analyses:
                    _profiles_analyses.add(_anal)

            for _service in _profiles_analyses:
                a_result_in = {
                    "sample_uid": copy.uid,
                    "analysis_uid": _service.uid,
                    "status": ResultState.PENDING,
                }
                a_result_schema = schemas.AnalysisResultCreate(**a_result_in)
                await AnalysisResultService().create(a_result_schema)

    return SampleListingType(samples=return_samples)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def samples_apply_template(
        info, uid: str, analysis_template_uid: str
) -> ResultedSampleActionResponse:
    felicity_user = await auth_from_info(info)

    sample = await SampleService().get(uid=uid)
    if sample.status not in [
        SampleState.RECEIVED,
        SampleState.AWAITING,
        SampleState.APPROVED,
    ]:
        return OperationError(
            error=f"Samples in {sample.status} can not be added analyses"
        )

    template = await AnalysisTemplateService().get(uid=analysis_template_uid)

    pending_results = await AnalysisResultService().get_all(
        sample_uid=sample.uid, status=ResultState.PENDING, worksheet_uid=None
    )
    pending_uids = [pr.analysis_uid for pr in pending_results]

    # create and attach result objects for each Analyses
    logger.info(
        f"Adding {len(template.analyses)} service results to the sample {sample.sample_id}"
    )
    a_result_schema = schemas.AnalysisResultCreate(
        sample_uid=sample.uid,
        status=ResultState.PENDING,
        analysis_uid=None,
        due_date=None,
        created_by_uid=felicity_user.uid,
        updated_by_uid=felicity_user.uid,
    )
    result_schemas = []
    for _service in template.analyses:
        if _service.uid not in pending_uids:
            result_schemas.append(
                a_result_schema.model_copy(
                    update={
                        "analysis_uid": _service.uid,
                        "due_date": (
                            timenow_dt()
                            + timedelta(minutes=_service.tat_length_minutes)
                            if _service.tat_length_minutes
                            else None
                        ),
                    }
                )
            )
    await AnalysisResultService().bulk_create(result_schemas)

    if sample.status != SampleState.RECEIVED:
        await SampleService().change_status(
            sample.uid, status=SampleState.RECEIVED, updated_by_uid=felicity_user.uid
        )

    sample = await SampleService().get(uid=uid)
    return ResultedSampleListingType(samples=[sample])


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def manage_analyses(
        info, sample_uid: str, payload: ManageAnalysisInputType
) -> ResultedSampleActionResponse:
    felicity_user = await auth_from_info(info)

    sample = await SampleService().get(uid=sample_uid)
    if sample.status not in [
        SampleState.RECEIVED,
        SampleState.AWAITING,
        SampleState.APPROVED,
    ]:
        return OperationError(
            error=f"Samples in {sample.status} can not be added analyses"
        )

    # cancel
    for _anal in payload.cancel:
        result = await AnalysisResultService().get(uid=_anal)
        await AnalysisResultWorkFlow().cancel(result.uid, cancelled_by=felicity_user)

    # create and attach result objects for each added Analyses
    logger.info(
        f"Adding {len(payload.add)} extra service results to the sample {sample.sample_id}"
    )
    a_result_schema = schemas.AnalysisResultCreate(
        sample_uid=sample.uid,
        status=ResultState.PENDING,
        analysis_uid=None,
        due_date=None,
        created_by_uid=felicity_user.uid,
        updated_by_uid=felicity_user.uid,
    )
    result_schemas = []
    for _service_uid in payload.add:
        service = await AnalysisService().get(uid=_service_uid)
        result_schemas.append(
            a_result_schema.model_copy(
                update={
                    "analysis_uid": service.uid,
                    "due_date": (
                        timenow_dt() + timedelta(minutes=service.tat_length_minutes)
                        if service.tat_length_minutes
                        else None
                    ),
                }
            )
        )
    await AnalysisResultService().bulk_create(result_schemas)

    if sample.status != SampleState.RECEIVED:
        await SampleService().change_status(
            sample.uid, status=SampleState.RECEIVED, updated_by_uid=felicity_user.uid
        )

    sample = await SampleService().get(uid=sample_uid)
    return ResultedSampleListingType(samples=[sample])
