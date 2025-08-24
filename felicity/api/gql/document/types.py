from typing import List, Optional

import strawberry

from felicity.api.gql.setup.types import DepartmentType, LaboratoryType
from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import UserType


# Document Category Type
@strawberry.type
class DocumentCategoryType:
    uid: str
    name: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class DocumentCategoryEdge:
    cursor: str
    node: DocumentCategoryType


@strawberry.type
class DocumentCategoryCursorPage:
    page_info: PageInfo
    edges: Optional[List[DocumentCategoryEdge]] = None
    items: Optional[List[DocumentCategoryType]] = None
    total_count: int


# Document Tag Type
@strawberry.type
class DocumentTagType:
    uid: str
    name: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def documents(self, info) -> List["DocumentType"]:
        from felicity.apps.document.services import DocumentService
        return await DocumentService().get_by_tag(self.uid)


@strawberry.type
class DocumentTagEdge:
    cursor: str
    node: DocumentTagType


@strawberry.type
class DocumentTagCursorPage:
    page_info: PageInfo
    edges: Optional[List[DocumentTagEdge]] = None
    items: Optional[List[DocumentTagType]] = None
    total_count: int


# Document Folder Type
@strawberry.type
class DocumentFolderType:
    uid: str
    name: str
    description: str | None = None
    parent_uid: str | None = None
    parent: Optional["DocumentFolderType"] = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def subfolders(self, info) -> List["DocumentFolderType"]:
        from felicity.apps.document.services import DocumentFolderService
        return await DocumentFolderService().get_all(parent_uid=self.uid)

    @strawberry.field
    async def documents(self, info) -> List["DocumentType"]:
        from felicity.apps.document.services import DocumentService
        return await DocumentService().get_all(folder_uid=self.uid)


@strawberry.type
class DocumentFolderEdge:
    cursor: str
    node: DocumentFolderType


@strawberry.type
class DocumentFolderCursorPage:
    page_info: PageInfo
    edges: Optional[List[DocumentFolderEdge]] = None
    items: Optional[List[DocumentFolderType]] = None
    total_count: int


# Document Template Type
@strawberry.type
class DocumentTemplateType:
    uid: str
    name: str
    description: str | None = None
    content: str
    category_uid: str | None = None
    category: DocumentCategoryType | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def documents(self, info) -> List["DocumentType"]:
        from felicity.apps.document.services import DocumentService
        return await DocumentService().get_all(template_uid=self.uid)


@strawberry.type
class DocumentTemplateEdge:
    cursor: str
    node: DocumentTemplateType


@strawberry.type
class DocumentTemplateCursorPage:
    page_info: PageInfo
    edges: Optional[List[DocumentTemplateEdge]] = None
    items: Optional[List[DocumentTemplateType]] = None
    total_count: int


# Document Version Type
@strawberry.type
class DocumentVersionType:
    uid: str
    document_uid: str
    document: Optional["DocumentType"] = None
    version_number: str
    content: str
    editor: str
    thumbnail: str | None = None
    change_summary: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class DocumentVersionEdge:
    cursor: str
    node: DocumentVersionType


@strawberry.type
class DocumentVersionCursorPage:
    page_info: PageInfo
    edges: Optional[List[DocumentVersionEdge]] = None
    items: Optional[List[DocumentVersionType]] = None
    total_count: int


# Document Status Type
@strawberry.type
class DocumentStatusType:
    uid: str
    document_uid: str
    document: Optional["DocumentType"] = None
    status: str
    date: str
    user_uid: str
    user: UserType
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class DocumentStatusEdge:
    cursor: str
    node: DocumentStatusType


@strawberry.type
class DocumentStatusCursorPage:
    page_info: PageInfo
    edges: Optional[List[DocumentStatusEdge]] = None
    items: Optional[List[DocumentStatusType]] = None
    total_count: int


# Document Review Step Type
@strawberry.type
class DocumentReviewStepType:
    uid: str
    review_cycle_uid: str
    review_cycle: "DocumentReviewCycleType"
    reviewer_uid: str
    reviewer: UserType
    sequence: int
    status: str
    comments: str | None = None
    action_date: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class DocumentReviewStepEdge:
    cursor: str
    node: DocumentReviewStepType


@strawberry.type
class DocumentReviewStepCursorPage:
    page_info: PageInfo
    edges: Optional[List[DocumentReviewStepEdge]] = None
    items: Optional[List[DocumentReviewStepType]] = None
    total_count: int


# Document Review Cycle Type
@strawberry.type
class DocumentReviewCycleType:
    uid: str
    document_uid: str
    document: "DocumentType"
    start_date: str
    end_date: str | None = None
    initiated_by_uid: str
    initiated_by: UserType
    status: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def steps(self, info) -> List[DocumentReviewStepType]:
        from felicity.apps.document.services import DocumentReviewStepService
        return await DocumentReviewStepService().get_all(review_cycle_uid=self.uid)


@strawberry.type
class DocumentReviewCycleEdge:
    cursor: str
    node: DocumentReviewCycleType


