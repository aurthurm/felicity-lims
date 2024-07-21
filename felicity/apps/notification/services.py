from typing import List, Optional, Any

from domain.notification.conf import channels
from domain.notification.ports.repository import (
    INotificationRepository,
    IActivityFeedRepository,
    IActivityStreamRepository,
)
from domain.notification.ports.service import (
    IActivityFeedService,
    IActivityStreamService,
    INotificationService,
)
from domain.notification.schemas import (
    ActivityFeed,
    ActivityStream,
    Notification,
    ActivityStreamCreate,
    NotificationCreate,
)
from domain.setup.schemas import Department
from domain.shared.channel import broadcast
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from domain.user.schemas import User, Group


class ActivityFeedService(BaseService[ActivityFeed], IActivityFeedService):
    def __init__(self, repository: IActivityFeedRepository):
        self.repository = repository

    async def reset_subscribers(self, activity_feed: ActivityFeed) -> ActivityFeed:
        activity_feed.subscribers.clear()
        return await super().update(activity_feed, **marshal(activity_feed))

    async def remove_subscriber(
            self, activity_feed: ActivityFeed, user: User
    ) -> ActivityFeed:
        activity_feed.subscribers.remove(user)
        return await super().update(activity_feed, **marshal(activity_feed))

    async def add_subscriber(
            self, activity_feed: ActivityFeed, user: User
    ) -> ActivityFeed:
        if user not in activity_feed.viewers:
            activity_feed.subscribers.append(user)
            return await super().update(activity_feed, **marshal(activity_feed))
        return activity_feed


class ActivityStreamService(BaseService[ActivityStream], IActivityStreamService):
    def __init__(self, repository: IActivityStreamRepository):
        self.repository = repository

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
        s_in = ActivityStreamCreate(
            feeds=feeds,
            actor_uid=actor.uid,
            verb=verb,
            action_object_type=object_type,
            action_object_uid=obj.uid,
            target_uid=None,
        )
        stream = await super().create(**marshal(s_in))
        await broadcast.publish(channels.ACTIVITIES, stream)

    async def reset_feeds(self, activity_stream: ActivityStream) -> ActivityStream:
        activity_stream.feeds.clear()
        return await super().update(activity_stream, **marshal(activity_stream))

    async def remove_feed(
            self, activity_stream: ActivityStream, feed: ActivityFeed
    ) -> ActivityStream:
        activity_stream.feeds.remove(feed)
        return await super().update(activity_stream, **marshal(activity_stream))

    async def add_feed(
            self, activity_stream: ActivityStream, feed: ActivityFeed
    ) -> ActivityStream:
        if feed not in activity_stream.feeds:
            activity_stream.feeds.append(feed)
            return await super().update(activity_stream, **marshal(activity_stream))
        return activity_stream

    async def reset_viewers(self, activity_stream: ActivityStream) -> ActivityStream:
        activity_stream.viewers.clear()
        return await super().update(activity_stream, **marshal(activity_stream))

    async def remove_viewer(
            self, activity_stream: ActivityStream, viewer: User
    ) -> ActivityStream:
        activity_stream.viewers.remove(viewer)
        return await super().update(activity_stream, **marshal(activity_stream))

    async def add_viewer(
            self, activity_stream: ActivityStream, viewer: User
    ) -> ActivityStream:
        if viewer not in activity_stream.viewers:
            activity_stream.viewers.append(viewer)
            return await super().update(activity_stream, **marshal(activity_stream))
        return activity_stream

    async def not_viewed(self, activity_uid) -> Optional[List[User]]:
        """list of users who have not seen the notification"""

    @classmethod
    async def for_viewer(
            self, activity_stream: ActivityStream, viewer: User, seen=False
    ) -> Optional[List[ActivityStream]]:
        """Streams for user: seen or unseen"""


class NotificationService(BaseService[Notification], INotificationService):
    def __init__(self, repository: INotificationRepository):
        self.repository = repository

    async def notify(
            self,
            message: str,
            departments,
            groups,
            users,
    ) -> None:
        n_in = NotificationCreate(message=message)
        n_in.users = users
        n_in.departments = departments
        n_in.groups = groups
        notification = await super().create(**marshal(n_in))
        await broadcast.publish(channels.NOTIFICATIONS, notification)

    async def filter(
            self,
            group_uid: str | None,
            department_uid: str | None,
            user_uid: str | None,
    ) -> List[Notification]:
        filters = {}

        if group_uid:
            filters["groups__uid__in"] = [group_uid]

        if department_uid:
            filters["departments__uid__in"] = [department_uid]

        if user_uid:
            filters["users__uid__in"] = [user_uid]

        return await self.repository.filter(filters, ["-created_at"])

    async def reset_views(self, notification: Notification) -> Notification:
        notification.viewers.clear()
        return await super().update(notification, **marshal(notification))

    async def remove_viewer(
            self, notification: Notification, user: User
    ) -> Notification:
        notification.viewers.remove(user)
        return await super().update(notification, **marshal(notification))

    async def add_viewer(self, notification: Notification, user: User) -> Notification:
        if user not in notification.viewers:
            notification.viewers.append(user)
            return await super().update(notification, **marshal(notification))
        return notification

    async def reset_departments(self, notification: Notification) -> Notification:
        notification.departments.clear()
        return await super().update(notification, **marshal(notification))

    async def remove_department(
            self, notification: Notification, department: Department
    ) -> Notification:
        notification.departments.remove(department)
        return await super().update(notification, **marshal(notification))

    async def add_department(
            self, notification: Notification, department: Department
    ) -> Notification:
        if department not in self.departments:
            notification.departments.append(department)
            return await super().update(notification, **marshal(notification))
        return notification

    async def reset_groups(self, notification: Notification) -> Notification:
        notification.groups.clear()
        return await super().update(notification, **marshal(notification))

    async def remove_group(
            self, notification: Notification, group: Group
    ) -> Notification:
        notification.groups.remove(group)
        return await super().update(notification, **marshal(notification))

    async def add_group(self, notification: Notification, group: Group) -> Notification:
        if group not in notification.groups:
            notification.groups.append(group)
            return await super().update(notification, **marshal(notification))
        return self

    async def reset_users(self, notification: Notification) -> Notification:
        notification.users.clear()
        return await super().update(notification, **marshal(notification))

    async def remove_users(
            self, notification: Notification, user: User
    ) -> Notification:
        notification.users.remove(user)
        return await super().update(notification, **marshal(notification))

    async def add_user(self, notification: Notification, user: Group) -> Notification:
        if user not in notification.users:
            self.users.append(user)
            return await super().update(notification, **marshal(notification))
        return notification
