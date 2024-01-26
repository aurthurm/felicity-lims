import logging
from typing import List, Optional

import sqlalchemy as sa
import strawberry  # noqa
from felicity.api.gql.types import PageInfo
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.worksheet.types import (
    WorkSheetCursorPage,
    WorkSheetEdge,
    WorkSheetTemplateType,
    WorkSheetType,
)
from felicity.apps.worksheet import models as ws_models

from felicity.utils import has_value_or_is_truthy

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class WorkSheetQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def worksheet_all(
        self,
        info,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        status: str | None = None,
        sort_by: list[str] | None = None,
    ) -> WorkSheetCursorPage:

        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
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

        page = await ws_models.WorkSheet.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[WorkSheetEdge[WorkSheetType]] = page.edges
        items: List[WorkSheetType] = page.items
        page_info: PageInfo = page.page_info

        return WorkSheetCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def worksheet_template_all(self, info) -> List[WorkSheetTemplateType]:
        return await ws_models.WorkSheetTemplate.all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def worksheet_by_analyst(self, info, analyst_uid: str) -> List[WorkSheetType]:
        return await ws_models.WorkSheet.get_all(analyst_uid=analyst_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def worksheet_by_uid(self, info, worksheet_uid: str) -> WorkSheetType:
        return await ws_models.WorkSheet.get(uid=worksheet_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def worksheet_by_id(self, info, worksheet_id: str) -> WorkSheetType:
        return await ws_models.WorkSheet.get(worksheet_id=worksheet_id)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def worksheet_by_status(
        self, info, worksheet_status: str
    ) -> List[WorkSheetType]:
        return await ws_models.WorkSheet.get_all(status__exact=worksheet_status)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def worksheet_template_by_uid(
        self, info, worksheet_uid: str
    ) -> List[WorkSheetType]:
        return await ws_models.WorkSheet.get_all(uid=worksheet_uid)
