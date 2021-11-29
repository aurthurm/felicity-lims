import inspect
import logging
from datetime import datetime
from typing import Optional, List

import strawberry

from felicity.apps.patient import models as pt_models
from felicity.apps.client import models as ct_models
from felicity.apps.setup.models import setup as setup_models
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.apps.analysis.models import qc as qc_models
from felicity.apps.analysis.models import results as result_models
from felicity.apps.analysis.utils import (
    get_qc_sample_type
)
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


@strawberry.type
class AnalysisMutations:
    @strawberry.mutation
    async def create_sample_type(self, info, name: str, abbr: str, description: Optional[str] = None,
                                 internal_use: Optional[bool] = False, 
                                 active: Optional[bool] = True) -> a_types.SampleTypeTyp:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create sample types")

        if not name or not abbr:
            raise Exception("Name and Description are mandatory")

        exists = await analysis_models.SampleType.get(name=name)
        if exists:
            raise Exception(f"Sample Type: {name} already exists")

        incoming = {}
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.SampleTypeCreate(**incoming)
        sample_type: analysis_models.SampleType = await analysis_models.SampleType.create(obj_in)
        return sample_type

    @strawberry.mutation
    async def update_sample_type(self, info, uid: int, name: Optional[str] = None, abbr: Optional[str] = None,
                                 description: Optional[str] = None, internal_use: Optional[bool] = False,
                                 active: Optional[bool] = True) -> a_types.SampleTypeTyp:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update sample types")

        sample_type = await analysis_models.SampleType.get(uid=uid)
        if not sample_type:
            raise Exception(f"Sample type with uid {uid} does not exist")

        st_data = sample_type.to_dict()
        for field in st_data:
            if field in passed_args:
                try:
                    setattr(sample_type, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        sample_type_in = schemas.SampleTypeUpdate(**sample_type.to_dict())
        sample_type = await sample_type.update(sample_type_in)
        return sample_type

    @strawberry.mutation
    async def create_result_option(self, info, analysis_uid: int, option_key: int, value: str) -> a_types.ResultOptionType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can add result options")

        if not analysis_uid:
            raise Exception("Analysis to attach Result Option Required")

        if not option_key or not value:
            raise Exception("Result option key and value Required")

        analysis = await analysis_models.Analysis.get(uid=analysis_uid)
        if not analysis:
            raise Exception(f"Analysis with uid {analysis_uid} does not exist")

        incoming = {}
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.ResultOptionCreate(**incoming)
        result_option: analysis_models.ResultOption = await analysis_models.ResultOption.create(obj_in)
        return result_option

    @strawberry.mutation
    async def update_result_option(self, info, uid: int, option_key: Optional[int] = None, value: Optional[str] = None) -> a_types.ResultOptionType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update result options")

        result_option = await analysis_models.ResultOption.get(uid=uid)
        if not result_option:
            raise Exception(f"ResultOption with uid {uid} does not exist")

        ro_data = result_option.to_dict()
        for field in ro_data:
            if field in passed_args:
                try:
                    setattr(result_option, field, passed_args[field])
                except Exception as e:
                    logger.warning(e)

        result_option_in = schemas.ResultOptionUpdate(**result_option.to_dict())
        result_option = await result_option.update(result_option_in)
        return result_option

    @strawberry.mutation
    async def create_rejection_reason(self, info, reason: str) -> a_types.RejectionReasonType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create rejection reasons")

        if not reason:
            raise Exception("reason is mandatory")

        exists = await analysis_models.RejectionReason.get(reason=reason)
        if exists:
            raise Exception(f"The Rejection reason -> {reason} <- already exists")

        obj_in = schemas.RejectionReasonCreate(**passed_args)
        rejection_reason: analysis_models.RejectionReason = await analysis_models.RejectionReason.create(obj_in)
        return rejection_reason

    @strawberry.mutation
    async def update_rejection_reason(self, info, uid: int, reason: str) -> a_types.RejectionReasonType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update rejection reasons")

        rejection_reason = await analysis_models.RejectionReason.get(uid=uid)
        if not rejection_reason:
            raise Exception(f"rejection reason with uid {uid} does not exist")

        qc_data = rejection_reason.to_dict()
        for field in qc_data:
            if field in passed_args:
                try:
                    setattr(rejection_reason, field, passed_args[field])
                except AttributeError as e:
                    logger.warning(e)

        rr_in = schemas.RejectionReasonUpdate(**rejection_reason.to_dict())
        rejection_reason = await rejection_reason.update(rr_in)
        return rejection_reason

    @strawberry.mutation
    async def create_analysis_category(self, info, name: str, description: Optional[str] = None,
                                       active: Optional[bool] = True) -> a_types.AnalysisCategoryType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create analysis categories")

        if not name or not description:
            raise Exception("Name and Description are mandatory")

        exists = await analysis_models.AnalysisCategory.get(name=name)
        if exists:
            raise Exception(f"A AnalysisCategory named {name} already exists")

        incoming = {}
        for k, v in passed_args.items():
            incoming[k] = v

        obj_in = schemas.AnalysisCategoryCreate(**incoming)
        analysis_category: analysis_models.AnalysisCategory = await analysis_models.AnalysisCategory.create(obj_in)
        return analysis_category

    @strawberry.mutation
    async def update_analysis_category(self, info, uid: int, name: Optional[str] = None, description: Optional[str] = None,
                                       active: Optional[bool] = False) -> a_types.AnalysisCategoryType: # noqa

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update analysis categories")

        analysis_category = await analysis_models.AnalysisCategory.get(uid=uid)
        if not analysis_category:
            raise Exception(f"AnalysisCategory with uid {uid} does not exist")

        ac_data = analysis_category.to_dict()
        for field in ac_data:
            if field in passed_args:
                try:
                    setattr(analysis_category, field, passed_args[field])
                except AttributeError as e:
                    logger.warning(e)

        profile_in = schemas.AnalysisCategoryUpdate(**analysis_category.to_dict())
        analysis_category = await analysis_category.update(profile_in)
        return analysis_category

    @strawberry.mutation
    async def create_profile(self, info, name: str, description: str, keyword: Optional[str] = None, active: Optional[bool] = True) -> a_types.ProfileType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create analysis profiles")

        if not name or not description:
            raise Exception("Name and Description are mandatory")

        exists = await analysis_models.Profile.get(name=name)
        if exists:
            raise Exception(f"A Profile named {name} already exists")

        obj_in = schemas.ProfileCreate(**passed_args)
        profile: analysis_models.Profile = await analysis_models.Profile.create(obj_in)
        return profile

    @strawberry.mutation
    async def update_profile(self, info, uid: int, name: Optional[str] = None, description: Optional[str] = None,
                             keyword: Optional[str] = None, services: Optional[List[int]] = None, active: Optional[bool] = True) -> a_types.ProfileType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update analysis profiles")

        profile = await analysis_models.Profile.get(uid=uid)
        if not profile:
            raise Exception(f"Profile with uid {uid} does not exist")

        profile_data = profile.to_dict()
        for field in profile_data:
            if field in passed_args:
                try:
                    setattr(profile, field, passed_args[field])
                except AttributeError as e:
                    logger.warning(e)

        profile_in = schemas.ProfileUpdate(**profile.to_dict())
        profile = await profile.update(profile_in)

        analyses = passed_args.get('services', None)
        profile.analyses.clear()
        if analyses:
            for _uid in analyses:
                anal = await analysis_models.Analysis.get(uid=_uid)
                if anal not in profile.analyses:  # analysis_data['profiles'] ??
                    profile.analyses.append(anal)
        profile = await profile.save()

        return profile

    @strawberry.mutation
    async def create_analysis(self, info, name: str, description: str, keyword: str, sort_key: int,
                              sample_types: Optional[List[int]] = None, category_uid: Optional[int] = None, internal_use: Optional[bool] = False,
                              active: Optional[bool] = True) -> a_types.AnalysisWithProfiles:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create analysis")

        if not name or not description:
            raise Exception("Name and Description are mandatory")

        exists = await analysis_models.Analysis.get(name=name)
        if exists:
            raise Exception(f"A analysis named {name} already exists")

        exists = await analysis_models.Analysis.get(keyword=keyword)
        if exists:
            raise Exception(f"Analysis Keyword {keyword} is not unique")

        incoming = {}
        for k, v in passed_args.items():
            incoming[k] = v

        sample_types = passed_args.get('sampletypes', None)
        incoming['sample_types'] = []
        if sample_types:
            for _uid in sample_types:
                stype = await analysis_models.SampleType.get(uid=_uid)
                if stype not in incoming['sample_types']:
                    incoming['sampletypes'].append(stype)

        obj_in = schemas.AnalysisCreate(**incoming)  # skip this stage if its not adding analyses and stypes
        analysis: analysis_models.Analysis = await analysis_models.Analysis.create(obj_in)

        return analysis

    @strawberry.mutation
    async def update_analysis(self, info, uid: int, name: str, description: str, keyword: str, sort_key: int,
                              sample_types: Optional[List[str]] = None, category_uid: Optional[int] = None, internal_use: Optional[bool] = False,
                              active: Optional[bool] = True) -> a_types.AnalysisWithProfiles:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update analysis")

        analysis = await analysis_models.Analysis.get(uid=uid)
        if not analysis:
            raise Exception(f"Analysis with uid {uid} does not exist -- cannot update")

        analysis_data = analysis.to_dict()
        for field in analysis_data:
            if field in passed_args:
                try:
                    setattr(analysis, field, passed_args[field])
                except AttributeError as e:
                    logger.warning(e)

        sample_types = passed_args.get('sample_types', None)
        analysis.sampletypes.clear()
        if sample_types:
            for _uid in sample_types:
                stype = await analysis_models.SampleType.get(uid=_uid)
                if stype not in analysis.sampletypes:
                    analysis.sampletypes.append(stype)

        analysis_in = schemas.AnalysisUpdate(**analysis.to_dict(nested=False))
        analysis = await analysis.update(analysis_in)
        return analysis

    @strawberry.mutation
    async def create_analysis_request(self, info, patient_uid: int, client_uid: int, samples: List[ARSampleInputType] = None,
                     client_request_id: Optional[str] = None, internal_use: Optional[bool] = False,
                     priority: int = priorities.sample.NORMAL) -> a_types.AnalysisRequestWithSamples:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create analysis requests")

        patient = await pt_models.Patient.get(uid=patient_uid)
        if not patient:
            raise Exception(f"Patient Not found")

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
    async def update_analysis_request(self, info, uid: int, patient_uid: Optional[int] = None, client_uid: Optional[int] = None,
                                      client_request_id: Optional[str] = None, internal_use: Optional[bool] = False) -> a_types.AnalysisRequestWithSamples:

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
                            analyses: List[int] = None, internal_use: Optional[bool] = False, cancel: Optional[bool] = False) -> a_types.SampleType:

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

    @strawberry.mutation
    async def submit_analysis_results(self, info, analysis_results: List[ARResultInputType]) -> List[r_types.AnalysisResultType]:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can submit analysis results")

        return_results = []

        if len(analysis_results) == 0:
            raise Exception(f"No Results to update are provided!")

        for _ar in analysis_results:
            uid = _ar.uid
            a_result: result_models.AnalysisResult = await result_models.AnalysisResult.get(uid=uid)
            if not a_result:
                raise Exception(f"AnalysisResult with uid {uid} not found")

            # only submit results in pending state
            if a_result.status not in [states.result.PENDING]:
                return_results.append(a_result)
                continue

            analysis_result = a_result.to_dict(nested=False)
            for field in analysis_result:
                if field in _ar.__dict__.keys():
                    try:
                        setattr(a_result, field, getattr(_ar, field, None))
                    except AttributeError as e:
                        logger.warning(e)

            # No Empty Results
            result = getattr(a_result, 'result', None)
            if not result or result.strip() == '' or len(result.strip()) == 0:
                setattr(a_result, 'result', None)
            else:
                setattr(a_result, 'status', states.result.RESULTED)

                # set submitter ad date_submitted
                setattr(a_result, 'submitted_by_uid', felicity_user.uid)
                setattr(a_result, 'date_submitted', datetime.now())

                # set updated_by
                try:
                    setattr(a_result, 'updated_by_uid', felicity_user.uid)
                except AttributeError as e:
                    pass

            a_result_in = schemas.AnalysisResultUpdate(**a_result.to_dict())
            a_result = await a_result.update(a_result_in)

            # try to submit sample
            if a_result.sample:
                await a_result.sample.submit(submitted_by=felicity_user)

            # try to submit associated worksheet
            if a_result.worksheet_uid:
                await a_result.worksheet.submit(submitter=felicity_user)

            return_results.append(a_result)
        return return_results

    @strawberry.mutation
    async def verify_analysis_results(self, info, analyses: List[int]) -> List[r_types.AnalysisResultType]:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can verify analysis results")

        return_results = []

        if len(analyses) == 0:
            raise Exception(f"No analyses to verify are provided!")

        for _ar_uid in analyses:
            a_result: result_models.AnalysisResult = await result_models.AnalysisResult.get(uid=_ar_uid)
            if not a_result:
                raise Exception(f"AnalysisResult with uid {_ar_uid} not found")

            # No Empty Results
            status = getattr(a_result, 'status', None)
            if status == states.result.RESULTED:
                a_result = await a_result.verify(verifier=felicity_user)
                return_results.append(a_result)
            else:
                continue

            # TODO: optimisation -> reduce db-calls
            #  Avoid calling verify sample & verify worksheet len(analyses) times
            #  However create "set" holder variables and hold sample, worksheet ids
            #  after the for loop has completed, then try verify linkages

            # try to verify associated sample
            if a_result.sample:
                await a_result.sample.verify(verified_by=felicity_user)

            # try to submit associated worksheet
            if a_result.worksheet_uid:
                await a_result.worksheet.verify(verified_by=felicity_user)

        return return_results

    @strawberry.mutation
    async def retract_analysis_results(self, info, analyses: List[int]) -> List[r_types.AnalysisResultType]:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can retract analysis results")

        return_results = []

        if len(analyses) == 0:
            raise Exception(f"No analyses to retract are provided!")

        for _ar_uid in analyses:
            a_result: result_models.AnalysisResult = await result_models.AnalysisResult.get(uid=_ar_uid)
            if not a_result:
                raise Exception(f"AnalysisResult with uid {_ar_uid} not found")

            retest, a_result = await a_result.retest_result(retested_by=felicity_user, next_action="retract")

            # if in worksheet then keep add retest to ws
            if a_result.worksheet_uid:
                retest.worksheet_uid = a_result.worksheet_uid
                retest.worksheet_position = a_result.worksheet_position
                retest.assigned = True
                retest = await retest.save()

            # add retest
            if retest:
                return_results.append(retest)

            # add original
            return_results.append(a_result)
        return return_results

    @strawberry.mutation
    async def retest_analysis_results(self, info, analyses: List[int]) -> List[r_types.AnalysisResultType]:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can retest analysis results")

        return_results = []

        if len(analyses) == 0:
            raise Exception(f"No analyses to Retest are provided!")

        for _ar_uid in analyses:
            a_result: result_models.AnalysisResult = await result_models.AnalysisResult.get(uid=_ar_uid)
            if not a_result:
                raise Exception(f"AnalysisResult with uid {_ar_uid} not found")

            retest, a_result = await a_result.retest_result(retested_by=felicity_user, next_action="verify")
            if retest:
                return_results.append(retest)
            return_results.append(a_result)

        return return_results

    @strawberry.mutation
    async def cancel_analysis_results(self, info, analyses: List[int]) -> List[r_types.AnalysisResultType]:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can cancel analysis results")

        return_results = []

        if len(analyses) == 0:
            raise Exception(f"No analyses to Retest are provided!")

        for _ar_uid in analyses:
            a_result: result_models.AnalysisResult = await result_models.AnalysisResult.get(uid=_ar_uid)
            if not a_result:
                raise Exception(f"AnalysisResult with uid {_ar_uid} not found")

            a_result = await a_result.cancel(cancelled_by=felicity_user)
            if a_result:
                return_results.append(a_result)

        return return_results

    @strawberry.mutation
    async def re_instate_analysis_results(self, info, analyses: List[int]) -> List[r_types.AnalysisResultType]:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can re instate cancelled analysis "
                                                          "results")

        return_results = []

        if len(analyses) == 0:
            raise Exception(f"No analyses to Reinstate are provided!")

        for _ar_uid in analyses:
            a_result: result_models.AnalysisResult = await result_models.AnalysisResult.get(uid=_ar_uid)
            if not a_result:
                raise Exception(f"AnalysisResult with uid {_ar_uid} not found")

            a_result = await a_result.re_instate(re_instated_by=felicity_user)
            if a_result:
                return_results.append(a_result)

        return return_results

    @strawberry.mutation
    async def create_QC_set(self, info, samples: List[QCSetInputType]) -> CreateQCSetData:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create qc-sets")

        if not samples or len(samples) == 0:
            raise Exception("There are No QC Requests to create")

        qc_sample_type = await get_qc_sample_type()
        qc_samples: List[analysis_models.Sample] = []
        qc_sets: List[analysis_models.QCSet] = []

        for qc_set_in in samples:
            qc_set_schema = schemas.QCSetCreate(name="Set", note="Auto Generated")
            qc_set = await qc_models.QCSet.create(qc_set_schema)

            qc_levels = []
            qc_levels_uids = []
            if qc_set_in.qcTemplateUid:
                qc_template = await qc_models.QCTemplate.get(uid=qc_set_in.qcTemplateUid)
                for level in qc_template.qc_levels:
                    if level.uid not in qc_levels_uids:
                        qc_levels.append(level)
                        qc_levels_uids.append(level.uid)

            if qc_set_in.qcLevels:
                for level_uid in qc_set_in.qcLevels:
                    if int(level_uid) not in qc_levels_uids:
                        level = await qc_models.QCLevel.get(uid=int(level_uid))
                        qc_levels.append(level)
                        qc_levels_uids.append(level_uid)

            profiles = []
            analyses = []
            _profiles_analyses = set()

            if qc_set_in.analysisProfiles:
                for p_uid in qc_set_in.analysisProfiles:
                    profile = await analysis_models.Profile.get(uid=p_uid)
                    profiles.append(profile)
                    analyses_ = profile.analyses
                    for _an in analyses_:
                        _profiles_analyses.add(_an)

            if qc_set_in.analysisServices:
                # make sure the selected analyses are not part of the selected profiles
                for a_uid in qc_set_in.analysisServices:
                    analysis = await analysis_models.Analysis.get(uid=a_uid)
                    if analysis not in _profiles_analyses:
                        analyses.append(analysis)
                        _profiles_analyses.add(analysis)

            for level in qc_levels:
                # create qc_sample
                s_in = schemas.SampleCreate(
                    sampletype_uid=qc_sample_type.uid,
                    internal_use=True,
                    status=states.sample.RECEIVED,
                )
                sample: analysis_models.Sample = await analysis_models.Sample.create(s_in)
                sample.analyses = analyses
                sample.profiles = profiles
                sample.qc_set_uid = qc_set.uid
                sample.qc_level_uid = level.uid
                sample = await sample.save()

                # Attach Analysis result for each Analyses
                for _service in _profiles_analyses:
                    a_result_in = {
                        'sample_uid': sample.uid,
                        'analysis_uid': _service.uid,
                        'status': states.result.PENDING
                    }
                    a_result_schema = schemas.AnalysisResultCreate(**a_result_in)
                    await result_models.AnalysisResult.create(a_result_schema)

                qc_samples.append(sample)

            qc_sets.append(qc_set)

        return CreateQCSetData(samples=qc_samples, qc_sets=qc_sets)

    @strawberry.mutation
    async def create_QC_level(self, info, level: str) -> a_types.QCLevelType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create qc-levels")

        if not level:
            raise Exception("Level Name is mandatory")

        exists = await qc_models.QCLevel.get(level=level)
        if exists:
            raise Exception(f"A QCLevel named {level} already exists")

        obj_in = schemas.QCLevelCreate(**passed_args)
        qc_level: qc_models.QCLevel = await qc_models.QCLevel.create(obj_in)
        return qc_level

    @strawberry.mutation
    async def update_QC_level(self, info, uid: int, level: str) -> a_types.QCLevelType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update qc-levels")

        qc_level = await qc_models.QCLevel.get(uid=uid)
        if not qc_level:
            raise Exception(f"QCLevel with uid {uid} does not exist")

        qc_data = qc_level.to_dict()
        for field in qc_data:
            if field in passed_args:
                try:
                    setattr(qc_level, field, passed_args[field])
                except AttributeError as e:
                    logger.warning(e)

        qc_in = schemas.QCTemplateUpdate(**qc_level.to_dict())
        qc_level = await qc_level.update(qc_in)
        return qc_level

    @strawberry.mutation
    async def create_QC_template(self, info, name: str, description: str, departments: List[int] = None, levels: List[int] = None) -> a_types.QCTemplateType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create qc-templates")

        if not name:
            raise Exception("Name is mandatory")

        exists = await qc_models.QCTemplate.get(name=name)
        if exists:
            raise Exception(f"A QCTemplate named {name} already exists")

        incoming = {}
        for k, v in passed_args.items():
            if k not in ['levels', 'departments']:
                incoming[k] = v

        obj_in = schemas.QCTemplateCreate(**incoming)
        qc_template: qc_models.QCTemplate = await qc_models.QCTemplate.create(obj_in)

        levels = passed_args.get('levels', None)
        qc_template.qc_levels.clear()
        if levels:
            for _uid in levels:
                level = await qc_models.QCLevel.get(uid=_uid)
                if level not in qc_template.qc_levels:
                    qc_template.qc_levels.append(level)
        qc_template = await qc_template.save()

        departments = passed_args.get('departments', None)
        qc_template.departments.clear()
        if departments:
            for _uid in departments:
                dept = await setup_models.Department.get(uid=_uid)
                if dept not in qc_template.departments:
                    qc_template.departments.append(dept)
        qc_template = await qc_template.save()
        return qc_template

    @strawberry.mutation
    async def update_QC_template(self, info, uid: int, name: Optional[str] = None, description: Optional[str] = None,
                                 departments: List[int] = None, levels: List[int] = None) -> a_types.QCTemplateType:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
        
        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update qc-templates")

        qc_template = await qc_models.QCTemplate.get(uid=uid)
        if not qc_template:
            raise Exception(f"QCTemplate with uid {uid} does not exist")

        qc_data = qc_template.to_dict()
        for field in qc_data:
            if field in passed_args:
                try:
                    setattr(qc_template, field, passed_args[field])
                except AttributeError as e:
                    # raise Exception(f"{e}")
                    pass

        qc_in = schemas.QCTemplateUpdate(**qc_template.to_dict())
        qc_template = await qc_template.update(qc_in)

        levels = passed_args.get('levels', None)
        qc_template.qc_levels.clear()
        if levels:
            for _uid in levels:
                level = await qc_models.QCLevel.get(uid=_uid)
                if level not in qc_template.qc_levels:
                    qc_template.qc_levels.append(level)
        qc_template = await qc_template.save()

        departments = passed_args.get('departments', None)
        qc_template.departments.clear()
        if departments:
            for _uid in departments:
                dept = await setup_models.Department.get(uid=_uid)
                if dept not in qc_template.departments:
                    qc_template.departments.append(dept)
        qc_template = await qc_template.save()
        return qc_template

