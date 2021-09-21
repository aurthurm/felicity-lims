from typing import List
import strawberry

from felicity.apps.audit.models import AuditLog
from felicity.gql.audit.types import AuditLogType


@strawberry.type
class AuditLogQuery:
    @strawberry.field
    async def audit_log_all(self, info) -> List[AuditLogType]:
        return await AuditLog.all()

    @strawberry.field
    async def audit_logs_filter(self, info, target_type: str, target_id: str) -> List[AuditLogType]:
        return await AuditLog.where(target_type=target_type, target_id=target_id)
