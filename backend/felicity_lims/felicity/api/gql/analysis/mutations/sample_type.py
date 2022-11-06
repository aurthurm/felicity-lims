import logging
from typing import Optional

import strawberry  # noqa
from felicity.apps.analysis import schemas
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.api.gql import OperationError, auth_from_info, verify_user_auth
from felicity.api.gql.analysis.types import analysis as a_types

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class SampleTypeInputType:
    name: str
    abbr: str
    description: Optional[str] = ""
    internal_use: Optional[bool] = False
    active: Optional[bool] = True


SampleTypeResponse = strawberry.union(
    "SampleTypeResponse",
    (a_types.SampleTypeTyp, OperationError),  # noqa
    description="",
)


@strawberry.mutation
async def create_sample_type(info, payload: SampleTypeInputType) -> SampleTypeResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can create sample types",
    )

    if not payload.name or not payload.abbr:
        return OperationError(error="Name and Description are mandatory")

    exists = await analysis_models.SampleType.get(name=payload.name)
    if exists:
        return OperationError(error=f"Sample Type: {payload.name} already exists")

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.SampleTypeCreate(**incoming)
    sample_type: analysis_models.SampleType = await analysis_models.SampleType.create(
        obj_in
    )
    return a_types.SampleTypeTyp(**sample_type.marshal_simple())


@strawberry.mutation
async def update_sample_type(
    info, uid: int, payload: SampleTypeInputType
) -> SampleTypeResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
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
