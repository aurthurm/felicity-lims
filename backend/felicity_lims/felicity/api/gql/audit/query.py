from typing import List

import strawberry  # noqa

from felicity.api.gql.audit.types import AuditLogType
from felicity.apps.audit.models import AuditLog
from felicity.core.uid_gen import FelicityID


@strawberry.type
class AuditLogQuery:
    @strawberry.field
    async def audit_logs_filter(
        self, info, target_type: str, target_id: FelicityID
    ) -> List[AuditLogType]:
        return await AuditLog.get_all(target_type=target_type, target_id=target_id)
