from beak.apps.abstract.repository import BaseRepository
from beak.apps.noticeboard.entities import Notice


class NoticeRepository(BaseRepository[Notice]):
    def __init__(self) -> None:
        super().__init__(Notice)
