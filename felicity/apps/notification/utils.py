import logging
from typing import Any

from apps.common.channel import broadcast
from apps.notification.conf import channels
from apps.notification.models import ActivityStream, Notification
from apps.notification.schemas import ActivityStreamCreate, NotificationCreate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FelicityStreamer:
    """activity streams helper util"""

    @staticmethod
    async def stream(obj: Any, actor: Any, verb: str, object_type: str):
        s_in = ActivityStreamCreate(
            feeds=[],
            actor_uid=actor.uid,
            verb=verb,
            action_object_type=object_type,
            action_object_uid=obj.uid,
            target_uid=None,
        )
        stream: ActivityStream = await ActivityStream.create(s_in)
        await broadcast.publish(channels.ACTIVITIES, stream)


class FelicityNotifier:
    """simple notification stream util util"""

    @staticmethod
    async def notify(
        message: str, departments: Any = None, groups: Any = None, users: Any = None
    ):
        n_in = NotificationCreate(message=message)
        notification: Notification = await Notification.create(n_in)
        await broadcast.publish(channels.NOTIFICATIONS, notification)


class ReportNotifier:
    """generated report status"""

    @staticmethod
    async def notify(message: str, user: Any = None):
        n_in = NotificationCreate(message=message)
        notification: Notification = await Notification.create(n_in)
        notification.users = [user]
        notification = await notification.save()
        await broadcast.publish(channels.NOTIFICATIONS, notification)
