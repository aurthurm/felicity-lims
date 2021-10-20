from graphql import GraphQLError
from jose import jwt
from pydantic import ValidationError

from felicity.apps.user import models # noqa
from felicity.apps.core import schemas as core_schemas # noqa
from felicity.core import security # noqa
from felicity.core.config import settings # noqa


async def get_current_user(token: str = None) -> models.User:
    if not token:
        GraphQLError("No auth token")
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = core_schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise Exception("Could not validate credentials")
    user = await models.User.get(uid=token_data.sub)
    if not user:
        raise GraphQLError("User not found!")
    return user


async def get_current_active_user(token: str = None) -> models.User:
    current_user = await get_current_user(token=token)
    if not current_user.is_active:
        raise GraphQLError("Inactive User")
    return current_user


async def get_current_active_superuser(token: str = None) -> models.User:
    current_user = await get_current_user(token=token)
    if not current_user.is_superuser:
        raise GraphQLError("The user doesn't have enough privileges")
    return current_user
