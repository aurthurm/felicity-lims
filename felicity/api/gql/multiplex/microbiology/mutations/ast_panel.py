import logging
from typing import List

import strawberry  # noqa
from sqlalchemy import or_

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.multiplex.microbiology import AbxASTPanelType, AbxASTResultType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.analysis.enum import SampleState, ResultState
from felicity.apps.analysis.schemas import AnalysisResultCreate
from felicity.apps.analysis.services.analysis import SampleService, AnalysisService
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.multiplex.microbiology.entities import panel_organism, panel_antibiotic
from felicity.apps.multiplex.microbiology.schemas import AbxASTPanelCreate, AbxASTPanelUpdate, AbxASTResultCreate, \
    AbxASTResultUpdate
from felicity.apps.multiplex.microbiology.services import AbxASTPanelService, AbxBreakpointService, AbxASTResultService, \
    AbxBreakpointTypeService, AbxHostService
from felicity.apps.multiplex.microbiology.utils import interpret_ast

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.input
class AbxASTPanelInputType:
    name: str
    description: str | None = None
    antibiotics: List[str]
    organisms: List[str]
    active: bool = True


AbxASTPanelResponse = strawberry.union(
    "AbxASTPanelResponse",
    (AbxASTPanelType, OperationError),
    description="",
)

AbxASTResultResponse = strawberry.union(
    "AbxASTResultResponse",
    (AbxASTResultType, OperationError),
    description="",
)


@strawberry.input
class AbxApplyAstPanelInput:
    sample_uid: str
    panel_uid: str
    organism_result_uid: str


@strawberry.type
class AbxASTResultsType:
    ast_results: List[AbxASTResultType]


AbxASTResultsResponse = strawberry.union(
    "AbxASTResultResponse",
    (AbxASTResultsType, OperationError),
    description="",
)


@strawberry.input
class AbxASTResultUpdateInput:
    uid: str
    ast_method_uid: str | None = None
    guideline_year_uid: str | None = None
    ast_value: str | None = None
    reportable: bool | None = None
    result: str | None = None