@strawberry.type
class DocumentReviewCycleCursorPage:
    page_info: PageInfo
    edges: Optional[List[DocumentReviewCycleEdge]] = None
    items: Optional[List[DocumentReviewCycleType]] = None
    total_count: int


# Document Subscription Type
@strawberry.type
class DocumentSubscriptionType:
    uid: str
    document_uid: str
    document: "DocumentType"
    user_uid: str
    user: UserType
    subscription_type: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class DocumentSubscriptionEdge:
    cursor: str
    node: DocumentSubscriptionType


@strawberry.type
class DocumentSubscriptionCursorPage:
    page_info: PageInfo
    edges: Optional[List[DocumentSubscriptionEdge]] = None
    items: Optional[List[DocumentSubscriptionType]] = None
    total_count: int


# Document Audit Type
@strawberry.type
class DocumentAuditType:
    uid: str
    document_uid: str
    document: "DocumentType"
    action: str
    date: str
    user_uid: str
    user: UserType
    ip_address: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class DocumentAuditEdge:
    cursor: str
    node: DocumentAuditType


@strawberry.type
class DocumentAuditCursorPage:
    page_info: PageInfo
    edges: Optional[List[DocumentAuditEdge]] = None
    items: Optional[List[DocumentAuditType]] = None
    total_count: int


# Main Document Type
@strawberry.type
class DocumentType:
    uid: str
    name: str
    subtitle: str | None = None
    document_id: str
    folder_uid: str | None = None
    folder: DocumentFolderType | None = None
    department_uid: str | None = None
    department: DepartmentType | None = None
    category_uid: str | None = None
    category: DocumentCategoryType | None = None
    template_uid: str | None = None
    template: DocumentTemplateType | None = None
    last_accessed: str | None = None
    last_accessed_by_uid: str | None = None
    last_accessed_by: UserType | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def tags(self, info) -> List[DocumentTagType]:
        from felicity.apps.document.services import DocumentService
        document = await DocumentService().get(uid=self.uid)
        return document.tags if document else []

    @strawberry.field
    async def authors(self, info) -> List[UserType]:
        from felicity.apps.document.services import DocumentService
        document = await DocumentService().get(uid=self.uid)
        return document.authors if document else []

    @strawberry.field
    async def readers(self, info) -> List[UserType]:
        from felicity.apps.document.services import DocumentService
        document = await DocumentService().get(uid=self.uid)
        return document.readers if document else []

    @strawberry.field
    async def related_to(self, info) -> List["DocumentType"]:
        from felicity.apps.document.services import DocumentService
        document = await DocumentService().get(uid=self.uid)
        return document.related_to if document else []

    @strawberry.field
    async def related_from(self, info) -> List["DocumentType"]:
        from felicity.apps.document.services import DocumentService
        document = await DocumentService().get(uid=self.uid)
        return document.related_from if document else []

    @strawberry.field
    async def versions(self, info) -> List[DocumentVersionType]:
        from felicity.apps.document.services import DocumentVersionService
        return await DocumentVersionService().get_all(document_uid=self.uid)

    @strawberry.field
    async def statuses(self, info) -> List[DocumentStatusType]:
        from felicity.apps.document.services import DocumentStatusService
        return await DocumentStatusService().get_all(document_uid=self.uid)

    @strawberry.field
    async def review_cycles(self, info) -> List[DocumentReviewCycleType]:
        from felicity.apps.document.services import DocumentReviewCycleService
        return await DocumentReviewCycleService().get_all(document_uid=self.uid)

    @strawberry.field
    async def subscriptions(self, info) -> List[DocumentSubscriptionType]:
        from felicity.apps.document.services import DocumentSubscriptionService
        return await DocumentSubscriptionService().get_all(document_uid=self.uid)

    @strawberry.field
    async def audit_records(self, info) -> List[DocumentAuditType]:
        from felicity.apps.document.services import DocumentAuditService
        return await DocumentAuditService().get_all(document_uid=self.uid)

    @strawberry.field
    async def latest_version(self, info) -> Optional[DocumentVersionType]:
        from felicity.apps.document.services import DocumentVersionService
        versions = await DocumentVersionService().get_all(document_uid=self.uid)
        if not versions:
            return None
        return sorted(versions, key=lambda v: v.version_number, reverse=True)[0]

    @strawberry.field
    async def content(self, info) -> Optional[str]:
        latest_version = await self.latest_version(info)
        return latest_version.content if latest_version else None

    @strawberry.field
    async def editor(self, info) -> Optional[str]:
        latest_version = await self.latest_version(info)
        return latest_version.editor if latest_version else "unknown-editor"

    @strawberry.field
    async def status(self, info) -> Optional[str]:
        from felicity.apps.document.services import DocumentStatusService
        statuses = await DocumentStatusService().get_all(document_uid=self.uid)
        if not statuses:
            return None
        return sorted(statuses, key=lambda s: s.date, reverse=True)[0].status


@strawberry.type
class DocumentEdge:
    cursor: str
    node: DocumentType


@strawberry.type
class DocumentCursorPage:
    page_info: PageInfo
    edges: Optional[List[DocumentEdge]] = None
    items: Optional[List[DocumentType]] = None
    total_count: int
