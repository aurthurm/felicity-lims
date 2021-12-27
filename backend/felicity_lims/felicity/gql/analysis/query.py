from typing import List, Optional, Dict, Any
import logging
import strawberry
import sqlalchemy as sa

from felicity.apps.analysis.utils import sample_search
from felicity.gql.analysis.types import analysis as a_types
from felicity.gql.analysis.types import results as r_types
from felicity.apps.analysis.models import analysis as a_models
from felicity.apps.analysis.models import results as r_models
from felicity.apps.analysis.models import qc as qc_models
from felicity.gql import PageInfo
from felicity.utils import has_value_or_is_truthy

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class AnalysisQuery:
    @strawberry.field
    async def sample_type_all(self, info) -> List[a_types.SampleTypeTyp]:
        return await a_models.SampleType.all()

    @strawberry.field
    async def sample_type_by_uid(self, info, uid: int) -> a_types.SampleTypeTyp:
        return await a_models.SampleType.get(uid=uid)

    @strawberry.field
    async def sample_all(self, info, page_size: Optional[int] = None,
                         after_cursor: Optional[str] = None, before_cursor: Optional[str] = None,
                         text: Optional[str] = None, status: Optional[str] = None, client_uid: Optional[int] = None,
                         sort_by: Optional[List[str]] = None) -> r_types.SampleCursorPage:
        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                'sample_id__ilike',
                'analysis_request___patient___first_name__ilike',
                'analysis_request___patient___last_name__ilike',
                'analysis_request___patient___client_patient_id__ilike',
                'analysis_request___client_request_id__ilike',
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        if client_uid:
            filters.append({'analysis_request___client_uid__exact': client_uid})

        if status:
            filters.append({'status__exact': status})

        # Exclude QC Sample else front-end will throw ?????
        # filters.append({'internal_use__ne': True})
        filters.append({'analysis_request__ne': None})

        page = await a_models.Sample.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by
        )

        total_count: int = page.total_count
        edges: List[r_types.SampleEdge[r_types.SamplesWithResults]] = page.edges
        items: List[r_types.SamplesWithResults] = page.items
        page_info: PageInfo = page.page_info

        return r_types.SampleCursorPage(
            total_count=total_count,
            edges=edges,
            items=items,
            page_info=page_info,
        )

    # awaiting deprecation since sample_all can now achieve this
    @strawberry.field
    async def sample_search(self, info, status: str, text: str, client_uid: int) -> List[a_types.SampleType]:
        return await sample_search(status, text, client_uid)

    # awaiting deprecation since sample_all can now achieve this
    @strawberry.field
    async def sample_count(self, info, status: str, text: str, client_uid: int) -> int:
        combined = await sample_search(status, text, client_uid)
        return len(combined)

    @strawberry.field
    async def sample_by_uid(self, info, uid: int) -> a_types.SampleType:
        return await a_models.Sample.get(uid=uid)

    @strawberry.field
    async def sample_by_parent_id(self, info, parent_id: int) -> List[a_types.SampleType]:
        """Retrieve associated invalidated parent - children relationship by mptt parent_id"""
        return await a_models.Sample.get_all(parent_id=parent_id)

    @strawberry.field
    async def samples_by_uids(self, info, sample_uids: List[int] = []) -> List[r_types.SamplesWithResults]:
        """Samples for publishing/ report printing"""
        return await a_models.Sample.get_all(uid__in=sample_uids)

    @strawberry.field
    async def profile_all(self, info) -> List[a_types.ProfileType]:
        return await a_models.Profile.all()

    @strawberry.field
    async def profile_by_uid(self, info, uid: int) -> a_types.ProfileType:
        return await a_models.Profile.get(uid=uid)

    @strawberry.field
    async def analysis_category_all(self, info) -> List[a_types.AnalysisCategoryType]:
        return await a_models.AnalysisCategory.all()

    @strawberry.field
    async def analysis_category_by_uid(self, info, uid: int) -> a_types.AnalysisCategoryType:
        return await a_models.AnalysisCategory.get(uid=uid)

    @strawberry.field
    async def analysis_all(self, info, page_size: Optional[int] = None,
                           after_cursor: Optional[str] = None, before_cursor: Optional[str] = None,
                           text: Optional[str] = None,
                           sort_by: Optional[List[str]] = None,
                           qc_only: Optional[bool] = False) -> a_types.AnalysisCursorPage:

        filters = []
        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                'name__ilike',
                'description__ilike',
                'keyword__ilike',
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        if qc_only:
            filters.append({'category___name__exact': 'Quality Control'})

        page = await a_models.Analysis.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by
        )

        total_count: int = page.total_count
        edges: List[a_types.AnalysisEdge[a_types.AnalysisType]] = page.edges
        items: List[a_types.AnalysisType] = page.items
        page_info: PageInfo = page.page_info

        return a_types.AnalysisCursorPage(
            total_count=total_count,
            edges=edges,
            items=items,
            page_info=page_info,
        )

    @strawberry.field
    async def analysis_by_uid(self, info, uid: int) -> a_types.AnalysisType:
        return await a_models.Analysis.get(uid=uid)

    @strawberry.field
    async def analysis_request_all(self, info, page_size: Optional[int] = None,
                                   after_cursor: Optional[str] = None, before_cursor: Optional[str] = None,
                                   text: Optional[str] = None,
                                   sort_by: Optional[List[str]] = None) -> a_types.AnalysisRequestCursorPage:
        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                'client_request_id__ilike',
                'patient___first_name__ilike',
                'patient___last_name__ilike',
                'patient___client_patient_id__ilike',
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        filters.append({'internal_use__ne': True})

        page = await a_models.AnalysisRequest.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by
        )

        total_count: int = page.total_count
        edges: List[a_types.AnalysisRequestEdge[a_types.AnalysisRequestWithSamples]] = page.edges
        items: List[a_types.AnalysisRequestType] = page.items
        page_info: PageInfo = page.page_info

        return a_types.AnalysisRequestCursorPage(
            total_count=total_count,
            edges=edges,
            items=items,
            page_info=page_info,
        )

    @strawberry.field
    async def analysis_request_by_uid(self, info, uid: int) -> a_types.AnalysisRequestWithSamples:
        return await a_models.AnalysisRequest.get(uid=uid)

    @strawberry.field
    async def analysis_requests_by_patient_uid(self, info, uid: int) -> List[a_types.AnalysisRequestWithSamples]:
        return await a_models.AnalysisRequest.get_all(patient_uid__exact=uid)

    @strawberry.field
    async def analysis_requests_by_client_uid(self, info, uid: int) -> List[a_types.AnalysisRequestWithSamples]:
        return await a_models.AnalysisRequest.get_all(client_uid__exact=uid)

    @strawberry.field
    async def analysis_result_by_uid(self, info, uid: int) -> r_types.AnalysisResultType:
        return await r_models.AnalysisResult.get(uid=uid)

    @strawberry.field
    async def analysis_result_by_sample_uid(self, info, uid: int) -> List[r_types.AnalysisResultType]:
        return await r_models.AnalysisResult.get_all(sample_uid__exact=uid)

    @strawberry.field
    async def qc_set_all(self, info, page_size: Optional[int] = None,
                         after_cursor: Optional[str] = None, before_cursor: Optional[str] = None,
                         text: Optional[str] = None,
                         sort_by: Optional[List[str]] = None) -> r_types.QCSetCursorPage:

        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                'name__ilike',
                'description__ilike',
                'keyword__ilike',
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        # filters.append({'internal_use__ne': True})

        page = await a_models.QCSet.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by
        )

        total_count: int = page.total_count
        edges: List[r_types.QCSetEdge[r_types.QCSetWithSamples]] = page.edges
        items: List[r_types.QCSetWithSamples] = page.items
        page_info: PageInfo = page.page_info

        return r_types.QCSetCursorPage(
            total_count=total_count,
            edges=edges,
            items=items,
            page_info=page_info,
        )

    @strawberry.field
    async def qc_set_by_uid(self, info, uid: int) -> r_types.QCSetWithSamples:
        return await qc_models.QCSet.get(uid=uid)

    @strawberry.field
    async def qc_level_all(self, info) -> List[a_types.QCLevelType]:
        return await qc_models.QCLevel.all()

    @strawberry.field
    async def qc_level_by_uid(self, info, uid: int) -> a_types.QCLevelType:
        return await qc_models.QCLevel.get(uid=uid)

    @strawberry.field
    async def qc_template_all(self, info) -> List[a_types.QCTemplateType]:
        return await qc_models.QCTemplate.all()

    @strawberry.field
    async def qc_template_by_uid(self, info, uid: int) -> a_types.QCTemplateType:
        return await qc_models.QCTemplate.get(uid=uid)

    @strawberry.field
    async def result_options_by_analysis_uid(self, info, uid: int) -> a_types.ResultOptionType:
        return await a_models.ResultOption.get_all(analysis_uid__exact=uid)

    @strawberry.field
    async def rejection_reasons_all(self, info) -> List[a_types.RejectionReasonType]:
        return await a_models.RejectionReason.all()

    @strawberry.field
    async def rejection_reason_by_uid(self, info, uid: int) -> a_types.RejectionReasonType:
        return await a_models.RejectionReason.get(uid=uid)
