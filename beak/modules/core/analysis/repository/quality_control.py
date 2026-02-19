from beak.modules.core.abstract.repository import BaseRepository
from beak.modules.core.analysis.entities.qc import QCLevel, QCReference, QCSet, QCTemplate


class QCSetRepository(BaseRepository[QCSet]):
    def __init__(self) -> None:
        super().__init__(QCSet)


class QCReferenceRepository(BaseRepository[QCReference]):
    def __init__(self) -> None:
        super().__init__(QCReference)


class QCLevelRepository(BaseRepository[QCLevel]):
    def __init__(self) -> None:
        super().__init__(QCLevel)


class QCTemplateRepository(BaseRepository[QCTemplate]):
    def __init__(self) -> None:
        super().__init__(QCTemplate)
