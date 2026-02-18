import logging
import os
import re
import subprocess
import sys

from sqlalchemy import text

from beak.apps.platform.repository import TenantRepository
from beak.apps.setup import schemas as setup_schemas
from beak.apps.setup.services import (
    LaboratoryService,
    LaboratorySettingService,
    OrganizationService,
)
from beak.core.config import ROOT_DIR, get_settings
from beak.core.tenant_context import TenantContext, clear_tenant_context, set_tenant_context
from beak.database.platform_session import PlatformSessionScoped
from beak.lims.seeds import requisite_setup

logger = logging.getLogger(__name__)
settings = get_settings()

_SLUG_PATTERN = re.compile(r"^[a-z][a-z0-9_]{0,62}$")


class TenantRegistryService:
    def __init__(self) -> None:
        self.repository = TenantRepository()

    async def ensure_registry(self) -> None:
        await self.repository.ensure_registry()

    async def list_active(self) -> list[dict]:
        await self.repository.ensure_registry()
        return await self.repository.get_all_active()

    async def list(self, status: str = "all") -> list[dict]:
        await self.repository.ensure_registry()
        return await self.repository.get_all(status=status)

    async def get_by_slug(self, slug: str) -> dict | None:
        await self.repository.ensure_registry()
        return await self.repository.get_by_slug(slug)


