from typing import List, Optional

import sqlalchemy as sa
import strawberry

from felicity.api.gql.document import types
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import PageInfo
from felicity.apps.document.services import (
    DocumentCategoryService,
    DocumentTagService,
    DocumentService,
    DocumentStatusService,
    DocumentFolderService,
    DocumentVersionService,
    DocumentReviewCycleService,
    DocumentReviewStepService,
    DocumentTemplateService,
    DocumentSubscriptionService,
    DocumentAuditService,
    DocumentAIModelService,
    DocumentAIAuthoringSessionService,
    DocumentComplianceStandardService,
    DocumentAIComplianceCheckService,
    DocumentComplianceIssueService,
    DocumentAIReviewFeedbackService,
    DocumentAnalyticsService,
)
from felicity.utils import has_value_or_is_truthy


@strawberry.type
class DocumentQuery:
    # Document Category Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_ai_compliance_checks_by_document(
            self, info, document_uid: str
    ) -> List[types.DocumentAIComplianceCheckType]:
        return await DocumentAIComplianceCheckService().get_all(document_uid=document_uid)

    # Compliance Issue Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_compliance_issue_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            check_uid: str | None = None,
            severity: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentComplianceIssueCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["section__ilike", "description__ilike", "suggestion__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        if check_uid:
            filters["check_uid"] = check_uid

        if severity:
            filters["severity"] = severity

        page = await DocumentComplianceIssueService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentComplianceIssueEdge[types.DocumentComplianceIssueType]] = page.edges
        items: List[types.DocumentComplianceIssueType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentComplianceIssueCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_compliance_issue_by_uid(self, info, uid: str) -> Optional[types.DocumentComplianceIssueType]:
        return await DocumentComplianceIssueService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_compliance_issues_by_check(
            self, info, check_uid: str
    ) -> List[types.DocumentComplianceIssueType]:
        return await DocumentComplianceIssueService().get_all(check_uid=check_uid)

    # AI Review Feedback Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_ai_review_feedback_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            review_step_uid: str | None = None,
            model_uid: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentAIReviewFeedbackCursorPage:
        filters = {}

        if review_step_uid:
            filters["review_step_uid"] = review_step_uid

        if model_uid:
            filters["model_uid"] = model_uid

        page = await DocumentAIReviewFeedbackService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentAIReviewFeedbackEdge[types.DocumentAIReviewFeedbackType]] = page.edges
        items: List[types.DocumentAIReviewFeedbackType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentAIReviewFeedbackCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_ai_review_feedback_by_uid(self, info, uid: str) -> Optional[types.DocumentAIReviewFeedbackType]:
        return await DocumentAIReviewFeedbackService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_ai_review_feedback_by_step(
            self, info, review_step_uid: str
    ) -> List[types.DocumentAIReviewFeedbackType]:
        return await DocumentAIReviewFeedbackService().get_all(review_step_uid=review_step_uid)

    # Document Analytics Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_analytics_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            document_uid: str | None = None,
            min_readability: float | None = None,
            max_readability: float | None = None,
            min_sentiment: float | None = None,
            max_sentiment: float | None = None,
            min_complexity: float | None = None,
            max_complexity: float | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentAnalyticsCursorPage:
        filters = {}

        if document_uid:
            filters["document_uid"] = document_uid

        if min_readability is not None:
            filters["readability_score__gte"] = min_readability

        if max_readability is not None:
            filters["readability_score__lte"] = max_readability

        if min_sentiment is not None:
            filters["sentiment_score__gte"] = min_sentiment

        if max_sentiment is not None:
            filters["sentiment_score__lte"] = max_sentiment

        if min_complexity is not None:
            filters["complexity_score__gte"] = min_complexity

        if max_complexity is not None:
            filters["complexity_score__lte"] = max_complexity

        page = await DocumentAnalyticsService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentAnalyticsEdge[types.DocumentAnalyticsType]] = page.edges
        items: List[types.DocumentAnalyticsType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentAnalyticsCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_analytics_by_uid(self, info, uid: str) -> Optional[types.DocumentAnalyticsType]:
        return await DocumentAnalyticsService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_analytics_by_document(self, info, document_uid: str) -> List[types.DocumentAnalyticsType]:
        return await DocumentAnalyticsService().get_all(document_uid=document_uid)

    async def document_category_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentCategoryCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["name__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        page = await DocumentCategoryService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentCategoryEdge[types.DocumentCategoryType]] = page.edges
        items: List[types.DocumentCategoryType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentCategoryCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_category_by_uid(self, info, uid: str) -> Optional[types.DocumentCategoryType]:
        return await DocumentCategoryService().get(uid=uid)

    # Document Tag Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_tag_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentTagCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["name__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        page = await DocumentTagService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentTagEdge[types.DocumentTagType]] = page.edges
        items: List[types.DocumentTagType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentTagCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_tag_by_uid(self, info, uid: str) -> Optional[types.DocumentTagType]:
        return await DocumentTagService().get(uid=uid)

    # Document Folder Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_folder_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            parent_uid: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentFolderCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["name__ilike", "description__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        if parent_uid:
            filters["parent_uid"] = parent_uid

        page = await DocumentFolderService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentFolderEdge[types.DocumentFolderType]] = page.edges
        items: List[types.DocumentFolderType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentFolderCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_folder_by_uid(self, info, uid: str) -> Optional[types.DocumentFolderType]:
        return await DocumentFolderService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_root_folders(self, info) -> List[types.DocumentFolderType]:
        return await DocumentFolderService().get_all(parent_uid=None)

    # Document Template Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_template_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            category_uid: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentTemplateCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["name__ilike", "description__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        if category_uid:
            filters["category_uid"] = category_uid

        page = await DocumentTemplateService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentTemplateEdge[types.DocumentTemplateType]] = page.edges
        items: List[types.DocumentTemplateType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentTemplateCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_template_by_uid(self, info, uid: str) -> Optional[types.DocumentTemplateType]:
        return await DocumentTemplateService().get(uid=uid)

    # Main Document Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            folder_uid: str | None = None,
            category_uid: str | None = None,
            department_uid: str | None = None,
            tag_uid: str | None = None,
            status: str | None = None,
            author_uid: str | None = None,
            reader_uid: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["name__ilike", "subtitle__ilike", "document_id__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        if folder_uid:
            filters["folder_uid"] = folder_uid

        if category_uid:
            filters["category_uid"] = category_uid

        if department_uid:
            filters["department_uid"] = department_uid

        if tag_uid:
            filters["tags___uid"] = tag_uid

        if status:
            filters["statuses___status"] = status

        if author_uid:
            filters["authors___status"] = author_uid

        if reader_uid:
            filters["readers___status"] = reader_uid

        page = await DocumentService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentEdge[types.DocumentType]] = page.edges
        items: List[types.DocumentType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_by_uid(self, info, uid: str) -> Optional[types.DocumentType]:
        return await DocumentService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_by_document_id(self, info, document_id: str) -> Optional[types.DocumentType]:
        return await DocumentService().get(document_id=document_id)

    # Document Version Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_version_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            document_uid: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentVersionCursorPage:
        filters = {}

        if document_uid:
            filters["document_uid"] = document_uid

        page = await DocumentVersionService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentVersionEdge[types.DocumentVersionType]] = page.edges
        items: List[types.DocumentVersionType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentVersionCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_version_by_uid(self, info, uid: str) -> Optional[types.DocumentVersionType]:
        return await DocumentVersionService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_versions_by_document(self, info, document_uid: str) -> List[types.DocumentVersionType]:
        return await DocumentVersionService().get_all(document_uid=document_uid)

    # Document Status Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_status_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            document_uid: str | None = None,
            status: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentStatusCursorPage:
        filters = {}

        if document_uid:
            filters["document_uid"] = document_uid

        if status:
            filters["status"] = status

        page = await DocumentStatusService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentStatusEdge[types.DocumentStatusType]] = page.edges
        items: List[types.DocumentStatusType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentStatusCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_status_by_uid(self, info, uid: str) -> Optional[types.DocumentStatusType]:
        return await DocumentStatusService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_statuses_by_document(self, info, document_uid: str) -> List[types.DocumentStatusType]:
        return await DocumentStatusService().get_all(document_uid=document_uid)

    # Document Review Cycle Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_review_cycle_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            document_uid: str | None = None,
            status: str | None = None,
            initiated_by_uid: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentReviewCycleCursorPage:
        filters = {}

        if document_uid:
            filters["document_uid"] = document_uid

        if status:
            filters["status"] = status

        if initiated_by_uid:
            filters["initiated_by_uid"] = initiated_by_uid

        page = await DocumentReviewCycleService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentReviewCycleEdge[types.DocumentReviewCycleType]] = page.edges
        items: List[types.DocumentReviewCycleType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentReviewCycleCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_review_cycle_by_uid(self, info, uid: str) -> Optional[types.DocumentReviewCycleType]:
        return await DocumentReviewCycleService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_review_cycles_by_document(self, info, document_uid: str) -> List[types.DocumentReviewCycleType]:
        return await DocumentReviewCycleService().get_all(document_uid=document_uid)

    # Document Review Step Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_review_step_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            review_cycle_uid: str | None = None,
            reviewer_uid: str | None = None,
            status: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentReviewStepCursorPage:
        filters = {}

        if review_cycle_uid:
            filters["review_cycle_uid"] = review_cycle_uid

        if reviewer_uid:
            filters["reviewer_uid"] = reviewer_uid

        if status:
            filters["status"] = status

        page = await DocumentReviewStepService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentReviewStepEdge[types.DocumentReviewStepType]] = page.edges
        items: List[types.DocumentReviewStepType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentReviewStepCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_review_step_by_uid(self, info, uid: str) -> Optional[types.DocumentReviewStepType]:
        return await DocumentReviewStepService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_review_steps_by_cycle(self, info, review_cycle_uid: str) -> List[types.DocumentReviewStepType]:
        return await DocumentReviewStepService().get_all(review_cycle_uid=review_cycle_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_review_steps_by_reviewer(self, info, reviewer_uid: str) -> List[types.DocumentReviewStepType]:
        return await DocumentReviewStepService().get_all(reviewer_uid=reviewer_uid)

    # Document Subscription Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_subscription_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            document_uid: str | None = None,
            user_uid: str | None = None,
            subscription_type: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentSubscriptionCursorPage:
        filters = {}

        if document_uid:
            filters["document_uid"] = document_uid

        if user_uid:
            filters["user_uid"] = user_uid

        if subscription_type:
            filters["subscription_type"] = subscription_type

        page = await DocumentSubscriptionService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentSubscriptionEdge[types.DocumentSubscriptionType]] = page.edges
        items: List[types.DocumentSubscriptionType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentSubscriptionCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_subscription_by_uid(self, info, uid: str) -> Optional[types.DocumentSubscriptionType]:
        return await DocumentSubscriptionService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_subscriptions_by_document(self, info, document_uid: str) -> List[types.DocumentSubscriptionType]:
        return await DocumentSubscriptionService().get_all(document_uid=document_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_subscriptions_by_user(self, info, user_uid: str) -> List[types.DocumentSubscriptionType]:
        return await DocumentSubscriptionService().get_all(user_uid=user_uid)

    # Document Audit Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_audit_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            document_uid: str | None = None,
            user_uid: str | None = None,
            action: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentAuditCursorPage:
        filters = {}

        if document_uid:
            filters["document_uid"] = document_uid

        if user_uid:
            filters["user_uid"] = user_uid

        if action:
            filters["action"] = action

        page = await DocumentAuditService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentAuditEdge[types.DocumentAuditType]] = page.edges
        items: List[types.DocumentAuditType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentAuditCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_audit_by_uid(self, info, uid: str) -> Optional[types.DocumentAuditType]:
        return await DocumentAuditService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_audits_by_document(self, info, document_uid: str) -> List[types.DocumentAuditType]:
        return await DocumentAuditService().get_all(document_uid=document_uid)

    # AI Model Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_ai_model_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            is_active: bool | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentAIModelCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["name__ilike", "description__ilike", "capabilities__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        if is_active is not None:
            filters["is_active"] = is_active

        page = await DocumentAIModelService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentAIModelEdge[types.DocumentAIModelType]] = page.edges
        items: List[types.DocumentAIModelType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentAIModelCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_ai_model_by_uid(self, info, uid: str) -> Optional[types.DocumentAIModelType]:
        return await DocumentAIModelService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_ai_models_active(self, info) -> List[types.DocumentAIModelType]:
        return await DocumentAIModelService().get_all(is_active=True)

    # AI Authoring Session Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_ai_authoring_session_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            document_uid: str | None = None,
            model_uid: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentAIAuthoringSessionCursorPage:
        filters = {}

        if document_uid:
            filters["document_uid"] = document_uid

        if model_uid:
            filters["model_uid"] = model_uid

        page = await DocumentAIAuthoringSessionService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentAIAuthoringSessionEdge[types.DocumentAIAuthoringSessionType]] = page.edges
        items: List[types.DocumentAIAuthoringSessionType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentAIAuthoringSessionCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_ai_authoring_session_by_uid(self, info, uid: str) -> Optional[
        types.DocumentAIAuthoringSessionType]:
        return await DocumentAIAuthoringSessionService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_ai_authoring_sessions_by_document(
            self, info, document_uid: str
    ) -> List[types.DocumentAIAuthoringSessionType]:
        return await DocumentAIAuthoringSessionService().get_all(document_uid=document_uid)

    # Compliance Standard Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_compliance_standard_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            text: str | None = None,
            version: str | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentComplianceStandardCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["name__ilike", "description__ilike", "content__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        if version:
            filters["version"] = version

        page = await DocumentComplianceStandardService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentComplianceStandardEdge[types.DocumentComplianceStandardType]] = page.edges
        items: List[types.DocumentComplianceStandardType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentComplianceStandardCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_compliance_standard_by_uid(self, info, uid: str) -> Optional[
        types.DocumentComplianceStandardType]:
        return await DocumentComplianceStandardService().get(uid=uid)

    # AI Compliance Check Queries
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_ai_compliance_check_all(
            self,
            info,
            page_size: int | None = None,
            after_cursor: str | None = None,
            before_cursor: str | None = None,
            document_uid: str | None = None,
            standard_uid: str | None = None,
            min_score: float | None = None,
            max_score: float | None = None,
            sort_by: list[str] | None = None,
    ) -> types.DocumentAIComplianceCheckCursorPage:
        filters = {}

        if document_uid:
            filters["document_uid"] = document_uid

        if standard_uid:
            filters["standard_uid"] = standard_uid

        if min_score is not None:
            filters["compliance_score__gte"] = min_score

        if max_score is not None:
            filters["compliance_score__lte"] = max_score

        page = await DocumentAIComplianceCheckService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentAIComplianceCheckEdge[types.DocumentAIComplianceCheckType]] = page.edges
        items: List[types.DocumentAIComplianceCheckType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentAIComplianceCheckCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def document_ai_compliance_check_by_uid(self, info, uid: str) -> Optional[
        types.DocumentAIComplianceCheckType]:
        return await DocumentAIComplianceCheckService().get(uid=uid)
