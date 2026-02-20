from datetime import timedelta

from jose import JWTError, jwt

from beak.modules.platform.enum import PlatformRole
from beak.modules.platform.iam_repository import PlatformIAMRepository
from beak.core.config import get_settings
from beak.core.dtz import timenow_dt
from beak.core.security import get_password_hash, verify_password

settings = get_settings()


class PlatformIAMService:
    def __init__(self) -> None:
        self.repository = PlatformIAMRepository()

    async def ensure_ready(self) -> None:
        await self.repository.ensure_tables()
        await self.seed_roles()

    async def seed_roles(self) -> None:
        for role in PlatformRole:
            await self.repository.upsert_role(role)

    async def seed_superuser(
        self,
        *,
        email: str,
        username: str,
        password: str,
        first_name: str = "Platform",
        last_name: str = "Admin",
    ) -> dict:
        await self.ensure_ready()
        user = await self.repository.upsert_user(
            email=email,
            username=username,
            hashed_password=get_password_hash(password),
            first_name=first_name,
            last_name=last_name,
            is_active=True,
        )
        admin_role = await self.repository.upsert_role(PlatformRole.ADMINISTRATOR)
        await self.repository.assign_role(user_uid=user["uid"], role_uid=admin_role["uid"])
        return await self.get_user_with_roles(user["uid"])

    async def authenticate(self, identifier: str, password: str) -> dict | None:
        await self.ensure_ready()
        user = await self.repository.get_user_by_identifier(identifier)
        if not user or not user.get("is_active"):
            return None
        if not verify_password(password, user["hashed_password"]):
            return None
        return await self.get_user_with_roles(user["uid"])

    async def get_user_with_roles(self, user_uid: str) -> dict:
        user = await self.repository.get_user_by_uid(user_uid)
        if not user:
            raise ValueError("Platform user not found")
        user["roles"] = await self.repository.get_roles_for_user(user_uid)
        return user

    def create_access_token(self, user: dict) -> str:
        expire = timenow_dt() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        payload = {
            "exp": expire.timestamp() * 1000,
            "sub": user["uid"],
            "aud": "platform",
            "roles": user.get("roles", []),
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    async def decode_access_token(self, token: str) -> dict | None:
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM],
                audience="platform",
            )
        except JWTError:
            return None
        if payload.get("aud") != "platform":
            return None
        sub = payload.get("sub")
        if not sub:
            return None
        return await self.get_user_with_roles(sub)
