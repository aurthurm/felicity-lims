from felicity.apps.abstract import BaseRepository
from felicity.apps.app.entities import APPActivityLog


class APPActivityLogRepository(BaseRepository[APPActivityLog]):
    def __init__(self) -> None:
        super().__init__(APPActivityLog)
