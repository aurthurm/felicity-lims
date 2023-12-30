import json
from typing import Annotated

from fastapi import APIRouter, HTTPException, Depends, Request

from api.deps import get_current_user
from apps.iol.fhir.schema import (
    BundleResource,
    DiagnosticReportResource,
    PatientResource,
    ServiceRequestResource,
)
from apps.iol.fhir.utils import (
    get_diagnostic_report_resource,
    get_patient_resource,
    create_resource,
)
from apps.user import models as user_models
from apps.user.schemas import User

fhir_v4 = APIRouter(tags=["fhir-v4"], prefix="/fhir")


@fhir_v4.post("/{resource_type}")
async def add_resource(
    request: Request,
    resource_type: str,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Add a fhir resource
    Supported Resources are Bundle, ServiceRequest and Patient
    """
    user_auth = await user_models.UserAuth.get_by_username(current_user.username)
    current_user = await user_models.User.get(auth_uid=user_auth.uid)

    data = json.loads(await request.json())

    resources = {
        "Bundle": BundleResource,
        "DiagnosticReport": DiagnosticReportResource,
        "ServiceRequest": ServiceRequestResource,
        "Patient": PatientResource,
    }
    if resource_type not in resources:
        raise HTTPException(417, f"{resource_type} Resource not supported")

    mapped_data = resources[resource_type](**data)
    return await create_resource(resource_type, mapped_data, request, current_user)


@fhir_v4.get("/{resource}/{resource_id}")
async def get_resource(
    resource: str,
    resource_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Supported Resources are DiagnosticReport and  Patient

    - **resource_id** A Fhir Resource ID
    """
    if resource not in ["Patient", "DiagnosticReport"]:
        raise HTTPException(417, f"{resource} Resource not supported")

    item = None
    if resource == "Patient":
        item = await get_patient_resource(resource_id)

    if resource == "DiagnosticReport":
        item = await get_diagnostic_report_resource(resource_id)

    if not item:
        raise HTTPException(404, f"{resource} with id {resource_id} not found")
    return item
