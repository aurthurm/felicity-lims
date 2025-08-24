from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import JSONB

from felicity.apps.abstract.entity import BaseEntity


class AuditLog(BaseEntity):
    """Model an audit log of user actions"""

    __tablename__ = "audit_log"

    user_uid = Column(String, doc="The UID of the user who made the change")
    target_type = Column(
        String(100), nullable=False, doc="The table name of the altered object"
    )
    target_uid = Column(String, doc="The UID of the altered object")
    action = Column(Integer, doc="Create (1), update (2), or delete (3)")
    state_before = Column(
        JSONB,
        doc="Stores a JSON representation of a dict containing the altered "
            "column names and original values",
    )
    state_after = Column(
        JSONB,
        doc="Stores a JSON representation of a dict containing the altered "
            "column names and new values",
    )
    extras = Column(
        JSONB,
        doc="Stores a JSON representation of a dict containing extra metadata",
    )

    def __repr__(self):
        return "<AuditLog %r: %r -> %r>" % (
            self.user_uid,
            self.target_type,
            self.action,
        )
