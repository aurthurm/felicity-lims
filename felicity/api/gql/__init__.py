import logging
from typing import Optional, Tuple, Union

import strawberry  # noqa
from apps.user.models import User, UserAuth


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class PageInfo:
    has_next_page: bool
    has_previous_page: bool
    start_cursor: str | None
    end_cursor: str | None


@strawberry.type
class DeletedItem:
    uid: str


@strawberry.type
class MessagesType:
    message: str


@strawberry.type
class OperationError:
    error: str
    suggestion: str | None = ""


@strawberry.type
class OperationSuccess:
    message: str


DeleteResponse = strawberry.union(
    "DeleteResponse",
    (DeletedItem, OperationError),
    description="Union of possible outcomes when deleting some object",
)

MessageResponse = strawberry.union(
    "MessageResponse",
    (MessagesType, OperationError),
    description="Union of possible outcomes when deleting some object",
)

SuccessErrorResponse = strawberry.union(
    "SuccessErrorResponse",
    (OperationSuccess, OperationError),
    description="Union of possible outcomes when deleting some object",
)


def is_authenticated(request):
    return request.user.is_authenticated


def same_origin(request):
    return request.headers.get("sec-fetch-site", "unknown") == "same-origin"


async def auth_from_info(info) -> Tuple[bool, Optional[User]]:
    is_auth = is_authenticated(info.context["request"])

    try:
        username = info.context["request"].user.username
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

    return is_auth, user


def verify_user_auth(
    is_auth: bool = False, user=None, err_msg: str = None
) -> Tuple[bool, Optional[OperationError]]:
    if not is_auth:
        return False, OperationError(
            error=f"{err_msg}", suggestion="Try to login again"
        )

    if not user:
        return False, OperationError(
            error="Failed to acquire authenticated user",
            suggestion="refresh your page. If error persists, logout and login again",
        )
    return True, None
