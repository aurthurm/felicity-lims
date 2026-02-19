from beak.modules.core.abstract.repository import BaseRepository
from beak.modules.core.worksheet.entities import WorkSheet, WorkSheetTemplate


class WorkSheetRepository(BaseRepository[WorkSheet]):
    def __init__(self) -> None:
        super().__init__(WorkSheet)


class WorkSheetTemplateRepository(BaseRepository[WorkSheetTemplate]):
    def __init__(self) -> None:
        super().__init__(WorkSheetTemplate)
