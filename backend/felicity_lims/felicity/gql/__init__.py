import logging
from typing import Optional
from datetime import datetime
import strawberry  # noqa
from felicity.apps.user.models import User, UserAuth

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class PageInfo:
    has_next_page: bool
    has_previous_page: bool
    start_cursor: Optional[str]
    end_cursor: Optional[str]


@strawberry.type
class DeletedItem:
    uid: int


@strawberry.type
class MessageType:
    message: str


@strawberry.type
class OperationError:
    error: str
    suggestion: Optional[str] = ""


DeleteResponse = strawberry.union("DeleteResponse", (DeletedItem, OperationError),
                                  description="Union of possible outcomes when deleting some object"
                                  )

MessageResponse = strawberry.union("MessageResponse", (MessageType, OperationError),
                                   description="Union of possible outcomes when deleting some object"
                                   )


def is_authenticated(request):
    return request.user.is_authenticated


def same_origin(request):
    return request.headers.get('sec-fetch-site', 'unknown') == "same-origin"


async def auth_from_info(info):
    is_auth = is_authenticated(info.context['request'])

    try:
        username = info.context['request'].user.username
    except AttributeError:
        username = None

    if not username:
        return False, None

    auth = await UserAuth.get_by_username(username)
    if not auth:
        return False, None

    user = await User.get(auth_uid=auth.uid)
    if not user:
        return False, None

    # extract other info from request headers

    # try:
    #     user_role = info.context['request'].headers.get('x-felicity-role')
    # except AttributeError:
    #     user_role = None
    #
    # try:
    #     user_id = info.context['request'].headers.get('x-felicity-user-id')
    # except AttributeError:
    #     token = None

    return is_auth, user


def verify_user_auth(is_auth: bool = False, user=None, err_msg: str = None):
    if not is_auth:
        return OperationError(
            error=f"{err_msg}",
            suggestion="Try to login again"
        )

    if not user:
        return OperationError(
            error="Failed to acquire authenticated user",
            suggestion="refresh your page. If error persists, logout and login again"
        )
