import logging

from felicity.apps.iol.meilisearch.handler import MeilisearchSyncHandler
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


def init_entity_tracker_events():
    subscribe("entity-tracker", meilisearch_tracker)
