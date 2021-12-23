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
async def create_analysis(self, info, name: str, description: str, keyword: str, sort_key: int,
                          sample_types: Optional[List[int]] = None, category_uid: Optional[int] = None,
                          internal_use: Optional[bool] = False, tat_length_minutes: int = None, unit: str = None,
                          active: Optional[bool] = True) -> a_types.AnalysisWithProfiles:

    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create analysis")

    if not name or not description:
        raise Exception("Name and Description are mandatory")

    exists = await analysis_models.Analysis.get(name=name)
    if exists:
        raise Exception(f"A analysis named {name} already exists")

    exists = await analysis_models.Analysis.get(keyword=keyword)
    if exists:
        raise Exception(f"Analysis Keyword {keyword} is not unique")

    incoming = {}
    for k, v in passed_args.items():
        incoming[k] = v

    sample_types = passed_args.get('sample_types', None)
    incoming['sample_types'] = []
    if sample_types:
        for _uid in sample_types:
            stype = await analysis_models.SampleType.get(uid=_uid)
            if stype not in incoming['sample_types']:
                incoming['sample_types'].append(stype)

    obj_in = schemas.AnalysisCreate(**incoming)  # skip this stage if its not adding analyses and stypes
    analysis: analysis_models.Analysis = await analysis_models.Analysis.create(obj_in)

    return analysis

@strawberry.mutation
async def update_analysis(self, info, uid: int, name: str, description: str, keyword: str, sort_key: int,
                          sample_types: Optional[List[str]] = None, category_uid: Optional[int] = None,
                          internal_use: Optional[bool] = False, tat_length_minutes: int = None, unit: str = None,
                          active: Optional[bool] = True) -> a_types.AnalysisWithProfiles:

    inspector = inspect.getargvalues(inspect.currentframe())
    passed_args = get_passed_args(inspector)

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update analysis")

    analysis = await analysis_models.Analysis.get(uid=uid)
    if not analysis:
        raise Exception(f"Analysis with uid {uid} does not exist -- cannot update")

    analysis_data = analysis.to_dict()
    for field in analysis_data:
        if field in passed_args:
            try:
                setattr(analysis, field, passed_args[field])
            except AttributeError as e:
                logger.warning(e)

    sample_types = passed_args.get('sample_types', None)
    analysis.sample_types.clear()
    if sample_types:
        for _uid in sample_types:
            stype = await analysis_models.SampleType.get(uid=_uid)
            if stype not in analysis.sample_types:
                analysis.sample_types.append(stype)

    analysis_in = schemas.AnalysisUpdate(**analysis.to_dict(nested=False))
    analysis = await analysis.update(analysis_in)
    return analysis
