from domain.impress.ports.repository import IReportImpressRepository

from infrastructure.database.repository.base import BaseRepository

from infrastructure.database.impress.entities import ReportImpress


class ReportImpressRepository(BaseRepository[ReportImpress], IReportImpressRepository):
    def __init__(self) -> None:
        self.model = ReportImpress
        super().__init__()
