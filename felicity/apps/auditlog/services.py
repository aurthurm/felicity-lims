from felicity.apps.abstract import BaseService
from felicity.apps.auditlog.entities import AuditLog
from felicity.apps.auditlog.repositories import AuditLogRepository


class AuditLogService(BaseService[AuditLog]):
    def __init__(self) -> None:
        super().__init__(AuditLogRepository)
