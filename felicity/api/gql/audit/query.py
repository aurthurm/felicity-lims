from typing import List

import strawberry  # noqa

from felicity.api.gql.audit.types import AuditLogType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.apps.auditlog.services import AuditLogService


@strawberry.type
class AuditLogQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def audit_logs_filter(
        self, info, target_type: str, target_id: str
    ) -> List[AuditLogType]:
        return await AuditLogService().get_all(
            target_type=target_type, target_id=target_id
        )
