import logging
from sqlalchemy import Column, String, ForeignKey, Boolean, Table
from sqlalchemy.orm import relationship

from . import schemas
from felicity.apps import BaseAuditDBModel, DBModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

"""
 Many to Many Link between Users (views) and Message
"""
message_view = Table('message_view', DBModel.metadata,
                     Column("message_uid", ForeignKey('message.uid'), primary_key=True),
                     Column("user_uid", ForeignKey('user.uid'), primary_key=True)
                     )

"""
 Many to Many Link between Users (recipients)  and Message
"""
message_recipient = Table('message_recipient', DBModel.metadata,
                          Column("message_uid", ForeignKey('message.uid'), primary_key=True),
                          Column("user_uid", ForeignKey('user.uid'), primary_key=True)
                          )

"""
 Many to Many Link between Users (deletions) and Message
"""
message_delete = Table('message_delete', DBModel.metadata,
                       Column("message_uid", ForeignKey('message.uid'), primary_key=True),
                       Column("user_uid", ForeignKey('user.uid'), primary_key=True)
                       )


class Message(BaseAuditDBModel):
    """Message"""
    recipients = relationship('User', secondary=message_recipient, lazy="selectin")
    subject = Column(String, nullable=False)
    body = Column(String, nullable=False)
    viewers = relationship('User', secondary=message_view, lazy="selectin")
    deleted_by = relationship('User', secondary=message_delete, lazy="selectin")
    # Messages where recipient > 1 are broadcast messages and have no replies
    broadcast = Column(Boolean, nullable=False)

    @classmethod
    async def create(cls, obj_in: schemas.MessageCreate) -> schemas.Message:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.MessageUpdate) -> schemas.Message:
        data = self._import(obj_in)
        return await super().update(**data)

    async def update_broadcast(self) -> schemas.Message:
        if len(self.recipients) > 1:
            self.broadcast = True
            return await self.save()
        return self

    async def can_reply(self) -> bool:
        return self.broadcast
