import logging

import strawberry  # noqa
from api.gql.analysis.types import analysis as a_types
from api.gql.auth import auth_from_info, verify_user_auth
from api.gql.types import OperationError
from domain.analysis.models import analysis as analysis_models

from domain.analysis import schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RejectionReasonResponse = strawberry.union(
    "RejectionReasonResponse",
    (a_types.RejectionReasonType, OperationError),  # noqa
    description="",
)


async def create_rejection_reason(info, reason: str) -> RejectionReasonResponse:
    is_authenticated, user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        user,
        "Only Authenticated user can create rejection reasons",
    )

    if not reason:
        return OperationError(error="reason is mandatory")

    exists = await analysis_models.RejectionReason.get(reason=reason)
    if exists:
        return OperationError(
            error=f"The Rejection reason -> {reason} <- already exists"
        )

    incoming = {
        "reason": reason,
        "created_by_uid": user.uid,
        "updated_by_uid": user.uid,
    }

    obj_in = schemas.RejectionReasonCreate(**incoming)
    rejection_reason: analysis_models.RejectionReason = (
        await analysis_models.RejectionReason.create(obj_in)
    )
    return a_types.RejectionReasonType(**rejection_reason.marshal_simple())


async def update_rejection_reason(
    info, uid: str, reason: str
) -> RejectionReasonResponse:
    is_authenticated, user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        user,
        "Only Authenticated user can update rejection reasons",
    )

    rejection_reason = await analysis_models.RejectionReason.get(uid=uid)
    if not rejection_reason:
        return OperationError(error=f"rejection reason with uid {uid} does not exist")

    try:
        setattr(rejection_reason, "reason", reason)
    except AttributeError as e:
        logger.warning(e)

    rr_in = schemas.RejectionReasonUpdate(**rejection_reason.to_dict())
    rejection_reason = await rejection_reason.update(rr_in)
    return a_types.RejectionReasonType(**rejection_reason.marshal_simple())
