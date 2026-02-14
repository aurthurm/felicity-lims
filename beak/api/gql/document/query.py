from typing import List, Optional

import sqlalchemy as sa
import strawberry
from strawberry.permission import PermissionExtension

from beak.api.gql.document import types
from beak.api.gql.permissions import IsAuthenticated, HasPermission
from beak.api.gql.types import PageInfo
from beak.apps.user.caches import get_current_user_preferences
from beak.apps.document.services import (
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
)
from beak.apps.guard import FAction, FObject
from beak.utils import has_value_or_is_truthy


async def _get_department_uids() -> list[str]:
    preferences = await get_current_user_preferences(None)
    if not preferences or not preferences.departments:
        return []

    return [
        department.uid
        for department in preferences.departments
        if department and department.uid
    ]


@strawberry.type
class DocumentQuery:
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

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_category_by_uid(
        self, info, uid: str
    ) -> Optional[types.DocumentCategoryType]:
        return await DocumentCategoryService().get(uid=uid)

    # Document Tag Queries
    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
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

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_tag_by_uid(
        self, info, uid: str
    ) -> Optional[types.DocumentTagType]:
        return await DocumentTagService().get(uid=uid)

    # Document Folder Queries
    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
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
            arg_list = ["name__ilike"]
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

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_folder_by_uid(
        self, info, uid: str
    ) -> Optional[types.DocumentFolderType]:
        return await DocumentFolderService().get(uid=uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_root_folders(self, info) -> List[types.DocumentFolderType]:
        return await DocumentFolderService().get_all(parent_uid=None)

    # Document Template Queries
    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
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

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_template_by_uid(
        self, info, uid: str
    ) -> Optional[types.DocumentTemplateType]:
        return await DocumentTemplateService().get(uid=uid)

    # Main Document Queries
    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
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
        department_uids = await _get_department_uids()

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

        if department_uids:
            filters["department_uid__in"] = department_uids

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

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_by_uid(self, info, uid: str) -> Optional[types.DocumentType]:
        return await DocumentService().get(uid=uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_by_document_id(
        self, info, document_id: str
    ) -> Optional[types.DocumentType]:
        return await DocumentService().get(document_id=document_id)

    # Document Version Queries
    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
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
        department_uids = await _get_department_uids()

        if document_uid:
            filters["document_uid"] = document_uid
        if department_uids:
            filters["document___department_uid__in"] = department_uids

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

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_version_by_uid(
        self, info, uid: str
    ) -> Optional[types.DocumentVersionType]:
        return await DocumentVersionService().get(uid=uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_versions_by_document(
        self, info, document_uid: str
    ) -> List[types.DocumentVersionType]:
        return await DocumentVersionService().get_all(document_uid=document_uid)

    # Document Status Queries
    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
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
        department_uids = await _get_department_uids()

        if document_uid:
            filters["document_uid"] = document_uid

        if status:
            filters["status"] = status
        if department_uids:
            filters["document___department_uid__in"] = department_uids

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

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_status_by_uid(
        self, info, uid: str
    ) -> Optional[types.DocumentStatusType]:
        return await DocumentStatusService().get(uid=uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_statuses_by_document(
        self, info, document_uid: str
    ) -> List[types.DocumentStatusType]:
        return await DocumentStatusService().get_all(document_uid=document_uid)

    # Document Review Cycle Queries
    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
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
        department_uids = await _get_department_uids()

        if document_uid:
            filters["document_uid"] = document_uid

        if status:
            filters["status"] = status

        if initiated_by_uid:
            filters["initiated_by_uid"] = initiated_by_uid
        if department_uids:
            filters["document___department_uid__in"] = department_uids

        page = await DocumentReviewCycleService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentReviewCycleEdge[types.DocumentReviewCycleType]] = (
            page.edges
        )
        items: List[types.DocumentReviewCycleType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentReviewCycleCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_review_cycle_by_uid(
        self, info, uid: str
    ) -> Optional[types.DocumentReviewCycleType]:
        return await DocumentReviewCycleService().get(uid=uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_review_cycles_by_document(
        self, info, document_uid: str
    ) -> List[types.DocumentReviewCycleType]:
        return await DocumentReviewCycleService().get_all(document_uid=document_uid)

    # Document Review Step Queries
    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
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
        department_uids = await _get_department_uids()

        if review_cycle_uid:
            filters["review_cycle_uid"] = review_cycle_uid

        if reviewer_uid:
            filters["reviewer_uid"] = reviewer_uid

        if status:
            filters["status"] = status
        if department_uids:
            filters["review_cycle___document___department_uid__in"] = department_uids

        page = await DocumentReviewStepService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentReviewStepEdge[types.DocumentReviewStepType]] = (
            page.edges
        )
        items: List[types.DocumentReviewStepType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentReviewStepCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_review_step_by_uid(
        self, info, uid: str
    ) -> Optional[types.DocumentReviewStepType]:
        return await DocumentReviewStepService().get(uid=uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_review_steps_by_cycle(
        self, info, review_cycle_uid: str
    ) -> List[types.DocumentReviewStepType]:
        return await DocumentReviewStepService().get_all(
            review_cycle_uid=review_cycle_uid
        )

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_review_steps_by_reviewer(
        self, info, reviewer_uid: str
    ) -> List[types.DocumentReviewStepType]:
        return await DocumentReviewStepService().get_all(reviewer_uid=reviewer_uid)

    # Document Subscription Queries
    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
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
        department_uids = await _get_department_uids()

        if document_uid:
            filters["document_uid"] = document_uid

        if user_uid:
            filters["user_uid"] = user_uid

        if subscription_type:
            filters["subscription_type"] = subscription_type
        if department_uids:
            filters["document___department_uid__in"] = department_uids

        page = await DocumentSubscriptionService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.DocumentSubscriptionEdge[types.DocumentSubscriptionType]] = (
            page.edges
        )
        items: List[types.DocumentSubscriptionType] = page.items
        page_info: PageInfo = page.page_info

        return types.DocumentSubscriptionCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_subscription_by_uid(
        self, info, uid: str
    ) -> Optional[types.DocumentSubscriptionType]:
        return await DocumentSubscriptionService().get(uid=uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_subscriptions_by_document(
        self, info, document_uid: str
    ) -> List[types.DocumentSubscriptionType]:
        return await DocumentSubscriptionService().get_all(document_uid=document_uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_subscriptions_by_user(
        self, info, user_uid: str
    ) -> List[types.DocumentSubscriptionType]:
        return await DocumentSubscriptionService().get_all(user_uid=user_uid)

    # Document Audit Queries
    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
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
        department_uids = await _get_department_uids()

        if document_uid:
            filters["document_uid"] = document_uid

        if user_uid:
            filters["user_uid"] = user_uid

        if action:
            filters["action"] = action
        if department_uids:
            filters["document___department_uid__in"] = department_uids

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

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_audit_by_uid(
        self, info, uid: str
    ) -> Optional[types.DocumentAuditType]:
        return await DocumentAuditService().get(uid=uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.DOCUMENT),
                ]
            )
        ]
    )
    async def document_audits_by_document(
        self, info, document_uid: str
    ) -> List[types.DocumentAuditType]:
        return await DocumentAuditService().get_all(document_uid=document_uid)
