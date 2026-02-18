import logging
from datetime import datetime

from sqlalchemy import text

from beak.core.config import get_settings
from beak.core.uid_gen import get_flake_uid
from beak.database.platform_session import PlatformSessionScoped

logger = logging.getLogger(__name__)
settings = get_settings()


class TenantRepository:
    """Repository for platform tenant registry metadata."""

    async def ensure_registry(self) -> None:
        exists_sql = text(
            """
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = :schema_name
                  AND table_name = 'tenant'
            ) AS tenant_registry_exists
            """
        )
        async with PlatformSessionScoped() as session:
            exists = (
                await session.execute(
                    exists_sql, {"schema_name": settings.PLATFORM_SCHEMA}
                )
            ).scalar()
        if not exists:
            raise RuntimeError(
                "Platform tenant registry is not initialized. "
                "Run `alembic upgrade head` (without TENANT_SCHEMA) first."
            )

    async def create(
        self,
        *,
        name: str,
        slug: str,
        schema_name: str,
        status: str,
        admin_email: str | None = None,
    ) -> dict:
        now = datetime.utcnow()
        uid = get_flake_uid()
        stmt = text(
            f'''
            INSERT INTO "{settings.PLATFORM_SCHEMA}".tenant
                (uid, name, slug, schema_name, status, admin_email, created_at, updated_at)
            VALUES
                (:uid, :name, :slug, :schema_name, :status, :admin_email, :now, :now)
            '''
        )
        async with PlatformSessionScoped() as session:
            await session.execute(
                stmt,
                {
                    "uid": uid,
                    "name": name,
                    "slug": slug,
                    "schema_name": schema_name,
                    "status": status,
                    "admin_email": admin_email,
                    "now": now,
                },
            )
            await session.commit()
        return {
            "uid": uid,
            "name": name,
            "slug": slug,
            "schema_name": schema_name,
            "status": status,
            "admin_email": admin_email,
            "created_at": now,
            "updated_at": now,
            "provisioned_at": None,
        }

    async def get_by_slug(self, slug: str) -> dict | None:
        stmt = text(
            f'''
            SELECT uid, name, slug, schema_name, status, admin_email, provisioned_at, created_at, updated_at
            FROM "{settings.PLATFORM_SCHEMA}".tenant
            WHERE slug = :slug
            '''
        )
        async with PlatformSessionScoped() as session:
            row = (await session.execute(stmt, {"slug": slug})).mappings().first()
        return dict(row) if row else None

    async def get_by_schema_name(self, schema_name: str) -> dict | None:
        stmt = text(
            f'''
            SELECT uid, name, slug, schema_name, status, admin_email, provisioned_at, created_at, updated_at
            FROM "{settings.PLATFORM_SCHEMA}".tenant
            WHERE schema_name = :schema_name
            '''
        )
        async with PlatformSessionScoped() as session:
            row = (
                await session.execute(stmt, {"schema_name": schema_name})
            ).mappings().first()
        return dict(row) if row else None

    async def get_all(self, status: str | None = None) -> list[dict]:
        if status and status != "all":
            stmt = text(
                f'''
                SELECT uid, name, slug, schema_name, status, admin_email, provisioned_at, created_at, updated_at
                FROM "{settings.PLATFORM_SCHEMA}".tenant
                WHERE status = :status
                ORDER BY created_at ASC
                '''
            )
            params = {"status": status}
        else:
            stmt = text(
                f'''
                SELECT uid, name, slug, schema_name, status, admin_email, provisioned_at, created_at, updated_at
                FROM "{settings.PLATFORM_SCHEMA}".tenant
                ORDER BY created_at ASC
                '''
            )
            params = {}
        async with PlatformSessionScoped() as session:
            rows = (await session.execute(stmt, params)).mappings().all()
        return [dict(r) for r in rows]

    async def get_all_active(self) -> list[dict]:
        return await self.get_all(status="active")

    async def delete_by_uid(self, uid: str) -> None:
        stmt = text(
            f'''
            DELETE FROM "{settings.PLATFORM_SCHEMA}".tenant
            WHERE uid = :uid
            '''
        )
        async with PlatformSessionScoped() as session:
            await session.execute(stmt, {"uid": uid})
            await session.commit()

    async def update_status(self, uid: str, status: str) -> None:
        if status == "active":
            stmt = text(
                f'''
                UPDATE "{settings.PLATFORM_SCHEMA}".tenant
                SET status = :status,
                    updated_at = :now,
                    provisioned_at = :now
                WHERE uid = :uid
                '''
            )
        else:
            stmt = text(
                f'''
                UPDATE "{settings.PLATFORM_SCHEMA}".tenant
                SET status = :status,
                    updated_at = :now
                WHERE uid = :uid
                '''
            )
        async with PlatformSessionScoped() as session:
            await session.execute(
                stmt,
                {
                    "uid": uid,
                    "status": status,
                    "now": datetime.utcnow(),
                },
            )
            await session.commit()
