import logging

import strawberry  # noqa

from felicity.api.gql.multiplex.microbiology import AbxMediumType, AbxQCRangeType
from felicity.apps.multiplex.microbiology.schemas import AbxMediumCreate, AbxMediumUpdate, AbxQCRangeCreate, \
    AbxQCRangeUpdate
from felicity.apps.multiplex.microbiology.services import AbxMediumService, AbxQCRangeService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
import strawberry
from typing import List
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.types import OperationError


# Input Types
@strawberry.input
class AbxMediumInputType:
    name: str
    description: str | None = None


@strawberry.input
class AbxQCRangeInputType:
    guideline_uid: str
    year: int
    strain: str
    reference_table: str
    whonet_org_code: str
    antibiotic: str
    abx_test: str
    whonet_abx_code: str
    method: str
    medium_uid: str | None = None
    minimum: str | None = None
    maximum: str | None = None


@strawberry.input
class AbxASTPPanelInputType:
    name: str
    description: str | None = None
    breakpoints: List[str] | None = None  # List of breakpoint UIDs
    active: bool = True


# Response Unions
AbxMediumResponse = strawberry.union(
    "AbxMediumResponse",
    (AbxMediumType, OperationError),
    description="",
)

AbxQCRangeResponse = strawberry.union(
    "AbxQCRangeResponse",
    (AbxQCRangeType, OperationError),
    description="",
)


# Medium Mutations
@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_medium(
        info,
        payload: AbxMediumInputType
) -> AbxMediumResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxMediumCreate(**incoming)
    abx_medium = await AbxMediumService().create(obj_in)
    return AbxMediumType(**abx_medium.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_medium(
        info,
        uid: str,
        payload: AbxMediumInputType
) -> AbxMediumResponse:
    felicity_user = await auth_from_info(info)
    abx_medium = await AbxMediumService().get(uid=uid)

    medium_data = abx_medium.to_dict()
    for field in medium_data:
        if field in payload.__dict__:
            try:
                setattr(abx_medium, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(abx_medium, "updated_by_uid", felicity_user.uid)

    medium_in = AbxMediumUpdate(**abx_medium.to_dict())
    abx_medium = await AbxMediumService().update(abx_medium.uid, medium_in)
    return AbxMediumType(**abx_medium.marshal_simple())


# QC Range Mutations
@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_qc_range(
        info,
        payload: AbxQCRangeInputType
) -> AbxQCRangeResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxQCRangeCreate(**incoming)
    qc_range = await AbxQCRangeService().create(obj_in)
    return AbxQCRangeType(**qc_range.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_qc_range(
        info,
        uid: str,
        payload: AbxQCRangeInputType
) -> AbxQCRangeResponse:
    felicity_user = await auth_from_info(info)

    qc_range = await AbxQCRangeService().get(uid=uid)

    range_data = qc_range.to_dict()
    for field in range_data:
        if field in payload.__dict__:
            try:
                setattr(qc_range, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    setattr(qc_range, "updated_by_uid", felicity_user.uid)

    range_in = AbxQCRangeUpdate(**qc_range.to_dict())
    qc_range = await AbxQCRangeService().update(uid, range_in)
    return AbxQCRangeType(**qc_range.marshal_simple())
