from dataclasses import field
from typing import List, Optional

from pydantic import ConfigDict

from felicity.apps.common.schemas import BaseAuditModel
from felicity.apps.setup.schemas import Department
from felicity.apps.user.schemas import Group, User


#
# ActivityFeed Schemas
#
class ActivityFeedBase(BaseAuditModel):
    name: str | None = ""
    subscribers: Optional[List[User]] = field(default_factory=list)


class ActivityFeed(ActivityFeedBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class ActivityFeedCreate(ActivityFeedBase):
    pass


class ActivityFeedUpdate(ActivityFeedBase):
    pass


#
# ActivityStream Schemas
#
class ActivityStreamBase(BaseAuditModel):
    feeds: Optional[List[ActivityFeed]] = field(default_factory=list)
    actor_uid: str | None = None
    actor: Optional[User] = None
    verb: str | None = None
    action_object_type: str | None = None
    action_object_uid: str | None = None
    action_object: str | None = None
    target_uid: str | None = None
    target: str | None = None
    viewers: Optional[List[User]] = field(default_factory=list)


class ActivityStream(ActivityStreamBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class ActivityStreamCreate(ActivityStream):
    pass


class ActivityStreamUpdate(ActivityStreamBase):
    pass


#
# Notification Schemas
#
class NotificationBase(BaseAuditModel):
    departments: Optional[List[Department]] = field(default_factory=list)
    groups: Optional[List[Group]] = field(default_factory=list)
    users: Optional[List[User]] = field(default_factory=list)
    message: str | None = ""
    viewers: Optional[List[User]] = field(default_factory=list)


class Notification(NotificationBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class NotificationCreate(NotificationBase):
    pass


class NotificationUpdate(NotificationBase):
    pass
