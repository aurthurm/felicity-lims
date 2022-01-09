import logging

import strawberry  # noqa
from felicity.apps.analysis import schemas
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.gql import OperationError, auth_from_info, verify_user_auth
from felicity.gql.analysis.types import analysis as a_types

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RejectionReasonResponse = strawberry.union(
    "RejectionReasonResponse",
    (a_types.RejectionReasonType, OperationError),  # noqa
    description="",
)


@strawberry.mutation
async def create_rejection_reason(info, reason: str) -> RejectionReasonResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
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
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }

    obj_in = schemas.RejectionReasonCreate(**incoming)
    rejection_reason: analysis_models.RejectionReason = await analysis_models.RejectionReason.create(
        obj_in
    )
    return a_types.RejectionReasonType(**rejection_reason.marshal_simple())


@strawberry.mutation
async def update_rejection_reason(
    info, uid: int, reason: str
) -> RejectionReasonResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
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
