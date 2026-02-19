from datetime import datetime

from sqlalchemy import text

from beak.modules.platform.enum import PlatformRole
from beak.core.config import get_settings
from beak.core.uid_gen import get_flake_uid
from beak.database.platform_session import PlatformSessionScoped

settings = get_settings()


class PlatformIAMRepository:
    async def ensure_tables(self) -> None:
        async with PlatformSessionScoped() as session:
            await session.execute(
                text(
                    f"""
                    CREATE TABLE IF NOT EXISTS "{settings.PLATFORM_SCHEMA}".platform_role (
                        uid VARCHAR(64) PRIMARY KEY,
                        name VARCHAR(64) NOT NULL UNIQUE,
                        created_at TIMESTAMP NULL,
                        updated_at TIMESTAMP NULL
                    )
                    """
                )
            )
            await session.execute(
                text(
                    f"""
                    CREATE TABLE IF NOT EXISTS "{settings.PLATFORM_SCHEMA}".platform_user (
                        uid VARCHAR(64) PRIMARY KEY,
                        email VARCHAR(255) NOT NULL UNIQUE,
                        username VARCHAR(128) NOT NULL UNIQUE,
                        first_name VARCHAR(255) NULL,
                        last_name VARCHAR(255) NULL,
                        hashed_password VARCHAR(255) NOT NULL,
                        is_active BOOLEAN NOT NULL DEFAULT TRUE,
                        created_at TIMESTAMP NULL,
                        updated_at TIMESTAMP NULL
                    )
                    """
                )
            )
            await session.execute(
                text(
                    f"""
                    CREATE TABLE IF NOT EXISTS "{settings.PLATFORM_SCHEMA}".platform_user_role (
                        user_uid VARCHAR(64) NOT NULL,
                        role_uid VARCHAR(64) NOT NULL,
                        created_at TIMESTAMP NULL,
                        PRIMARY KEY (user_uid, role_uid),
                        CONSTRAINT fk_platform_user_role_user
                            FOREIGN KEY (user_uid)
                            REFERENCES "{settings.PLATFORM_SCHEMA}".platform_user(uid)
                            ON DELETE CASCADE,
                        CONSTRAINT fk_platform_user_role_role
                            FOREIGN KEY (role_uid)
                            REFERENCES "{settings.PLATFORM_SCHEMA}".platform_role(uid)
                            ON DELETE CASCADE
                    )
                    """
                )
            )
            await session.commit()

    async def upsert_role(self, role_name: PlatformRole) -> dict:
        now = datetime.utcnow()
        uid = get_flake_uid()
        async with PlatformSessionScoped() as session:
            await session.execute(
                text(
                    f"""
                    INSERT INTO "{settings.PLATFORM_SCHEMA}".platform_role
                        (uid, name, created_at, updated_at)
                    VALUES (:uid, :name, :now, :now)
                    ON CONFLICT (name)
                    DO UPDATE SET updated_at = EXCLUDED.updated_at
                    """
                ),
                {"uid": uid, "name": role_name.value, "now": now},
            )
            await session.commit()
            role = (
                await session.execute(
                    text(
                        f"""
                        SELECT uid, name
                        FROM "{settings.PLATFORM_SCHEMA}".platform_role
                        WHERE name = :name
                        """
                    ),
                    {"name": role_name.value},
                )
            ).mappings().first()
        return dict(role)

    async def get_user_by_identifier(self, identifier: str) -> dict | None:
        stmt = text(
            f"""
            SELECT uid, email, username, first_name, last_name, hashed_password, is_active
            FROM "{settings.PLATFORM_SCHEMA}".platform_user
            WHERE email = :identifier OR username = :identifier
            """
        )
        async with PlatformSessionScoped() as session:
            row = (await session.execute(stmt, {"identifier": identifier})).mappings().first()
        return dict(row) if row else None

    async def get_user_by_uid(self, uid: str) -> dict | None:
        stmt = text(
            f"""
            SELECT uid, email, username, first_name, last_name, is_active
            FROM "{settings.PLATFORM_SCHEMA}".platform_user
            WHERE uid = :uid
            """
        )
        async with PlatformSessionScoped() as session:
            row = (await session.execute(stmt, {"uid": uid})).mappings().first()
        return dict(row) if row else None

    async def get_roles_for_user(self, user_uid: str) -> list[str]:
        stmt = text(
            f"""
            SELECT r.name
            FROM "{settings.PLATFORM_SCHEMA}".platform_role r
            JOIN "{settings.PLATFORM_SCHEMA}".platform_user_role ur ON ur.role_uid = r.uid
            WHERE ur.user_uid = :user_uid
            ORDER BY r.name ASC
            """
        )
        async with PlatformSessionScoped() as session:
            rows = (await session.execute(stmt, {"user_uid": user_uid})).all()
        return [r[0] for r in rows]

    async def upsert_user(
        self,
        *,
        email: str,
        username: str,
        hashed_password: str,
        first_name: str | None = None,
        last_name: str | None = None,
        is_active: bool = True,
    ) -> dict:
        now = datetime.utcnow()
        uid = get_flake_uid()
        async with PlatformSessionScoped() as session:
            await session.execute(
                text(
                    f"""
                    INSERT INTO "{settings.PLATFORM_SCHEMA}".platform_user
                        (uid, email, username, first_name, last_name, hashed_password, is_active, created_at, updated_at)
                    VALUES
                        (:uid, :email, :username, :first_name, :last_name, :hashed_password, :is_active, :now, :now)
                    ON CONFLICT (email)
                    DO UPDATE SET
                        username = EXCLUDED.username,
                        first_name = EXCLUDED.first_name,
                        last_name = EXCLUDED.last_name,
                        hashed_password = EXCLUDED.hashed_password,
                        is_active = EXCLUDED.is_active,
                        updated_at = EXCLUDED.updated_at
                    """
                ),
                {
                    "uid": uid,
                    "email": email,
                    "username": username,
                    "first_name": first_name,
                    "last_name": last_name,
                    "hashed_password": hashed_password,
                    "is_active": is_active,
                    "now": now,
                },
            )
            await session.commit()
        user = await self.get_user_by_identifier(email)
        if not user:
            raise RuntimeError("Failed to upsert platform user")
        return user

    async def assign_role(self, *, user_uid: str, role_uid: str) -> None:
        async with PlatformSessionScoped() as session:
            await session.execute(
                text(
                    f"""
                    INSERT INTO "{settings.PLATFORM_SCHEMA}".platform_user_role
                        (user_uid, role_uid, created_at)
                    VALUES (:user_uid, :role_uid, :now)
                    ON CONFLICT (user_uid, role_uid) DO NOTHING
                    """
                ),
                {"user_uid": user_uid, "role_uid": role_uid, "now": datetime.utcnow()},
            )
            await session.commit()
