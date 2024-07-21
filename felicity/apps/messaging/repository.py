from domain.messaging.ports.repository import (
    IMessageThreadRepository,
    IMessageRepository,
)
from felicity.apps.messaging.entities import MessageThread, Message
from felicity.apps.repository.base import BaseRepository


class MessageThreadRepository(BaseRepository[MessageThread], IMessageThreadRepository):
    def __init__(self) -> None:
        self.model = MessageThread
        super().__init__()


class MessageRepository(BaseRepository[Message], IMessageRepository):
    def __init__(self) -> None:
        self.model = Message
        super().__init__()
