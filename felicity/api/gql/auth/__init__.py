import logging
from typing import Optional, Tuple

from apps.user.models import User, UserAuth
from api.gql.types import OperationError


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def is_authenticated(request):
    return request.user.is_authenticated


def same_origin(request):
    return request.headers.get("sec-fetch-site", "unknown") == "same-origin"


async def auth_from_info(info) -> Tuple[bool, Optional[User]]:
    is_auth = is_authenticated(info.context.request)
    auth = await UserAuth.get_by_username(info.context.request.user.username)
    user = await User.get(auth_uid=auth.uid)
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
