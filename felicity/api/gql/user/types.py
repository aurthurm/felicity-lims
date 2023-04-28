from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from api.gql import PageInfo
from api.gql.setup.types.department import DepartmentType
from core.uid_gen import FelicityID


@strawberry.type
class UserAuthType:
    uid: FelicityID
    user_name: str
    login_retry: int
    is_blocked: bool
    user_type: str | None
    #
    created_at: datetime | None
    creator_name: str | None
    creator_uid: FelicityID | None
    updated_at: datetime | None
    updator_name: str | None
    updator_uid: FelicityID | None


@strawberry.type
class PermissionType:
    uid: FelicityID
    action: str | None
    target: str | None
    active: bool| None


@strawberry.type
class GroupType:
    uid: FelicityID
    name: str | None
    keyword: str | None
    members: Optional[List["UserType"]]
    permissions: Optional[List[PermissionType]]
    active: bool| None
    pages: str | None


@strawberry.type
class UserType:
    uid: FelicityID
    first_name: str | None
    last_name: str | None
    email: str | None
    mobile_phone: str | None
    business_phone: str | None
    groups: Optional[List[GroupType]]
    preference_uid: FelicityID | None
    preference: Optional["UserPreferenceType"]
    is_active: bool
    is_superuser: bool
    auth_uid: FelicityID | None
    auth: Optional[UserAuthType]
    bio: str | None
    avatar: str | None
    default_route: str | None
    #
    created_at: datetime | None
    creator_name: str | None
    creator_uid: FelicityID | None
    updated_at: datetime | None
    updator_name: str | None
    updator_uid: FelicityID | None


@strawberry.type
class AuthenticatedData:
    user: UserType
    token: str
    token_type: str


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
    items: list[UserType] | None
    total_count: int


@strawberry.type
class UserPreferenceType:
    uid: FelicityID
    expanded_menu: bool| None
    departments: list[DepartmentType] | None
    theme: str | None
