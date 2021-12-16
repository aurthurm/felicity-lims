import inspect
import logging
from typing import Optional, List

import strawberry

from felicity.apps.patient import models as pt_models
from felicity.apps.client import models as ct_models
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.apps.analysis.models import results as result_models
from felicity.apps.analysis import schemas
from felicity.gql import auth_from_info, verify_user_auth
from felicity.gql.analysis.types import analysis as a_types
from felicity.gql.analysis.types import results as r_types
from felicity.apps.patient.models import logger
from felicity.apps.analysis.conf import priorities, states
from felicity.utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ARSampleInputType:
    sample_type: int
    profiles: List[int]
    analyses: List[int]


@strawberry.input
class ARResultInputType:
    uid: int
    result: str
    reportable: Optional[bool] = True


@strawberry.input
class QCSetInputType:
    qcTemplateUid: Optional[int]
    qcLevels: List[int]
    analysisProfiles: List[int]
    analysisServices: List[int]


@strawberry.type
class CreateQCSetData:
    samples: List[a_types.SampleType]
    qc_sets: List[a_types.QCSetType]


@strawberry.input
class SampleRejectInputType:
    uid: int
    reasons: List[int]
    other: Optional[str] = None


@strawberry.mutation
async def create_analysis_request(self, info, patient_uid: int, client_uid: int,
                                  samples: List[ARSampleInputType] = None,
                                  client_request_id: Optional[str] = None, internal_use: Optional[bool] = False,
                                  priority: int = priorities.sample.NORMAL) -> a_types.AnalysisRequestWithSamples:
    logger.info("Received request to create analysis request")

    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create analysis requests")

    patient = await pt_models.Patient.get(uid=patient_uid)
    if not patient:
        raise Exception(f"Patient with uid {patient_uid} Not found")

    client = await ct_models.Client.get(uid=client_uid)
    if not client:
        raise Exception(f"Client Not found")

    samples = passed_args.get('samples', [])
    if len(samples) == 0:
        raise Exception(f"Samples are required")

    # create the ar
    incoming = {
        "patient_uid": patient_uid,
        "client_uid": client_uid,
        "request_id": None,
        "client_request_id": passed_args.get('client_request_id', None)
    }

    obj_in = schemas.AnalysisRequestCreate(**incoming)
    analysisrequest: analysis_models.AnalysisRequest = await analysis_models.AnalysisRequest.create(obj_in)

    # 1. create samples
    logger.info(f"Adding {len(samples)} samples to the analysis request {analysisrequest.client_request_id}")
    for s in samples:  # ARResultInputType
        _st_uid = s.sample_type
        _profiles = s.profiles
        _analyses = s.analyses
        stype = await analysis_models.SampleType.get(uid=_st_uid)
        if not stype:
            raise Exception(f"Error, failed to retrieve sample type {_st_uid}")

        sample_in = {
            'analysisrequest_uid': analysisrequest.uid,
            'sampletype_uid': _st_uid,
            'sample_id': None,
            'priority': priority,
            'status': states.sample.DUE
        }

        profiles = []
        analyses = []
        _profiles_analyses = set()

        for p_uid in _profiles:
            profile = await analysis_models.Profile.get_related(related=["analyses"], uid=p_uid)
            profiles.append(profile)
            analyses_ = profile.analyses
            for _an in analyses_:
                _profiles_analyses.add(_an)

        # make sure the selected analyses are not part of the selected profiles
        for a_uid in _analyses:
            analysis = await analysis_models.Analysis.get(uid=a_uid)
            if analysis not in _profiles_analyses:
                analyses.append(analysis)
                _profiles_analyses.add(analysis)

        sample_schema = schemas.SampleCreate(**sample_in)
        sample_schema.analyses = analyses
        sample_schema.profiles = profiles
        sample: analysis_models.Sample = await analysis_models.Sample.create(sample_schema)

        # Attach Analysis result for each Analyses
        logger.info(f"Adding {len(_profiles_analyses)} service results to the sample {sample.sample_id}")
        for _service in _profiles_analyses:
            a_result_in = {
                'sample_uid': sample.uid,
                'analysis_uid': _service.uid,
                'status': states.result.PENDING
            }
            a_result_schema = schemas.AnalysisResultCreate(**a_result_in)
            await result_models.AnalysisResult.create(a_result_schema)

    return analysisrequest


@strawberry.mutation
async def update_analysis_request(self, info, uid: int, patient_uid: Optional[int] = None,
                                  client_uid: Optional[int] = None,
                                  client_request_id: Optional[str] = None,
                                  internal_use: Optional[bool] = False) -> a_types.AnalysisRequestWithSamples:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update analysis requests")

    analysis_request = await analysis_models.AnalysisRequest.get(uid=uid)
    if not analysis_request:
        raise Exception(f"AnalysisRequest with uid {uid} does not exist")

    ar_data = analysis_request.to_dict()
    for field in ar_data:
        if field in passed_args:
            try:
                setattr(analysis_request, field, passed_args[field])
            except AttributeError as e:
                logger.warning(e)

    ar_in = schemas.AnalysisRequestUpdate(**analysis_request.to_dict())
    analysis_request = await analysis_request.update(ar_in)
    return analysis_request


