from beak.modules.core.abstract.repository import BaseRepository
from beak.modules.core.impress.entities import ReportImpress


class ReportImpressRepository(BaseRepository[ReportImpress]):
    def __init__(self) -> None:
        super().__init__(ReportImpress)
