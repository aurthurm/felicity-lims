from fastapi import APIRouter

from beak.api.rest.api_v1.endpoints import jobs
from beak.api.rest.api_v1.endpoints import reports
from beak.api.rest.api_v1.endpoints import setup
from beak.api.rest.api_v1.endpoints import version
from beak.api.rest.api_v1.endpoints import health
from beak.api.rest.api_v1.endpoints import platform
from beak.api.rest.api_v1.fhir import r4

api = APIRouter()

api.include_router(reports.reports)
api.include_router(setup.setup)
api.include_router(jobs.jobs)
api.include_router(version.version)
api.include_router(r4.fhir_v4)
api.include_router(health.health)
api.include_router(platform.platform)
