import logging

from felicity.apps.auditlog.services import AuditLogService
from felicity.core.config import settings
from felicity.core.events import subscribe
from felicity.database.mongo import MongoService, MongoCollection

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def auditlog_tracker(action: str, table_name: str, metadata):
    logger.info(f"Event fired: {action}:{table_name}")
    if action != "after-update" and not metadata:
        return

    update = {
        **metadata,
        "user_uid": metadata["state_after"].get("updated_by_uid", None),
        "target_type": table_name,
        "target_uid": metadata.get("uid"),
    }

    if settings.DOCUMENT_STORAGE:
        await MongoService().create(MongoCollection.AUDIT_LOG, update)
    else:
        await AuditLogService().create(update)


def init_auditlog_listener_events():
    subscribe("entity-tracker", auditlog_tracker)
