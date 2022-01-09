from typing import List, Optional

import sqlalchemy as sa
import strawberry  # noqa
from felicity.apps.kanban import models
from felicity.gql import PageInfo
from felicity.gql.kanban.types import (
    BoardCursorPage,
    BoardEdge,
    BoardListingType,
    BoardType,
    ListingTaskType,
    TaskCommentType,
    TaskMilestoneType,
)
from felicity.utils import has_value_or_is_truthy


@strawberry.type
class KanBanQuery:
    @strawberry.field
    async def board_all(
        self,
        info,
        page_size: Optional[int] = None,
        after_cursor: Optional[str] = None,
        before_cursor: Optional[str] = None,
        text: Optional[str] = None,
        sort_by: Optional[List[str]] = None,
    ) -> BoardCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = ["title__ilike", "description__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        page = await models.Board.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[BoardEdge[BoardType]] = page.edges
        items: List[BoardType] = page.items
        page_info: PageInfo = page.page_info

        return BoardCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field
    async def task_comment_all(self, info, task_uid: int) -> List[TaskCommentType]:
        return await models.TaskComment.where(task_uid=task_uid)

    @strawberry.field
    async def task_milestone_all(self, info, task_uid: int) -> List[TaskMilestoneType]:
        return await models.TaskMilestone.get(task_uid=task_uid)

    @strawberry.field
    async def board_by_uid(self, info, uid: int) -> Optional[BoardType]:
        return await models.Board.get(uid=uid)

    @strawberry.field
    async def board_listing_by_uid(self, info, uid: int) -> BoardListingType:
        return await models.BoardListing.get(uid=uid)

    @strawberry.field
    async def board_listing_by_board_uid(
        self, info, board_uid: int
    ) -> List[BoardListingType]:
        return await models.BoardListing.where(board_uid=board_uid)

    @strawberry.field
    async def listing_task_by_uid(self, info, uid: int) -> ListingTaskType:
        return await models.ListingTask.get(uid=uid)
