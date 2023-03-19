from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, func
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship

from felicity.apps.audit.mixin import AuditableMixin
from felicity.apps.common.hooks import EventHookMixin
from felicity.core.uid_gen import FelicitySAID
from felicity.database.base_class import DBModel


class TrailMixin(object):
    @declared_attr
    def created_at(self):
        return Column(DateTime, default=datetime.utcnow)

    @declared_attr
    def created_by_uid(self):
        return Column(FelicitySAID, ForeignKey("user.uid"), nullable=True)

    @declared_attr
    def created_by(self):
        return relationship("User", foreign_keys=[self.created_by_uid], lazy="selectin")

    @declared_attr
    def updated_at(self):
        return Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @declared_attr
    def updated_by_uid(self):
        return Column(FelicitySAID, ForeignKey("user.uid"), nullable=True)

    @declared_attr
    def updated_by(self):
        return relationship("User", foreign_keys=[self.updated_by_uid], lazy="selectin")


class BaseAuditDBModel(DBModel, TrailMixin):
    """With creator and updater"""

    __abstract__ = True


class Auditable(BaseAuditDBModel, AuditableMixin):
    """With Audit Log"""

    __abstract__ = True


# class EventHooked(BaseAuditDBModel, EventHookMixin):
#     """Listens for All events:  Not working"""
#     __abstract__ = True
