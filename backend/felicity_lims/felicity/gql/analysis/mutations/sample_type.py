from typing import Optional, List
import logging
import inspect
import strawberry

from felicity.apps.analysis.models import analysis as analysis_models
from felicity.apps.analysis import schemas
from felicity.gql import auth_from_info, verify_user_auth
from felicity.gql.analysis.types import analysis as a_types
from felicity.apps.patient.models import logger
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
async def create_sample_type(self, info, name: str, abbr: str, description: Optional[str] = None,
                             internal_use: Optional[bool] = False,
                             active: Optional[bool] = True) -> a_types.SampleTypeTyp:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create sample types")

    if not name or not abbr:
        raise Exception("Name and Description are mandatory")

    exists = await analysis_models.SampleType.get(name=name)
    if exists:
        raise Exception(f"Sample Type: {name} already exists")

    incoming = {}
    for k, v in passed_args.items():
        incoming[k] = v

    obj_in = schemas.SampleTypeCreate(**incoming)
    sample_type: analysis_models.SampleType = await analysis_models.SampleType.create(obj_in)
    return sample_type


@strawberry.mutation
async def update_sample_type(self, info, uid: int, name: Optional[str] = None, abbr: Optional[str] = None,
                             description: Optional[str] = None, internal_use: Optional[bool] = False,
                             active: Optional[bool] = True) -> a_types.SampleTypeTyp:
    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update sample types")

    sample_type = await analysis_models.SampleType.get(uid=uid)
    if not sample_type:
        raise Exception(f"Sample type with uid {uid} does not exist")

    st_data = sample_type.to_dict()
    for field in st_data:
        if field in passed_args:
            try:
                setattr(sample_type, field, passed_args[field])
            except Exception as e:
                logger.warning(e)

    sample_type_in = schemas.SampleTypeUpdate(**sample_type.to_dict())
    sample_type = await sample_type.update(sample_type_in)
    return sample_type

