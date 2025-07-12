import logging
from datetime import datetime
from typing import List

import sqlalchemy as sa
import strawberry  # noqa
from strawberry.permission import PermissionExtension

from felicity.api.gql.analysis.types import analysis as a_types
from felicity.api.gql.analysis.types import results as r_types
from felicity.api.gql.permissions import IsAuthenticated, HasPermission
from felicity.api.gql.types import PageInfo
from felicity.apps.analysis.enum import ResultState, SampleState
from felicity.apps.analysis.services.analysis import (
    AnalysisCategoryService,
    AnalysisCodingService,
    AnalysisCorrectionFactorService,
    AnalysisDetectionLimitService,
    AnalysisInterimService,
    AnalysisRequestService,
    AnalysisService,
    AnalysisSpecificationService,
    AnalysisTemplateService,
    AnalysisUncertaintyService,
    CodingStandardService,
    ProfileCodingService,
    ProfileService,
    RejectionReasonService,
    ResultOptionService,
    SampleService,
    SampleTypeCodingService,
    SampleTypeService, )
from felicity.apps.analysis.services.quality_control import (
    QCLevelService,
    QCSetService,
    QCTemplateService,
)
from felicity.apps.analysis.services.result import (
    AnalysisResultService,
    ResultMutationService,
)
from felicity.apps.analysis.utils import sample_search, get_qc_sample_type
from felicity.apps.guard import FAction, FObject
from felicity.apps.patient.services import PatientService
from felicity.database.session import async_session
from felicity.utils import has_value_or_is_truthy

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class AnalysisQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def coding_standard_all(self, info) -> List[a_types.CodingStandardType]:
        return await CodingStandardService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def sample_type_all(self, info) -> List[a_types.SampleTypeTyp]:
        return await SampleTypeService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def sample_type_by_uid(self, info, uid: str) -> a_types.SampleTypeTyp:
        return await SampleTypeService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def sample_type_mappings_by_sample_type(
            self, info, sample_type_uid: str
    ) -> list[a_types.SampleTypeMappingType]:
        return await SampleTypeCodingService().get_all(sample_type_uid=sample_type_uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SAMPLE)]
        )]
    )
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
            patient_uids = await PatientService().high_performance_search(
                first_name=text,
                last_name=text,
                patient_id=text,
                client_patient_id=text,
                fuzzy_match=True,
                return_uids=True
            )

            _or_text_["sample_id__ilike"] = f"%{text}%"
            _or_text_['analysis_request___patient___uid__in'] = patient_uids

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        if client_uid:
            filters.append({"analysis_request___client_uid__exact": client_uid})

        if status:
            filters.append({"status__exact": status})

        # Exclude QC Sample else front-end will throw ?????
        # filters.append({'internal_use__ne': True})
        filters.append({"analysis_request__ne": None})

        page = await SampleService().paging_filter(
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

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.CREATE, FObject.SHIPMENT)]
        )]
    )
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
                    SampleState.RECEIVED,
                    SampleState.PAIRED,
                ]
            }
        )

        if not sort_by:
            sort_by = ["-priority", "uid"]

        page = await SampleService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
            get_related=["analyses"],
        )

        total_count: int = page.total_count
        edges: List[r_types.SampleEdge[a_types.SampleType]] = page.edges
        items: List[r_types.SampleType] = page.items
        page_info: PageInfo = page.page_info

        return r_types.SampleCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SAMPLE)]
        )]
    )
    async def sample_search(
            self, info, status: str, text: str, client_uid: str
    ) -> List[a_types.SampleType]:
        return await sample_search(status, text, client_uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SAMPLE)]
        )]
    )
    async def sample_count(self, info, status: str, text: str, client_uid: str) -> int:
        combined = await sample_search(status, text, client_uid)
        return len(combined)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SAMPLE)]
        )]
    )
    async def sample_by_uid(self, info, uid: str) -> a_types.SampleType:
        return await SampleService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SAMPLE)]
        )]
    )
    async def sample_by_parent_id(
            self, info, parent_id: str, text: str | None = None
    ) -> List[a_types.SampleType]:
        """Retrieve associated invalidated parent - children relationship by mptt parent_id"""
        samples = await SampleService().get_all(parent_id=parent_id)

        if text == "repeat":  # created by invalidation hence they contain "_R0"
            return list(filter(lambda x: "_R0" in x.sample_id, samples))

        return samples

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SAMPLE)]
        )]
    )
    async def samples_by_uids(
            self, info, sample_uids: list[str]
    ) -> List[r_types.SamplesWithResults]:
        """Samples for publishing/ report printing"""
        return await SampleService().get_all(uid__in=sample_uids) if sample_uids else []

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SAMPLE)]
        )]
    )
    async def samples_by_storage_container_uid(
            self, info, uid: str
    ) -> List[a_types.SampleType]:
        """Retrieve stored samples for a given container uid"""
        return await SampleService().get_all(storage_container_uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def profile_all(self, info) -> List[a_types.ProfileType]:
        return await ProfileService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def profile_by_uid(self, info, uid: str) -> a_types.ProfileType:
        return await ProfileService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def profile_mappings_by_profile(
            self, info, profile_uid: str
    ) -> list[a_types.ProfileMappingType]:
        return await ProfileCodingService().get_all(profile_uid=profile_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_category_all(self, info) -> List[a_types.AnalysisCategoryType]:
        return await AnalysisCategoryService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_category_by_uid(
            self, info, uid: str
    ) -> a_types.AnalysisCategoryType:
        return await AnalysisCategoryService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_template_all(self, info) -> List[a_types.AnalysisTemplateType]:
        return await AnalysisTemplateService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_template_by_uid(
            self, info, uid: str
    ) -> a_types.AnalysisTemplateType:
        return await AnalysisTemplateService().get(uid=uid)

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

        page = await AnalysisService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
            get_related=["profiles"],
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
        return await AnalysisService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_mappings_by_analysis(
            self, info, analysis_uid: str
    ) -> list[a_types.AnalysisMappingType]:
        return await AnalysisCodingService().get_all(analysis_uid=analysis_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_without_profile(self, info) -> List[a_types.AnalysisType]:
        async with async_session() as session:
            result = await session.execute(sa.text("select * from analysis_profile"))

        a_uids = list(set([ids[0] for ids in result.all()]))
        return await AnalysisService().get_all(uid__notin=a_uids)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SAMPLE)]
        )]
    )
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

        page = await AnalysisRequestService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[a_types.AnalysisRequestEdge[a_types.AnalysisRequestWithSamples]] = (
            page.edges
        )
        items: List[a_types.AnalysisRequestType] = page.items
        page_info: PageInfo = page.page_info

        return a_types.AnalysisRequestCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SAMPLE)]
        )]
    )
    async def analysis_request_by_uid(
            self, info, uid: str
    ) -> a_types.AnalysisRequestWithSamples:
        return await AnalysisRequestService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SAMPLE)]
        )]
    )
    async def analysis_requests_by_patient_uid(
            self, info, uid: str
    ) -> List[a_types.AnalysisRequestWithSamples]:
        return await AnalysisRequestService().get_all(patient_uid__exact=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SAMPLE)]
        )]
    )
    async def analysis_requests_by_client_uid(
            self, info, uid: str
    ) -> List[a_types.AnalysisRequestWithSamples]:
        return await AnalysisRequestService().get_all(client_uid__exact=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.RESULT)]
        )]
    )
    async def analysis_result_by_uid(
            self, info, uid: str
    ) -> r_types.AnalysisResultType:
        return await AnalysisResultService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.RESULT)]
        )]
    )
    async def analysis_result_by_sample_uid(
            self, info, uid: str
    ) -> List[r_types.AnalysisResultType]:
        return await AnalysisResultService().get_all(sample_uid__exact=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.CREATE, FObject.WORKSHEET)]
        )]
    )
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

        filters.append({"sample___status": SampleState.RECEIVED})
        filters.append({"status": ResultState.PENDING})

        if not sort_by:
            sort_by = ["-sample___priority", "sample___uid"]

        page = await AnalysisResultService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
            get_related=["sample"],
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
        return await AnalysisInterimService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_interim_by_uid(
            self, info, uid: str
    ) -> a_types.AnalysisInterimType:
        return await AnalysisInterimService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_correction_factor_all(
            self, info
    ) -> List[a_types.AnalysisCorrectionFactorType]:
        return await AnalysisCorrectionFactorService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_correction_factor_by_uid(
            self, info, uid: str
    ) -> a_types.AnalysisCorrectionFactorType:
        return await AnalysisCorrectionFactorService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_uncertainty_all(
            self, info
    ) -> List[a_types.AnalysisUncertaintyType]:
        return await AnalysisUncertaintyService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_uncertainty_by_uid(
            self, info, uid: str
    ) -> a_types.AnalysisUncertaintyType:
        return await AnalysisUncertaintyService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_detection_limit_all(
            self, info
    ) -> List[a_types.AnalysisDetectionLimitType]:
        return await AnalysisDetectionLimitService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_detection_limit_by_uid(
            self, info, uid: str
    ) -> a_types.AnalysisDetectionLimitType:
        return await AnalysisDetectionLimitService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_specification_all(
            self, info
    ) -> List[a_types.AnalysisSpecificationType]:
        return await AnalysisSpecificationService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def analysis_specification_uid(
            self, info, uid: str
    ) -> a_types.AnalysisSpecificationType:
        return await AnalysisSpecificationService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SAMPLE)]
        )]
    )
    async def qc_set_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            status: str | None = None,
            sort_by: list[str] = ["-uid"],
    ) -> r_types.QCSetCursorPage:
        filters = {}
        if status:
            filters = {"status": status}

        page = await QCSetService().paging_filter(
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

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.SAMPLE)]
        )]
    )
    async def qc_set_by_uid(self, info, uid: str) -> r_types.QCSetWithSamples:
        return await QCSetService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def qc_level_all(self, info) -> List[a_types.QCLevelType]:
        return await QCLevelService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def qc_level_by_uid(self, info, uid: str) -> a_types.QCLevelType:
        return await QCLevelService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def qc_template_all(self, info) -> List[a_types.QCTemplateType]:
        return await QCTemplateService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def qc_template_by_uid(self, info, uid: str) -> a_types.QCTemplateType:
        return await QCTemplateService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def result_options_by_analysis_uid(
            self, info, uid: str
    ) -> list[a_types.ResultOptionType]:
        return await ResultOptionService().get_all(analysis_uid__exact=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def rejection_reasons_all(self, info) -> List[a_types.RejectionReasonType]:
        return await RejectionReasonService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def rejection_reason_by_uid(
            self, info, uid: str
    ) -> a_types.RejectionReasonType:
        return await RejectionReasonService().get(uid=uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.RESULT)]
        )]
    )
    async def result_mutation_by_result_uid(
            self, info, result_uid: str
    ) -> r_types.ResultMutationType | None:
        return await ResultMutationService().get(result_uid=result_uid)

    @strawberry.field(
        extensions=[PermissionExtension(
            permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.RESULT)]
        )]
    )
    async def qc_chart_data(self, info, analyses: list[str], month: int, year: int) -> list[r_types.AnalysisResultType]:
        start_date = datetime(year, month, 1)
        if int(month) == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)

        qc_sample_type = await get_qc_sample_type()
        return await AnalysisResultService().get_all(
            sample___sample_type_uid=qc_sample_type.uid,
            analysis_uid__in=analyses,
            date_verified__ge=start_date,
            date_verified__le=end_date,
        )
