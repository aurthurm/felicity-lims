import logging

import strawberry  # noqa
from api.gql.analysis.types import analysis as a_types
from api.gql.auth import auth_from_info, verify_user_auth
from api.gql.types import OperationError
from domain.analysis.models import analysis as analysis_models

from domain.analysis import schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class SampleTypeInputType:
    name: str
    abbr: str
    description: str | None = ""
    internal_use: bool | None = False
    active: bool | None = True


SampleTypeResponse = strawberry.union(
    "SampleTypeResponse",
    (a_types.SampleTypeTyp, OperationError),  # noqa
    description="",
)

SampleTypeMappingResponse = strawberry.union(
    "SampleTypeMappingResponse",
    (a_types.SampleTypeMappingType, OperationError),  # noqa
    description="Union of possible outcomes when adding a new notice",
)


@strawberry.input
class SampleTypeMappingInputType:
    sample_type_uid: str
    coding_standard_uid: str
    name: str
    code: str
    description: str | None = None


async def create_sample_type(info, payload: SampleTypeInputType) -> SampleTypeResponse:
    is_authenticated, user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        user,
        "Only Authenticated user can create sample types",
    )

    if not payload.name or not payload.abbr:
        return OperationError(error="Name and Description are mandatory")

    exists = await analysis_models.SampleType.get(name=payload.name)
    if exists:
        return OperationError(error=f"Sample Type: {payload.name} already exists")

    incoming = {
        "created_by_uid": user.uid,
        "updated_by_uid": user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.SampleTypeCreate(**incoming)
    sample_type: analysis_models.SampleType = await analysis_models.SampleType.create(
        obj_in
    )
    return a_types.SampleTypeTyp(**sample_type.marshal_simple())


async def update_sample_type(
    info, uid: str, payload: SampleTypeInputType
) -> SampleTypeResponse:
    is_authenticated, user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        user,
        "Only Authenticated user can update sample types",
    )

    sample_type = await analysis_models.SampleType.get(uid=uid)
    if not sample_type:
        return OperationError(error=f"Sample type with uid {uid} does not exist")

    st_data = sample_type.to_dict()
    for field in st_data:
        if field in payload.__dict__:
            try:
                setattr(sample_type, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    sample_type_in = schemas.SampleTypeUpdate(**sample_type.to_dict())
    sample_type = await sample_type.update(sample_type_in)
    return a_types.SampleTypeTyp(**sample_type.marshal_simple())


async def create_sample_type_mapping(
    info, payload: SampleTypeMappingInputType
) -> SampleTypeMappingResponse:
    is_authenticated, user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        user,
        "Only Authenticated user can create sample type mappigs",
    )

    exists = await analysis_models.SampleTypeCoding.get(code=payload.code)
    if exists:
        return OperationError(error=f"Mapping: {payload.code} already exists")

    incoming = {
        "created_by_uid": user.uid,
        "updated_by_uid": user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.SampleTypeCodingCreate(**incoming)
    sample_type_mapping: analysis_models.SampleTypeCoding = (
        await analysis_models.SampleTypeCoding.create(obj_in)
    )
    return a_types.SampleTypeMappingType(**sample_type_mapping.marshal_simple())


async def update_sample_type_mapping(
    info, uid: str, payload: SampleTypeMappingInputType
) -> SampleTypeMappingResponse:
    is_authenticated, user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        user,
        "Only Authenticated user can update sample_type mappings",
    )

    sample_type_mapping = await analysis_models.SampleTypeCoding.get(uid=uid)
    if not sample_type_mapping:
        return OperationError(error=f"Coding with uid {uid} does not exist")

    st_data = sample_type_mapping.to_dict()
    for field in st_data:
        if field in payload.__dict__:
            try:
                setattr(sample_type_mapping, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    sample_type_mapping_in = schemas.SampleTypeCodingUpdate(
        **sample_type_mapping.to_dict()
    )
    sample_type_mapping = await sample_type_mapping.update(sample_type_mapping_in)
    return a_types.SampleTypeMappingType(**sample_type_mapping.marshal_simple())
