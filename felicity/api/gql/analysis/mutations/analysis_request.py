import asyncio
import logging
from datetime import timedelta
from typing import List, Optional

import strawberry  # noqa
from strawberry.permission import PermissionExtension
from strawberry.scalars import JSON

from felicity.api.gql.analysis.permissions import CanVerifySample
from felicity.api.gql.analysis.types import analysis as a_types
from felicity.api.gql.analysis.types import results as r_types
from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated, HasPermission
from felicity.api.gql.types import (
    OperationError,
    OperationSuccess, )
from felicity.apps.analysis import schemas
from felicity.apps.analysis.entities.analysis import (
    sample_analysis,
    sample_profile,
    sample_rejection_reason,
)
from felicity.apps.analysis.enum import ResultState, SamplePriority, SampleState
from felicity.apps.analysis.schemas import ClinicalDataCreate
from felicity.apps.analysis.services.analysis import (
    AnalysisRequestService,
    AnalysisService,
    AnalysisTemplateService,
    ProfileService,
    RejectionReasonService,
    SampleService,
    SampleTypeService, ClinicalDataService,
)
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.analysis.workflow.analysis_result import AnalysisResultWorkFlow
from felicity.apps.analysis.workflow.sample import SampleWorkFlow
from felicity.apps.billing.utils import bill_order
from felicity.apps.client.services import ClientService
from felicity.apps.guard import FAction, FObject
from felicity.apps.impress.sample.tasks import impress_results
from felicity.apps.iol.redis import task_guard
from felicity.apps.iol.redis.enum import TrackableObject
from felicity.apps.job import schemas as job_schemas
from felicity.apps.job.enum import JobAction, JobCategory, JobPriority, JobState
from felicity.apps.job.services import JobService
from felicity.apps.multiplex.microbiology.schemas import AbxOrganismResultCreate
from felicity.apps.multiplex.microbiology.services import AbxOrganismResultService
from felicity.apps.notification.enum import NotificationObject
from felicity.apps.notification.services import ActivityStreamService
from felicity.apps.patient.services import PatientService
from felicity.apps.reflex.services import ReflexEngineService
from felicity.apps.setup.caches import get_laboratory_setting
from felicity.core.config import settings
from felicity.core.dtz import timenow_dt

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ARSampleInputType:
    sample_type: str
    profiles: List[str]
    analyses: List[str]
    date_collected: str
    date_received: str


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
    message: str | None = None


SampleActionResponse = strawberry.union(
    "SampleActionResponse",
    (SampleListingType, OperationSuccess, OperationError),  # noqa
    description="Union of possible outcomes when actioning samples",
)


@strawberry.input
class ClinicalDataInputType:
    symptoms: Optional[List[str]] = None
    symptoms_raw: Optional[str] = ""
    clinical_indication: Optional[str] = ""
    pregnancy_status: Optional[bool] = False
    breast_feeding: Optional[bool] = False
    vitals: Optional[JSON] = None
    treatment_notes: Optional[str] = ""
    other_context: Optional[JSON] = None


@strawberry.input
class AnalysisRequestInputType:
    patient_uid: str
    client_uid: str
    client_contact_uid: str
    clinical_data: ClinicalDataInputType | None = None
    samples: List[ARSampleInputType] = None
    client_request_id: str | None = None
    internal_use: bool | None = False
    priority: int = SamplePriority.NORMAL


@strawberry.input
class ManageAnalysisInputType:
    cancel: list[str] | None = None
    add: list[str] | None = None


