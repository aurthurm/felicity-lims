from beak.apps.abstract.repository import BaseRepository
from beak.apps.worksheet.entities import WorkSheet, WorkSheetTemplate


class WorkSheetRepository(BaseRepository[WorkSheet]):
    def __init__(self) -> None:
        super().__init__(WorkSheet)


class WorkSheetTemplateRepository(BaseRepository[WorkSheetTemplate]):
    def __init__(self) -> None:
        super().__init__(WorkSheetTemplate)
