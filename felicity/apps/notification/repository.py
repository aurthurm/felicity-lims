
from felicity.apps.notification.entities import (
    ActivityFeed,
    ActivityStream,
    Notification,
)
from felicity.apps.abstract.repository import BaseRepository


class ActivityFeedRepository(BaseRepository[ActivityFeed]):
    def __init__(self) -> None:
        super().__init__(ActivityFeed)


class ActivityStreamRepository(
    BaseRepository[ActivityStream]
):
    def __init__(self) -> None:
        super().__init__(ActivityStream)


class NotificationRepository(BaseRepository[Notification]):
    def __init__(self) -> None:
        super().__init__(Notification)
