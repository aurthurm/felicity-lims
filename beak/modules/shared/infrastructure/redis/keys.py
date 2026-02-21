"""Redis key builders for scoped and global data."""

from __future__ import annotations

from beak.modules.shared.infrastructure.scope import TenantStorageScope


def processing_key(
    *,
    uid: str,
    object_type: str,
    scope: TenantStorageScope | None,
) -> str:
    """Build processing lock key with tenant/lab namespacing when available."""
    if scope and scope.tenant_slug and scope.laboratory_uid:
        return f"processing:{scope.tenant_slug}:{scope.laboratory_uid}:{object_type}:{uid}"
    if scope and scope.tenant_slug:
        return f"processing:{scope.tenant_slug}:{object_type}:{uid}"
    return f"processing:{object_type}:{uid}"
