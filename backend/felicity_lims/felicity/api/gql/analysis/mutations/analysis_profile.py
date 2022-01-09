import logging
from typing import Optional

import strawberry  # noqa
from felicity.apps.analysis import schemas
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.gql import OperationError, auth_from_info, verify_user_auth
from felicity.gql.analysis.types import analysis as a_types

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

AnalysisProfileResponse = strawberry.union(
    "AnalysisProfileResponse",
    (a_types.ProfileType, OperationError),  # noqa
    description="Union of possible outcomes when adding a new notice",
)


@strawberry.input
class ProfileInputType:
    name: str
    description: str
    services: Optional[int]
    keyword: Optional[str] = None
    active: Optional[bool] = True


@strawberry.mutation
async def create_profile(info, payload: ProfileInputType) -> AnalysisProfileResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can create analysis profiles",
    )

    if not payload.name or not payload.description:
        return OperationError(
            error="Name and Description are mandatory",
            suggestion="Make sure the fields name and description are not empty",
        )

    exists = await analysis_models.Profile.get(name=payload.name)
    if exists:
        return OperationError(
            error=f"A Profile named {payload.name} already exists",
            suggestion="Change profile title to something else",
        )

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
        **payload.__dict__,
    }

    obj_in = schemas.ProfileCreate(**incoming)
    profile: analysis_models.Profile = await analysis_models.Profile.create(obj_in)
    return a_types.ProfileType(**profile.marshal_simple())


@strawberry.mutation
async def update_profile(
    info, uid: int, payload: ProfileInputType
) -> AnalysisProfileResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can update analysis profiles",
    )

    profile = await analysis_models.Profile.get(uid=uid)
    if not profile:
        return OperationError(
            error=f"Profile with uid {uid} does not exist",
            suggestion="refresh your page and try again",
        )

    profile_data = profile.to_dict()
    for field in profile_data:
        if field in payload.__dict__:
            try:
                setattr(profile, field, payload.__dict__[field])
            except AttributeError as e:
                logger.warning(e)

    profile_in = schemas.ProfileUpdate(**profile.to_dict())
    profile = await profile.update(profile_in)

    profile.analyses.clear()
    if payload.services:
        for _uid in payload.services:
            anal = await analysis_models.Analysis.get(uid=_uid)
            if anal not in profile.analyses:
                profile.analyses.append(anal)
    profile = await profile.save()

    return a_types.ProfileType(**profile.marshal_simple())
