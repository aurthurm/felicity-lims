from domain.errlog.ports.repository import IErrorLogRepository

from infrastructure.database.repository.base import BaseRepository

from infrastructure.database.errlog.entities import ErrorLog


class ErrorLogRepository(BaseRepository[ErrorLog], IErrorLogRepository):
    def __init__(self) -> None:
        self.model = ErrorLog
        super().__init__()
