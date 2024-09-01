import logging

from felicity.core.events import subscribe

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def change_tracker(action: str, table_name: str, metadata):
    logger.info(f"Event fired: {action}:{table_name}")
    if not metadata:
        return

    if action == "after-update":
        metadata = {
            "uid": metadata["uid"],
            **metadata.get("state_after")
        }

    # SomeHandler().on_event(action, table_name, metadata)


def init_entity_tracker_events():
    subscribe("entity-tracker", change_tracker)
