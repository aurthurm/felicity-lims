from typing import List

import strawberry  # noqa

from database.mongo import MongoService, MongoCollection
from felicity.api.gql.audit.types import AuditLogType
from felicity.api.gql.permissions import IsAuthenticated


@strawberry.type
class AuditLogQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def audit_logs_filter(
            self, info, target_type: str, target_uid: str
    ) -> List[AuditLogType] | None:
        documents = await MongoService().search(
            MongoCollection.AUDIT_LOG,
            filters={
                "target_type": target_type,
                "target_uid": target_uid
            }
        )

        def _log(doc: dict) -> AuditLogType:
            print(type(doc))
            doc["uid"] = doc["_id"]
            del doc["_id"]
            return AuditLogType(**doc)

        return [_log(doc) for doc in documents] if documents else None
