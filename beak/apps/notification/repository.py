from beak.apps.abstract.repository import BaseRepository
from beak.apps.notification.entities import (
    ActivityFeed,
    ActivityStream,
    Notification,
)


class ActivityFeedRepository(BaseRepository[ActivityFeed]):
    def __init__(self) -> None:
        super().__init__(ActivityFeed)


class ActivityStreamRepository(BaseRepository[ActivityStream]):
    def __init__(self) -> None:
        super().__init__(ActivityStream)


class NotificationRepository(BaseRepository[Notification]):
    def __init__(self) -> None:
        super().__init__(Notification)
