from felicity.apps.abstract import BaseRepository
from felicity.apps.document.entities import *


class DocumentCategoryRepository(BaseRepository[DocumentCategory]):
    def __init__(self) -> None:
        super().__init__(DocumentCategory)


class DocumentTagRepository(BaseRepository[DocumentTag]):
    def __init__(self) -> None:
        super().__init__(DocumentTag)


class DocumentRepository(BaseRepository[Document]):
    def __init__(self) -> None:
        super().__init__(Document)


class DocumentStatusRepository(BaseRepository[DocumentStatus]):
    def __init__(self) -> None:
        super().__init__(DocumentStatus)


class DocumentFolderRepository(BaseRepository[DocumentFolder]):
    def __init__(self) -> None:
        super().__init__(DocumentFolder)


class DocumentVersionRepository(BaseRepository[DocumentVersion]):
    def __init__(self) -> None:
        super().__init__(DocumentVersion)


class DocumentReviewCycleRepository(BaseRepository[DocumentReviewCycle]):
    def __init__(self) -> None:
        super().__init__(DocumentReviewCycle)


class DocumentReviewStepRepository(BaseRepository[DocumentReviewStep]):
    def __init__(self) -> None:
        super().__init__(DocumentReviewStep)


class DocumentTemplateRepository(BaseRepository[DocumentTemplate]):
    def __init__(self) -> None:
        super().__init__(DocumentTemplate)


class DocumentSubscriptionRepository(BaseRepository[DocumentSubscription]):
    def __init__(self) -> None:
        super().__init__(DocumentSubscription)


class DocumentAuditRepository(BaseRepository[DocumentAudit]):
    def __init__(self) -> None:
        super().__init__(DocumentAudit)
