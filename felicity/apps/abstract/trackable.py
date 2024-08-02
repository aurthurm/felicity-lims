import logging

from sqlalchemy import event, inspect
from sqlalchemy.orm import class_mapper
from sqlalchemy.orm.attributes import get_history

from felicity.apps.common.utils.serializer import marshaller
from felicity.core.events import post_event

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TrackableEntity:
    """Allow a model to be automatically tracked"""

    @staticmethod
    def put_out(action, table_name, metadata):
        """"handle an event that something has happened"""
        post_event(
            event_type="entity-tracker",
            action=action,
            table_name=table_name,
            metadata=metadata
        )

    @classmethod
    def __declare_last__(cls):
        logger.debug("trigger")
        event.listens_for(cls, "after_insert", cls.handle_insert)
        event.listen(cls, "after_update", cls.handle_update)
        event.listen(cls, "after_delete", cls.handle_delete)

    @staticmethod
    def handle_insert(mapper, connection, target):
        target.put_out("after-insert", target.__tablename__, marshaller(target))

    @staticmethod
    def handle_delete(mapper, connection, target):
        target.put_out("after-delete", target.__tablename__, marshaller(target))

    @staticmethod
    def handle_update(mapper, connection, target):
        target.put_out("after-update", target.__tablename__, target.get_changes(target))

    @staticmethod
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
            "state_before": state_before,
            "state_after": state_after
        }
