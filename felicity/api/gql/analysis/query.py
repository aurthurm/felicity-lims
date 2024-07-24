import logging
from typing import List

import sqlalchemy as sa
import strawberry  # noqa

from felicity.api.gql.analysis.types import analysis as a_types
from felicity.api.gql.analysis.types import results as r_types
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import PageInfo
from felicity.apps.analysis import enum as analysis_conf
from felicity.apps.analysis.entities import analysis as a_entities
from felicity.apps.analysis.entities import qc as qc_entities
from felicity.apps.analysis.entities import results as r_entities
from felicity.apps.analysis.utils import sample_search
from felicity.database.session import async_session
from felicity.utils import has_value_or_is_truthy

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class AnalysisQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def coding_standard_all(self, info) -> List[a_types.CodingStandardType]:
        return await a_entities.CodingStandard.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def sample_type_all(self, info) -> List[a_types.SampleTypeTyp]:
        return await a_entities.SampleType.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def sample_type_by_uid(self, info, uid: str) -> a_types.SampleTypeTyp:
        return await a_entities.SampleType.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def sample_type_mappings_by_sample_type(
            self, info, sample_type_uid: str
    ) -> list[a_types.SampleTypeMappingType]:
        return await a_entities.SampleTypeCoding.get_all(sample_type_uid=sample_type_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def sample_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            status: str | None = None,
            client_uid: str | None = None,
            sort_by: list[str] | None = None,
    ) -> r_types.SampleCursorPage:
        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                "sample_id__ilike",
                "analysis_request___patient___first_name__ilike",
                "analysis_request___patient___last_name__ilike",
                "analysis_request___patient___client_patient_id__ilike",
                "analysis_request___client_request_id__ilike",
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        if client_uid:
            filters.append({"analysis_request___client_uid__exact": client_uid})

        if status:
            filters.append({"status__exact": status})

        # Exclude QC Sample else front-end will throw ?????
        # filters.append({'internal_use__ne': True})
        filters.append({"analysis_request__ne": None})

        page = await a_entities.Sample.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[r_types.SampleEdge[r_types.SamplesWithResults]] = page.edges
        items: List[r_types.SamplesWithResults] = page.items
        page_info: PageInfo = page.page_info

        return r_types.SampleCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def samples_for_shipment_assign(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
            analysis_uid: str | None = None,
            sample_type_uid: str | None = None,
    ) -> r_types.SampleCursorPage:

        filters = []
        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = ["sample___sample_id__ilike"]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        if analysis_uid:
            # filters.append({"analysis_uid": analysis_uid})
            pass

        if sample_type_uid:
            filters.append({"sample_type_uid": sample_type_uid})

        filters.append(
            {
                "status__in": [
                    analysis_conf.SampleState.RECEIVED,
                    analysis_conf.SampleState.PAIRED,
                ]
            }
        )

        if not sort_by:
            sort_by = ["-priority", "uid"]

        page = await a_entities.Sample.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
            get_related="analyses",
        )

        total_count: int = page.total_count
        edges: List[r_types.SampleEdge[a_types.SampleType]] = page.edges
        items: List[r_types.SampleType] = page.items
        page_info: PageInfo = page.page_info

        return r_types.SampleCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    # awaiting deprecation since sample_all can now achieve this
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def sample_search(
            self, info, status: str, text: str, client_uid: str
    ) -> List[a_types.SampleType]:
        return await sample_search(status, text, client_uid)

    # awaiting deprecation since sample_all can now achieve this
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def sample_count(self, info, status: str, text: str, client_uid: str) -> int:
        combined = await sample_search(status, text, client_uid)
        return len(combined)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def sample_by_uid(self, info, uid: str) -> a_types.SampleType:
        return await a_entities.Sample.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def sample_by_parent_id(
            self, info, parent_id: str, text: str | None = None
    ) -> List[a_types.SampleType]:
        """Retrieve associated invalidated parent - children relationship by mptt parent_id"""
        samples: list[a_entities.Sample] = await a_entities.Sample.get_all(
            parent_id=parent_id
        )

        if text == "repeat":  # created by invalidation hence they contain "_R0"
            return list(filter(lambda x: "_R0" in x.sample_id, samples))

        return samples

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def samples_by_uids(
            self, info, sample_uids: list[str] = []
    ) -> List[r_types.SamplesWithResults]:
        """Samples for publishing/ report printing"""
        return await a_entities.Sample.get_all(uid__in=sample_uids)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def samples_by_storage_container_uid(
            self, info, uid: str
    ) -> List[a_types.SampleType]:
        """Retrieve stored samples for a given container uid"""
        return await a_entities.Sample.get_all(storage_container_uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def profile_all(self, info) -> List[a_types.ProfileType]:
        return await a_entities.Profile.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def profile_by_uid(self, info, uid: str) -> a_types.ProfileType:
        return await a_entities.Profile.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def profile_mappings_by_profile(
            self, info, profile_uid: str
    ) -> list[a_types.ProfileMappingType]:
        return await a_entities.ProfileCoding.get_all(profile_uid=profile_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_category_all(self, info) -> List[a_types.AnalysisCategoryType]:
        return await a_entities.AnalysisCategory.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_category_by_uid(
            self, info, uid: str
    ) -> a_types.AnalysisCategoryType:
        return await a_entities.AnalysisCategory.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_template_all(self, info) -> List[a_types.AnalysisTemplateType]:
        return await a_entities.AnalysisTemplate.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_template_by_uid(self, info, uid: str) -> a_types.AnalysisTemplateType:
        return await a_entities.AnalysisTemplate.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
            qc_only: bool | None = False,
    ) -> a_types.AnalysisCursorPage:

        filters = []
        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = ["name__ilike", "description__ilike", "keyword__ilike"]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        if qc_only:
            filters.append({"category___name__exact": "Quality Control"})

        page = await a_entities.Analysis.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
            get_related="profiles",
        )

        total_count: int = page.total_count
        edges: List[a_types.AnalysisEdge[a_types.AnalysisType]] = page.edges
        items: List[a_types.AnalysisType] = page.items
        page_info: PageInfo = page.page_info

        return a_types.AnalysisCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_by_uid(self, info, uid: str) -> a_types.AnalysisType:
        return await a_entities.Analysis.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_mappings_by_analysis(
            self, info, analysis_uid: str
    ) -> list[a_types.AnalysisMappingType]:
        return await a_entities.AnalysisCoding.get_all(analysis_uid=analysis_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_without_profile(self, info) -> List[a_types.AnalysisType]:
        async with async_session() as session:
            result = await session.execute(sa.text("select * from analysis_profile"))

        a_uids = list(set([ids[0] for ids in result.all_async()]))
        return await a_entities.Analysis.get_all(uid__notin=a_uids)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_request_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
    ) -> a_types.AnalysisRequestCursorPage:
        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                "client_request_id__ilike",
                "patient___first_name__ilike",
                "patient___last_name__ilike",
                "patient___client_patient_id__ilike",
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        filters.append({"internal_use__ne": True})

        page = await a_entities.AnalysisRequest.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[
            a_types.AnalysisRequestEdge[a_types.AnalysisRequestWithSamples]
        ] = page.edges
        items: List[a_types.AnalysisRequestType] = page.items
        page_info: PageInfo = page.page_info

        return a_types.AnalysisRequestCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_request_by_uid(
            self, info, uid: str
    ) -> a_types.AnalysisRequestWithSamples:
        return await a_entities.AnalysisRequest.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_requests_by_patient_uid(
            self, info, uid: str
    ) -> List[a_types.AnalysisRequestWithSamples]:
        return await a_entities.AnalysisRequest.get_all(patient_uid__exact=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_requests_by_client_uid(
            self, info, uid: str
    ) -> List[a_types.AnalysisRequestWithSamples]:
        return await a_entities.AnalysisRequest.get_all(client_uid__exact=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_result_by_uid(
            self, info, uid: str
    ) -> r_types.AnalysisResultType:
        return await r_entities.AnalysisResult.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_result_by_sample_uid(
            self, info, uid: str
    ) -> List[r_types.AnalysisResultType]:
        return await r_entities.AnalysisResult.get_all(sample_uid__exact=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_results_for_ws_assign(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
            analysis_uid: str | None = None,
            sample_type_uid: str | None = None,
    ) -> r_types.AnalysisResultCursorPage:

        filters = [{"assigned": False}]
        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = ["sample___sample_id__ilike"]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        if analysis_uid:
            filters.append({"analysis_uid": analysis_uid})

        if sample_type_uid:
            filters.append({"sample___sample_type_uid": sample_type_uid})

        filters.append({"sample___status": analysis_conf.SampleState.RECEIVED})
        filters.append({"status": analysis_conf.states.result.PENDING})

        if not sort_by:
            sort_by = ["-sample___priority", "sample___uid"]

        page = await r_entities.AnalysisResult.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
            get_related="sample",
        )

        total_count: int = page.total_count
        edges: List[r_types.AnalysisResultEdge[r_types.AnalysisType]] = page.edges
        items: List[r_types.AnalysisResultType] = page.items
        page_info: PageInfo = page.page_info

        return r_types.AnalysisResultCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_interim_all(self, info) -> List[a_types.AnalysisInterimType]:
        return await a_entities.AnalysisInterim.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_interim_by_uid(
            self, info, uid: str
    ) -> a_types.AnalysisInterimType:
        return await a_entities.AnalysisInterim.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_correction_factor_all(
            self, info
    ) -> List[a_types.AnalysisCorrectionFactorType]:
        return await a_entities.AnalysisCorrectionFactor.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_correction_factor_by_uid(
            self, info, uid: str
    ) -> a_types.AnalysisCorrectionFactorType:
        return await a_entities.AnalysisCorrectionFactor.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_uncertainty_all(
            self, info
    ) -> List[a_types.AnalysisUncertaintyType]:
        return await a_entities.AnalysisUncertainty.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_uncertainty_by_uid(
            self, info, uid: str
    ) -> a_types.AnalysisUncertaintyType:
        return await a_entities.AnalysisUncertainty.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_detection_limit_all(
            self, info
    ) -> List[a_types.AnalysisDetectionLimitType]:
        return await a_entities.AnalysisDetectionLimit.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_detection_limit_by_uid(
            self, info, uid: str
    ) -> a_types.AnalysisDetectionLimitType:
        return await a_entities.AnalysisUncertainty.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_specification_all(
            self, info
    ) -> List[a_types.AnalysisSpecificationType]:
        return await a_entities.AnalysisSpecification.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_specification_uid(
            self, info, uid: str
    ) -> a_types.AnalysisSpecificationType:
        return await a_entities.AnalysisSpecification.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def qc_set_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
    ) -> r_types.QCSetCursorPage:

        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = ["name__ilike", "description__ilike", "keyword__ilike"]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        # filters.append({'internal_use__ne': True})

        page = await a_entities.QCSet.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[r_types.QCSetEdge[r_types.QCSetWithSamples]] = page.edges
        items: List[r_types.QCSetWithSamples] = page.items
        page_info: PageInfo = page.page_info

        return r_types.QCSetCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def qc_set_by_uid(self, info, uid: str) -> r_types.QCSetWithSamples:
        return await qc_entities.QCSet.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def qc_level_all(self, info) -> List[a_types.QCLevelType]:
        return await qc_entities.QCLevel.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def qc_level_by_uid(self, info, uid: str) -> a_types.QCLevelType:
        return await qc_entities.QCLevel.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def qc_template_all(self, info) -> List[a_types.QCTemplateType]:
        return await qc_entities.QCTemplate.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def qc_template_by_uid(self, info, uid: str) -> a_types.QCTemplateType:
        return await qc_entities.QCTemplate.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def result_options_by_analysis_uid(
            self, info, uid: str
    ) -> a_types.ResultOptionType:
        return await a_entities.ResultOption.get_all(analysis_uid__exact=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def rejection_reasons_all(self, info) -> List[a_types.RejectionReasonType]:
        return await a_entities.RejectionReason.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def rejection_reason_by_uid(
            self, info, uid: str
    ) -> a_types.RejectionReasonType:
        return await a_entities.RejectionReason.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def result_mutation_by_result_uid(
            self, info, result_uid: str
    ) -> r_types.ResultMutationType | None:
        return await r_entities.ResultMutation.get(result_uid=result_uid)
