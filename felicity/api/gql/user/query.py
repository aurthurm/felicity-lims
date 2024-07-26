from typing import List, Optional

import strawberry  # noqa

from felicity.api import deps
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import (GroupType, PermissionType,
                                         UserCursorPage, UserEdge, UserType)
from felicity.apps.user.services import GroupService, PermissionService, UserService


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
        page = await UserService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            text=text,
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
        return await UserService().get_by_email(email=email)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def group_all(self, info) -> List[GroupType]:
        return await GroupService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def group_by_uid(self, info, uid: str) -> Optional[GroupType]:
        return await GroupService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def permission_all(self, info) -> List[PermissionType]:
        return await PermissionService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def permission_by_uid(self, info, uid: str) -> Optional[PermissionType]:
        return await PermissionService().get(uid=uid)
