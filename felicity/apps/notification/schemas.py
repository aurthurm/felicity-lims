from typing import List, Optional

from apps.common.schemas import BaseAuditModel
from apps.setup.schemas import Department
from apps.user.schemas import Group, User



#
# ActivityFeed Schemas
#
class ActivityFeedBase(BaseAuditModel):
    name: str | None = ""
    subscribers: Optional[List[User]] = []


class ActivityFeed(ActivityFeedBase):
    uid: str| None = None

    class Config:
        orm_mode = True


class ActivityFeedCreate(ActivityFeedBase):
    pass


class ActivityFeedUpdate(ActivityFeedBase):
    pass


#
# ActivityStream Schemas
#
class ActivityStreamBase(BaseAuditModel):
    feeds: Optional[List[ActivityFeed]] = []
    actor_uid: str| None = None
    actor: Optional[User] = None
    verb: str | None = None
    action_object_type: str | None = None
    action_object_uid: str| None = None
    action_object: str | None = None
    target_uid: str| None = None
    target: str | None = None
    viewers: Optional[List[User]] = []


class ActivityStream(ActivityStreamBase):
    uid: str| None = None

    class Config:
        orm_mode = True


class ActivityStreamCreate(ActivityStream):
    pass


class ActivityStreamUpdate(ActivityStreamBase):
    pass


#
# Notification Schemas
#
class NotificationBase(BaseAuditModel):
    departments: Optional[List[Department]] = []
    groups: Optional[List[Group]] = []
    users: Optional[List[User]] = []
    message: str | None = ""
    viewers: Optional[List[User]] = []


class Notification(NotificationBase):
    uid: str| None = None

    class Config:
        orm_mode = True


class NotificationCreate(NotificationBase):
    pass


class NotificationUpdate(NotificationBase):
    pass
