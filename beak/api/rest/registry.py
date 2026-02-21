from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import APIRouter, Depends

if TYPE_CHECKING:
    from beak.modules.registry import ModuleRegistry


def compose_rest_api(registry: ModuleRegistry) -> APIRouter:
    """Compose the REST API router from active module manifests."""
    api = APIRouter()
    from beak.api.rest.system import health_router, version_router

    from beak.modules.platform.module_access import module_dependency

    # System/ops endpoints are composition-level APIs, not module-owned.
    api.include_router(version_router)
    api.include_router(health_router)

    for manifest in registry.resolve(["core", "clinical", "pharma", "environment", "industrial"]):
        for router in manifest.rest_routers:
            if manifest.module_id == "core":
                api.include_router(router)
                continue

            api.include_router(
                router,
                dependencies=[Depends(module_dependency(manifest.module_id))],
            )

    return api
