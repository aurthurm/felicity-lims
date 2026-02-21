"""Shared infrastructure clients for storage and cache."""

from beak.modules.shared.infrastructure.scope import TenantStorageScope, resolve_storage_scope

__all__ = ["TenantStorageScope", "resolve_storage_scope"]