@strawberry.mutation(
    extensions=[PermissionExtension(
        permissions=[IsAuthenticated(), HasPermission(FAction.CREATE, FObject.SAMPLE)]
    )]
)
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

    if len(payload.samples) == 0:
        return OperationError(error="Samples are required")

    async with PatientService().repository.async_session() as transaction_session:
        patient = await PatientService().get(uid=payload.patient_uid, session=transaction_session)
        if not patient:
            return OperationError(error=f"Patient with uid {payload.patient_uid} Not found")

        client = await ClientService().get(uid=payload.client_uid, session=transaction_session)
        if not client:
            return OperationError(error=f"Client with uid {payload.client_uid} Not found")

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
        analysis_request = await AnalysisRequestService().create(obj_in, session=transaction_session)

        # save clinical data only if there's at least one value
        if payload.clinical_data:
            clinical_data = payload.clinical_data
            # Check if there's at least one non-empty value
            has_data = any([
                clinical_data.symptoms,
                clinical_data.symptoms_raw,
                clinical_data.clinical_indication,
                clinical_data.pregnancy_status,
                clinical_data.breast_feeding,
                clinical_data.vitals,
                clinical_data.treatment_notes,
                clinical_data.other_context
            ])

            if has_data:
                c_data_in = ClinicalDataCreate(
                    analysis_request_uid=analysis_request.uid,
                    symptoms=clinical_data.symptoms,
                    symptoms_raw=clinical_data.symptoms_raw,
                    clinical_indication=clinical_data.clinical_indication,
                    pregnancy_status=clinical_data.pregnancy_status,
                    breast_feeding=clinical_data.breast_feeding,
                    vitals=clinical_data.vitals,
                    treatment_notes=clinical_data.treatment_notes,
                    other_context=clinical_data.other_context
                )
                await ClinicalDataService().create(c_data_in, session=transaction_session)

        # 1. create samples
        logger.info(
            f"Adding {len(payload.samples)} samples to the analysis request {analysis_request.client_request_id}"
        )

        for s in payload.samples:
            _st_uid = s.sample_type
            stype = await SampleTypeService().get(uid=_st_uid, session=transaction_session)
            if not stype:
                await transaction_session.rollback()
                return OperationError(
                    error=f"Error, failed to retrieve sample type {_st_uid}"
                )

            sample_in = {
                "created_by_uid": felicity_user.uid,
                "updated_by_uid": felicity_user.uid,
                "analysis_request_uid": analysis_request.uid,
                "date_collected": s.date_collected,
                "date_received": s.date_received,
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
                profile = await ProfileService().get(related=["analyses"], uid=p_uid, session=transaction_session)
                if not profile:
                    print(f"failed to retrieve profile information: {p_uid}")
                profiles.append(profile)
                analyses_ = profile.analyses
                for _an in analyses_:
                    _profiles_analyses.add(_an)

            # make sure the selected analyses are not part of the selected profiles
            for a_uid in s.analyses:
                analysis = await AnalysisService().get(uid=a_uid, session=transaction_session)
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
            sample = await SampleService().create(sample_schema, session=transaction_session)

            # link sample to provided profiles
            for _prof in profiles:
                await SampleService().repository.table_insert(
                    table=sample_profile,
                    mappings=[{"sample_uid": sample.uid, "profile_uid": _prof.uid}],
                    session=transaction_session
                )

            # link sample to provided services
            for _anal in analyses:
                if _anal.keyword == "felicity_ast_abx_antibiotic": continue
                await SampleService().repository.table_insert(
                    table=sample_analysis,
                    mappings=[{"sample_uid": sample.uid, "analysis_uid": _anal.uid}],
                    session=transaction_session
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
                result_schemas, related=["sample", "analysis"], session=transaction_session
            )
            for _a in created:
                if _a.keyword == "felicity_ast_abx_organism":
                    await AbxOrganismResultService().create(AbxOrganismResultCreate(
                        analysis_result_uid=_a.uid,
                        organism_uid=None,
                        isolate_number=1
                    ), commit=False, session=transaction_session)

        # save transactions
        await PatientService().repository.save_transaction(transaction_session)

    # ! paramount: No idea why but it makes it work!
    await asyncio.sleep(1)

    analysis_request = await AnalysisRequestService().get(
        related=["samples"], uid=analysis_request.uid
    )

    _, lab_setting = await get_laboratory_setting()

    for sample in analysis_request.samples:
        await SampleService().snapshot(sample)
        # auto receive samples
        if lab_setting.auto_receive_samples:
            await SampleService().receive(sample.uid, received_by=felicity_user)

        # snapshot analyses of this sample
        analyses = await AnalysisResultService().get_all(sample_uid=sample.uid)
        await AnalysisResultService().snapshot(analyses)

        # initialise reflex action if exist
        logger.info("ReflexUtil .... set_reflex_actions ...")
        await ReflexEngineService().set_reflex_actions(analyses)

    # auto_bill=True during sample registration
    await bill_order(analysis_request, auto_bill=True)
    _ar = analysis_request.marshal_simple()
    del _ar["client"]
    return a_types.AnalysisRequestWithSamples(**_ar)


@strawberry.mutation(
    extensions=[PermissionExtension(
        permissions=[IsAuthenticated(), HasPermission(FAction.CREATE, FObject.SAMPLE)]
    )]
)
async def clone_samples(info, samples: List[str]) -> SampleActionResponse:
    felicity_user = await auth_from_info(info)

    if len(samples) == 0:
        return OperationError(error="No Samples to clone are provided!")

    clones = []
    creations = []
    async with SampleService().repository.async_session() as transaction_session:
        to_clone = await SampleService().get_by_uids(uids=samples, session=transaction_session)
        for _, _sample in enumerate(to_clone):
            clone = await SampleService().clone_afresh(_sample.uid, felicity_user, session=transaction_session)

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
                        a_result_schema, related=["sample", "analysis"],
                        session=transaction_session
                    )
                    creations.append(created)

        # save transaction
        await SampleService().repository.save_transaction(transaction_session)

    await ReflexEngineService().set_reflex_actions(creations)

    clones = [
        (await SampleService().get(related=["sample_type"], uid=clone.uid))
        for clone in clones
    ]
    for clone in clones:
        await SampleService().snapshot(clone, {})
    await AnalysisResultService().snapshot(creations)
    return SampleListingType(samples=clones)


