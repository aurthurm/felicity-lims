from sanic import Blueprint

from api.rest.api_v1.endpoints import reports, setup, jobs
from api.rest.api_v1.fhir import r4

api = Blueprint.group(
    reports.reports,
    setup.setup,
    jobs.jobs,
    r4.fhir_v4,
    version=1,
    version_prefix="/api/v",
    url_prefix="/",
    strict_slashes=True,
)
