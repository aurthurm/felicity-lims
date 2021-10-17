from typing import List
import strawberry

from felicity.apps.audit.models import AuditLog
from felicity.gql.audit.types import AuditLogType


@strawberry.type
class AuditLogQuery:
    @strawberry.field
    async def audit_logs_filter(self, info, target_type: str, target_id: int) -> List[AuditLogType]:
        return await AuditLog.get_all(target_type=target_type, target_id=target_id)
