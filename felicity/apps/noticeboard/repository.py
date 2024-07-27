from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.noticeboard.entities import Notice


class NoticeRepository(BaseRepository[Notice]):
    def __init__(self) -> None:
        super().__init__(Notice)
