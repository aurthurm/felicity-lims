from beak.modules.core.abstract import BaseService
from beak.modules.core.abstract.service import E
from beak.modules.core.auditlog.entities import AuditLog
from beak.modules.core.auditlog.repositories import AuditLogRepository
from beak.modules.core.common.schemas.dummy import Dummy
from beak.modules.core.common.utils.serializer import marshaller


class AuditLogService(BaseService[AuditLog, Dummy, Dummy]):
    def __init__(self) -> None:
        super().__init__(AuditLogRepository())

    async def create(self, c, related: list[str] | None = None) -> E:
        c = marshaller(c)
        return await super().create(c=c, related=related)
