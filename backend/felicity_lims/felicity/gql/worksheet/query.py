import logging
from typing import List, Optional
import strawberry
import sqlalchemy as sa

from felicity.gql import PageInfo
from felicity.gql.worksheet.types import (
    WorkSheetType,
    WorkSheetTemplateType,
    WorkSheetEdge,
    WorkSheetCursorPage
)
from felicity.apps.worksheet import models as ws_models
from felicity.utils import has_value_or_is_truthy

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class WorkSheetQuery:
    @strawberry.field
    async def worksheet_all(self, info, page_size: Optional[int] = None,
                            after_cursor: Optional[str] = None, before_cursor: Optional[str] = None,
                            text: Optional[str] = None, sort_by: Optional[List[str]] = None) -> WorkSheetCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = [
                'state__ilike',
                'worksheet_id__ilike',
                'analyst___first_name__ilike',
                'analyst___last_name__ilike',
                'analyst___auth___user_name__ilike',
                'instrument___name__ilike',
                'sample_type___name__ilike',
            ]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        page = await ws_models.WorkSheet.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by
        )

        total_count: int = page.total_count
        edges: List[WorkSheetEdge[WorkSheetType]] = page.edges
        items: List[WorkSheetType] = page.items
        page_info: PageInfo = page.page_info

        return WorkSheetCursorPage(
            total_count=total_count,
            edges=edges,
            items=items,
            page_info=page_info,
        )

    @strawberry.field
    async def worksheet_template_all(self, info) -> List[WorkSheetTemplateType]:
        return await ws_models.WorkSheetTemplate.all()

    @strawberry.field
    async def worksheet_by_analyst(self, info, analyst_uid: int) -> List[WorkSheetType]:
        return await ws_models.WorkSheet.get_all(analyst_uid=analyst_uid)

    @strawberry.field
    async def worksheet_by_uid(self, info, worksheet_uid: int) -> WorkSheetType:
        return await ws_models.WorkSheet.get(uid=worksheet_uid)

    @strawberry.field
    async def worksheet_by_id(self, info, worksheet_id: int) -> WorkSheetType:
        return await ws_models.WorkSheet.get(worksheet_id=worksheet_id)

    @strawberry.field
    async def worksheet_by_status(self, info, worksheet_status: str) -> List[WorkSheetType]:
        return await ws_models.WorkSheet.get_all(status__exact=worksheet_status)

    @strawberry.field
    async def worksheet_template_by_uid(self, info, worksheet_uid: int) -> List[WorkSheetType]:
        return await ws_models.WorkSheet.get_all(uid=worksheet_uid)
