from felicity.apps.analysis.entities.results import ResultMutation, AnalysisResult
from felicity.database.repository import BaseRepository


class ResultMutationRepository(
    BaseRepository[ResultMutation]
):
    def __init__(self) -> None:
        super().__init__(ResultMutation)


class AnalysisResultRepository(BaseRepository[AnalysisResult]):
    def __init__(self) -> None:
        super().__init__(AnalysisResult)
