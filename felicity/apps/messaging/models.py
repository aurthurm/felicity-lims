import logging

from sqlalchemy import Boolean, Column, ForeignKey, String, Table
from sqlalchemy.orm import relationship

from apps import BaseAuditDBModel, DBModel
from apps.common import BaseMPTT
from apps.user.models import User
from . import schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

"""
 Many to Many Link between Users (recipients)  and MessageThread
"""
message_thread_recipient = Table(
    "message_thread_recipient",
    DBModel.metadata,
    Column("message_thread_uid", ForeignKey("message_thread.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)

"""
 Many to Many Link between Users (deletions)  and MessageThread
"""
message_thread_delete = Table(
    "message_thread_delete",
    DBModel.metadata,
    Column("message_thread_uid", ForeignKey("message_thread.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)


class MessageThread(BaseAuditDBModel):
    """MessageThread"""

    __tablename__ = "message_thread"

    broadcast = Column(Boolean, nullable=False)
    messages = relationship("Message", back_populates="thread", lazy="selectin")
    recipients = relationship(
        "User", secondary=message_thread_recipient, lazy="selectin"
    )
    deleted_by = relationship("User", secondary=message_thread_delete, lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.MessageThreadCreate) -> schemas.MessageThread:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
            self, obj_in: schemas.MessageThreadUpdate
    ) -> schemas.MessageThread:
        data = self._import(obj_in)
        return await super().update(**data)

    async def get_last_message(self):
        if not self.messages:
            return None
        return sorted(self.messages, key=lambda x: x.created_at)[0]

    async def can_reply(self) -> bool:
        return self.broadcast is True

    async def add_recipient(self, user: User) -> schemas.MessageThread:
        if user not in self.recipients:
            self.recipients.append(user)
            return await self.save()
        return self

    async def add_deletion(self, user: User) -> schemas.MessageThread:
        if user not in self.deleted_by:
            self.deleted_by.append(user)
            return await self.save()
        return self

    async def delete_for_user(self, user: User) -> schemas.MessageThread:
        uid = self.uid
        # first delete all messages for user
        for message in self.messages:
            if user not in message.deleted_by:
                await message.add_deletion(user)
        # delete thread for user
        await self.add_deletion(user)

        # if all thread recipients have deleted the thread
        if self.all_have_deleted():
            # permanently delete all messages in thread
            for message in self.messages:
                await message.delete()
            # then finally delete the thread permanently
            self.delete()

        return uid

    async def all_have_deleted(self) -> bool:
        deletions = 0
        for recipient in self.recipients:
            if recipient in self.deleted_by:
                deletions += 1
        return len(self.recipients) == deletions


"""
 Many to Many Link between Users (views) and Message
"""
message_view = Table(
    "message_view",
    DBModel.metadata,
    Column("message_uid", ForeignKey("message.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)

"""
 Many to Many Link between Users (deletions) and Message
"""
message_delete = Table(
    "message_delete",
    DBModel.metadata,
    Column("message_uid", ForeignKey("message.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)


class Message(BaseAuditDBModel, BaseMPTT):
    """Message"""

    __tablename__ = "message"

    thread_uid = Column(String, ForeignKey("message_thread.uid"), nullable=True)
    thread = relationship("MessageThread", back_populates="messages", lazy="selectin")
    body = Column(String, nullable=False)
    viewers = relationship("User", secondary=message_view, lazy="selectin")
    deleted_by = relationship("User", secondary=message_delete, lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.MessageCreate) -> schemas.Message:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.MessageUpdate) -> schemas.Message:
        data = self._import(obj_in)
        return await super().update(**data)

    async def add_deletion(self, user: User) -> schemas.Message:
        if user not in self.deleted_by:
            self.deleted_by.append(user)
            return await self.save()
        return self

    async def delete_for_user(self, user: User) -> int:
        uid = self.uid
        await self.add_deletion(user)

        # if all thread recipients have deleted the message
        if self.all_have_deleted():
            # delete the message permanently
            await self.delete()
        return uid

    async def all_have_deleted(self) -> bool:
        deletions = 0
        for recipient in self.thread.recipients:
            if recipient in self.deleted_by:
                deletions += 1
        return len(self.thread.recipients) == deletions

    async def was_read(self) -> bool:
        return len(self.viewers) > 0
