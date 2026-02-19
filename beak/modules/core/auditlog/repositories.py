from beak.modules.core.abstract import BaseRepository
from beak.modules.core.auditlog.entities import AuditLog


class AuditLogRepository(BaseRepository[AuditLog]):
    def __init__(self) -> None:
        super().__init__(AuditLog)
