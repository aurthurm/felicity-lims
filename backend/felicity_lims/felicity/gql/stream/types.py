from typing import Optional, List
from datetime import datetime
import strawberry

from felicity.gql.user.types import UserType


@strawberry.type
class ActivityFeedType:
    uid: int
    name: str
    subscribers: Optional[List[UserType]]


@strawberry.type
class ActivityStreamType:
    uid: int
    feeds: List[ActivityFeedType]
    actor_uid: int
    actor: Optional[UserType]
    verb: str
    action_object_uid: int
    action_object: str
    target_uid: int
    target: str
    viewers: Optional[List[UserType]]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
