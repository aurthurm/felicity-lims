from sanic import Blueprint

from api.rest.api_v1.endpoints import reports, setup
from api.rest.api_v1.fhir import r4

api = Blueprint.group(
    reports.reports,
    setup.setup,
    r4.fhir_v4,
    version=1,
    version_prefix="/api/v",
    url_prefix="/",
    strict_slashes=True,
)