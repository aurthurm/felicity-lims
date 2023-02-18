from fastapi import APIRouter
from felicity.api.rest.api_v1.endpoints import login, reports, setup
from felicity.api.rest.api_v1.fhir import r4

api_router = APIRouter()
api_router.include_router(login.router, prefix="/login", tags=["login"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(setup.router, prefix="/setup", tags=["setup"])
api_router.include_router(r4.router, prefix="/experimental/fhir/r4", tags=["fhir"])
