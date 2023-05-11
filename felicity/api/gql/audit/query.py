from typing import List

import strawberry  # noqa
from api.gql.audit.types import AuditLogType
from apps.audit.models import AuditLog



@strawberry.type
class AuditLogQuery:
    @strawberry.field
    async def audit_logs_filter(
        self, info, target_type: str, target_id: str
    ) -> List[AuditLogType]:
        return await AuditLog.get_all(target_type=target_type, target_id=target_id)
