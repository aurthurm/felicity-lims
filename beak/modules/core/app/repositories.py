from beak.modules.core.abstract import BaseRepository
from beak.modules.core.app.entities import APPActivityLog


class APPActivityLogRepository(BaseRepository[APPActivityLog]):
    def __init__(self) -> None:
        super().__init__(APPActivityLog)
