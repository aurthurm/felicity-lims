from beak.modules.core.abstract.repository import BaseRepository
from beak.modules.core.noticeboard.entities import Notice


class NoticeRepository(BaseRepository[Notice]):
    def __init__(self) -> None:
        super().__init__(Notice)
