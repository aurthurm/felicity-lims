from sqlalchemy import Boolean, Column, ForeignKey, String, Table
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity, BaseMPTT

"""
 Many to Many Link between Users (recipients)  and MessageThread
"""
message_thread_recipient = Table(
    "message_thread_recipient",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("message_thread_uid", ForeignKey("message_thread.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)

"""
 Many to Many Link between Users (deletions)  and MessageThread
"""
message_thread_delete = Table(
    "message_thread_delete",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("message_thread_uid", ForeignKey("message_thread.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)


class MessageThread(LabScopedEntity):
    """MessageThread"""

    __tablename__ = "message_thread"

    broadcast = Column(Boolean, nullable=False)
    messages = relationship("Message", back_populates="thread", lazy="selectin")
    recipients = relationship(
        "User", secondary=message_thread_recipient, lazy="selectin"
    )
    deleted_by = relationship("User", secondary=message_thread_delete, lazy="selectin")


"""
 Many to Many Link between Users (views) and Message
"""
message_view = Table(
    "message_view",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("message_uid", ForeignKey("message.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)

"""
 Many to Many Link between Users (deletions) and Message
"""
message_delete = Table(
    "message_delete",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("message_uid", ForeignKey("message.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)


class Message(LabScopedEntity, BaseMPTT):
    """Message"""

    __tablename__ = "message"

    thread_uid = Column(String, ForeignKey("message_thread.uid"), nullable=True),
    thread = relationship("MessageThread", back_populates="messages", lazy="selectin")
    body = Column(String, nullable=False)
    viewers = relationship("User", secondary=message_view, lazy="selectin")
    deleted_by = relationship("User", secondary=message_delete, lazy="selectin")
