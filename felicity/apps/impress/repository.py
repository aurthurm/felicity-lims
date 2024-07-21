
from felicity.apps.impress.entities import ReportImpress
from felicity.database.repository import BaseRepository


class ReportImpressRepository(BaseRepository[ReportImpress]):
    def __init__(self) -> None:
        super().__init__(ReportImpress)
