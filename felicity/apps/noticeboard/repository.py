from domain.noticeboard.ports.repository import INoticeRepository

from felicity.apps.repository.base import BaseRepository

from felicity.apps.noticeboard.entities import Notice


class NoticeRepository(BaseRepository[Notice], INoticeRepository):
    def __init__(self) -> None:
        self.model = Notice
        super().__init__()
