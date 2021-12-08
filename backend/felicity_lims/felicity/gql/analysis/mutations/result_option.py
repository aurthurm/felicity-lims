import logging
import inspect
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
async def create_result_option(self, info, analysis_uid: int, option_key: int,
                               value: str) -> a_types.ResultOptionType:

    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can add result options")

    if not analysis_uid:
        raise Exception("Analysis to attach Result Option Required")

    if not option_key or not value:
        raise Exception("Result option key and value Required")

    analysis = await analysis_models.Analysis.get(uid=analysis_uid)
    if not analysis:
        raise Exception(f"Analysis with uid {analysis_uid} does not exist")

    incoming = {}
    for k, v in passed_args.items():
        incoming[k] = v

    obj_in = schemas.ResultOptionCreate(**incoming)
    result_option: analysis_models.ResultOption = await analysis_models.ResultOption.create(obj_in)
    return result_option


@strawberry.mutation
async def update_result_option(self, info, uid: int, option_key: Optional[int] = None,
                               value: Optional[str] = None) -> a_types.ResultOptionType:

    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update result options")

    result_option = await analysis_models.ResultOption.get(uid=uid)
    if not result_option:
        raise Exception(f"ResultOption with uid {uid} does not exist")

    ro_data = result_option.to_dict()
    for field in ro_data:
        if field in passed_args:
            try:
                setattr(result_option, field, passed_args[field])
            except Exception as e:
                logger.warning(e)

    result_option_in = schemas.ResultOptionUpdate(**result_option.to_dict())
    result_option = await result_option.update(result_option_in)
    return result_option