from felicity.apps.errlog.entities import ErrorLog
from felicity.apps.abstract.repository import BaseRepository


class ErrorLogRepository(BaseRepository[ErrorLog]):
    def __init__(self) -> None:
        super().__init__(ErrorLog)
