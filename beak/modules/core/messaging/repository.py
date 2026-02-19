from beak.modules.core.abstract.repository import BaseRepository
from beak.modules.core.messaging.entities import Message, MessageThread


class MessageThreadRepository(BaseRepository[MessageThread]):
    def __init__(self) -> None:
        super().__init__(MessageThread)


class MessageRepository(BaseRepository[Message]):
    def __init__(self) -> None:
        super().__init__(Message)
