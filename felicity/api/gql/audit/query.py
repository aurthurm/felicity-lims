from typing import List

import strawberry  # noqa

from felicity.api.gql.audit.types import AuditLogType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.apps.auditlog.services import AuditLogService
from felicity.core.config import settings
from felicity.database.mongo import MongoService, MongoCollection


@strawberry.type
class AuditLogQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def audit_logs_filter(
        self, info, target_type: str, target_uid: str
    ) -> List[AuditLogType] | None:
        filters = {"target_type": target_type, "target_uid": target_uid}
        if settings.DOCUMENT_STORAGE:
            documents = await MongoService().search(
                MongoCollection.AUDIT_LOG, filters=filters
            )

            def _log(doc: dict) -> AuditLogType:
                doc["uid"] = doc["_id"]
                del doc["_id"]
                return AuditLogType(**doc)

            return [_log(doc) for doc in documents] if documents else None
        else:
            return await AuditLogService().get_all(**filters)
