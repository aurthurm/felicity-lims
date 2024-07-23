import logging
from dataclasses import field
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types import analysis as a_types
from felicity.api.gql.auth import auth_from_info, verify_user_auth
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.analysis import schemas, utils
from felicity.apps.analysis.entities import analysis as analysis_entities

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
    description: str = ""
    department_uid: str | None = None
    sample_types: Optional[List[str]] = field(default_factory=list)
    services: Optional[List[str]] = field(default_factory=list)
    keyword: str | None = None
    active: bool | None = True


AnalysisTemplateResponse = strawberry.union(
    "AnalysisTemplateResponse",
    (a_types.AnalysisTemplateType, OperationError),  # noqa
    description="Union of possible outcomes",
)


@strawberry.input
class AnalysisTemplateInputType:
    name: str
    description: str = ""
    department_uid: str | None = None
    services: Optional[List[str]] = field(default_factory=list)


ProfileMappingResponse = strawberry.union(
    "ProfileMappingResponse",
    (a_types.ProfileMappingType, OperationError),  # noqa
    description="Union of possible outcomes when adding a new notice",
)


@strawberry.input
class ProfileMappingInputType:
    profile_uid: str
    coding_standard_uid: str
    name: str
    code: str
    description: str | None = None


@strawberry.mutation(permission_classes=[IsAuthenticated])
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

    exists = await analysis_entities.Profile.get(name=payload.name)
    if exists:
        return OperationError(
            error=f"A Profile named {payload.name} already exists",
            suggestion="Change profile title to something else",
        )

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        if k not in ["sample_types", "services"]:
            incoming[k] = v

    obj_in = schemas.ProfileCreate(**incoming)
    profile: analysis_entities.Profile = await analysis_entities.Profile.create(obj_in)

    if payload.sample_types:
        for _st_uid in payload.sample_types:
            await analysis_entities.Profile.table_insert(
                table=analysis_entities.profile_sample_type,
                mappings={"sample_type_uid": _st_uid, "profile_uid": profile.uid},
            )

    if payload.services:
        for service_uid in payload.services:
            await analysis_entities.Analysis.table_insert(
                table=analysis_entities.analysis_profile,
                mappings={"analysis_uid": service_uid, "profile_uid": profile.uid},
            )

    await utils.billing_setup_profiles([profile.uid])

    profile = await analysis_entities.Profile.get(uid=profile.uid)  # noqa
    return a_types.ProfileType(**profile.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_profile(
        info, uid: str, payload: ProfileInputType
) -> AnalysisProfileResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can update analysis profiles",
    )

    profile = await analysis_entities.Profile.get(uid=uid)
    if not profile:
        return OperationError(
            error=f"Profile with uid {uid} does not exist",
            suggestion="refresh your page and try again",
        )

    profile_data = profile.to_dict()
    for _field in profile_data:
        if _field in payload.__dict__:
            try:
                setattr(profile, _field, payload.__dict__[_field])
            except AttributeError as e:
                logger.warning(e)

    profile_in = schemas.ProfileUpdate(**profile.to_dict())
    profile = await profile.update(profile_in)

    # Analyses management
    if payload.services:
        profile.analyses.clear()
        profile = await profile.save_async()
        for _uid in payload.services:
            anal = await analysis_entities.Analysis.get(uid=_uid)
            await analysis_entities.Analysis.table_insert(
                table=analysis_entities.analysis_profile,
                mappings={"analysis_uid": anal.uid, "profile_uid": profile.uid},
            )

    # Sample Type management
    if payload.sample_types:
        profile.sample_types.clear()
        profile = await profile.save_async()
        for _uid in payload.sample_types:
            st = await analysis_entities.SampleType.get(uid=_uid)
            profile.sample_types.append(st)
            await analysis_entities.SampleType.table_insert(
                table=analysis_entities.profile_sample_type,
                mappings={"sample_type_uid": st.uid, "profile_uid": profile.uid},
            )

    return a_types.ProfileType(**profile.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_analysis_template(info, payload: AnalysisTemplateInputType) -> AnalysisTemplateResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can create analysis templates",
    )

    if not payload.name or not payload.description:
        return OperationError(
            error="Name and Description are mandatory",
            suggestion="Make sure the fields name and description are not empty",
        )

    exists = await analysis_entities.AnalysisTemplate.get(name=payload.name)
    if exists:
        return OperationError(
            error=f"An Analysis Template named {payload.name} already exists",
            suggestion="Change template title to something else",
        )

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        if k not in ["services"]:
            incoming[k] = v

    obj_in = schemas.AnalysisTemplateCreate(**incoming)
    template = await analysis_entities.AnalysisTemplate.create(obj_in)

    if payload.services:
        for service_uid in payload.services:
            await analysis_entities.Analysis.table_insert(
                table=analysis_entities.analysis_analysis_template,
                mappings={"analysis_uid": service_uid, "analysis_template_uid": template.uid},
            )

    template = await analysis_entities.AnalysisTemplate.get(uid=template.uid)
    return a_types.AnalysisTemplateType(**template.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_analysis_template(
        info, uid: str, payload: AnalysisTemplateInputType
) -> AnalysisTemplateResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can update analysis templates",
    )

    template = await analysis_entities.AnalysisTemplate.get(uid=uid)
    if not template:
        return OperationError(
            error=f"Analysis Template with uid {uid} does not exist",
            suggestion="refresh your page and try again",
        )

    template_data = template.to_dict()
    for _field in template_data:
        if _field in payload.__dict__:
            try:
                setattr(template, _field, payload.__dict__[_field])
            except AttributeError as e:
                logger.warning(e)

    template_in = schemas.AnalysisTemplateUpdate(**template.to_dict())
    template = await template.update(template_in)

    # Analyses management
    if payload.services:
        template.analyses.clear()
        template = await template.save_async()
        for _uid in payload.services:
            anal = await analysis_entities.Analysis.get(uid=_uid)
            await analysis_entities.Analysis.table_insert(
                table=analysis_entities.analysis_analysis_template,
                mappings={"analysis_uid": anal.uid, "analysis_template_uid": template.uid},
            )

    return a_types.AnalysisTemplateType(**template.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_profile_mapping(
        info, payload: ProfileMappingInputType
) -> ProfileMappingResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can create profiles mappigs",
    )

    exists = await analysis_entities.ProfileCoding.get(code=payload.code)
    if exists:
        return OperationError(error=f"Mapping: {payload.code} already exists")

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.ProfileCodingCreate(**incoming)
    profile_mapping: analysis_entities.ProfileCoding = (
        await analysis_entities.ProfileCoding.create(obj_in)
    )
    return a_types.ProfileMappingType(**profile_mapping.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_profile_mapping(
        info, uid: str, payload: ProfileMappingInputType
) -> ProfileMappingResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can update profile mappings",
    )

    profile_mapping = await analysis_entities.ProfileCoding.get(uid=uid)
    if not profile_mapping:
        return OperationError(error=f"Coding with uid {uid} does not exist")

    st_data = profile_mapping.to_dict()
    for _field in st_data:
        if _field in payload.__dict__:
            try:
                setattr(profile_mapping, _field, payload.__dict__[_field])
            except Exception as e:
                logger.warning(e)

    profile_mapping_in = schemas.ProfileCodingUpdate(**profile_mapping.to_dict())
    profile_mapping = await profile_mapping.update(profile_mapping_in)
    return a_types.ProfileMappingType(**profile_mapping.marshal_simple())
