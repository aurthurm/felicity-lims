from domain.errlog.ports.repository import IErrorLogRepository
from domain.errlog.ports.service import IErrorLogService
from domain.errlog.schemas import ErrorLog
from domain.shared.services import BaseService


class ErrorLogService(BaseService[ErrorLog], IErrorLogService):
    def __int__(self, repository: IErrorLogRepository):
        self.repository = repository
