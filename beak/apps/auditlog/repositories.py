from beak.apps.abstract import BaseRepository
from beak.apps.auditlog.entities import AuditLog


class AuditLogRepository(BaseRepository[AuditLog]):
    def __init__(self) -> None:
        super().__init__(AuditLog)
