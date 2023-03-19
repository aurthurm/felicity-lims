from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

import felicity.api.gql.setup.types
from felicity.api.gql import PageInfo
from felicity.core.uid_gen import FelicityID


@strawberry.type
class UserAuthType:
    uid: FelicityID
    user_name: str
    login_retry: int
    is_blocked: bool
    user_type: Optional[str]
    #
    created_at: Optional[datetime]
    creator_name: Optional[str]
    creator_uid: Optional[FelicityID]
    updated_at: Optional[datetime]
    updator_name: Optional[str]
    updator_uid: Optional[FelicityID]


@strawberry.type
class PermissionType:
    uid: FelicityID
    action: Optional[str]
    target: Optional[str]
    active: Optional[bool]


@strawberry.type
class GroupType:
    uid: FelicityID
    name: Optional[str]
    keyword: Optional[str]
    members: Optional[List["UserType"]]
    permissions: Optional[List[PermissionType]]
    active: Optional[bool]
    pages: Optional[str]


@strawberry.type
class UserType:
    uid: FelicityID
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    mobile_phone: Optional[str]
    business_phone: Optional[str]
    groups: Optional[List[GroupType]]
    preference_uid: Optional[FelicityID]
    preference: Optional["UserPreferenceType"]
    is_active: bool
    is_superuser: bool
    auth_uid: Optional[FelicityID]
    auth: Optional[UserAuthType]
    bio: Optional[str]
    avatar: Optional[str]
    default_route: Optional[str]
    #
    created_at: Optional[datetime]
    creator_name: Optional[str]
    creator_uid: Optional[FelicityID]
    updated_at: Optional[datetime]
    updator_name: Optional[str]
    updator_uid: Optional[FelicityID]


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
    items: Optional[List[UserType]]
    total_count: int


@strawberry.type
class UserPreferenceType:
    uid: FelicityID
    expanded_menu: Optional[bool]
    departments: Optional[List["felicity.api.gql.setup.types.DepartmentType"]]
    theme: Optional[str]
