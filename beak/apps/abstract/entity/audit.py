from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship


class Auditable:
    """Track simple action events by user

    Note: A table called User is required
    """

    __abstract__ = True

    # Track Creation Audits
    @declared_attr
    def created_at(self):
        return Column(DateTime, default=datetime.now)

    @declared_attr
    def created_by_uid(cls):
        return Column(
            String,
            ForeignKey("user.uid", name=f"fk_{cls.__tablename__}_created_by"),
            nullable=True,
        )

    @declared_attr
    def created_by(cls):
        return relationship("User", foreign_keys=[cls.created_by_uid], lazy="selectin")

    # Track Updating Audits
    @declared_attr
    def updated_at(self):
        return Column(DateTime, default=datetime.now, onupdate=datetime.now)

    @declared_attr
    def updated_by_uid(cls):
        return Column(
            String,
            ForeignKey("user.uid", name=f"fk_{cls.__tablename__}_updated_by"),
            nullable=True,
        )

    @declared_attr
    def updated_by(cls):
        return relationship("User", foreign_keys=[cls.updated_by_uid], lazy="selectin")
