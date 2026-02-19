from fastapi import APIRouter
from fastapi import Depends

from beak.modules.platform.module_access import module_dependency
from beak.modules import registry

api = APIRouter()

for manifest in registry.resolve(["core", "clinical", "pharma", "environment", "industrial"]):
    for router in manifest.rest_routers:
        if manifest.module_id == "core":
            api.include_router(router)
        else:
            api.include_router(
                router,
                dependencies=[Depends(module_dependency(manifest.module_id))],
            )
