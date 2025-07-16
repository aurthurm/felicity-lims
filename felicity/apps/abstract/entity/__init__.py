from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship

from .audit import Auditable
from .base import Base
from .listenable import EventListenable


class BaseEntity(Base, Auditable, EventListenable):
    __abstract__ = True


class LabScopedEntity(BaseEntity):
    """Base entity for models that are scoped to a specific laboratory"""
    __abstract__ = True

    @declared_attr
    def laboratory_uid(self):
        return Column(String, ForeignKey("laboratory.uid"), nullable=False, index=True)

    @declared_attr
    def laboratory(self):
        return relationship("Laboratory", foreign_keys=[self.laboratory_uid], lazy="selectin")
