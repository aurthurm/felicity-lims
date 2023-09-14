import logging
from dataclasses import field
from typing import List, Optional

import strawberry  # noqa

from api.gql.analysis.types import analysis as a_types
from api.gql.auth import auth_from_info, verify_user_auth
from api.gql.permissions import IsAuthenticated
from api.gql.types import OperationError
from apps.analysis import schemas
from apps.analysis.models import analysis as analysis_models
from apps.instrument.models import Method

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class AnalysisInputType:
    name: str
    keyword: str
    sort_key: int
    description: str = ""
    department_uid: str | None = None
    sample_types: Optional[List[str]] = field(default_factory=list)
    methods: Optional[List[str]] = field(default_factory=list)
    category_uid: str | None = None
    unit_uid: str | None = None
    internal_use: bool | None = False
    tat_length_minutes: int = None
    precision: int = None
    required_verifications: int = 1
    self_verification: bool | None = False
    active: bool | None = True


ProfilesServiceResponse = strawberry.union(
    "ProfilesServiceResponse",
    (a_types.AnalysisWithProfiles, OperationError),  # noqa
    description="",
)

AnalysisMappingResponse = strawberry.union(
    "AnalysisMappingResponse",
    (a_types.AnalysisMappingType, OperationError),  # noqa
    description="Union of possible outcomes when adding a new notice",
)


@strawberry.input
class AnalysisMappingInputType:
    analysis_uid: str
    coding_standard_uid: str
    name: str
    code: str
    description: str | None = None


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_analysis(info, payload: AnalysisInputType) -> ProfilesServiceResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated, felicity_user, "Only Authenticated user can create analysis"
    )

    if not payload.name or not payload.description:
        return OperationError(error="Name and Description are mandatory")

    exists = await analysis_models.Analysis.get(name=payload.name)
    if exists:
        return OperationError(error=f"A analysis named {payload.name} already exists")

    exists = await analysis_models.Analysis.get(keyword=payload.keyword)
    if exists:
        return OperationError(error=f"Analysis Keyword {payload.keyword} is not unique")

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        if k not in ["sample_types"]:
            incoming[k] = v

    obj_in = schemas.AnalysisCreate(**incoming)
    analysis: analysis_models.Analysis = await analysis_models.Analysis.create(obj_in)

    if payload.sample_types:
        for st_uid in payload.sample_types:
            await analysis_models.Analysis.table_insert(
                table=analysis_models.analysis_sample_type,
                mappings={"sample_type_uid": st_uid, "analysis_uid": analysis.uid},
            )

    if payload.methods:
        for m_uid in payload.methods:
            await analysis_models.Analysis.table_insert(
                table=analysis_models.analysis_method,
                mappings={"method_uid": m_uid, "analysis_uid": analysis.uid},
            )

    analysis = await analysis_models.Analysis.get(uid=analysis.uid)
    profiles = await analysis_models.Profile.get_all(analyses___uid=analysis.uid)

    return a_types.AnalysisWithProfiles(**{**analysis.marshal_simple(), "profiles": profiles})


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_analysis(
        info, uid: str, payload: AnalysisInputType
) -> ProfilesServiceResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated, felicity_user, "Only Authenticated user can update analysis"
    )

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

    analysis_in = schemas.AnalysisUpdate(**analysis.to_dict(nested=False))
    analysis = await analysis.update(analysis_in)

    if payload.sample_types:
        analysis.sample_types.clear()
        analysis = await analysis.save()
        for _uid in payload.sample_types:
            stype = await analysis_models.SampleType.get(uid=_uid)
            analysis.sample_types.append(stype)
        analysis = await analysis.save()

    if payload.methods:
        analysis.methods.clear()
        analysis = await analysis.save()
        for _uid in payload.methods:
            meth = await Method.get(uid=_uid)
            await Method.table_insert(
                table=analysis_models.analysis_method,
                mappings={"method_uid": meth.uid, "analysis_uid": analysis.uid},
            )
        analysis = await analysis.get(uid=analysis.uid)

    profiles = analysis_models.Profile.get_all(analyses___uid=analysis.uid)

    return a_types.AnalysisWithProfiles(**{**analysis.marshal_simple(), "profiles": profiles})


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_analysis_mapping(
        info, payload: AnalysisMappingInputType
) -> AnalysisMappingResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can create analysiss mappigs",
    )

    exists = await analysis_models.AnalysisCoding.get(code=payload.code)
    if exists:
        return OperationError(error=f"Mapping: {payload.code} already exists")

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.AnalysisCodingCreate(**incoming)
    analysis_mapping: analysis_models.AnalysisCoding = (
        await analysis_models.AnalysisCoding.create(obj_in)
    )
    return a_types.AnalysisMappingType(**analysis_mapping.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_analysis_mapping(
        info, uid: str, payload: AnalysisMappingInputType
) -> AnalysisMappingResponse:
    is_authenticated, felicity_user = await auth_from_info(info)
    verify_user_auth(
        is_authenticated,
        felicity_user,
        "Only Authenticated user can update analysis mappings",
    )

    analysis_mapping = await analysis_models.AnalysisCoding.get(uid=uid)
    if not analysis_mapping:
        return OperationError(error=f"Coding with uid {uid} does not exist")

    st_data = analysis_mapping.to_dict()
    for field in st_data:
        if field in payload.__dict__:
            try:
                setattr(analysis_mapping, field, payload.__dict__[field])
            except Exception as e:
                logger.warning(e)

    analysis_mapping_in = schemas.AnalysisCodingUpdate(**analysis_mapping.to_dict())
    analysis_mapping = await analysis_mapping.update(analysis_mapping_in)
    return a_types.AnalysisMappingType(**analysis_mapping.marshal_simple())
