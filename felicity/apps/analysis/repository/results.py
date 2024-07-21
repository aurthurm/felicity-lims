from domain.analysis.ports.repository.quality_control import IQCSetRepository
from domain.analysis.ports.repository.result import IResultMutationRepository, IAnalysisResultRepository
from felicity.apps.analysis.entities.quality_control import QCSet
from felicity.apps.analysis.entities.results import ResultMutation, AnalysisResult
from felicity.apps.repository.base import BaseRepository


class QCSetRepository(BaseRepository[QCSet], IQCSetRepository):
    def __init__(self) -> None:
        self.model = QCSet
        super().__init__()


class ResultMutationRepository(
    BaseRepository[ResultMutation], IResultMutationRepository
):
    def __init__(self) -> None:
        self.model = ResultMutation
        super().__init__()


class AnalysisResultRepository(BaseRepository[AnalysisResult], IAnalysisResultRepository):
    def __init__(self) -> None:
        self.model = AnalysisResult
        super().__init__()
