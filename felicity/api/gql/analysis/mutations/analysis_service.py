import logging
from dataclasses import field

import strawberry  # noqa

from felicity.api.gql.analysis.types import analysis as a_types
from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.analysis import schemas, utils
from felicity.apps.analysis.entities.analysis import (
    analysis_method,
    analysis_sample_type,
)
from felicity.apps.analysis.services.analysis import (
    AnalysisCodingService,
    AnalysisService,
    ProfileService,
    SampleTypeService,
)
from felicity.apps.instrument.services import MethodService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class AnalysisInputType:
    name: str
    keyword: str
    sort_key: int
    description: str = ""
    department_uid: str | None = None
    sample_types: list[str] | None = field(default_factory=list)
    methods: list[str] | None = field(default_factory=list)
    category_uid: str | None = None
    unit_uid: str | None = None
    internal_use: bool | None = False
    tat_length_minutes: int = None
    precision: int | None = None
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
    felicity_user = await auth_from_info(info)

    if not payload.name or not payload.description:
        return OperationError(error="Name and Description are mandatory")

    exists = await AnalysisService().get(name=payload.name)
    if exists:
        return OperationError(error=f"A analysis named {payload.name} already exists")

    exists = await AnalysisService().get(keyword=payload.keyword)
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
    analysis = await AnalysisService().create(obj_in)

    if payload.sample_types:
        for st_uid in payload.sample_types:
            await AnalysisService().repository.table_insert(
                table=analysis_sample_type,
                mappings=[{"sample_type_uid": st_uid, "analysis_uid": analysis.uid}],
            )

    if payload.methods:
        for m_uid in payload.methods:
            await AnalysisService().repository.table_insert(
                table=analysis_method,
                mappings=[{"method_uid": m_uid, "analysis_uid": analysis.uid}],
            )

    analysis = await AnalysisService().get(uid=analysis.uid)
    profiles = await ProfileService().get_all(analyses___uid=analysis.uid)

    await utils.billing_setup_analysis([analysis.uid])

    return a_types.AnalysisWithProfiles(  # noqa
        **{**analysis.marshal_simple(), "profiles": profiles}
    )


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_analysis(
        info, uid: str, payload: AnalysisInputType
) -> ProfilesServiceResponse:
    await auth_from_info(info)

    analysis = await AnalysisService().get(uid=uid)
    if not analysis:
        return OperationError(
            error=f"Analysis with uid {uid} does not exist -- cannot update"
        )

    analysis_data = analysis.to_dict()
    for _field in analysis_data:
        if _field in payload.__dict__:
            try:
                setattr(analysis, _field, payload.__dict__[_field])
            except AttributeError as e:
                logger.warning(e)

    analysis_in = schemas.AnalysisUpdate(**analysis.to_dict(nested=False))
    analysis = await AnalysisService().update(analysis.uid, analysis_in)

    if payload.sample_types:
        analysis.sample_types.clear()
        analysis = await AnalysisService().save(analysis)
        for _uid in payload.sample_types:
            stype = await SampleTypeService().get(uid=_uid)
            analysis.sample_types.append(stype)
        analysis = await AnalysisService().save(analysis)

    if payload.methods:
        analysis.methods.clear()
        analysis = await AnalysisService().save(analysis)
        for _uid in payload.methods:
            meth = await MethodService().get(uid=_uid)
            await MethodService().repository.table_insert(
                table=analysis_method,
                mappings=[{"method_uid": meth.uid, "analysis_uid": analysis.uid}],
            )
        analysis = await AnalysisService().get(uid=analysis.uid)

    profiles = await ProfileService().get_all(analyses___uid=analysis.uid)

    return a_types.AnalysisWithProfiles(
        **{**analysis.marshal_simple(), "profiles": profiles}
    )


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_analysis_mapping(
        info, payload: AnalysisMappingInputType
) -> AnalysisMappingResponse:
    felicity_user = await auth_from_info(info)

    exists = await AnalysisCodingService().get(code=payload.code)
    if exists:
        return OperationError(error=f"Mapping: {payload.code} already exists")

    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = schemas.AnalysisCodingCreate(**incoming)
    analysis_mapping = await AnalysisCodingService().create(obj_in)
    return a_types.AnalysisMappingType(**analysis_mapping.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_analysis_mapping(
        info, uid: str, payload: AnalysisMappingInputType
) -> AnalysisMappingResponse:
    await auth_from_info(info)

    analysis_mapping = await AnalysisCodingService().get(uid=uid)
    if not analysis_mapping:
        return OperationError(error=f"Coding with uid {uid} does not exist")

    st_data = analysis_mapping.to_dict()
    for _field in st_data:
        if _field in payload.__dict__:
            try:
                setattr(analysis_mapping, _field, payload.__dict__[_field])
            except Exception as e:
                logger.warning(e)

    analysis_mapping_in = schemas.AnalysisCodingUpdate(**analysis_mapping.to_dict())
    analysis_mapping = await analysis_mapping.update(analysis_mapping_in)
    return a_types.AnalysisMappingType(**analysis_mapping.marshal_simple())
