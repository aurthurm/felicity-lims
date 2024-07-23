from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship

from felicity.apps.auditlog.mixin import AuditHistoryMixin
from felicity.apps.abstract.entity import BaseEntity


class TrailMixin(object):
    @declared_attr
    def created_at(self):
        return Column(DateTime, default=datetime.now)

    @declared_attr
    def created_by_uid(self):
        return Column(String, ForeignKey("user.uid"), nullable=True)

    @declared_attr
    def created_by(self):
        return relationship("User", foreign_keys=[self.created_by_uid], lazy="selectin")

    @declared_attr
    def updated_at(self):
        return Column(DateTime, default=datetime.now, onupdate=datetime.now)

    @declared_attr
    def updated_by_uid(self):
        return Column(String, ForeignKey("user.uid"), nullable=True)

    @declared_attr
    def updated_by(self):
        return relationship("User", foreign_keys=[self.updated_by_uid], lazy="selectin")


class AuditUser(BaseEntity, TrailMixin):
    """Track Actioners: creator and updater"""

    __abstract__ = True


class AuditHistory(AuditUser, AuditHistoryMixin):
    """Track Model History -> Audit Log"""

    __abstract__ = True
