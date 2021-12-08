import inspect
import logging
from typing import Optional, List

import strawberry

from felicity.apps.analysis import schemas
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.apps.patient.models import logger
from felicity.gql import auth_from_info, verify_user_auth
from felicity.gql.analysis.types import analysis as a_types
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
async def create_profile(self, info, name: str, description: str, keyword: Optional[str] = None,
                         active: Optional[bool] = True) -> a_types.ProfileType:

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
                         keyword: Optional[str] = None, services: Optional[List[int]] = None,
                         active: Optional[bool] = True) -> a_types.ProfileType:

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