from felicity.apps.abstract import BaseService
from felicity.apps.document.repositories import *
from felicity.apps.document.schemas import DocumentCategoryCreate, DocumentCategoryUpdate, DocumentTagCreate, \
    DocumentTagUpdate, DocumentCreate, DocumentUpdate, DocumentStatusCreate, DocumentStatusUpdate, DocumentFolderCreate, \
    DocumentFolderUpdate, DocumentVersionCreate, DocumentVersionUpdate, DocumentReviewCycleCreate, \
    DocumentReviewCycleUpdate, DocumentReviewStepCreate, DocumentReviewStepUpdate, DocumentTemplateCreate, \
    DocumentTemplateUpdate, DocumentSubscriptionCreate, DocumentSubscriptionUpdate, DocumentAuditCreate, \
    DocumentAuditUpdate


class DocumentCategoryService(BaseService[DocumentCategory, DocumentCategoryCreate, DocumentCategoryUpdate]):
    def __init__(self):
        super().__init__(DocumentCategoryRepository())


class DocumentTagService(BaseService[DocumentTag, DocumentTagCreate, DocumentTagUpdate]):
    def __init__(self):
        super().__init__(DocumentTagRepository())


class DocumentService(BaseService[Document, DocumentCreate, DocumentUpdate]):
    def __init__(self):
        super().__init__(DocumentRepository())

    async def get_by_tag(self, tag_uid: str) -> list[Document]:
        document_uids = await self.repository.table_query(
            document_tagged, columns=["document_uid"], document_tag_uid=tag_uid
        )
        return await self.get_by_uids(document_uids)

    async def add_tag(self, uid: str, tag_uid: str) -> None:
        await self.repository.table_insert(
            document_tagged,
            [{"document_uid": uid, "document_tag_uid": tag_uid}]
        )

    async def clear_tags(self, uid: str):
        await self.repository.table_delete(document_tagged, document_uid=uid)

    async def add_author(self, uid: str, author_uid: str) -> None:
        await self.repository.table_insert(
            document_author,
            [{"document_uid": uid, "user_uid": author_uid}]
        )

    async def clear_authors(self, uid: str):
        await self.repository.table_delete(document_author, document_uid=uid)

    async def add_reader(self, uid: str, reader_uid: str) -> None:
        await self.repository.table_insert(
            document_reader,
            [{"document_uid": uid, "user_uid": reader_uid}]
        )

    async def clear_readers(self, uid: str):
        await self.repository.table_delete(document_reader, document_uid=uid)

    async def clear_related_documents(self, uid: str):
        await self.repository.table_delete(document_relation, source_document_uid=uid)

    async def relation_exists(self, source_uid, target_uid, relation_type):
        return await self.repository.table_query(
            document_relation,
            source_document_uid=source_uid,
            target_document_uid=target_uid,
            relation_type=relation_type
        )

    async def add_relation(self, source_uid: str, target_uid: str, relation_type: str):
        return await self.repository.table_insert(
            document_relation,
            [{
                "source_document_uid": source_uid,
                "target_document_uid": target_uid,
                "relation_type": relation_type
            }]
        )

    async def remove_relation(self, source_uid: str, target_uid: str, relation_type: str):
        await self.repository.table_delete(
            document_relation,
            source_document_uid=source_uid,
            target_document_uid=target_uid,
            relation_type=relation_type
        )


class DocumentStatusService(BaseService[DocumentStatus, DocumentStatusCreate, DocumentStatusUpdate]):
    def __init__(self):
        super().__init__(DocumentStatusRepository())


class DocumentFolderService(BaseService[DocumentFolder, DocumentFolderCreate, DocumentFolderUpdate]):
    def __init__(self):
        super().__init__(DocumentFolderRepository())


class DocumentVersionService(BaseService[DocumentVersion, DocumentVersionCreate, DocumentVersionUpdate]):
    def __init__(self):
        super().__init__(DocumentVersionRepository())


class DocumentReviewCycleService(
    BaseService[DocumentReviewCycle, DocumentReviewCycleCreate, DocumentReviewCycleUpdate]):
    def __init__(self):
        super().__init__(DocumentReviewCycleRepository())


class DocumentReviewStepService(BaseService[DocumentReviewStep, DocumentReviewStepCreate, DocumentReviewStepUpdate]):
    def __init__(self):
        super().__init__(DocumentReviewStepRepository())


class DocumentTemplateService(BaseService[DocumentTemplate, DocumentTemplateCreate, DocumentTemplateUpdate]):
    def __init__(self):
        super().__init__(DocumentTemplateRepository())


class DocumentSubscriptionService(
    BaseService[DocumentSubscription, DocumentSubscriptionCreate, DocumentSubscriptionUpdate]):
    def __init__(self):
        super().__init__(DocumentSubscriptionRepository())


class DocumentAuditService(BaseService[DocumentAudit, DocumentAuditCreate, DocumentAuditUpdate]):
    def __init__(self):
        super().__init__(DocumentAuditRepository())
