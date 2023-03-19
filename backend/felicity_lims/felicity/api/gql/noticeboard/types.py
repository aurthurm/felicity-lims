from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.setup.types import DepartmentType
from felicity.core.uid_gen import FelicityID
from felicity.api.gql.user.types import GroupType, UserType


@strawberry.type
class NoticeType:
    uid: FelicityID
    departments: Optional[List[DepartmentType]]
    groups: Optional[List[GroupType]]
    title: str
    body: str
    viewers: Optional[List[UserType]]
    expiry: datetime
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