@strawberry.input
class AbxASTResultsUpdateInput:
    results: list[AbxASTResultUpdateInput]


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def create_abx_ast_panel(
        info,
        payload: AbxASTPanelInputType
) -> AbxASTPanelResponse:
    felicity_user = await auth_from_info(info)
    incoming = {
        "created_by_uid": felicity_user.uid,
        "updated_by_uid": felicity_user.uid,
    }
    for k, v in payload.__dict__.items():
        incoming[k] = v

    obj_in = AbxASTPanelCreate(**incoming)
    astp_panel = await AbxASTPanelService().create(obj_in)

    if payload.organisms:
        for organism_uid in payload.organisms:
            await AbxBreakpointService().repository.table_insert(
                panel_organism,
                [{"panel_uid": astp_panel.uid, "organism_uid": organism_uid}]
            )

    if payload.antibiotics:
        for antibiotic_uid in payload.antibiotics:
            await AbxBreakpointService().repository.table_insert(
                panel_antibiotic,
                [{"panel_uid": astp_panel.uid, "antibiotic_uid": antibiotic_uid}]
            )
    return AbxASTPanelType(**astp_panel.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_ast_panel(
        info,
        uid: str,
        payload: AbxASTPanelInputType
) -> AbxASTPanelResponse:
    felicity_user = await auth_from_info(info)
    astp_panel = await AbxASTPanelService().get(uid=uid)

    panel_data = astp_panel.to_dict()
    for field in panel_data:
        if field in payload.__dict__:
            if field in ['organisms', 'antibiotics']:  # Handle separately
                try:
                    setattr(astp_panel, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

    setattr(astp_panel, "updated_by_uid", felicity_user.uid)

    panel_in = AbxASTPanelUpdate(**astp_panel.to_dict())
    astp_panel = await AbxASTPanelService().update(astp_panel.uid, panel_in)

    # Update organism associations if provided
    if payload.organisms is not None:
        # Remove existing associations
        await AbxBreakpointService().repository.delete_table(
            panel_organism,
            panel_uid=astp_panel.uid
        )

        # Create new associations
        for organism_uid in payload.organisms:
            await AbxBreakpointService().repository.table_insert(
                panel_organism,
                [{"panel_uid": astp_panel.uid, "organism_uid": organism_uid}]
            )

    # Update antibiotic associations if provided
    if payload.antibiotics is not None:
        # Remove existing associations
        await AbxBreakpointService().repository.delete_table(
            panel_antibiotic,
            panel_uid=astp_panel.uid
        )

        # Create new associations
        for antibiotic_uid in payload.antibiotics:
            await AbxBreakpointService().repository.table_insert(
                panel_antibiotic,
                [{"panel_uid": astp_panel.uid, "antibiotic_uid": antibiotic_uid}]
            )
    return AbxASTPanelType(**astp_panel.marshal_simple())


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def apply_abx_ast_panel(
        info,
        payload: AbxApplyAstPanelInput
) -> AbxASTResultsResponse:
    felicity_user = await auth_from_info(info)
    sample = await SampleService().get(uid=payload.sample_uid)
    if sample.status not in [
        SampleState.RECEIVED,
        SampleState.AWAITING,
        SampleState.APPROVED,
    ]:
        return OperationError(
            error=f"Samples in {sample.status} can not be added analyses"
        )

    panel = await AbxASTPanelService().get(uid=payload.panel_uid, related=["antibiotics"])

    # create and attach result objects for each Analyses
    logger.info(
        f"Adding {len(panel.antibiotics)} abx service results to the sample {sample.sample_id}"
    )
    a_result_schema = AnalysisResultCreate(
        sample_uid=sample.uid,
        status=ResultState.PENDING,
        analysis_uid=None,
        due_date=None,
        created_by_uid=felicity_user.uid,
        updated_by_uid=felicity_user.uid,
        metadata_snapshot={},
    )

    abx_analysis_service = await AnalysisService().get(keyword="felicity_ast_abx_antibiotic")
    abx_results = []
    for antibiotic in panel.antibiotics:
        schema_in = a_result_schema.model_copy(
            update={
                "analysis_uid": abx_analysis_service.uid,
                "due_date": None,
            }
        )
        a_result = await AnalysisResultService().create(schema_in, related=["sample", "analysis"])
        abx_result_in = AbxASTResultCreate(
            analysis_result_uid=a_result.uid,
            organism_result_uid=payload.organism_result_uid,
            antibiotic_uid=antibiotic.uid,
            ast_method_uid=None,
            ast_value=None
        )
        abx_results.append(await AbxASTResultService().create(abx_result_in, related=["analysis_result"]))
        await AnalysisResultService().snapshot([a_result])

    if sample.status != SampleState.RECEIVED:
        await SampleService().change_status(
            sample.uid, status=SampleState.RECEIVED, updated_by_uid=felicity_user.uid
        )

    return AbxASTResultsType(
        ast_results=[AbxASTResultType(**abx_r.marshal_simple()) for abx_r in abx_results]
    )


@strawberry.mutation(permission_classes=[IsAuthenticated])
async def update_abx_ast_results(info, payload: AbxASTResultsUpdateInput) -> AbxASTResultsResponse:
    felicity_user = await auth_from_info(info)

    bp_type = await AbxBreakpointTypeService().get(name__ilike="human")
    host = await AbxHostService().get(name__ilike="human")
    outputs = []
    for result_payload in payload.results:
        ast_result = await AbxASTResultService().get(uid=result_payload.uid)
        ast_result_data = ast_result.to_dict()

        for field in ast_result_data:
            if field in result_payload.__dict__ and field != "uid":
                try:
                    setattr(ast_result, field, result_payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        setattr(ast_result, "updated_by_uid", felicity_user.uid)

        ast_result_in = AbxASTResultUpdate(**ast_result.to_dict())
        ast_result = await AbxASTResultService().update(
            ast_result.uid, ast_result_in, related=["antibiotic", "organism_result.organism", "ast_method"]
        )
        outputs.append(ast_result)

        # Interpretations
        _org = ast_result.organism_result.organism
        _abx = ast_result.antibiotic

        # get exact matches
        break_points_tables = await AbxBreakpointService().repository.filter(
            filters={
                "guideline_year_uid": ast_result.guideline_year_uid,
                "test_method_uid": ast_result.ast_method_uid,
                "breakpoint_type_uid": bp_type.uid,  # human
                "host_uid": host.uid,  # human
                "whonet_abx_code": _abx.whonet_abx_code,
                # ?? might need to flag to user that potency missing in breakpoint if used
                or_: [{"potency": _abx.potency}, {"potency": ""}],
                # IRS are not empty or null
                "i__isnull": False, "r__isnull": False, "s__isnull": False,
                "i__ne": "", "r__ne": "", "s__ne": "",
            }
        )

        # ✅ Filter `break_points_tables` based on `organism_code_type` and `organism_code`
        _code_filters = [
            ("whonet_org_code", _org.whonet_org_code.lower()),
            ("genus_code", _org.genus_code.lower()),
            ("family_code", _org.family_code.lower()),
            ("serovar_group", _org.serovar_group.lower()),
            ("species_group", _org.species_group.lower()),
        ]
        code_filters = [
            item for item in _code_filters
            if item[1] not in [None, ""]
        ]
        filtered_break_points = [
            bpt for bpt in break_points_tables
            if (bpt.organism_code_type.lower(), bpt.organism_code.lower()) in code_filters
        ]
        if len(filtered_break_points) != 1:
            logger.info(f"===== ): {_abx.name} | {_abx.whonet_abx_code} <org> {code_filters} ")
            logger.info(f"break_points: {[(bpt.organism_code_type.lower(), bpt.organism_code.lower()) \
                                          for bpt in filtered_break_points]}")
            for bp in filtered_break_points:
                logger.info(f"==============::::::::::::: {bp.marshal_simple()}")
            logger.info("=================================================================: end")
            continue

        interpretation = interpret_ast(filtered_break_points[0], ast_result)
        if not interpretation:
            continue

        # save interpretation
        await AbxASTResultService().update(
            ast_result.uid,
            {
                "breakpoint_uid": None if interpretation["user_provided"] else interpretation["breakpoint_uid"],
            }
        )

        analysis_result = await AnalysisResultService().get(uid=ast_result.analysis_result_uid)
        analysis_result.interpretation = interpretation
        await AnalysisResultService().update(
            analysis_result.uid, {
                "result": interpretation["interpreted"],
                "reportable": result_payload.reportable
            }, related=["sample", "analysis"]
        )
        await AnalysisResultService().snapshot([analysis_result])

    return AbxASTResultsType(
        ast_results=[AbxASTResultType(**abx_r.marshal_simple(exclude=["organism_result"])) for abx_r in outputs]
    )
