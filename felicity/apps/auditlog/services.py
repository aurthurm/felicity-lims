from felicity.apps.abstract import BaseService
from felicity.apps.abstract.service import E
from felicity.apps.auditlog.entities import AuditLog
from felicity.apps.auditlog.repositories import AuditLogRepository
from felicity.apps.common.schemas.dummy import Dummy


class AuditLogService(BaseService[AuditLog, Dummy, Dummy]):
    def __init__(self) -> None:
        super().__init__(AuditLogRepository)

    async def create(self, c) -> E:
        c["state_after"] = str(c["state_after"])
        c["state_before"] = str(c["state_before"])
        return await super().create(c)
