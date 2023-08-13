import json
from sanic import Blueprint
from sanic.request import Request
from sanic.exceptions import SanicException
from apps.iol.fhir.schema import (
    BundleResource,
    DiagnosticReportResource,
    PatientResource,
    ServiceRequestResource,
)
from apps.iol.fhir.utils import get_diagnostic_report_resource, get_patient_resource, create_resource
from apps.user import models as user_models

fhir_v4 = Blueprint('fhir-v4', url_prefix="/fhir")


@fhir_v4.post("/{resource_type}")
async def add_resource(
    request: Request, 
    resource_type: str, 
    current_user: user_models.User,
    ):
    """
    Add a fhir resource
    Supported Resources are Bundle, ServiceRequest and Patient
    """
    if not "authenticated" in request.auth.scopes:
        return SanicException("You are not authenticated", status_code=400)
    
    user_auth = await user_models.UserAuth.get_by_username(request.user.username)
    current_user = await user_models.User.get(auth_uid=user_auth.uid)

    data = json.loads(await request.json())

    resources = {
        "Bundle": BundleResource,
        "DiagnosticReport": DiagnosticReportResource,
        "ServiceRequest": ServiceRequestResource,
        "Patient": PatientResource,
    }
    if resource_type not in resources:
        raise SanicException(
            f"{resource_type} Resource not supported",
            status_code=417
        )
    
    mapped_data = resources[resource_type](**data)
    return await create_resource(resource_type, mapped_data, request, current_user)


@fhir_v4.get("/{resource}/{resource_id}")
async def get_resource(request, resource: str, resource_id: int,
    current_user: user_models.User,):
    """
    Supported Resources are DiagnosticReport and  Patient

    - **resource_id** A Fhir Resource ID
    """
    if resource not in ["Patient", "DiagnosticReport"]:
        raise SanicException(
            f"{resource} Resource not supported",
            status_code=417
        )

    item = None
    if resource == "Patient":
        item = await get_patient_resource(resource_id)

    if resource == "DiagnosticReport":
        item = await get_diagnostic_report_resource(resource_id)

    if not item:
        raise SanicException(
            f"{resource} with id {resource_id} not found",
            status_code=404
        )
    return item
