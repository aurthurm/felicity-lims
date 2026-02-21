from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import APIRouter

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
    from beak.api.rest.registry import compose_rest_api

    api.include_router(compose_rest_api(registry))

    _INITIALIZED = True
    return api
