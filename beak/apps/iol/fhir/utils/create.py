from fastapi import Request

from beak.apps.iol.fhir.services.create import FhirCreateService
from beak.apps.user.entities import User


async def create_resource(
    resource_type: str, resource_data, request: Request, current_user: User
):
    service = FhirCreateService()
    return await service.create_resource(
        resource_type, resource_data, request, current_user
    )
