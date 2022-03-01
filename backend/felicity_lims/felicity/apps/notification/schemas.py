from typing import List, Optional

from felicity.apps.common.schemas import BaseAuditModel
from felicity.apps.setup.schemas import Department
from felicity.apps.user.schemas import Group, User


#
# ActivityFeed Schemas
#
class ActivityFeedBase(BaseAuditModel):
    name: Optional[str] = ""
    subscribers: Optional[List[User]] = []


class ActivityFeed(ActivityFeedBase):
    uid: Optional[int] = None

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
    actor_uid: Optional[int] = None
    actor: Optional[User] = None
    verb: Optional[str] = None
    action_object_type: Optional[str] = None
    action_object_uid: Optional[int] = None
    action_object: Optional[str] = None
    target_uid: Optional[int] = None
    target: Optional[str] = None
    viewers: Optional[List[User]] = []


class ActivityStream(ActivityStreamBase):
    uid: Optional[int] = None

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
    message: Optional[str] = ""
    viewers: Optional[List[User]] = []


class Notification(NotificationBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


class NotificationCreate(NotificationBase):
    pass


class NotificationUpdate(NotificationBase):
    pass
