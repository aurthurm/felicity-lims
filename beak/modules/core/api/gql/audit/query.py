from typing import List

import strawberry  # noqa

from beak.modules.core.api.gql.audit.types import AuditLogType
from beak.modules.shared.api.gql.permissions import IsAuthenticated
from beak.modules.core.auditlog.services import AuditLogService
from beak.core.config import settings
from beak.modules.shared.infrastructure import resolve_storage_scope
from beak.modules.shared.infrastructure.mongo import MongoService, MongoCollection


@strawberry.type
class AuditLogQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def audit_logs_filter(
        self, info, target_type: str, target_uid: str
    ) -> List[AuditLogType] | None:
        filters = {"target_type": target_type, "target_uid": target_uid}
        if settings.DOCUMENT_STORAGE:
            documents = await MongoService().search(
                MongoCollection.AUDIT_LOG,
                filters=filters,
                scope=resolve_storage_scope(require_tenant=True),
            )

            def _log(doc: dict) -> AuditLogType:
                doc["uid"] = doc["_id"]
                del doc["_id"]
                return AuditLogType(**doc)

            return [_log(doc) for doc in documents] if documents else None
        else:
            return await AuditLogService().get_all(**filters)
