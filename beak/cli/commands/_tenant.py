from contextlib import asynccontextmanager
from typing import AsyncIterator

from beak.apps.platform.services import TenantRegistryService
from beak.core.tenant_context import TenantContext, clear_tenant_context, set_tenant_context


@asynccontextmanager
async def tenant_context_from_slug(tenant_slug: str | None) -> AsyncIterator[dict | None]:
    """Set tenant context for CLI commands when a tenant slug is provided."""
    if not tenant_slug:
        yield None
        return

    tenant = await TenantRegistryService().get_by_slug(tenant_slug)
    if not tenant:
        raise ValueError(f"Tenant '{tenant_slug}' not found")
    if tenant["status"] != "active":
        raise ValueError(
            f"Tenant '{tenant_slug}' is not active (status={tenant['status']})"
        )

    set_tenant_context(
        TenantContext(schema_name=tenant["schema_name"], tenant_slug=tenant_slug)
    )
    try:
        yield tenant
    finally:
        clear_tenant_context()
