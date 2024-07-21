from domain.noticeboard.ports.repository import INoticeRepository

from infrastructure.database.repository.base import BaseRepository

from infrastructure.database.noticeboard.entities import Notice


class NoticeRepository(BaseRepository[Notice], INoticeRepository):
    def __init__(self) -> None:
        self.model = Notice
        super().__init__()
