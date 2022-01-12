import logging
from typing import Any, List, Optional

from felicity.apps import BaseAuditDBModel, DBModel
from felicity.apps.setup.models import Department
from felicity.apps.user.models import Group, User
from sqlalchemy import Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

from . import schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


"""
 Many to Many Link between Users and ActivityFeed
"""
activity_feed_subscription = Table(
    "activity_feed_subscription",
    DBModel.metadata,
    Column("activity_feed_uid", ForeignKey("activityfeed.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)


class ActivityFeed(BaseAuditDBModel):
    """ActivityFeed"""

    name = Column(String, nullable=False)
    subscribers = relationship(
        "User", secondary=activity_feed_subscription, lazy="selectin"
    )

    @classmethod
    async def create(cls, obj_in: schemas.ActivityFeedCreate) -> schemas.ActivityFeed:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.ActivityFeedUpdate) -> schemas.ActivityFeed:
        data = self._import(obj_in)
        return await super().update(**data)

    async def reset_subscribers(self) -> schemas.ActivityFeed:
        self.subscribers.clear()
        return await self.save()

    async def remove_subscriber(self, user: User) -> schemas.ActivityFeed:
        self.subscribers.remove(user)
        return await self.save()

    async def add_subscriber(self, user: User) -> schemas.ActivityFeed:
        if user not in self.viewers:
            self.subscribers.append(user)
            return await self.save()
        return self


"""
 Many to Many Link between ActivityStream and ActivityFeed
"""
activity_stream_feed = Table(
    "activity_stream_feed",
    DBModel.metadata,
    Column("activity_feed_uid", ForeignKey("activityfeed.uid"), primary_key=True),
    Column("stream_uid", ForeignKey("activitystream.uid"), primary_key=True),
)

"""
 Many to Many Link between Users and ActivityStream
"""
activity_stream_view = Table(
    "activity_stream_view",
    DBModel.metadata,
    Column("activity_stream_uid", ForeignKey("activitystream.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)


class ActivityStream(BaseAuditDBModel):
    """ActivityStream
    Actor. The object that performed the activity.
    Verb. The verb phrase that identifies the action of the activity.
    Action Object. (Optional) The object linked to the action itself.
    Target. (Optional) The object to which the activity was performed.
    e.g. Aurthur (actor) verified (verb) worksheet ws20-1222 (action object) 20 on felicity lims (target) minutes ago
    ?? maybe target as feed
    """

    feeds = relationship(ActivityFeed, secondary=activity_stream_feed, lazy="selectin")
    actor_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    actor = relationship("User", foreign_keys=[actor_uid], lazy="selectin")
    verb = Column(String, nullable=True)
    action_object_type = Column(String, nullable=True)
    action_object_uid = Column(Integer, nullable=True)
    action_object = Column(String, nullable=True)
    target_uid = Column(Integer, nullable=True)
    target = Column(String, nullable=True)
    viewers = relationship("User", secondary=activity_stream_view, lazy="selectin")

    @classmethod
    async def create(
        cls, obj_in: schemas.ActivityStreamCreate
    ) -> schemas.ActivityStream:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.ActivityStreamUpdate
    ) -> schemas.ActivityStream:
        data = self._import(obj_in)
        return await super().update(**data)

    async def reset_feeds(self) -> schemas.ActivityStream:
        self.feeds.clear()
        return await self.save()

    async def remove_feed(self, feed: ActivityFeed) -> schemas.ActivityStream:
        self.feeds.remove(feed)
        return await self.save()

    async def add_feed(self, feed: ActivityFeed) -> schemas.ActivityStream:
        if feed not in self.feeds:
            self.feeds.append(feed)
            return await self.save()
        return self

    async def reset_viewers(self) -> schemas.ActivityStream:
        self.viewers.clear()
        return await self.save()

    async def remove_viewer(self, viewer: User) -> schemas.ActivityStream:
        self.viewers.remove(viewer)
        return await self.save()

    async def add_viewer(self, viewer: User) -> schemas.ActivityStream:
        if viewer not in self.viewers:
            self.viewers.append(viewer)
            return await self.save()
        return self

    async def not_viewed(self, activity_uid) -> Optional[List[User]]:
        """list of users who have not seen the notification"""

    @classmethod
    async def for_viewer(
        cls, viewer: User, seen=False
    ) -> Optional[List[schemas.ActivityStream]]:
        """Streams for user: seen or unseen"""

    @classmethod
    async def stream(
        cls,
        obj: Any,
        actor: User,
        verb: str,
        object_type: str,
        feeds: List[ActivityFeed] = None,
    ):
        if feeds is None:
            feeds = []
        s_in = schemas.ActivityStreamCreate(
            feeds=feeds,
            actor_uid=actor.uid,
            verb=verb,
            action_object_type=object_type,
            action_object_uid=obj.uid,
            target_uid=None,
        )
        _stream = await cls.create(s_in)


"""Simple Notifications"""

"""
 Many to Many Link between Users and Notification
"""
user_notification = Table(
    "user_notification",
    DBModel.metadata,
    Column("notification_uid", ForeignKey("notification.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)

"""
 Many to Many Link between Users and Notification
"""
notification_view = Table(
    "notification_view",
    DBModel.metadata,
    Column("notification_uid", ForeignKey("notification.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)

"""
 Many to Many Link between Group and Notification
"""
group_notification = Table(
    "group_notification",
    DBModel.metadata,
    Column("notification_uid", ForeignKey("notification.uid"), primary_key=True),
    Column("group_uid", ForeignKey("group.uid"), primary_key=True),
)

"""
 Many to Many Link between Department and Notification
"""
department_notification = Table(
    "department_notification",
    DBModel.metadata,
    Column("notification_uid", ForeignKey("notification.uid"), primary_key=True),
    Column("department_uid", ForeignKey("department.uid"), primary_key=True),
)


class Notification(BaseAuditDBModel):
    """Notification
    Custom messages about system status. These are more like activity streams only that they are very specific
    messages to notify users about something important
    examples:
        32 samples are due in 4 days, today, etc ....
        7 open worksheets have been lying idle for 3 weeks plus with 137 samples past their duw date.
        2 worksheets have no samples, consider deleting them to avoid cluttering your dashboard
        ...
    """

    # target audiences
    departments = relationship(
        "Department", secondary=department_notification, lazy="selectin"
    )
    groups = relationship("Group", secondary=group_notification, lazy="selectin")
    users = relationship("User", secondary=user_notification, lazy="selectin")
    #
    message = Column(String, nullable=False)
    #
    viewers = relationship("User", secondary=notification_view, lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.NotificationCreate) -> schemas.Notification:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.NotificationUpdate) -> schemas.Notification:
        data = self._import(obj_in)
        return await super().update(**data)

    async def reset_views(self) -> schemas.Notification:
        self.viewers.clear()
        return await self.save()

    async def remove_viewer(self, user: User) -> schemas.Notification:
        self.viewers.remove(user)
        return await self.save()

    async def add_viewer(self, user: User) -> schemas.Notification:
        if user not in self.viewers:
            self.viewers.append(user)
            return await self.save()
        return self

    async def reset_departments(self) -> schemas.Notification:
        self.departments.clear()
        return await self.save()

    async def remove_department(self, department: Department) -> schemas.Notification:
        self.departments.remove(department)
        return await self.save()

    async def add_department(self, department: Department) -> schemas.Notification:
        if department not in self.departments:
            self.departments.append(department)
            return await self.save()
        return self

    async def reset_groups(self) -> schemas.Notification:
        self.groups.clear()
        return await self.save()

    async def remove_group(self, group: Group) -> schemas.Notification:
        self.groups.remove(group)
        return await self.save()

    async def add_group(self, group: Group) -> schemas.Notification:
        if group not in self.groups:
            self.groups.append(group)
            return await self.save()
        return self

    async def reset_users(self) -> schemas.Notification:
        self.users.clear()
        return await self.save()

    async def remove_users(self, user: User) -> schemas.Notification:
        self.users.remove(user)
        return await self.save()

    async def add_user(self, user: Group) -> schemas.Notification:
        if user not in self.users:
            self.users.append(user)
            return await self.save()
        return self