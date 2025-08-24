import logging
from typing import Any, Dict, Type, Tuple

from sqlalchemy import event, inspect
from sqlalchemy.orm import class_mapper
from sqlalchemy.orm.attributes import get_history

from felicity.apps.common.utils.serializer import marshaller
from felicity.core.events import post_event
from felicity.core.tenant_context import get_tenant_context

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EventListenable:
    """Listen to events on model"""

    __abstract__ = True

    @staticmethod
    def put_out(action: str, table_name: str, metadata: Dict[str, Any]) -> None:
        """Handle an event that something has happened"""
        logger.debug(f"Putting out event: {action} for table {table_name}")
        post_event(
            event_type="entity-tracker",
            action=action,
            table_name=table_name,
            metadata=metadata,
        )

    @classmethod
    def __declare_last__(cls: Type["EventListenable"]) -> None:
        logger.debug(f"Setting up event listeners for {cls.__name__}")
        event.listens_for(cls, "after_insert", cls.handle_insert)
        event.listen(cls, "after_update", cls.handle_update)
        event.listen(cls, "after_delete", cls.handle_delete)

    @staticmethod
    def handle_insert(mapper: Any, connection: Any, target: "EventListenable") -> None:
        logger.debug(f'Handling insert for {getattr(target, "__class__").__name__}')
        target.put_out(
            "after-insert", getattr(target, "__tablename__"), marshaller(target)
        )

    @staticmethod
    def handle_delete(mapper: Any, connection: Any, target: "EventListenable") -> None:
        logger.debug(f'Handling delete for {getattr(target, "__class__").__name__}')
        target.put_out(
            "after-delete", getattr(target, "__tablename__"), marshaller(target)
        )

    @staticmethod
    def handle_update(mapper: Any, connection: Any, target: "EventListenable") -> None:
        logger.debug(f'Handling update for {getattr(target, "__class__").__name__}')
        has_changes, metadata = target.get_changes(target)
        if has_changes:
            target.put_out("after-update", getattr(target, "__tablename__"), metadata)

    @staticmethod
    def get_changes(target: "EventListenable") -> Tuple[bool, Dict[str, Any]]:
        logger.info(f'Getting changes for {getattr(target, "__class__").__name__}')
        state_before: Dict[str, Any] = {}
        state_after: Dict[str, Any] = {}
        inspector = inspect(target)
        attrs = class_mapper(getattr(target, "__class__")).column_attrs

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
                        logger.debug(f"No history for {attr.key}, using current value")
                        state_before[attr.key] = getattr(target, attr.key)

        if state_after:
            to_delete = [
                key
                for key in state_after.keys()
                if state_after[key] == state_before[key]
            ]

            for _key in to_delete:
                del state_after[_key]
                del state_before[_key]

        if len(state_after) == 1 and "updated_at" in state_after:
            logger.info("Only updated_at changed, returning empty dict")
            return False, {}

        extras = {}
        tenant_context = get_tenant_context()
        if tenant_context is not None:
            extras["user_uid"] = tenant_context.user_uid
            extras["laboratory_uid"] = tenant_context.laboratory_uid
            extras["ip_address"] = tenant_context.ip_address
            extras["user_agent"] = tenant_context.user_agent
            extras["request_id"] = tenant_context.request_id

        return True, {
            "uid": getattr(target, "uid"),
            "state_before": state_before,
            "state_after": state_after,
            "extras": extras
        }
