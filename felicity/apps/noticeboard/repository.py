from felicity.apps.noticeboard.entities import Notice
from felicity.database.repository import BaseRepository


class NoticeRepository(BaseRepository[Notice]):
    def __init__(self) -> None:
        super().__init__(Notice)
