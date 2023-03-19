from typing import Union

from fastapi import APIRouter, HTTPException, status

from felicity.apps.iol.fhir.schema import (
    DiagnosticReportResource,
    PatientResource,
    ServiceRequestResource,
)
from felicity.apps.iol.fhir.utils import (
    get_diagnostic_report_resource,
    get_patient_resource,
)

router = APIRouter()


@router.post("/{resource}", status_code=201)
async def add_resource(resource: str, item: PatientResource | ServiceRequestResource):
    """
    Add a fhir resource
    Supported Resources are ServiceRequest and  Patient
    """
    if resource not in ["Patient", "ServiceRequest"]:
        raise HTTPException(
            status_code=status.HTTP_417_EXPECTATION_FAILED,
            detail=f"{resource} Resource not supported",
        )
    if item.resourceType != resource:
        raise HTTPException(
            status_code=status.HTTP_417_EXPECTATION_FAILED,
            detail=f"{item.resourceType} Resource not " f"supported",
        )
    return None


@router.get(
    "/{resource}/{resource_id}",
    response_model=Union[DiagnosticReportResource],
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
