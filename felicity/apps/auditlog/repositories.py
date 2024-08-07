from felicity.apps.abstract import BaseRepository
from felicity.apps.auditlog.entities import AuditLog


class AuditLogRepository(BaseRepository[AuditLog]):
    def __init__(self) -> None:
        super().__init__(AuditLog)
