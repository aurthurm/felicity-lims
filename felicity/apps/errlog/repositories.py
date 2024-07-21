from felicity.apps.errlog.entities import ErrorLog
from felicity.database.repository import BaseRepository


class ErrorLogRepository(BaseRepository[ErrorLog]):
    def __init__(self) -> None:
        super().__init__(ErrorLog)
