from fastapi import APIRouter
from felicity.api.rest.api_v1.endpoints import login, reports

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
