import logging

import strawberry  # noqa

from beak.modules.core.api.gql.analysis.types import analysis as a_types
from beak.modules.shared.api.gql.auth import auth_from_info
from beak.modules.shared.api.gql.permissions import IsAuthenticated
from beak.modules.shared.api.gql.types import OperationError
from beak.modules.core.analysis import schemas
from beak.modules.core.analysis.services.analysis import RejectionReasonService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RejectionReasonResponse = strawberry.union(
    "RejectionReasonResponse",
    (a_types.RejectionReasonType, OperationError),  # noqa
    description="",
)


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_rejection_reason(info, reason: str) -> RejectionReasonResponse:
    beak_user = await auth_from_info(info)

    if not reason:
        return OperationError(error="reason is mandatory")

    exists = await RejectionReasonService().get(reason=reason)
    if exists:
        return OperationError(
            error=f"The Rejection reason -> {reason} <- already exists"
        )

    incoming = {
        "reason": reason,
        "created_by_uid": beak_user.uid,
        "updated_by_uid": beak_user.uid,
    }

    obj_in = schemas.RejectionReasonCreate(**incoming)
    rejection_reason = await RejectionReasonService().create(obj_in)
    return a_types.RejectionReasonType(**rejection_reason.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_rejection_reason(
    info, uid: str, reason: str
) -> RejectionReasonResponse:
    await auth_from_info(info)

    rejection_reason = await RejectionReasonService().get(uid=uid)
    if not rejection_reason:
        return OperationError(error=f"rejection reason with uid {uid} does not exist")

    try:
        setattr(rejection_reason, "reason", reason)
    except AttributeError as e:
        logger.warning(e)

    rr_in = schemas.RejectionReasonUpdate(**rejection_reason.to_dict())
    rejection_reason = await RejectionReasonService().update(
        rejection_reason.uid, rr_in
    )
    return a_types.RejectionReasonType(**rejection_reason.marshal_simple())
