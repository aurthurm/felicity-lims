import logging
from typing import Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types import analysis as a_types
from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.analysis import schemas
from felicity.apps.analysis.services.analysis import (SampleTypeCodingService,
                                                      SampleTypeService)

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


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_sample_type(info, payload: SampleTypeInputType) -> SampleTypeResponse:

    felicity_user = await auth_from_info(info)

    if not payload.name or not payload.abbr:
        return OperationError(error="Name and Description are mandatory")

    exists = await SampleTypeService().get(name=payload.name)
    if exists:
        return OperationError(error=f"Sample Type: {payload.name} already exists")

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.SampleTypeCreate(**incoming)
    sample_type = await SampleTypeService().create(obj_in)
    return a_types.SampleTypeTyp(**sample_type.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_sample_type(
    info, uid: str, payload: SampleTypeInputType
) -> SampleTypeResponse:

    felicity_user = await auth_from_info(info)

    sample_type = await SampleTypeService().get(uid=uid)
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
    sample_type = await SampleTypeService().update(sample_type.uid, sample_type_in)
    return a_types.SampleTypeTyp(**sample_type.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_sample_type_mapping(
    info, payload: SampleTypeMappingInputType
) -> SampleTypeMappingResponse:

    felicity_user = await auth_from_info(info)

    exists = await SampleTypeCodingService().get(code=payload.code)
    if exists:
        return OperationError(error=f"Mapping: {payload.code} already exists")

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.SampleTypeCodingCreate(**incoming)
    sample_type_mapping = await SampleTypeCodingService().create(obj_in)
    return a_types.SampleTypeMappingType(**sample_type_mapping.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_sample_type_mapping(
    info, uid: str, payload: SampleTypeMappingInputType
) -> SampleTypeMappingResponse:

    felicity_user = await auth_from_info(info)

    sample_type_mapping = await SampleTypeCodingService().get(uid=uid)
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
    sample_type_mapping = await SampleTypeCodingService().update(
        sample_type_mapping.uid, sample_type_mapping_in
    )
    return a_types.SampleTypeMappingType(**sample_type_mapping.marshal_simple())
