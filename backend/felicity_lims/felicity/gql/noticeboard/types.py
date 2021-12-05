from typing import Optional, List
from datetime import datetime

import strawberry

from felicity.gql.setup.types import DepartmentType
from felicity.gql.user.types import UserType, GroupType


@strawberry.type
class NoticeType:
    uid: int
    departments: Optional[List[DepartmentType]]
    groups: Optional[List[GroupType]]
    title: str
    body: str
    viewers: Optional[List[UserType]]
    expiry: datetime
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
