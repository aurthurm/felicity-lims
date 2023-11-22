from fastapi import APIRouter

from api.rest.api_v1.endpoints import reports, setup, jobs
from api.rest.api_v1.fhir import r4

api = APIRouter()

api.include_router(reports.reports)
api.include_router(setup.setup)
api.include_router(jobs.jobs)
api.include_router(r4.fhir_v4)
#
