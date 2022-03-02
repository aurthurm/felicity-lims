from typing import List, Optional
from datetime import datetime
import strawberry  # noqa
from felicity.api.gql import PageInfo


@strawberry.type
class UserAuthType:
    uid: int
    user_name: str
    login_retry: int
    is_blocked: bool
    user_type: Optional[str]
    bio: Optional[str]
    #
    created_at: Optional[datetime]
    creator_name: Optional[str]
    creator_uid: Optional[int]
    updated_at: Optional[datetime]
    updator_name: Optional[str]
    updator_uid: Optional[int]


@strawberry.type
class PermissionType:
    uid: int
    action: Optional[str]
    target: Optional[str]
    active: Optional[bool]


@strawberry.type
class GroupType:
    uid: int
    name: Optional[str]
    keyword: Optional[str]
    members: Optional[List["UserType"]]
    permissions: Optional[List[PermissionType]]
    active: Optional[bool]
    pages: Optional[str]


@strawberry.type
class UserType:
    uid: int
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    mobile_phone: Optional[str]
    business_phone: Optional[str]
    groups: Optional[List[GroupType]]
    is_active: bool
    is_superuser: bool
    auth_uid: Optional[int]
    auth: Optional[UserAuthType]
    #
    created_at: Optional[datetime]
    creator_name: Optional[str]
    creator_uid: Optional[int]
    updated_at: Optional[datetime]
    updator_name: Optional[str]
    updator_uid: Optional[int]


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
