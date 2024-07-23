from felicity.apps.worksheet.entities import WorkSheet, WorkSheetTemplate
import sqlalchemy as sa

from felicity.database.paging import PageCursor
from felicity.apps.abstract.repository import BaseRepository


class WorkSheetRepository(BaseRepository[WorkSheet]):
    def __init__(self) -> None:
        super().__init__(WorkSheet)

    async def paginate_with_cursors(
        self,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        status: str | None = None,
        sort_by: list[str] | None = None,
    ) -> PageCursor:
        pass

        filters = []

        _or_text_ = {}
        if text:
            arg_list = [
                "state__ilike",
                "worksheet_id__ilike",
                "analyst___first_name__ilike",
                "analyst___last_name__ilike",
                "analyst___auth___user_name__ilike",
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        if status:
            filters.append({"state__exact": status})

        # filters.append({'internal_use__ne': True})
        return await super().paginate_with_cursors(
            page_size, after_cursor, before_cursor, filters, sort_by
        )


class WorkSheetTemplateRepository(
    BaseRepository[WorkSheetTemplate]
):
    def __init__(self) -> None:
        super().__init__(WorkSheetTemplate)
