from felicity.apps.abstract.service import BaseService
from felicity.apps.errlog.entities import ErrorLog
from felicity.apps.errlog.repositories import ErrorLogRepository
from felicity.apps.errlog.schemas import ErrorLogCreate, ErrorLogUpdate


class ErrorLogService(BaseService[ErrorLog, ErrorLogCreate, ErrorLogUpdate]):
    def __int__(self):
        super().__init__(ErrorLogRepository)
