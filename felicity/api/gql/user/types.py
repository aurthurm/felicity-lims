from typing import List, Optional, Self

import strawberry  # noqa

from felicity.api.gql.setup.types.department import DepartmentType
from felicity.api.gql.types import PageInfo


@strawberry.type
class PermissionType:
    uid: str
    action: str | None = None
    target: str | None = None
    active: bool | None = None
    #
    created_by_uid: str | None = None
    created_by: Self | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Self | None = None
    updated_at: str | None = None


@strawberry.type
class GroupType:
    uid: str
    name: str | None = None
    keyword: str | None = None
    members: Optional[List["UserType"]] = None
    permissions: Optional[List[PermissionType]] = None
    active: bool | None = None
    pages: str | None = None
    #
    created_by_uid: str | None = None
    created_by: Self | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Self | None = None
    updated_at: str | None = None


@strawberry.type
class UserType:
    uid: str
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    groups: Optional[List[GroupType]] = None
    preference: Optional["UserPreferenceType"] = None
    is_active: bool
    is_superuser: bool
    bio: str | None = None
    avatar: str | None = None
    default_route: str | None = None
    uid: str
    user_name: str
    login_retry: int
    is_blocked: bool
    #
    created_by_uid: str | None = None
    created_by: Self | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Self | None = None
    updated_at: str | None = None


@strawberry.type
class UpdatedGroupPerms:
    group: GroupType
    permission: PermissionType


# relay pagination
@strawberry.type
class UserEdge:
    cursor: str
    node: UserType


@strawberry.type
class UserCursorPage:
    page_info: PageInfo
    edges: Optional[List[UserEdge]]
    items: list[UserType] | None = None
    total_count: int


@strawberry.type
class UserPreferenceType:
    uid: str
    expanded_menu: bool | None = None
    departments: list[DepartmentType] | None = None
    theme: str | None = None
    #
    created_by_uid: str | None = None
    created_by: Self | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Self | None = None
    updated_at: str | None = None
