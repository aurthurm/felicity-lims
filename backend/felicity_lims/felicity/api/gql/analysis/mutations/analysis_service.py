import logging
from typing import List, Optional

import strawberry  # noqa
from felicity.apps.analysis import schemas
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.api.gql import OperationError, auth_from_info, verify_user_auth
from felicity.api.gql.analysis.types import analysis as a_types

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class AnalysisInputType:
    name: str
    description: str
    keyword: str
    sort_key: int
    sample_types: Optional[List[int]] = None
    category_uid: Optional[int] = None,
    internal_use: Optional[bool] = False
    tat_length_minutes: int = None
    unit: str = None
    active: Optional[bool] = True


ProfilesServiceResponse = strawberry.union("ProfilesServiceResponse",
                                           (a_types.AnalysisWithProfiles, OperationError),  # noqa
                                           description=""
                                           )


@strawberry.mutation
async def create_analysis(info, payload: AnalysisInputType) -> ProfilesServiceResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can create analysis")

    if not payload.name or not payload.description:
        return OperationError(
            error="Name and Description are mandatory"
        )

    exists = await analysis_models.Analysis.get(name=payload.name)
    if exists:
        return OperationError(
            error=f"A analysis named {payload.name} already exists"
        )

    exists = await analysis_models.Analysis.get(keyword=payload.keyword)
    if exists:
        return OperationError(
            error=f"Analysis Keyword {payload.keyword} is not unique"
        )

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    sample_types = payload.__dict__.get('sample_types', None)
    incoming['sample_types'] = []
    if sample_types:
        for _uid in sample_types:
            stype = await analysis_models.SampleType.get(uid=_uid)
            if stype not in incoming['sample_types']:
                incoming['sample_types'].append(stype)

    obj_in = schemas.AnalysisCreate(**incoming)  # skip this stage if its not adding analyses and stypes
    analysis: analysis_models.Analysis = await analysis_models.Analysis.create(obj_in)

    return a_types.AnalysisWithProfiles(**analysis.marshal_simple())


@strawberry.mutation
async def update_analysis(info, uid: int, payload: AnalysisInputType) -> ProfilesServiceResponse:

    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(is_authenticated, felicity_user, "Only Authenticated user can update analysis")

    analysis = await analysis_models.Analysis.get(uid=uid)
    if not analysis:
        return OperationError(
            error=f"Analysis with uid {uid} does not exist -- cannot update"
        )

    analysis_data = analysis.to_dict()
    for field in analysis_data:
        if field in payload.__dict__:
            try:
                setattr(analysis, field, payload.__dict__[field])
            except AttributeError as e:
                logger.warning(e)

    analysis.sample_types.clear()
    if payload.sample_types:
        for _uid in payload.sample_types:
            stype = await analysis_models.SampleType.get(uid=_uid)
            if stype not in analysis.sample_types:
                analysis.sample_types.append(stype)

    analysis_in = schemas.AnalysisUpdate(**analysis.to_dict(nested=False))
    analysis = await analysis.update(analysis_in)
    return a_types.AnalysisWithProfiles(**analysis.marshal_simple())
