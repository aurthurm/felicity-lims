from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import APIRouter, Depends

if TYPE_CHECKING:
    from beak.modules.registry import ModuleRegistry

api = APIRouter()
_INITIALIZED = False


def init_api(registry: ModuleRegistry | None = None) -> APIRouter:
    global _INITIALIZED
    if _INITIALIZED:
        return api

    if registry is None:
        from beak.modules import get_registry

        registry = get_registry()
    from beak.modules.platform.module_access import module_dependency

    for manifest in registry.resolve(["core", "clinical", "pharma", "environment", "industrial"]):
        for router in manifest.rest_routers:
            if manifest.module_id == "core":
                api.include_router(router)
            else:
                api.include_router(
                    router,
                    dependencies=[Depends(module_dependency(manifest.module_id))],
                )

    _INITIALIZED = True
    return api
