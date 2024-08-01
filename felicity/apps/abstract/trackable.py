import logging

from sqlalchemy import event

from felicity.core.events import post_event

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TrackableEntity:
    """Allow a model to be automatically tracked"""

    @staticmethod
    def put_out(action, table_name, target):
        """"handle an event that something has happened"""
        post_event(
            event_type="entity-tracker",
            action=action,
            table_name=table_name,
            instance=target
        )

    @classmethod
    def __declare_last__(cls):
        logger.debug("trigger")
        event.listens_for(cls, "after_insert", cls.handle_insert)
        event.listen(cls, "after_update", cls.handle_update)
        event.listen(cls, "after_delete", cls.handle_delete)

    @staticmethod
    def handle_insert(mapper, connection, target):
        target.put_out("after-insert", target.__tablename__, target)

    @staticmethod
    def handle_delete(mapper, connection, target):
        target.put_out("after-delete", target.__tablename__, target)

    @staticmethod
    def handle_update(mapper, connection, target):
        target.put_out("after-update", target.__tablename__, target)
