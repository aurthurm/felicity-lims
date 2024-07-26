import logging

import strawberry  # noqa

from felicity.api.gql.analysis.types import analysis as a_types
from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.analysis import schemas
from felicity.apps.analysis.entities import analysis as analysis_entities

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RejectionReasonResponse = strawberry.union(
    "RejectionReasonResponse",
    (a_types.RejectionReasonType, OperationError),  # noqa
    description="",
)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_rejection_reason(info, reason: str) -> RejectionReasonResponse:

    felicity_user = await auth_from_info(info)


    if not reason:
        return OperationError(error="reason is mandatory")

    exists = await analysis_entities.RejectionReason.get(reason=reason)
    if exists:
        return OperationError(
            error=f"The Rejection reason -> {reason} <- already exists"
        )

    incoming = {
        "reason": reason,
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }

    obj_in = schemas.RejectionReasonCreate(**incoming)
    rejection_reason: analysis_entities.RejectionReason = (
        await analysis_entities.RejectionReason.create(obj_in)
    )
    return a_types.RejectionReasonType(**rejection_reason.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_rejection_reason(
    info, uid: str, reason: str
) -> RejectionReasonResponse:
    felicity_user = await auth_from_info(info)

    rejection_reason = await analysis_entities.RejectionReason.get(uid=uid)
    if not rejection_reason:
        return OperationError(error=f"rejection reason with uid {uid} does not exist")

    try:
        setattr(rejection_reason, "reason", reason)
    except AttributeError as e:
        logger.warning(e)

    rr_in = schemas.RejectionReasonUpdate(**rejection_reason.to_dict())
    rejection_reason = await rejection_reason.update(rr_in)
    return a_types.RejectionReasonType(**rejection_reason.marshal_simple())
