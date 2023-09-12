import logging
from dataclasses import dataclass
from typing import Any

from graphql import GraphQLError
from jose import jwt
from pydantic import ValidationError
from sanic.request import Request
from strawberry.http.temporal_response import TemporalResponse
from strawberry.types.info import Info as StrawberryInfo, RootValueType

from apps.common import schemas as core_schemas  # noqa
from apps.user import models  # noqa
from apps.user.models import User
from core import security  # noqa
from core.config import settings  # noqa

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class InfoContext:
    user: User
    request: Request
    response: TemporalResponse


Info = StrawberryInfo[InfoContext, RootValueType]


async def get_current_user(token: str = None) -> models.User | None:
    if not token:
        GraphQLError("No auth token")
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = core_schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError) as e:
        return None

    return await models.User.get(uid=token_data.sub)


async def get_current_active_user(token: str = None) -> models.User | None:
    current_user = await get_current_user(token=token)
    if not current_user or not current_user.is_active:
        return None
    return current_user


async def get_auth_context(request: Request) -> Any:
    if "Authorization" in request.headers:
        authorization = request.headers.get("Authorization", None)
        if not authorization:
            return {"user": None}
        _, credentials = authorization.split()
        return {"user": await get_current_active_user(credentials)}

    logger.info(f"Context: must authenticate {request}")

    return {"user": None}


async def get_auth_user(request: Request) -> Any:
    if "Authorization" in request.headers:
        authorization = request.headers.get("Authorization", None)
        if not authorization:
            return {"user": None}
        _, credentials = authorization.split()
        return await get_current_active_user(credentials)

    logger.info(f"Context: must authenticate {request}")

    return None


async def get_gql_context(request: Request, response: TemporalResponse) -> InfoContext:
    auth_ctx = await get_auth_context(request)
    return InfoContext(**{
        **auth_ctx,
        "request": request,
        "response": response
    })
