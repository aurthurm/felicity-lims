import logging

from apps.iol.meilisearch.handler import MeilisearchSyncHandler
from database.mongo import MongoService, MongoCollection
from felicity.core.events import subscribe

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def meilisearch_tracker(action: str, table_name: str, metadata):
    logger.info(f"Event fired: {action}:{table_name}")
    if not metadata:
        return

    if action == "after-update":
        metadata = {
            "uid": metadata["uid"],
            **metadata.get("state_after")
        }

    MeilisearchSyncHandler().on_event(action, table_name, metadata)


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
    await MongoService().create(MongoCollection.AUDIT_LOG, update)


def init_entity_tracker_events():
    subscribe("entity-tracker", meilisearch_tracker)
    subscribe("entity-tracker", auditlog_tracker)
