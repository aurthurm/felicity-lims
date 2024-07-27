from felicity.apps.abstract.service import BaseService
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.messaging.entities import Message, MessageThread
from felicity.apps.messaging.repository import (MessageRepository,
                                                MessageThreadRepository)
from felicity.apps.messaging.schemas import (MessageCreate,
                                             MessageThreadCreate,
                                             MessageThreadUpdate,
                                             MessageUpdate)
from felicity.apps.user.entities import User
from felicity.apps.user.services import UserService


class MessageThreadService(
    BaseService[MessageThread, MessageThreadCreate, MessageThreadUpdate]
):
    def __init__(self):
        self.message_service = MessageService()
        super().__init__(MessageThreadRepository)

    async def get_last_message(self, uid: str):
        thread = await self.get(uid=uid)
        if not thread.messages:
            return None
        return sorted(thread.messages, key=lambda x: x.created_at)[0]

    async def can_reply(self, uid: str) -> bool:
        thread = await self.get(uid=uid)
        return thread.broadcast

    async def add_recipient(self, uid: str, user: User) -> MessageThread:
        thread = await self.get(uid=uid)
        if user not in thread.recipients:
            thread.recipients.append(user)
            return await super().update(thread, **marshaller(thread))
        return thread

    async def add_deletion(self, uid: str, user: User) -> MessageThread:
        thread = await self.get(uid=uid)
        if user not in thread.deleted_by:
            thread.deleted_by.append(user)
            return await super().update(thread, **marshaller(thread))
        return thread

    async def delete_for_user(self, uid: str, user: User) -> str:
        thread = await self.get(uid=uid)
        uid = thread.uid
        # first delete all messages for user
        for message in thread.messages:
            if user not in message.deleted_by:
                await self.message_service.add_deletion(message.uid, thread, user)
        # delete thread for user
        await self.add_deletion(thread.uid, user)

        # if all thread  recipients have deleted the thread
        if self.all_have_deleted(thread.uid):
            # permanently delete all messages in thread
            for message in thread.messages:
                await self.message_service.delete(message.uid)
            # then finally delete the thread permanently
            await super().delete(uid)
        return uid

    @staticmethod
    async def all_have_deleted(self, uid: str) -> bool:
        thread = await self.get(uid=uid)
        deletions = 0
        for recipient in thread.recipients:
            if recipient in thread.deleted_by:
                deletions += 1
        return len(thread.recipients) == deletions

    async def delete_thread(self, uid: str, user: User) -> str:
        thread = await self.get(uid=uid)
        return await self.delete_for_user(thread.uid, user)


class MessageService(BaseService[Message, MessageCreate, MessageUpdate]):
    def __int__(self):
        self.thread_service = MessageThreadService()
        self.user_service = UserService()
        super().__init__(MessageRepository)

    async def send_message(
        self, recipients: list[str], body: str, user: User
    ) -> Message:

        _recipients = [user]
        for _rec in recipients:
            recipient = User.get(uid=_rec)
            if recipient and recipient not in _recipients:
                _recipients.append(user)

        thread_in = MessageThreadCreate(broadcast=len(recipients) > 1)
        thread_in.recipients = _recipients
        thread = await self.thread_service.create(thread_in)

        incoming = {
            "body": body,
            "thread_uid": thread.uid,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }

        exists = await self.get(body=body)
        if exists:
            incoming["body"] = ">> " + incoming["body"]

        incoming["recipients"] = []
        for user_uid in recipients:
            _rec = await self.user_service.get(uid=user_uid)
            if _rec:
                incoming["recipients"].append(_rec)

        obj_in = MessageCreate(**incoming)
        return await self.create(obj_in)

    async def reply_message(self, thread_uid: str, body: str, user: User) -> Message:
        thread = await self.thread_service.get(uid=thread_uid)

        incoming = {
            "body": body,
            "thread_uid": thread_uid,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }

        last_message = await self.thread_service.get_last_message(thread.uid)

        if last_message:
            # not deleted
            incoming["parent_id"] = last_message.uid

        obj_in = MessageCreate(**incoming)
        return await self.create(obj_in)

    async def view_message(self, uid: str, user: User) -> Message:
        message = await self.get(uid=uid)
        if user not in message.viewers:
            message.viewers.append(user)
            return await super().update(message, **marshaller(message))
        return message

    async def delete_message(self, uid: str, user: User) -> str:
        return await self.delete_for_user(uid, user)

    async def add_deletion(self, uid: str, user: User) -> Message:
        message = await self.get(uid=uid)
        if user not in message.deleted_by:
            message.deleted_by.append(user)
            return await super().update(message, **marshaller(message))
        return message

    async def delete_for_user(self, uid: str, user: User) -> str:
        await self.add_deletion(uid, user)

        # if all thread recipients have deleted the message
        if self.all_have_deleted(uid):
            # delete the message permanently
            await super().delete(uid)
        return uid

    async def all_have_deleted(self, uid: str) -> bool:
        message = await self.get(uid=uid)
        deletions = 0
        for recipient in message.recipients:
            if recipient in message.deleted_by:
                deletions += 1
        return len(message.recipients) == deletions

    @staticmethod
    async def was_read(self, uid: str) -> bool:
        message = await self.get(uid=uid)
        return len(message.viewers) > 0
