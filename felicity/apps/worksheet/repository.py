import sqlalchemy as sa

from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.worksheet.entities import WorkSheet, WorkSheetTemplate
from felicity.database.paging import PageCursor


class WorkSheetRepository(BaseRepository[WorkSheet]):
    def __init__(self) -> None:
        super().__init__(WorkSheet)

class WorkSheetTemplateRepository(BaseRepository[WorkSheetTemplate]):
    def __init__(self) -> None:
        super().__init__(WorkSheetTemplate)
