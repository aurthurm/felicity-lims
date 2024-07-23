
from felicity.apps.impress.entities import ReportImpress
from felicity.apps.abstract.repository import BaseRepository


class ReportImpressRepository(BaseRepository[ReportImpress]):
    def __init__(self) -> None:
        super().__init__(ReportImpress)
