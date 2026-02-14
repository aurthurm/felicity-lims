from beak.apps.abstract import BaseService
from beak.apps.abstract.service import E
from beak.apps.auditlog.entities import AuditLog
from beak.apps.auditlog.repositories import AuditLogRepository
from beak.apps.common.schemas.dummy import Dummy
from beak.apps.common.utils.serializer import marshaller


class AuditLogService(BaseService[AuditLog, Dummy, Dummy]):
    def __init__(self) -> None:
        super().__init__(AuditLogRepository())

    async def create(self, c, related: list[str] | None = None) -> E:
        c = marshaller(c)
        return await super().create(c=c, related=related)
