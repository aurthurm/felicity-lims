from __future__ import annotations

import time

from fastapi import HTTPException, status

from beak.modules.platform.services import TenantRegistryService
from beak.core.tenant_context import get_tenant_context

_CACHE_TTL_SECONDS = 30
_MODULE_CACHE: dict[str, tuple[set[str], float]] = {}


async def get_enabled_modules(tenant_slug: str) -> set[str]:
    now = time.time()
    cached = _MODULE_CACHE.get(tenant_slug)
    if cached:
        modules, expires_at = cached
        if expires_at > now:
            return modules

    tenant = await TenantRegistryService().get_by_slug(tenant_slug)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Tenant '{tenant_slug}' not found",
        )

    modules = set(tenant.get("enabled_modules", ["core", "clinical"]))
    _MODULE_CACHE[tenant_slug] = (modules, now + _CACHE_TTL_SECONDS)
    return modules


async def ensure_module_enabled_for_current_tenant(module_id: str) -> None:
    context = get_tenant_context()
    if not context or not context.tenant_slug:
        return

    modules = await get_enabled_modules(context.tenant_slug)
    if module_id not in modules:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Module '{module_id}' is not enabled for tenant '{context.tenant_slug}'",
        )


def module_dependency(module_id: str):
    async def _dep() -> None:
        await ensure_module_enabled_for_current_tenant(module_id)

    return _dep
