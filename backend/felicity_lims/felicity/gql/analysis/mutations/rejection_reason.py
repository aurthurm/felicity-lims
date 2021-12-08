import inspect
import logging
from typing import Optional, List

import strawberry

from felicity.apps.analysis import schemas
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.apps.patient.models import logger
from felicity.gql import auth_from_info, verify_user_auth
from felicity.gql.analysis.types import analysis as a_types
from felicity.utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class ARSampleInputType:
    sample_type: int
    profiles: List[int]
    analyses: List[int]


@strawberry.input
class ARResultInputType:
    uid: int
    result: str
    reportable: Optional[bool] = True


@strawberry.input
class QCSetInputType:
    qcTemplateUid: Optional[int]
    qcLevels: List[int]
    analysisProfiles: List[int]
    analysisServices: List[int]


@strawberry.type
class CreateQCSetData:
    samples: List[a_types.SampleType]
    qc_sets: List[a_types.QCSetType]


@strawberry.input
class SampleRejectInputType:
    uid: int
    reasons: List[int]
    other: Optional[str] = None


@strawberry.mutation
async def create_rejection_reason(self, info, reason: str) -> a_types.RejectionReasonType:

    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create rejection reasons")

    if not reason:
        raise Exception("reason is mandatory")

    exists = await analysis_models.RejectionReason.get(reason=reason)
    if exists:
        raise Exception(f"The Rejection reason -> {reason} <- already exists")

    obj_in = schemas.RejectionReasonCreate(**passed_args)
    rejection_reason: analysis_models.RejectionReason = await analysis_models.RejectionReason.create(obj_in)
    return rejection_reason

@strawberry.mutation
async def update_rejection_reason(self, info, uid: int, reason: str) -> a_types.RejectionReasonType:

    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update rejection reasons")

    rejection_reason = await analysis_models.RejectionReason.get(uid=uid)
    if not rejection_reason:
        raise Exception(f"rejection reason with uid {uid} does not exist")

    qc_data = rejection_reason.to_dict()
    for field in qc_data:
        if field in passed_args:
            try:
                setattr(rejection_reason, field, passed_args[field])
            except AttributeError as e:
                logger.warning(e)

    rr_in = schemas.RejectionReasonUpdate(**rejection_reason.to_dict())
    rejection_reason = await rejection_reason.update(rr_in)
    return rejection_reason
