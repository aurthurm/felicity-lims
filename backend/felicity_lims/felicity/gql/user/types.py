from typing import Optional, List, TypeVar, Generic
import strawberry

from felicity.gql import PageInfo

@strawberry.type
class UserAuthType:
    uid: int
    user_name: str
    login_retry: int
    is_blocked: bool
    user_type: Optional[str]


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
    permissions: Optional[PermissionType]
    active: Optional[bool]


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


@strawberry.type
class AuthenticatedData:
    user: UserType
    token: str
    token_type: str


@strawberry.type
class UpdatedGroupPerms:
    group: GroupType
    permission: PermissionType


#  relay paginations
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
