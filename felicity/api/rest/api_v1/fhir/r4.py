import json
from apps.iol.fhir.schema import (
    BundleResource,
    DiagnosticReportResource,
    PatientResource,
    ServiceRequestResource,
)
from apps.iol.fhir.utils import get_diagnostic_report_resource, get_patient_resource, create_resource
from fastapi import APIRouter, HTTPException, status, Request

router = APIRouter()


@router.post("/{resource_type}", status_code=201)
async def add_resource(resource_type: str, request: Request):
    """
    Add a fhir resource
    Supported Resources are Bundle, ServiceRequest and Patient
    """
    data = json.loads(await request.json())
    resources = {
        "Bundle": BundleResource,
        "ServiceRequest": ServiceRequestResource,
        "Patient": PatientResource,
    }
    if resource_type not in resources:
        raise HTTPException(
            status_code=status.HTTP_417_EXPECTATION_FAILED,
            detail=f"{resource_type} Resource not supported",
        )
    
    mapped_data = resources[resource_type](**data)
    return await create_resource(resource_type, mapped_data, request)


@router.get(
    "/{resource}/{resource_id}",
    response_model=DiagnosticReportResource | PatientResource,
    summary="Get a fhir Resource by id",
)
async def get_resource(resource: str, resource_id: int):
    """
    Supported Resources are DiagnosticReport and  Patient

    - **resource_id** A Fhir Resource ID
    """
    if resource not in ["Patient", "DiagnosticReport"]:
        raise HTTPException(
            status_code=status.HTTP_417_EXPECTATION_FAILED,
            detail=f"{resource} Resource not supported",
        )

    item = None
    if resource == "Patient":
        item = await get_patient_resource(resource_id)

    if resource == "DiagnosticReport":
        item = await get_diagnostic_report_resource(resource_id)

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} with id {resource_id} not found",
        )
    return item
