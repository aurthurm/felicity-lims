from typing import List, Optional

import sqlalchemy as sa
import strawberry  # noqa

from felicity.api import deps
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import (
    GroupType,
    PermissionType,
    PermissionUsageSummaryType,
    UserAccessSummaryType,
    UserCursorPage,
    UserEdge,
    UserType,
)
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
        laboratory_uid: str | None = None,
        sort_by: list[str] | None = None,
    ) -> UserCursorPage:
        filters = {}

        # Handle laboratory filtering
        if laboratory_uid:
            user_service = UserService()
            lab_users = await user_service.get_users_by_laboratory(laboratory_uid)
            user_uids = [user.uid for user in lab_users]
            if user_uids:
                filters["uid__in"] = user_uids
            else:
                # No users in this lab, return empty result
                return UserCursorPage(
                    total_count=0, 
                    edges=[], 
                    items=[], 
                    page_info=PageInfo(has_next_page=False, has_previous_page=False)
                )

        _or_ = dict()
        if text:
            arg_list = [
                "first_name__ilike",
                "last_name__ilike",
                "email__ilike",
                "mobile_phone__ilike",
                "business_phone__ilike",
                "user_name__ilike",
            ]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            if filters:
                filters = {sa.and_: [filters, {sa.or_: _or_}]}
            else:
                filters = {sa.or_: _or_}

        page = await UserService().paging_filter(
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
        return await UserService().get_by_email(email=email)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def group_all(self, info, laboratory_uid: str | None = None) -> List[GroupType]:
        """Get all groups, optionally filtered by laboratory"""
        return await GroupService().get_groups_by_laboratory(laboratory_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def group_by_uid(self, info, uid: str) -> Optional[GroupType]:
        return await GroupService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def groups_by_laboratory(self, info, laboratory_uid: str | None = None) -> List[GroupType]:
        """Get groups for a specific laboratory or global groups"""
        return await GroupService().get_groups_by_laboratory(laboratory_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def group_by_name(self, info, name: str, laboratory_uid: str | None = None) -> Optional[GroupType]:
        """Get group by name within laboratory scope"""
        return await GroupService().get_group_by_name(name, laboratory_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def group_search(
        self, info, text: str, laboratory_uid: str | None = None, limit: int = 10
    ) -> List[GroupType]:
        """Search groups by text"""
        return await GroupService().search_groups(text, laboratory_uid, limit)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def groups_with_permission(
        self, info, permission_uid: str, laboratory_uid: str | None = None
    ) -> List[GroupType]:
        """Get all groups that have a specific permission"""
        return await GroupService().get_groups_with_permission(permission_uid, laboratory_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def permission_all(self, info) -> List[PermissionType]:
        return await PermissionService().all()

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def permission_by_uid(self, info, uid: str) -> Optional[PermissionType]:
        return await PermissionService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def permissions_by_action(self, info, action: str) -> List[PermissionType]:
        """Get all permissions for a specific action"""
        return await PermissionService().get_permissions_by_action(action)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def permissions_by_target(self, info, target: str) -> List[PermissionType]:
        """Get all permissions for a specific target object"""
        return await PermissionService().get_permissions_by_target(target)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def permissions_by_action_target(
        self, info, action: str, target: str
    ) -> List[PermissionType]:
        """Get permissions by action and target"""
        return await PermissionService().get_permissions_by_action_target(action, target)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def permission_search(self, info, text: str, limit: int = 10) -> List[PermissionType]:
        """Search permissions by text"""
        return await PermissionService().search_permissions(text, limit)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def permission_usage_summary(self, info, permission_uid: str) -> PermissionUsageSummaryType:
        """Get summary of groups and users that have this permission"""
        summary = await PermissionService().get_permission_usage_summary(permission_uid)
        return PermissionUsageSummaryType(**summary)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def users_by_laboratory(self, info, laboratory_uid: str) -> List[UserType]:
        """Get all users assigned to a specific laboratory"""
        return await UserService().get_users_by_laboratory(laboratory_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def user_laboratories(self, info, user_uid: str) -> List[str]:
        """Get all laboratory UIDs a user has access to"""
        return await UserService().get_laboratories_by_user(user_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def user_access_summary(self, info, user_uid: str) -> UserAccessSummaryType:
        """Get comprehensive access summary for a user"""
        summary = await UserService().get_user_access_summary(user_uid)
        return UserAccessSummaryType(**summary)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def user_search(
        self, info, text: str, laboratory_uid: str | None = None, limit: int = 10
    ) -> List[UserType]:
        """Search users by text"""
        return await UserService().search_users(text, laboratory_uid, limit)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def user_by_email_or_username(self, info, identifier: str) -> Optional[UserType]:
        """Get user by email or username"""
        return await UserService().get_user_by_email_or_username(identifier)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def user_by_uid(self, info, uid: str) -> Optional[UserType]:
        """Get user by UID"""
        return await UserService().get(uid=uid)
