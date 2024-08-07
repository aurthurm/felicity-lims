from felicity.apps.abstract import BaseService
from felicity.apps.auditlog.entities import AuditLog
from felicity.apps.auditlog.repositories import AuditLogRepository
from felicity.apps.common.schemas.dummy import Dummy


class AuditLogService(BaseService[AuditLog, Dummy, Dummy]):
    def __init__(self) -> None:
        super().__init__(AuditLogRepository)
