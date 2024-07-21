from domain.shared.ports.repository import IBaseRepository

from infrastructure.database.repository.base import BaseRepository

from infrastructure.database.audit.entities import AuditLog


class AuditLogRepository(BaseRepository[AuditLog], IBaseRepository):
    def __init__(self) -> None:
        self.model = AuditLog
        super().__init__()
