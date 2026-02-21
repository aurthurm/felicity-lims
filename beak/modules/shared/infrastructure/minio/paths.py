"""Scoped object path helpers for MinIO."""

from __future__ import annotations

from beak.modules.shared.infrastructure.scope import TenantStorageScope


def build_scoped_object_name(
    object_name: str,
    *,
    scope: TenantStorageScope | None,
    domain: str | None = None,
) -> str:
    """Build a tenant/lab namespaced object path."""
    if scope is None or scope.scope_kind == "global":
        return object_name

    parts: list[str] = ["tenants", scope.tenant_slug or "unknown"]
    if scope.laboratory_uid:
        parts.extend(["labs", scope.laboratory_uid])
    if domain:
        parts.append(domain)
    parts.append(object_name)
    return "/".join(parts)
