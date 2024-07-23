from felicity.apps.messaging.entities import MessageThread, Message
from felicity.apps.abstract.repository import BaseRepository



class MessageThreadRepository(BaseRepository[MessageThread]):
    def __init__(self) -> None:
        super().__init__(MessageThread)


class MessageRepository(BaseRepository[Message]):
    def __init__(self) -> None:
        super().__init__(Message)
