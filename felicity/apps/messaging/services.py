from domain.messaging.ports.repository import (
    IMessageThreadRepository,
    IMessageRepository,
)
from domain.messaging.ports.service import IMessageThreadService, IMessageService
from domain.messaging.schemas import (
    MessageThread,
    Message,
    MessageCreate,
    MessageThreadCreate,
)
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from domain.user.ports.service import IUserService
from domain.user.schemas import User


class MessageThreadService(BaseService[MessageThread], IMessageThreadService):
    def __init__(
            self, repository: IMessageThreadRepository, message_service: IMessageService
    ):
        self.repository = repository
        self.message_service = message_service

    async def get_last_message(self, thread: MessageThread):
        if not thread.messages:
            return None
        return sorted(self.messages, key=lambda x: x.created_at)[0]

    @staticmethod
    async def can_reply(thread: MessageThread) -> bool:
        return thread.broadcast

    async def add_recipient(self, thread: MessageThread, user: User) -> MessageThread:
        if user not in thread.recipients:
            thread.recipients.append(user)
            return await super().update(thread, **marshal(thread))
        return thread

    async def add_deletion(self, thread: MessageThread, user: User) -> MessageThread:
        if user not in thread.deleted_by:
            thread.deleted_by.append(user)
            return await super().update(thread, **marshal(thread))
        return thread

    async def delete_for_user(self, thread: MessageThread, user: User) -> str:
        uid = thread.uid
        # first delete all messages for user
        for message in thread.messages:
            if user not in message.deleted_by:
                await message.add_deletion(thread, user)
        # delete thread for user
        await self.add_deletion(thread, user)

        # if all thread recipients have deleted the thread
        if self.all_have_deleted(thread):
            # permanently delete all messages in thread
            for message in thread.messages:
                await self.message_service.delete(message)
            # then finally delete the thread permanently
            await super().delete(thread)

        return uid

    @staticmethod
    async def all_have_deleted(thread: MessageThread) -> bool:
        deletions = 0
        for recipient in thread.recipients:
            if recipient in thread.deleted_by:
                deletions += 1
        return len(thread.recipients) == deletions

    async def delete_thread(self, uid: str, user: User) -> str:
        thread = await self.get(uid=uid)
        return await self.delete_for_user(thread, user)


class MessageService(BaseService[Message], IMessageService):
    def __int__(
            self,
            repository: IMessageRepository,
            thread_service: IMessageThreadService,
            user_service: IUserService,
    ):
        self.repository = repository
        self.thread_service = thread_service
        self.user_service = user_service

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
        thread = await super().create(**marshal(thread_in))

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
        return await super().create(**marshal(obj_in))

    async def reply_message(self, thread_uid: str, body: str, user: User) -> Message:
        thread = await self.get(uid=thread_uid)

        incoming = {
            "body": body,
            "thread_uid": thread_uid,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }

        last_message = await self.thread_service.get_last_message(thread)

        if last_message:
            # not deleted
            incoming["parent_id"] = last_message.uid

        obj_in = MessageCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def view_message(self, uid: str, user: User) -> Message:
        message = await self.get(uid=uid)
        if user not in message.viewers:
            message.viewers.append(user)
            return await super().update(message, **marshal(message))
        return message

    async def delete_message(self, uid: str, user: User) -> str:
        message = await self.get(uid=uid)
        return await self.delete_for_user(message, user)

    async def add_deletion(self, message: Message, user: User) -> Message:
        if user not in message.deleted_by:
            message.deleted_by.append(user)
            return await super().update(message, **marshal(message))
        return message

    async def delete_for_user(self, message: Message, user: User) -> str:
        uid = message.uid
        await self.add_deletion(message, user)

        # if all thread recipients have deleted the message
        if self.all_have_deleted(message):
            # delete the message permanently
            await super().delete(message)
        return uid

    @staticmethod
    async def all_have_deleted(message: Message) -> bool:
        deletions = 0
        for recipient in message.recipients:
            if recipient in message.deleted_by:
                deletions += 1
        return len(message.recipients) == deletions

    @staticmethod
    async def was_read(message: Message) -> bool:
        return len(message.viewers) > 0
