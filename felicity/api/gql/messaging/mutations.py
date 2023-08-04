import inspect
import logging
from typing import List

import strawberry  # noqa
from api.gql.types import DeletedItem, DeleteResponse, OperationError
from api.gql.auth import auth_from_info, verify_user_auth
from api.gql.permissions import IsAuthenticated
from api.gql.messaging.types import MessageType
from apps.messaging import models, schemas
from apps.user.models import User

from utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MessageResponse = strawberry.union(
    "MessageResponse", (MessageType, OperationError), description=""  # noqa
)


@strawberry.type
class MessageMutations:
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def send_message(
        self, info, recipients: List[str], body: str
    ) -> MessageResponse:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated, felicity_user, "Only Authenticated user can send messages"
        )

        if not recipients or not body:
            return OperationError(error="Message body and recipients are mandatory")

        _recipients = [felicity_user]
        for _rec in recipients:
            recipient = User.get(uid=_rec)
            if recipient and recipient not in _recipients:
                _recipients.append(felicity_user)

        thread_in = schemas.MessageThreadCreate(broadcast=len(recipients) > 1)
        thread_in.recipients = _recipients
        thread: models.MessageThread = await models.MessageThread.create(thread_in)

        incoming = {
            "thread_uid": thread.uid,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        for k, v in passed_args.items():
            incoming[k] = v

        exists = await models.Message.get(body=body)
        if exists:
            incoming["body"] = ">> " + incoming["body"]

        incoming["recipients"] = []
        for user_uid in recipients:
            _rec = User.get(uid=user_uid)
            if _rec:
                incoming["recipients"].append(_rec)

        obj_in = schemas.MessageCreate(**incoming)
        message: models.Message = await models.Message.create(obj_in)
        return MessageType(**message.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def reply_message(
        self, info, thread_uid: str, body: str
    ) -> MessageResponse:

        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can reply to messages",
        )

        thread: models.MessageThread = await models.MessageThread.get(uid=thread_uid)
        if not thread:
            return OperationError(
                error=f"Message Thread with uid {thread_uid} not fount"
            )

        if not body:
            return OperationError(error="Message cannot be blank")

        incoming = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        for k, v in passed_args.items():
            incoming[k] = v

        last_message = await thread.get_last_message()

        if last_message:
            # not deleted
            incoming["parent_id"] = last_message.uid

        obj_in = schemas.MessageCreate(**incoming)
        message: models.Message = await models.Message.create(obj_in)
        return MessageType(**message.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def view_message(self, info, uid: str) -> MessageResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated, felicity_user, "Only Authenticated user can view messages"
        )

        message: models.Message = await models.Message.get(uid=uid)
        if not message:
            return OperationError(error=f"message with uid {uid} does not exist")

        message = await message.add_viewer(felicity_user)
        return MessageType(**message.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_message(self, info, uid: str) -> DeleteResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can delete messages",
        )

        message: models.Message = await models.Message.get(uid=uid)
        if not message:
            return OperationError(error=f"Message with uid {uid} does not exist")

        uid = await message.delete_for_user(felicity_user)
        return DeletedItem(uid=uid)

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_thread(self, info, uid: str) -> DeleteResponse:

        is_authenticated, felicity_user = await auth_from_info(info)
        verify_user_auth(
            is_authenticated,
            felicity_user,
            "Only Authenticated user can delete threads",
        )

        thread: models.Message = await models.MessageThread.get(uid=uid)
        if not thread:
            return OperationError(error=f"Message Thread with uid {uid} does not exist")

        uid = await thread.delete_for_user(felicity_user)
        return DeletedItem(uid=uid)
