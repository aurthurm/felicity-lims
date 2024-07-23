from sanic import Request

from domain.iol.fhir.schema import (
    BundleResource,
    PatientResource,
    ServiceRequestResource,
    DiagnosticReportResource,
    Reference,
)
from domain.iol.ports.service import IFhirCreateService
from domain.job.enum import JobActions, JobCategories, JobStates
from domain.job.ports.service import IJobService
from domain.job.schemas import JobCreate
from domain.shared.utils.serialisers import marshal
from domain.shipment.enum import ShipmentStates
from domain.shipment.ports.service import (
    IShipmentService,
    IReferralLaboratoryService,
)
from domain.shipment.schemas import ShipmentCreate
from domain.user.schemas import User


class FhirCreateService(IFhirCreateService):
    def __init__(
        self,
        shipment_service: IShipmentService,
        referral_laboratory_service: IReferralLaboratoryService,
        job_service: IJobService,
    ):
        self.shipment_service = shipment_service
        self.referral_laboratory_service = referral_laboratory_service
        self.job_service = job_service

    async def create_resource(
        self,
        resource_type: str,
        resource_data: BundleResource
        | PatientResource
        | ServiceRequestResource
        | DiagnosticReportResource,
        request: Request,
        current_user: User,
    ):
        # logger.info(f"create resource {resource_type} ..................")
        resource_mappings = {
            "Bundle": self.create_bundle,
            "DiagnosticReport": self.create_diagnostic_report,
        }
        if resource_type not in resource_mappings:
            return False
        return await resource_mappings[resource_type](
            resource_data, request, current_user
        )

    async def create_bundle(
        self, resource_data: BundleResource, request: Request, current_user: User
    ):
        # logger.info(f"Bundle data: ........")
        if resource_data.extension[0].valueString == "shipment":
            await self.create_inbound_shipment(resource_data, request, current_user)

        return True

    async def create_inbound_shipment(
        self, payload: BundleResource, request: Request, current_user: User
    ):
        """Create inbound shipment from bundle"""
        # logger.info(f"Incoming Inbound shipment ....")

        data = payload.model_dump(exclude_none=True)

        laboratory = await self.resolve_ref_laboratory(
            payload.identifier.assigner, request
        )

        s_in = ShipmentCreate(
            comment=payload.extension[2].valueString,
            courier=payload.extension[1].valueString,
            assigned_count=payload.total,
            laboratory_uid=laboratory.uid,
            data=data,
            incoming=True,
            state=ShipmentStates.DUE,
        )
        shipment = await self.shipment_service.create(**marshal(s_in))

        try:
            await self.shipment_service.gen_pdf_manifest(
                payload.extension[3].data.get("data", None), shipment
            )
        except Exception:
            pass

    async def resolve_ref_laboratory(self, ref: Reference, request: Request):
        referral = await self.referral_laboratory_service.get(code=ref.identifier.value)
        if referral:
            return referral
        return await self.referral_laboratory_service.create(
            **{
                "name": ref.display,
                "code": ref.identifier.value,
                "url": request.headers.get("host", ""),
                "is_reference": True,
                "is_referral": False,
                "username": "changeme",
                "password": "changeme",
            }
        )

    async def create_diagnostic_report(
        self,
        diagnostic_data: DiagnosticReportResource,
        request: Request,
        current_user: User,
    ):
        job_schema = JobCreate(
            action=JobActions.DIAGNOSTIC_REPORT,
            category=JobCategories.SHIPMENT,
            priority=JobCategories.MEDIUM,
            job_id=0,
            status=JobStates.PENDING,
            creator_uid=current_user.uid,
            data={"data": diagnostic_data.model_dump(exclude_none=True)},
        )
        await self.job_service.create(**marshal(job_schema))

        return True
