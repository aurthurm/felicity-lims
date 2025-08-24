import sqlalchemy as sa
import strawberry  # noqa

from felicity.api.gql.multiplex.microbiology.types import *
from felicity.api.gql.permissions import IsAuthenticated
from felicity.apps.multiplex.microbiology.entities import laboratory_antibiotics
from felicity.apps.multiplex.microbiology.services import *
from felicity.apps.setup.services import LaboratoryService
from felicity.core.tenant_context import get_current_lab_uid
from felicity.utils import has_value_or_is_truthy


@strawberry.type
class MicrobiologyQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_guidelines_all(self, info) -> Optional[List[AbxGuidelineType]]:
        return await AbxGuidelineService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_guideline_by_uid(self, info, uid: str) -> Optional[AbxGuidelineType]:
        return await AbxGuidelineService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_antibiotic_all(self, info,
                                 text: str,
                                 page_size: int | None = None,
                                 after_cursor: str | None = None,
                                 before_cursor: str | None = None,
                                 sort_by: list[str] | None = None
                                 ) -> AbxAntibioticCursorPage:
        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                "name__ilike", "whonet_abx_code__ilike",
                "who_code__ilike", "din_code__ilike",
                "jac_code__ilike", "eucast_code__ilike",
                "user_code__ilike", "abx_number__ilike",
                "guidelines___name__ilike"
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

        text_filters = {sa.or_: _or_text_}
        filters.append(text_filters)

        page = await AbxAntibioticService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[AbxAntibioticEdge[AbxAntibioticType]] = page.edges
        items: List[AbxAntibioticType] = page.items
        page_info: PageInfo = page.page_info

        return AbxAntibioticCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_antibiotic_by_uid(self, info, uid: str) -> Optional[AbxAntibioticType]:
        return await AbxAntibioticService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_laboratory_antibiotics(self, info) -> Optional[List[AbxAntibioticType]]:
        lab_id = get_current_lab_uid()
        laboratory = await LaboratoryService().get(uid=lab_id)
        antibiotic_uids = await AbxAntibioticService().repository.table_query(
            table=laboratory_antibiotics,
            columns=["antibiotic_uid"],
            laboratory_uid=laboratory.uid
        )
        return await AbxAntibioticService().get_by_uids(antibiotic_uids) if antibiotic_uids else None

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_kingdom_all(self, info) -> Optional[List[AbxKingdomType]]:
        return await AbxKingdomService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_kingdom_by_uid(self, info, uid: str) -> Optional[AbxKingdomType]:
        return await AbxKingdomService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_phylum_all(self, info) -> Optional[List[AbxPhylumType]]:
        return await AbxPhylumService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_phylum_by_uid(self, info, uid: str) -> Optional[AbxPhylumType]:
        return await AbxPhylumService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_class_all(self, info) -> Optional[List[AbxClassType]]:
        return await AbxClassService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_class_by_uid(self, info, uid: str) -> Optional[AbxClassType]:
        return await AbxClassService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_order_all(self, info) -> Optional[List[AbxOrderType]]:
        return await AbxOrderService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_order_by_uid(self, info, uid: str) -> Optional[AbxOrderType]:
        return await AbxOrderService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_family_all(self, info) -> Optional[List[AbxFamilyType]]:
        return await AbxFamilyService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_family_by_uid(self, info, uid: str) -> Optional[AbxFamilyType]:
        return await AbxFamilyService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_genus_all(self, info) -> Optional[List[AbxGenusType]]:
        return await AbxGenusService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_genus_by_uid(self, info, uid: str) -> Optional[AbxGenusType]:
        return await AbxGenusService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_organism_all(self, info,
                               text: str,
                               page_size: int | None = None,
                               after_cursor: str | None = None,
                               before_cursor: str | None = None,
                               sort_by: list[str] | None = None
                               ) -> AbxOrganismCursorPage:
        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                "name__ilike", "whonet_org_code__ilike",
                "common__ilike", "organism_type__ilike",
                "subkingdom_code__ilike", "family_code__ilike",
                "genus_code__ilike", "species_group__ilike"
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

        text_filters = {sa.or_: _or_text_}
        filters.append(text_filters)

        page = await AbxOrganismService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[AbxAntibioticEdge[AbxAntibioticType]] = page.edges
        items: List[AbxAntibioticType] = page.items
        page_info: PageInfo = page.page_info

        return AbxOrganismCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_organism_by_uid(self, info, uid: str) -> Optional[AbxOrganismType]:
        return await AbxOrganismService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_organism_result_all(self, info, analysis_result_uid: str) -> Optional[List[AbxOrganismResultType]]:
        return await AbxOrganismResultService().get_all(analysis_result_uid=analysis_result_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_organism_serotype_all(self, info,
                                        text: str,
                                        page_size: int | None = None,
                                        after_cursor: str | None = None,
                                        before_cursor: str | None = None,
                                        sort_by: list[str] | None = None
                                        ) -> AbxOrganismSerotypeCursorPage:
        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                "organism___name__ilike", "serotype__ilike",
                "serogroup__ilike", "subspecies__ilike",
                "o_antigens__ilike", "h_phase_1__ilike",
                "h_phase_2__ilike"
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

        text_filters = {sa.or_: _or_text_}
        filters.append(text_filters)

        page = await AbxOrganismSerotypeService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[AbxOrganismSerotypeEdge[AbxOrganismSerotypeType]] = page.edges
        items: List[AbxOrganismSerotypeType] = page.items
        page_info: PageInfo = page.page_info

        return AbxOrganismSerotypeCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_organism_serotype_by_uid(self, info, uid: str) -> Optional[AbxOrganismSerotypeType]:
        return await AbxOrganismSerotypeService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_test_method_all(self, info) -> Optional[List[AbxTestMethodType]]:
        return await AbxTestMethodService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_test_method_by_uid(self, info, uid: str) -> Optional[AbxTestMethodType]:
        return await AbxTestMethodService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_breakpoint_type_all(self, info) -> Optional[List[AbxBreakpointTypeTyp]]:
        return await AbxBreakpointTypeService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_breakpoint_type_by_uid(self, info, uid: str) -> Optional[AbxBreakpointTypeTyp]:
        return await AbxBreakpointTypeService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_host_all(self, info) -> Optional[List[AbxHostType]]:
        return await AbxHostService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_host_by_uid(self, info, uid: str) -> Optional[AbxHostType]:
        return await AbxHostService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_site_of_infection_all(self, info) -> Optional[List[AbxSiteOfInfectionType]]:
        return await AbxSiteOfInfectionService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_site_of_infection_by_uid(self, info, uid: str) -> Optional[AbxSiteOfInfectionType]:
        return await AbxSiteOfInfectionService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_guideline_year_all(self, info) -> Optional[List[AbxGuidelineYearType]]:
        return await AbxGuidelineYearService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_breakpoint_all(self, info,
                                 text: str,
                                 page_size: int | None = None,
                                 after_cursor: str | None = None,
                                 before_cursor: str | None = None,
                                 sort_by: list[str] | None = None
                                 ) -> AbxBreakpointTypCursorPage:
        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                "guideline_year___code__ilike",
                "test_method___name__ilike", "potency__ilike",
                "organism_code__ilike", "breakpoint_type___name__ilike",
                "host___name__ilike", "site_of_infection___name__ilike",
                "whonet_abx_code__ilike"
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

        text_filters = {sa.or_: _or_text_}
        filters.append(text_filters)

        page = await AbxBreakpointService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[AbxBreakpointTypEdge[AbxBreakpointTyp]] = page.edges
        items: List[AbxBreakpointTyp] = page.items
        page_info: PageInfo = page.page_info

        return AbxBreakpointTypCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_breakpoint_by_uid(self, info, uid: str) -> Optional[AbxBreakpointTyp]:
        return await AbxBreakpointService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_expected_resistance_phenotype_all(self, info,
                                                    text: str,
                                                    page_size: int | None = None,
                                                    after_cursor: str | None = None,
                                                    before_cursor: str | None = None,
                                                    sort_by: list[str] | None = None
                                                    ) -> AbxExpResPhenotypeCursorPage:
        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                "guideline___name__ilike", "reference_table__ilike",
                "organism_code__ilike", "exception_organism_code__ilike",
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

        text_filters = {sa.or_: _or_text_}
        filters.append(text_filters)

        page = await AbxExpResPhenotypeService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[AbxExpResPhenotypeEdge[AbxExpResPhenotypeType]] = page.edges
        items: List[AbxExpResPhenotypeType] = page.items
        page_info: PageInfo = page.page_info

        return AbxExpResPhenotypeCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_expected_resistance_phenotype_by_uid(self, info, uid: str) -> Optional[AbxExpResPhenotypeType]:
        return await AbxExpResPhenotypeService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_expert_interpretation_rule_all(self, info,
                                                 text: str,
                                                 page_size: int | None = None,
                                                 after_cursor: str | None = None,
                                                 before_cursor: str | None = None,
                                                 sort_by: list[str] | None = None
                                                 ) -> AbxExpertInterpretationRuleCursorPage:
        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                "rule_code__ilike", "description__ilike",
                "organism_code__ilike", "rule_criteria__ilike",
                "affected_antibiotics__ilike", "antibiotic_exceptions__ilike",
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

        text_filters = {sa.or_: _or_text_}
        filters.append(text_filters)

        page = await AbxExpertInterpretationRuleService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[AbxExpertInterpretationRuleEdge[AbxExpertInterpretationRuleType]] = page.edges
        items: List[AbxExpertInterpretationRuleType] = page.items
        page_info: PageInfo = page.page_info

        return AbxExpertInterpretationRuleCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_expert_interpretation_rule_by_uid(self, info, uid: str) -> Optional[AbxExpertInterpretationRuleType]:
        return await AbxExpertInterpretationRuleService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_medium_all(self, info) -> Optional[List[AbxMediumType]]:
        return await AbxMediumService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_medium_by_uid(self, info, uid: str) -> Optional[AbxMediumType]:
        return await AbxMediumService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_qc_range_all(self, info,
                               text: str,
                               page_size: int | None = None,
                               after_cursor: str | None = None,
                               before_cursor: str | None = None,
                               sort_by: list[str] | None = None
                               ) -> AbxQCRangeCursorPage:
        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                "guideline___name__ilike", "medium___name__ilike",
                "strain__ilike", "reference_table__ilike",
                "antibiotic__ilike", "method__ilike",
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

        text_filters = {sa.or_: _or_text_}
        filters.append(text_filters)

        page = await AbxQCRangeService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[AbxQCRangeEdge[AbxQCRangeType]] = page.edges
        items: List[AbxQCRangeType] = page.items
        page_info: PageInfo = page.page_info

        return AbxQCRangeCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_qc_range_by_uid(self, info, uid: str) -> Optional[AbxQCRangeType]:
        return await AbxQCRangeService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_ast_panel_all(self, info) -> Optional[List[AbxASTPanelType]]:
        return await AbxASTPanelService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_ast_panel_filter(self, info, organism_uid: str, text: str = "") -> Optional[List[AbxASTPanelType]]:
        return await AbxASTPanelService().repository.filter(
            filters=[
                {"organisms___uid__exact": organism_uid},
                {"name__ilike": f"%{text}%"},
                {"description__ilike": f"%{text}%"}
            ],
            either=True
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_ast_panel_by_uid(self, info, uid: str) -> Optional[AbxASTPanelType]:
        return await AbxASTPanelService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_ast_result_all(self, info, analysis_result_uid: str) -> Optional[List[AbxASTResultType]]:
        return await AbxASTResultService().get_all(analysis_result_uid=analysis_result_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def abx_ast_result_all(self, info, sample_uid: str) -> Optional[List[AbxASTResultType]]:
        return await AbxASTResultService().get_all(analysis_result___sample_uid__exact=sample_uid)
