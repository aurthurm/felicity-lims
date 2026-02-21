from typing import Protocol


class TenantRegistryProvider(Protocol):
    async def list_active(self) -> list[dict]:
        """Return active tenant records."""


class NullTenantRegistryProvider:
    async def list_active(self) -> list[dict]:
        return []


_tenant_registry_provider: TenantRegistryProvider = NullTenantRegistryProvider()


def register_tenant_registry_provider(provider: TenantRegistryProvider) -> None:
    global _tenant_registry_provider
    _tenant_registry_provider = provider


def get_tenant_registry_provider() -> TenantRegistryProvider:
    return _tenant_registry_provider
