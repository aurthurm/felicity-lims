from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.errlog.entities import ErrorLog


class ErrorLogRepository(BaseRepository[ErrorLog]):
    def __init__(self) -> None:
        super().__init__(ErrorLog)
