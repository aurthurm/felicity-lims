import logging
from typing import Optional, Tuple

from felicity.api.gql.types import OperationError
from felicity.apps.user.entities import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def same_origin(request):
    return request.headers.get("sec-fetch-site", "unknown") == "same-origin"


async def auth_from_info(info) -> Tuple[bool, Optional[User]]:
    return await info.context.user()
