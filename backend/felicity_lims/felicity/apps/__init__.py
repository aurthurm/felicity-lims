from datetime import datetime
from typing import Optional
from pydantic import BaseModel

from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from felicity.apps.core.hooks import EventHookMixin
from felicity.database.base_class import DBModel
from felicity.apps.user.models import User
from felicity.apps.user.schemas import User as UserSchema
from felicity.apps.audit.mixin import AuditableMixin


class TrailMixin(object):
    @declared_attr
    def created_at(self):
        return Column(DateTime, default=datetime.utcnow)

    @declared_attr
    def created_by_uid(self):
        return Column(Integer, ForeignKey('user.uid'), nullable=True)

    @declared_attr
    def created_by(self):
        return relationship(User, foreign_keys=[self.created_by_uid], lazy='selectin')

    @declared_attr
    def updated_at(self):
        return Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @declared_attr
    def updated_by_uid(self):
        return Column(Integer, ForeignKey('user.uid'), nullable=True)

    @declared_attr
    def updated_by(self):
        return relationship(User, foreign_keys=[self.updated_by_uid], lazy='selectin')


class BaseAuditDBModel(DBModel, TrailMixin):
    """With creator and updater"""
    __abstract__ = True


class Auditable(BaseAuditDBModel, AuditableMixin):
    """With Audit Log"""
    __abstract__ = True


# class EventHooked(BaseAuditDBModel, EventHookMixin):
#     """Listens for All events:  Not working"""
#     __abstract__ = True


# Pydantic
class BaseAuditModel(BaseModel):
    created_at: Optional[datetime] = None
    created_by_uid: Optional[int] = None
    created_by: Optional[UserSchema] = None
    updated_at: Optional[datetime] = None
    updated_by_uid: Optional[int] = None
    updated_by: Optional[UserSchema] = None
