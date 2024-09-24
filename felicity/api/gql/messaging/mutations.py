import inspect
import logging
from typing import List

import strawberry  # noqa

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.messaging.types import MessageType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import DeletedItem, DeleteResponse, OperationError
from felicity.apps.messaging import schemas
from felicity.apps.messaging.services import MessageService, MessageThreadService
from felicity.apps.user.entities import User
from felicity.apps.user.services import UserService
from felicity.utils import get_passed_args

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MessageResponse = strawberry.union(
    "MessageResponse",
    (MessageType, OperationError),
    description="",  # noqa
)


@strawberry.type
class MessageMutations:
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def send_message(
        self, info, recipients: List[str], body: str
    ) -> MessageResponse:
        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        felicity_user = await auth_from_info(info)

        if not recipients or not body:
            return OperationError(error="Message body and recipients are mandatory")

        _recipients = [felicity_user]
        for _rec in recipients:
            recipient = UserService().get(uid=_rec)
            if recipient and recipient not in _recipients:
                _recipients.append(felicity_user)

        thread_in = schemas.MessageThreadCreate(broadcast=len(recipients) > 1)
        thread_in.recipients = _recipients
        thread = await MessageThreadService().create(thread_in)

        incoming = {
            "thread_uid": thread.uid,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        for k, v in passed_args.items():
            incoming[k] = v

        exists = await MessageService().get(body=body)
        if exists:
            incoming["body"] = ">> " + incoming["body"]

        incoming["recipients"] = []
        for user_uid in recipients:
            _rec = UserService().get(uid=user_uid)
            if _rec:
                incoming["recipients"].append(_rec) # type: ignore

        obj_in = schemas.MessageCreate(**incoming)
        message = await MessageService().create(obj_in)
        return MessageType(**message.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def reply_message(self, info, thread_uid: str, body: str) -> MessageResponse:
        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)

        felicity_user = await auth_from_info(info)

        thread = await MessageThreadService().get(uid=thread_uid)
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

        last_message = await MessageThreadService().get_last_message(thread.uid)

        if last_message:
            # not deleted
            incoming["parent_id"] = last_message.uid

        obj_in = schemas.MessageCreate(**incoming)
        message = await MessageService().create(obj_in)
        return MessageType(**message.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def view_message(self, info, uid: str) -> MessageResponse:
        felicity_user = await auth_from_info(info)

        message = await MessageService().get(uid=uid)
        if not message:
            return OperationError(error=f"message with uid {uid} does not exist")

        message = await MessageService().view_message(message.uid, felicity_user)
        return MessageType(**message.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_message(self, info, uid: str) -> DeleteResponse:
        felicity_user = await auth_from_info(info)

        message = await MessageService().get(uid=uid)
        if not message:
            return OperationError(error=f"Message with uid {uid} does not exist")

        uid = await MessageService().delete_for_user(message.uid, felicity_user)
        return DeletedItem(uid=uid)

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def delete_thread(self, info, uid: str) -> DeleteResponse:
        felicity_user = await auth_from_info(info)

        thread = await MessageThreadService().get(uid=uid)
        if not thread:
            return OperationError(error=f"Message Thread with uid {uid} does not exist")

        uid = await MessageThreadService().delete_for_user(thread.uid, felicity_user)
        return DeletedItem(uid=uid)
