import datetime
import json
import logging

from apps.audit.models import AuditLog
from sqlalchemy import event, inspect
from sqlalchemy.orm import class_mapper
from sqlalchemy.orm.attributes import get_history

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ACTION_CREATE = 1
ACTION_UPDATE = 2
ACTION_DELETE = 3

# Only audit the events in this list
PLEASE_AUDIT = [ACTION_UPDATE]


def custom_serial(o):
    if isinstance(o, (datetime.date, datetime.datetime)):
        return o.isoformat()

    raise TypeError("Type %s not serializable" % type(o))


class AuditableMixin:
    """Allow a model to be automatically audited"""

    @staticmethod
    def create_audit(connection, object_type, object_id, action, **kwargs):
        audit = AuditLog(
            object_type,
            object_id,
            action,
            kwargs.get("state_before"),
            kwargs.get("state_after"),
        )

        audit.save(connection)

    @classmethod
    def __declare_last__(cls):
        logger.debug("trigger")
        if ACTION_CREATE in PLEASE_AUDIT:
            event.listens_for(cls, "after_insert", cls.audit_insert)

        if ACTION_DELETE in PLEASE_AUDIT:
            event.listen(cls, "after_delete", cls.audit_delete)

        if ACTION_UPDATE in PLEASE_AUDIT:
            event.listen(cls, "after_update", cls.audit_update)

    @staticmethod
    def audit_insert(mapper, connection, target):
        """Listen for the `after_insert` event and create an AuditLog entry"""
        target.create_audit(connection, target.__tablename__, target.uid, ACTION_CREATE)

    @staticmethod
    def audit_delete(mapper, connection, target):
        """Listen for the `after_delete` event and create an AuditLog entry"""
        target.create_audit(connection, target.__tablename__, target.uid, ACTION_DELETE)

    @staticmethod
    def audit_update(mapper, connection, target):
        """Listen for the `after_update` event and create an AuditLog entry with before and after state changes"""
        state_before = {}
        state_after = {}
        inspector = inspect(target)
        attrs = class_mapper(target.__class__).column_attrs

        for attr in attrs:
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
                    except Exception:
                        state_before[attr.key] = getattr(target, attr.key)

        if len(state_after.keys()) == 1:
            if "updated_at" in list(state_after.keys()):
                return

        target.create_audit(
            connection,
            target.__tablename__,
            target.uid,
            ACTION_UPDATE,
            state_before=json.dumps(state_before, default=custom_serial),
            state_after=json.dumps(state_after, default=custom_serial),
        )
