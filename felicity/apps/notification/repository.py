from domain.notification.ports.repository import (
    IActivityFeedRepository,
    IActivityStreamRepository,
    INotificationRepository,
)

from felicity.apps.repository.base import BaseRepository

from felicity.apps.notification.entities import (
    ActivityFeed,
    ActivityStream,
    Notification,
)


class ActivityFeedRepository(BaseRepository[ActivityFeed], IActivityFeedRepository):
    def __init__(self) -> None:
        self.model = ActivityFeed
        super().__init__()


class ActivityStreamRepository(
    BaseRepository[ActivityStream], IActivityStreamRepository
):
    def __init__(self) -> None:
        self.model = ActivityStream
        super().__init__()


class NotificationRepository(BaseRepository[Notification], INotificationRepository):
    def __init__(self) -> None:
        self.model = Notification
        super().__init__()
