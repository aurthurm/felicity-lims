import base64
import binascii


from typing import Optional, Tuple
from api.gql.deps import get_current_active_user
from starlette.authentication import AuthCredentials  # UnauthenticatedUser,
from starlette.authentication import (
    AuthenticationBackend,
    AuthenticationError,
    SimpleUser,
    BaseUser
)
from apps.user.models import User, UserAuth
from fastapi.security.utils import get_authorization_scheme_param
from starlette.authentication import AuthenticationBackend, AuthenticationError
from starlette.requests import HTTPConnection


class FelicityUser(BaseUser):
    def __init__(self, user: User) -> None:
        self.username = user.auth.user_name
        self.uid = user.uid
        self.first_name = user.first_name
        self.last_name = user.last_name

    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def display_name(self) -> str:
        return self.username



class FelicityAuthBackend(AuthenticationBackend):
    async def authenticate(self, request):
        if "Authorization" not in request.headers:
            return

        auth = request.headers["Authorization"]
        try:
            scheme, credentials = auth.split()
            if scheme.lower() == "basic":
                decoded = base64.b64decode(credentials).decode("ascii")
                username, _, password = decoded.partition(":")
                # TODO: You'd want to verify the username and password here if needed
                user_auth = await UserAuth.get_by_username(username)
                authenticated = await user_auth.authenticate(username, password)
                if not authenticated:
                    raise AuthenticationError(
                        f"Failed to authenticate"
                    )                    
                user = await User.get(auth_uid=user_auth.uid)
            elif scheme.lower() == "bearer":
                """ "get is active user from token"""
                user = await get_current_active_user(credentials)
            else:
                raise AuthenticationError(
                    f"UnKnown Authentication Backend: {scheme.lower()}"
                )

            return AuthCredentials(["authenticated"]), FelicityUser(user)

        except (ValueError, UnicodeDecodeError, binascii.Error) as exc:
            raise AuthenticationError(f"Invalid auth credentials: {exc}")


class AuthBackend(AuthenticationBackend):
    """
    Own Auth Backend based on Starlette's AuthenticationBackend.

    Use instance of this class as `backend` argument to `add_middleware` func:

    .. code-block:: python

        app = FastAPI()

        @app.on_event('startup')
        async def startup():
            app.add_middleware(AuthenticationMiddleware, backend=AuthBackend())

    """

    async def authenticate(
        self, conn: HTTPConnection
    ) -> Tuple[bool, Optional[User]]:
        """
        Main function that AuthenticationMiddleware uses from this backend.
        Should return whether request is authenticated based on credentials and
        if it was, return also user instance.

        :param conn: HTTPConnection of the current request-response cycle
        :return: 2-tuple: is authenticated & user instance if exists
        """
        authorization: str = conn.headers.get("Authorization")
        if not authorization:
            return False, None
        scheme, credentials = get_authorization_scheme_param(authorization)
        if not (authorization and scheme and credentials):
            raise AuthenticationError("Not authenticated")
        if scheme.lower() != "token":
            raise AuthenticationError("Invalid authentication credentials")

        # token = await Token.get(
        #     key=credentials,
        #     is_active=True,
        #     expires={"$not": {"$lt": get_now()}},
        # )
        # if token is None:
        #     return False, None
        # conn.scope["token"] = token

        # user = await User.get(id=token.user_id)
        user = None
        if user is None:
            return False, None

        return True, user
