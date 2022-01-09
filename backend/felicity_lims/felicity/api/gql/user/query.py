from typing import List, Optional

import sqlalchemy as sa
import strawberry  # noqa
from felicity.apps.user import models as user_models
from felicity.gql import PageInfo, deps
from felicity.gql.user.types import (
    GroupType,
    PermissionType,
    UserCursorPage,
    UserEdge,
    UserType,
)
from felicity.utils import has_value_or_is_truthy


@strawberry.type
class UserQuery:
    @strawberry.field
    async def user_all(
        self,
        info,
        page_size: Optional[int] = None,
        after_cursor: Optional[str] = None,
        before_cursor: Optional[str] = None,
        text: Optional[str] = None,
        sort_by: Optional[List[str]] = None,
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

        page = await user_models.User.paginate_with_cursors(
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

    @strawberry.field
    async def user_me(self, info, token: str) -> Optional[UserType]:
        return await deps.get_current_active_user(token=token)

    @strawberry.field
    async def user_by_email(self, info, email: str) -> Optional[UserType]:
        return await user_models.User.get_by_email(email=email)

    @strawberry.field
    async def group_all(self, info) -> List[GroupType]:
        return await user_models.Group.all()

    @strawberry.field
    async def group_by_uid(self, info, uid: int) -> Optional[GroupType]:
        return await user_models.Group.get(uid=uid)

    @strawberry.field
    async def permission_all(self, info) -> List[PermissionType]:
        return await user_models.Permission.all()

    @strawberry.field
    async def permission_by_uid(self, info, uid: int) -> Optional[PermissionType]:
        return await user_models.Permission.get(uid=uid)