@strawberry.mutation
async def update_sample(self, info, uid: int, sampletype_uid: Optional[int] = None, profiles: List[int] = None,
                        analyses: List[int] = None, internal_use: Optional[bool] = False,
                        cancel: Optional[bool] = False) -> a_types.SampleType:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update samples")

    sample = await analysis_models.Sample.get(uid=uid)
    if not sample:
        raise Exception(f"Sample with uid {uid} not found")

    if passed_args.get('cancel'):
        await sample.cancel()
    else:
        # TODO: remove/change profile/analyses if no results yet
        pass

    return sample


@strawberry.mutation
async def cancel_samples(self, info, samples: List[int]) -> List[r_types.SamplesWithResults]:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can cancel samples")

    return_samples = []

    if len(samples) == 0:
        raise Exception(f"No Samples to cancel are provided!")

    for _sa_uid in samples:
        sample: analysis_models.Sample = await analysis_models.Sample.get(uid=_sa_uid)
        if not sample:
            raise Exception(f"Sample with uid {_sa_uid} not found")

        sample = await sample.cancel(cancelled_by=felicity_user)
        if sample:
            return_samples.append(sample)

    return return_samples


@strawberry.mutation
async def re_instate_samples(self, info, samples: List[int]) -> List[r_types.SamplesWithResults]:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can re instate cancelled samples")

    return_samples = []

    if len(samples) == 0:
        raise Exception(f"No Samples to cancel are provided!")

    for _sa_uid in samples:
        sample: analysis_models.Sample = await analysis_models.Sample.get(uid=_sa_uid)
        if not sample:
            raise Exception(f"Sample with uid {_sa_uid} not found")

        sample = await sample.re_instate(re_instated_by=felicity_user)
        if sample:
            return_samples.append(sample)

    return return_samples


@strawberry.mutation
async def receive_samples(self, info, samples: List[int]) -> List[r_types.SamplesWithResults]:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can receive due samples")

    return_samples = []

    if len(samples) == 0:
        raise Exception(f"No Samples to receive are provided!")

    for _sa_uid in samples:
        sample: analysis_models.Sample = await analysis_models.Sample.get(uid=_sa_uid)
        if not sample:
            raise Exception(f"Sample with uid {_sa_uid} not found")

        sample = await sample.receive(received_by=felicity_user)
        if sample:
            return_samples.append(sample)

    return return_samples


@strawberry.mutation
async def verify_samples(self, info, samples: List[int]) -> List[a_types.SampleType]:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can verify samples")

    return_samples = []

    if len(samples) == 0:
        raise Exception(f"No Samples to verify are provided!")

    for _sa_uid in samples:
        sample: analysis_models.Sample = await analysis_models.Sample.get(uid=_sa_uid)
        if not sample:
            raise Exception(f"Sample with uid {_sa_uid} not found")

        sample = await sample.verify(verified_by=felicity_user)
        if sample:
            return_samples.append(sample)

    return return_samples


@strawberry.mutation
async def reject_samples(self, info, samples: List[SampleRejectInputType]) -> List[a_types.SampleType]:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can reject samples")

    return_samples = []

    if len(samples) == 0:
        raise Exception(f"No Samples to verify are provided!")

    for _sam in samples:
        sample: analysis_models.Sample = await analysis_models.Sample.get(uid=_sam.uid)
        if not sample:
            raise Exception(f"Sample with uid {_sam.uid} not found")

        reasons = []
        for re_uid in _sam.reasons:
            reason = await analysis_models.RejectionReason.get(uid=re_uid)
            if not reason:
                raise Exception(f"RejectionReason with uid {re_uid} not found")
            reasons.append(reason)

        sample = await sample.reject(reasons=reasons, rejected_by=felicity_user)
        if sample:
            return_samples.append(sample)

        if sample.status == states.sample.REJECTED:
            for analyte in sample.analysis_results:
                await analyte.cancel(cancelled_by=felicity_user)

    return return_samples


@strawberry.mutation
async def publish_samples(self, info, samples: List[int]) -> List[a_types.SampleType]:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can re publish samples")

    return_samples = []

    if len(samples) == 0:
        raise Exception(f"No Samples to publish are provided!")

    for _sa_uid in samples:
        sample: analysis_models.Sample = await analysis_models.Sample.get(uid=_sa_uid)
        if not sample:
            raise Exception(f"Sample with uid {_sa_uid} not found")

        sample = await sample.publish(published_by=felicity_user)
        if sample:
            return_samples.append(sample)

    return return_samples


@strawberry.mutation
async def invalidate_samples(self, info, samples: List[int]) -> List[a_types.SampleType]:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can re invalidate samples")

    return_samples = []

    if len(samples) == 0:
        raise Exception(f"No Samples to invalidate are provided!")

    for _sa_uid in samples:
        sample: analysis_models.Sample = await analysis_models.Sample.get(uid=_sa_uid)
        if not sample:
            raise Exception(f"Sample with uid {_sa_uid} not found")

        copy, invalidated = await sample.invalidate(invalidated_by=felicity_user)

        # add invalidated or original
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
                    'sample_uid': copy.uid,
                    'analysis_uid': _service.uid,
                    'status': states.result.PENDING
                }
                a_result_schema = schemas.AnalysisResultCreate(**a_result_in)
                await result_models.AnalysisResult.create(a_result_schema)

    return return_samples
