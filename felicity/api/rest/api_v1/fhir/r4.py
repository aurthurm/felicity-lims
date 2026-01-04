from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request

from fhir.resources.bundle import Bundle, BundleEntry
from fhir.resources.diagnosticreport import DiagnosticReport
from fhir.resources.patient import Patient
from fhir.resources.servicerequest import ServiceRequest

from felicity.api.deps import get_current_user
from felicity.apps.analysis.services.analysis import AnalysisRequestService, SampleService
from felicity.apps.iol.fhir.utils import (
    create_resource,
    get_diagnostic_report_resource,
    get_patient_resource,
)
from felicity.apps.iol.fhir.services.read import FhirReadService
from felicity.apps.patient.services import PatientService
from felicity.core.dtz import to_datetime
from felicity.apps.user.schemas import User
from felicity.apps.user.services import UserService

fhir_v4 = APIRouter(tags=["fhir-v4"], prefix="/fhir")


@fhir_v4.post("/{resource_type}")
async def add_resource(
    request: Request,
    resource_type: str,
    user_service: Annotated[UserService, Depends(UserService)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    """
    Add a fhir resource
    Supported Resources are Bundle, ServiceRequest and Patient
    """
    user = await user_service.get_by_username(current_user.user_name)
    data = await request.json()

    resources = {
        "Bundle": Bundle,
        "DiagnosticReport": DiagnosticReport,
        "ServiceRequest": ServiceRequest,
        "Patient": Patient,
    }
    if resource_type not in resources:
        raise HTTPException(417, f"{resource_type} Resource not supported")

    mapped_data = resources[resource_type].model_validate(data)
    return await create_resource(resource_type, mapped_data, request, user)


@fhir_v4.get("/{resource}/{resource_id}")
async def get_resource(
    resource: str,
    resource_id: str,
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


@fhir_v4.get("/{resource}")
async def search_resource(
    resource: str,
    current_user: Annotated[User, Depends(get_current_user)],
    identifier: str | None = None,
    status: str | None = None,
    date: str | None = None,
    page: int = 1,
    count: int = 20,
    _page: int | None = None,
    _count: int | None = None,
):
    """
    Search FHIR resources with exact match filters.

    Supported resources: DiagnosticReport, Patient
    Supported params: identifier, status, date, paging (page/count)
    """
    if resource not in ["Patient", "DiagnosticReport"]:
        raise HTTPException(417, f"{resource} Resource not supported")

    page = _page or page
    count = _count or count
    page = max(page, 1)
    count = max(min(count, 100), 1)

    def _matches_date(value: str | None, target):
        if not value or not target:
            return False
        parsed = to_datetime(value)
        if "T" in value or ":" in value:
            return parsed == target
        return parsed.date() == target.date()

    def _paginate(items: list):
        total = len(items)
        start = (page - 1) * count
        end = start + count
        return items[start:end], total

    fhir_read_service = FhirReadService()

    if resource == "DiagnosticReport":
        analysis_request_service = AnalysisRequestService()
        sample_service = SampleService()
        status_filters = None
        if status:
            status_lower = status.lower()
            fhir_status_map = {
                "final": ["APPROVED", "PUBLISHED"],
                "registered": ["RECEIVED", "EXPECTED", "SCHEDULED", "STORED"],
                "preliminary": ["AWAITING", "REFERRED", "PAIRED"],
                "entered-in-error": ["INVALIDATED"],
                "cancelled": ["CANCELLED", "REJECTED"],
            }
            status_filters = fhir_status_map.get(
                status_lower, [status.upper()]
            )

        analysis_requests = []
        if identifier:
            candidates = []
            for field in ["client_request_id", "request_id", "uid"]:
                ar = await analysis_request_service.get(**{field: identifier})
                if ar:
                    candidates.append(ar)
            analysis_requests = list({ar.uid: ar for ar in candidates}.values())
        elif status_filters:
            if len(status_filters) == 1:
                samples = await sample_service.repository.filter(
                    {"status": status_filters[0]}
                )
            else:
                samples = await sample_service.repository.filter(
                    filters=[{"status": status_value} for status_value in status_filters],
                    either=True,
                )
            analysis_requests = list(
                {
                    sample.analysis_request.uid: sample.analysis_request
                    for sample in samples
                    if sample.analysis_request
                }.values()
            )
        else:
            analysis_requests = await analysis_request_service.all()

        if date:
            analysis_requests = [
                ar
                for ar in analysis_requests
                if ar.updated_at and _matches_date(date, ar.updated_at)
            ]

        if status_filters and not identifier:
            analysis_requests = [
                ar
                for ar in analysis_requests
                if ar.samples
                and any(
                    sample.status in status_filters for sample in ar.samples
                )
            ]
        elif status_filters:
            matched = []
            for ar in analysis_requests:
                sample = await sample_service.get(analysis_request_uid=ar.uid)
                if sample and sample.status in status_filters:
                    matched.append(ar)
            analysis_requests = matched

        paged_ars, total = _paginate(analysis_requests)
        reports = []
        for ar in paged_ars:
            report = await fhir_read_service.get_diagnostic_report_resource(ar.uid)
            if report:
                reports.append(report)

        return Bundle(
            type="searchset",
            total=total,
            entry=[BundleEntry(resource=r) for r in reports],
        )

    patient_service = PatientService()
    patients = []
    if identifier:
        candidates = []
        for field in ["client_patient_id", "patient_id", "uid"]:
            pt = await patient_service.get(**{field: identifier})
            if pt:
                candidates.append(pt)
        patients = list({pt.uid: pt for pt in candidates}.values())
    else:
        patients = await patient_service.all()

    if status:
        status_value = status.lower()
        if status_value in ["active", "inactive"]:
            is_active = status_value == "active"
            patients = [pt for pt in patients if pt.active == is_active]

    if date:
        patients = [
            pt
            for pt in patients
            if pt.date_of_birth and _matches_date(date, pt.date_of_birth)
        ]

    paged_patients, total = _paginate(patients)
    resources = []
    for pt in paged_patients:
        resource = await fhir_read_service.get_patient_resource(pt.uid)
        if resource:
            resources.append(resource)

    return Bundle(
        type="searchset",
        total=total,
        entry=[BundleEntry(resource=r) for r in resources],
    )
