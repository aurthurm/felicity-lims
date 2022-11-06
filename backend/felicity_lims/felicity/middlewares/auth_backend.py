import base64
import binascii

from felicity.api.gql.deps import get_current_active_user
from starlette.authentication import AuthCredentials  # UnauthenticatedUser,
from starlette.authentication import (AuthenticationBackend,
                                      AuthenticationError, SimpleUser)


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
            elif scheme.lower() == "bearer":
                """"get is active user from token"""
                user = await get_current_active_user(credentials)
                username, _, password = user.auth.user_name, None, None
            else:
                raise AuthenticationError(
                    f"UnKnown Authentication Backend: {scheme.lower()}"
                )

            return AuthCredentials(["authenticated"]), SimpleUser(username)

        except (ValueError, UnicodeDecodeError, binascii.Error) as exc:
            raise AuthenticationError(f"Invalid auth credentials: {exc}")
