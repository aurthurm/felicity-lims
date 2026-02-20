from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from beak.modules.registry import ModuleRegistry


_registry: ModuleRegistry | None = None


def build_default_registry() -> ModuleRegistry:
    from beak.modules.default_registry import build_default_registry as _build_default_registry

    return _build_default_registry()


def get_registry() -> ModuleRegistry:
    global _registry
    if _registry is None:
        _registry = build_default_registry()
    return _registry


class _RegistryProxy:
    def __getattr__(self, name: str):
        return getattr(get_registry(), name)


registry = _RegistryProxy()

__all__ = ["registry", "build_default_registry", "get_registry"]
