"""Shared tenant/laboratory storage scoping helpers."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

from beak.core.tenant_context import get_tenant_context

ScopeKind = Literal["tenant_lab", "tenant", "global"]


@dataclass(frozen=True)
class TenantStorageScope:
    """Logical scope for shared infrastructure storage and cache keys."""

    tenant_slug: str | None = None
    laboratory_uid: str | None = None
    organization_uid: str | None = None
    scope_kind: ScopeKind = "global"

    def as_filters(self) -> dict[str, str]:
        """Mongo-compatible filters for this scope."""
        filters: dict[str, str] = {}
        if self.tenant_slug:
            filters["tenant_slug"] = self.tenant_slug
        if self.laboratory_uid:
            filters["laboratory_uid"] = self.laboratory_uid
        if self.organization_uid:
            filters["organization_uid"] = self.organization_uid
        return filters


def resolve_storage_scope(
    *,
    tenant_slug: str | None = None,
    laboratory_uid: str | None = None,
    organization_uid: str | None = None,
    require_tenant: bool = False,
    require_lab: bool = False,
) -> TenantStorageScope:
    """Resolve storage scope from explicit values with tenant-context fallback."""
    context = get_tenant_context()
    resolved_tenant = tenant_slug or (context.tenant_slug if context else None)
    resolved_lab = laboratory_uid or (context.laboratory_uid if context else None)
    resolved_org = organization_uid or (context.organization_uid if context else None)

    if require_tenant and not resolved_tenant:
        raise ValueError("Tenant slug is required for this storage operation")
    if require_lab and not resolved_lab:
        raise ValueError("Laboratory UID is required for this storage operation")

    if resolved_tenant and resolved_lab:
        kind: ScopeKind = "tenant_lab"
    elif resolved_tenant:
        kind = "tenant"
    else:
        kind = "global"

    return TenantStorageScope(
        tenant_slug=resolved_tenant,
        laboratory_uid=resolved_lab,
        organization_uid=resolved_org,
        scope_kind=kind,
    )