@strawberry.mutation(
    extensions=[PermissionExtension(
        permissions=[IsAuthenticated(), HasPermission(FAction.CANCEL, FObject.SAMPLE)]
    )]
)
async def cancel_samples(info, samples: List[str]) -> ResultedSampleActionResponse:
    felicity_user = await auth_from_info(info)
    cancelled = await SampleWorkFlow().cancel(samples, cancelled_by=felicity_user)
    return ResultedSampleListingType(samples=cancelled)


@strawberry.mutation(
    extensions=[PermissionExtension(
        permissions=[IsAuthenticated(), HasPermission(FAction.CANCEL, FObject.SAMPLE)]
    )]
)
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


@strawberry.mutation(
    extensions=[PermissionExtension(
        permissions=[IsAuthenticated(), HasPermission(FAction.CREATE, FObject.SAMPLE)]
    )]
)
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


@strawberry.mutation(permission_classes=[IsAuthenticated, CanVerifySample])
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


@strawberry.mutation(
    extensions=[PermissionExtension(
        permissions=[IsAuthenticated(), HasPermission(FAction.REJECT, FObject.SAMPLE)]
    )]
)
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


@strawberry.mutation(
    extensions=[PermissionExtension(
        permissions=[IsAuthenticated(), HasPermission(FAction.PUBLISH, FObject.SAMPLE)]
    )]
)
async def publish_samples(
        info, samples: List[SamplePublishInputType]
) -> SampleActionResponse:
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

    job = await JobService().create(job_schema)
    if not settings.ENABLE_BACKGROUND_PROCESSING:
        await impress_results(job.uid)
        impressed = await SampleService().get_by_uids([s.uid for s in samples])
        return SampleListingType(samples=impressed, message="Samples have been impressed")

    if final_publish:
        for sample in final_publish:
            await task_guard.process(
                uid=sample.uid, object_type=TrackableObject.SAMPLE
            )

    # TODO: clean up below - probably no longer necessary - needs checking
    # !important for frontend
    # unfreeze frontend and return sample to original state since it is a non final publish
    if not_final:
        ns_samples = await SampleService().get_by_uids([nf.uid for nf in not_final])
        for sample in ns_samples:
            await ActivityStreamService().stream(
                sample, felicity_user, sample.status, NotificationObject.SAMPLE
            )

    return OperationSuccess(
        message="Your results are being published in the background."
    )


@strawberry.mutation(
    extensions=[PermissionExtension(
        permissions=[IsAuthenticated(), HasPermission(FAction.PRINT, FObject.SAMPLE)]
    )]
)
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


@strawberry.mutation(
    extensions=[PermissionExtension(
        permissions=[IsAuthenticated(), HasPermission(FAction.INVALIDATE, FObject.SAMPLE)]
    )]
)
async def invalidate_samples(info, samples: List[str]) -> SampleActionResponse:
    felicity_user = await auth_from_info(info)

    return_samples = []

    if len(samples) == 0:
        return OperationError(error="No Samples to invalidate are provided!")

    for _sa_uid in samples:
        async with SampleService().repository.async_session() as transaction_session:
            sample = await SampleService().get(uid=_sa_uid, session=transaction_session)
            if not sample:
                return OperationError(error=f"Sample with uid {_sa_uid} not found")

            copy, invalidated = await SampleWorkFlow().invalidate(
                sample.uid, invalidated_by=felicity_user, session=transaction_session
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
                        "metadata_snapshot": {}
                    }
                    a_result_schema = schemas.AnalysisResultCreate(**a_result_in)
                    created = await AnalysisResultService().create(
                        a_result_schema, related=["sample", "analysis"],
                        session=transaction_session
                    )
                    await AnalysisResultService().snapshot([created])

            # save transaction
            await SampleService().repository.save_transaction(transaction_session)
    return SampleListingType(samples=return_samples)


@strawberry.mutation(
    extensions=[PermissionExtension(
        permissions=[IsAuthenticated(), HasPermission(FAction.ASSIGN, FObject.SAMPLE)]
    )]
)
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
        metadata_snapshot={},
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
    created = await AnalysisResultService().bulk_create(result_schemas, related=["sample", "analysis"])
    await AnalysisResultService().snapshot(created)

    if sample.status != SampleState.RECEIVED:
        await SampleService().change_status(
            sample.uid, status=SampleState.RECEIVED, updated_by_uid=felicity_user.uid
        )

    sample = await SampleService().get(uid=uid)
    return ResultedSampleListingType(samples=[sample])


@strawberry.mutation(
    extensions=[PermissionExtension(
        permissions=[IsAuthenticated(), HasPermission(FAction.ASSIGN, FObject.SAMPLE)]
    )]
)
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
        metadata_snapshot={},
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
    created = await AnalysisResultService().bulk_create(result_schemas, related=["sample", "analysis"])
    await AnalysisResultService().snapshot(created)

    if sample.status != SampleState.RECEIVED:
        await SampleService().change_status(
            sample.uid, status=SampleState.RECEIVED, updated_by_uid=felicity_user.uid
        )

    sample = await SampleService().get(uid=sample_uid)
    return ResultedSampleListingType(samples=[sample])
