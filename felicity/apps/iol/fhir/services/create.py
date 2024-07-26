from requests import Request

from felicity.apps.iol.fhir.schema import BundleResource, PatientResource, ServiceRequestResource, DiagnosticReportResource, \
    Reference
from felicity.apps.job.enum import JobAction, JobCategory, JobPriority, JobState
from felicity.apps.job.schemas import JobCreate
from felicity.apps.job.services import JobService
from felicity.apps.shipment.enum import ShipmentState
from felicity.apps.shipment.schemas import ShipmentCreate
from felicity.apps.shipment.services import ReferralLaboratoryService, ShipmentService
from felicity.apps.user.entities import User


class FhirCreateService:
    def __init__(self):
        self.shipment_service = ShipmentService()
        self.referral_laboratory_service = ReferralLaboratoryService()
        self.job_service = JobService()

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
            state=ShipmentState.DUE,
        )
        shipment = await self.shipment_service.create(s_in)

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
            action=JobAction.DIAGNOSTIC_REPORT,
            category=JobCategory.SHIPMENT,
            priority=JobPriority.MEDIUM,
            job_id=0,
            status=JobState.PENDING,
            creator_uid=current_user.uid,
            data={"data": diagnostic_data.model_dump(exclude_none=True)},
        )
        await self.job_service.create(job_schema)

        return True