class TenantProvisioningService:
    def __init__(self) -> None:
        self.registry = TenantRepository()

    async def provision(
        self,
        *,
        name: str,
        slug: str,
        admin_email: str | None = None,
        initial_lab_name: str | None = None,
    ) -> dict:
        await self.registry.ensure_registry()
        self._validate_slug(slug)
        schema_name = f"{settings.TENANT_SCHEMA_PREFIX}{slug}"

        if await self.registry.get_by_slug(slug):
            raise ValueError(f"Tenant slug '{slug}' already exists")

        if await self.registry.get_by_schema_name(schema_name):
            raise ValueError(f"Tenant schema '{schema_name}' already exists")

        tenant_row = await self.registry.create(
            name=name,
            slug=slug,
            schema_name=schema_name,
            status="provisioning",
            admin_email=admin_email,
        )

        try:
            await self._create_schema(schema_name)
            self._run_tenant_migrations(schema_name)
            await self._assert_tenant_seed_ready(schema_name)
            await self._seed_tenant(schema_name=schema_name, org_name=name, lab_name=initial_lab_name)
            await self.registry.update_status(tenant_row["uid"], "active")
            active = await self.registry.get_by_slug(slug)
            return active or tenant_row
        except Exception:
            await self.registry.update_status(tenant_row["uid"], "failed")
            raise

    async def migrate(self, *, slug: str) -> dict:
        tenant = await self._get_tenant(slug)
        await self._create_schema(tenant["schema_name"])
        self._run_tenant_migrations(tenant["schema_name"])
        await self._assert_tenant_seed_ready(tenant["schema_name"])
        if tenant["status"] != "active":
            await self.registry.update_status(tenant["uid"], "active")
        refreshed = await self.registry.get_by_slug(slug)
        return refreshed or tenant

    async def activate(self, *, slug: str, force: bool = False) -> dict:
        tenant = await self._get_tenant(slug)
        if not force:
            await self._assert_tenant_seed_ready(tenant["schema_name"])
        await self.registry.update_status(tenant["uid"], "active")
        refreshed = await self.registry.get_by_slug(slug)
        return refreshed or tenant

    async def cleanup_failed(
        self,
        *,
        slug: str | None = None,
        drop_schema: bool = True,
    ) -> list[dict]:
        if slug:
            tenants = [await self._get_tenant(slug)]
        else:
            await self.registry.ensure_registry()
            tenants = await self.registry.get_all(status="failed")

        cleaned: list[dict] = []
        for tenant in tenants:
            if tenant["status"] != "failed":
                raise ValueError(
                    f"Tenant '{tenant['slug']}' is not failed (status={tenant['status']})"
                )
            if drop_schema:
                await self._drop_schema(tenant["schema_name"])
            await self.registry.delete_by_uid(tenant["uid"])
            cleaned.append(tenant)
        return cleaned

    async def add_laboratory(
        self,
        *,
        slug: str,
        laboratory_name: str,
        setup_name: str = "beak",
    ) -> dict:
        tenant = await self._require_active_tenant(slug)
        set_tenant_context(
            TenantContext(schema_name=tenant["schema_name"], tenant_slug=tenant["slug"])
        )
        try:
            organization = await OrganizationService().get_by_setup_name(setup_name)
            if not organization:
                raise RuntimeError(
                    f"Organization with setup_name='{setup_name}' not found in tenant '{slug}'"
                )

            laboratory_service = LaboratoryService()
            existing = await laboratory_service.get_laboratory_by_name(
                laboratory_name, organization.uid
            )

            created = existing is None
            laboratory = existing
            if not laboratory:
                laboratory = await laboratory_service.create_laboratory(
                    setup_schemas.LaboratoryCreate(
                        organization_uid=organization.uid,
                        name=laboratory_name,
                        email=None,
                        email_cc=None,
                        mobile_phone=None,
                        business_phone=None,
                    )
                )

            setting_service = LaboratorySettingService()
            lab_settings = await setting_service.get(laboratory_uid=laboratory.uid)
            if not lab_settings:
                await setting_service.create(
                    setup_schemas.LaboratorySettingCreate(
                        laboratory_uid=laboratory.uid,
                        allow_self_verification=False,
                        allow_patient_registration=True,
                        allow_sample_registration=True,
                        allow_worksheet_creation=True,
                        default_route="DASHBOARD",
                        password_lifetime=90,
                        inactivity_log_out=30,
                        default_theme="LIGHT",
                        auto_receive_samples=True,
                        sticker_copies=2,
                        allow_billing=False,
                        allow_auto_billing=True,
                        currency="USD",
                    )
                )
        finally:
            clear_tenant_context()

        return {
            "tenant_slug": tenant["slug"],
            "schema_name": tenant["schema_name"],
            "organization_uid": organization.uid,
            "laboratory_uid": laboratory.uid,
            "laboratory_name": laboratory.name,
            "created": created,
        }

    async def _create_schema(self, schema_name: str) -> None:
        async with PlatformSessionScoped() as session:
            await session.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{schema_name}"'))
            await session.commit()

    async def _drop_schema(self, schema_name: str) -> None:
        async with PlatformSessionScoped() as session:
            await session.execute(text(f'DROP SCHEMA IF EXISTS "{schema_name}" CASCADE'))
            await session.commit()

    def _run_tenant_migrations(self, schema_name: str) -> None:
        env = {
            **os.environ,
            "TENANT_SCHEMA": schema_name,
        }
        result = subprocess.run(
            [sys.executable, "-m", "alembic", "-c", f"{ROOT_DIR}/alembic.ini", "upgrade", "head"],
            env=env,
            cwd=ROOT_DIR,
            capture_output=True,
            text=True,
            check=False,
        )
        if result.returncode != 0:
            logger.error("Tenant migration failed: %s", result.stderr)
            raise RuntimeError(f"Tenant migration failed for {schema_name}: {result.stderr}")
        if result.stderr:
            logger.info("Tenant migration stderr for %s: %s", schema_name, result.stderr.strip())

    async def _assert_tenant_seed_ready(self, schema_name: str) -> None:
        async with PlatformSessionScoped() as session:
            result = await session.execute(
                text(
                    """
                    SELECT EXISTS (
                        SELECT 1
                        FROM information_schema.tables
                        WHERE table_schema = :schema_name
                          AND table_name = 'organization'
                    )
                    """
                ),
                {"schema_name": schema_name},
            )
            has_organization = bool(result.scalar())
            if not has_organization:
                raise RuntimeError(
                    f"Tenant migration completed but {schema_name}.organization was not created"
                )

    async def _get_tenant(self, slug: str) -> dict:
        await self.registry.ensure_registry()
        tenant = await self.registry.get_by_slug(slug)
        if not tenant:
            raise ValueError(f"Tenant slug '{slug}' not found")
        return tenant

    async def _require_active_tenant(self, slug: str) -> dict:
        tenant = await self._get_tenant(slug)
        if tenant["status"] != "active":
            raise ValueError(
                f"Tenant slug '{slug}' is not active (status={tenant['status']})"
            )
        return tenant

    async def _seed_tenant(self, *, schema_name: str, org_name: str, lab_name: str | None) -> None:
        default_lab_name = lab_name or f"{org_name} Main Lab"
        tenant_slug = schema_name.removeprefix(settings.TENANT_SCHEMA_PREFIX)
        set_tenant_context(TenantContext(schema_name=schema_name, tenant_slug=tenant_slug))
        try:
            await requisite_setup(org_name, default_lab_name)
        finally:
            clear_tenant_context()

    @staticmethod
    def _validate_slug(slug: str) -> None:
        if not _SLUG_PATTERN.fullmatch(slug):
            raise ValueError("Slug must match ^[a-z][a-z0-9_]{0,62}$")
        if slug.startswith("pg_"):
            raise ValueError("Slug cannot start with reserved prefix 'pg_'")
