import logging
from typing import Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types import analysis as a_types
from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.analysis import schemas
from felicity.apps.analysis.services.analysis import CodingStandardService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class CodingStandardInputType:
    name: str
    description: str | None = ""


CodingStandardResponse = strawberry.union(
    "CodingStandardResponse",
    (a_types.CodingStandardType, OperationError),  # noqa
    description="",
)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_coding_standard(
    info, payload: CodingStandardInputType
) -> CodingStandardResponse:

    felicity_user = await auth_from_info(info)

    if not payload.name:
        return OperationError(error="Name is mandatory")

    exists = await CodingStandardService().get(name=payload.name)
    if exists:
        return OperationError(error=f"Coding Standard: {payload.name} already exists")

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.CodingStandardCreate(**incoming)
    coding_standard = (
        await CodingStandardService().create(obj_in)
    )
    return a_types.CodingStandardType(**coding_standard.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_coding_standard(
    info, uid: str, payload: CodingStandardInputType
) -> CodingStandardResponse:

    felicity_user = await auth_from_info(info)

    coding_standard = await CodingStandardService().get(uid=uid)
    if not coding_standard:
        return OperationError(error=f"Coding standard with uid {uid} does not exist")

    st_data = coding_standard.to_dict()
    for field in st_data:
        if field in payload.__dict__:
            try:
                setattr(coding_standard, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    coding_standard_in = schemas.CodingStandardUpdate(**coding_standard.to_dict())
    coding_standard = await CodingStandardService().update(coding_standard.uid, coding_standard_in)
    return a_types.CodingStandardType(**coding_standard.marshal_simple())
