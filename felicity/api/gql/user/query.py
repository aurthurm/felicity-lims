from typing import List, Optional

import sqlalchemy as sa
import strawberry  # noqa

from felicity.api import deps
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import (GroupType, PermissionType,
                                         UserCursorPage, UserEdge, UserType)
from felicity.apps.user import entities as user_entities
from felicity.utils import has_value_or_is_truthy


@strawberry.type
class UserQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def user_all(
        self,
        info,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        sort_by: list[str] | None = None,
    ) -> UserCursorPage:
        filters = {}

        _or_ = dict()
        if has_value_or_is_truthy(text):
            arg_list = [
                "first_name__ilike",
                "last_name__ilike",
                "email__ilike",
                "mobile_phone__ilike",
                "business_phone__ilike",
            ]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters = {sa.or_: _or_}

        page = await user_entities.User.paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[UserEdge[UserType]] = page.edges
        items: List[UserType] = page.items
        page_info: PageInfo = page.page_info

        return UserCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def user_me(self, info, token: str) -> UserType | None:
        return await deps.get_current_active_user(token=token)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def user_by_email(self, info, email: str) -> UserType | None:
        return await user_entities.User.get_by_email(email=email)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def group_all(self, info) -> List[GroupType]:
        return await user_entities.Group.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def group_by_uid(self, info, uid: str) -> Optional[GroupType]:
        return await user_entities.Group.get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def permission_all(self, info) -> List[PermissionType]:
        return await user_entities.Permission.all_async()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def permission_by_uid(self, info, uid: str) -> Optional[PermissionType]:
        return await user_entities.Permission.get(uid=uid)
