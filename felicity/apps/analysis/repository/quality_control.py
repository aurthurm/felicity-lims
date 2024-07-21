from domain.analysis.ports.repository.quality_control import (
    IQCSetRepository,
    IQCReferenceRepository,
    IQCLevelRepository,
    IQCTemplateRepository,
)

from felicity.apps.repository.base import BaseRepository

from felicity.apps.analysis.entities.quality_control import (
    QCSet,
    QCReference,
    QCLevel,
    QCTemplate,
)


class QCSetRepository(BaseRepository[QCSet], IQCSetRepository):
    def __init__(self) -> None:
        self.model = QCSet
        super().__init__()


class QCReferenceRepository(BaseRepository[QCReference], IQCReferenceRepository):
    def __init__(self) -> None:
        self.model = QCReference
        super().__init__()


class QCLevelRepository(BaseRepository[QCLevel], IQCLevelRepository):
    def __init__(self) -> None:
        self.model = QCLevel
        super().__init__()


class QCTemplateRepository(BaseRepository[QCTemplate], IQCTemplateRepository):
    def __init__(self) -> None:
        self.model = QCTemplate
        super().__init__()
