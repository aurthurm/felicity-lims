import logging

from sqlalchemy import event

from felicity.apps.common.hooks.audit import AuditHook, conf

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EventHookMixin:
    """Event Monitor"""

    @classmethod
    def __declare_last__(cls):
        logger.info("inside __declare_last__ EventHookMixin")
        event.listens_for(cls, "after_insert", cls.run_insert_events)
        event.listens_for(cls, "after_delete", cls.run_delete_events)
        event.listens_for(cls, "after_update", cls.run_update_events)

    @staticmethod
    def run_insert_events(mapper, connection, target):
        logger.info("run_insert_events")
        if conf.hooks.events.CREATE in conf.hooks.PLEASE_AUDIT:
            AuditHook.audit_insert(mapper, connection, target)

    @staticmethod
    def run_update_events(mapper, connection, target):
        logger.info("run_update_events")
        if conf.hooks.events.UPDATE in conf.hooks.PLEASE_AUDIT:
            AuditHook.audit_update(mapper, connection, target)

    @staticmethod
    def run_delete_events(mapper, connection, target):
        logger.info("run_delete_events")
        if conf.hooks.events.DELETE in conf.hooks.PLEASE_AUDIT:
            AuditHook.audit_delete(mapper, connection, target)
