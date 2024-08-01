import datetime
import json
import logging

from sqlalchemy import inspect
from sqlalchemy.orm import class_mapper
from sqlalchemy.orm.attributes import get_history

from apps.iol.meilisearch.handler import MeilisearchSyncHandler
from database.mongo import MongoService, MongoCollection
from felicity.core.events import subscribe

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def custom_serial(o):
    if isinstance(o, (datetime.date, datetime.datetime)):
        return o.isoformat()

    raise TypeError("Type %s not serializable" % type(o))


def get_changes(target) -> dict:
    state_before = {}
    state_after = {}
    inspector = inspect(target)
    attrs = class_mapper(target.__class__).column_attrs

    for attr in attrs:  # noqa
        hist = getattr(inspector.attrs, attr.key).history
        if hist.has_changes():
            if isinstance(get_history(target, attr.key)[2], tuple):
                continue
            state_before[attr.key] = get_history(target, attr.key)[2].pop()
            state_after[attr.key] = getattr(target, attr.key)
        else:
            if attr.key in ["updated_by_uid", "created_by_uid"]:
                state_after[attr.key] = getattr(target, attr.key)
                try:
                    state_before[attr.key] = get_history(target, attr.key)[2].pop()
                except Exception:  # noqa
                    state_before[attr.key] = getattr(target, attr.key)

    if len(state_after.keys()) == 1:
        if "updated_at" in list(state_after.keys()):
            return {}

    return {
        "uid": target.uid,
        "state_before": json.dumps(state_before, default=custom_serial),
        "state_after": json.dumps(state_after, default=custom_serial),
    }


def meilisearch_tracker(action: str, table_name: str, instance):
    logger.info(f"Event fired: {action}:{table_name}")
    data = instance
    if action == "after-update":
        changes = get_changes(instance)
        data = {
            "uid": changes["uid"],
            **changes["state_after"]
        }

    if data:
        MeilisearchSyncHandler().on_event(action, table_name, data)


def auditlog_tracker(action: str, table_name: str, instance):
    logger.info(f"Event fired: {action}:{table_name}")
    if action != "after-update":
        return

    data = get_changes(instance)
    if not data:
        return

    update = {
        **data,
        "user_uid": data["state_after"].get("updated_by_uid", None),
        "target_type": table_name,
        "target_id": instance.uid,
    }
    MongoService().create(MongoCollection.AUDIT_LOG, update)


def init_entity_tracker_events():
    subscribe("entity-tracker", meilisearch_tracker)
    subscribe("entity-tracker", auditlog_tracker)
