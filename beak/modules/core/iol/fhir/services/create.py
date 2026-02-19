import asyncio
import json
import random
import string
from datetime import timedelta

from fastapi import Request

from fhir.resources.bundle import Bundle
from fhir.resources.diagnosticreport import DiagnosticReport
from fhir.resources.extension import Extension
from fhir.resources.patient import Patient
from fhir.resources.reference import Reference
from fhir.resources.servicerequest import ServiceRequest
from fhir.resources.specimen import Specimen

from beak.modules.core.analysis.entities.analysis import sample_analysis
from beak.modules.core.analysis.enum import ResultState, SampleState
from beak.modules.core.analysis.schemas import (
    AnalysisRequestCreate,
    AnalysisResultCreate,
    SampleCreate,
)
from beak.modules.core.analysis.services.analysis import (
    AnalysisRequestService,
    AnalysisService,
    SampleService,
    SampleTypeService,
)
from beak.modules.core.analysis.services.result import AnalysisResultService
from beak.modules.core.client.services import ClientService
from beak.modules.core.impress.shipment.utils import gen_pdf_manifest
from beak.modules.core.job.enum import JobAction, JobCategory, JobPriority, JobState
from beak.modules.core.job.schemas import JobCreate
from beak.modules.core.job.services import JobService
from beak.modules.clinical.patient.schemas import PatientCreate
from beak.modules.clinical.patient.services import PatientService
from beak.modules.core.reflex.services import ReflexEngineService
from beak.modules.core.shipment.enum import ShipmentState
from beak.modules.core.shipment.schemas import ShipmentCreate
from beak.modules.core.shipment.services import ReferralLaboratoryService, ShipmentService
from beak.modules.core.identity.entities import User
from beak.core.dtz import timenow_dt


class FhirCreateService:
    def __init__(self):
        self.shipment_service = ShipmentService()
        self.referral_laboratory_service = ReferralLaboratoryService()
        self.job_service = JobService()
        self.patient_service = PatientService()
        self.client_service = ClientService()
        self.analysis_request_service = AnalysisRequestService()
        self.sample_service = SampleService()
        self.sample_type_service = SampleTypeService()
        self.analysis_service = AnalysisService()
        self.analysis_result_service = AnalysisResultService()

    async def create_resource(
        self,
        resource_type: str,
        resource_data: Bundle | Patient | ServiceRequest | DiagnosticReport,
        request: Request,
        current_user: User,
    ):
        resource_mappings = {
            "Bundle": self.create_bundle,
            "DiagnosticReport": self.create_diagnostic_report,
            "Patient": self.create_patient,
            "ServiceRequest": self.create_service_request,
        }
        if resource_type not in resource_mappings:
            return False
        return await resource_mappings[resource_type](
            resource_data, request, current_user
        )

    async def create_bundle(
        self, resource_data: Bundle, request: Request, current_user: User
    ):
        object_type_ext = self._find_extension(
            resource_data.extension, "beak/object-type"
        )
        if object_type_ext and object_type_ext.valueString == "shipment":
            await self.create_inbound_shipment(resource_data, request, current_user)

        return True

    async def create_inbound_shipment(
        self, payload: Bundle, request: Request, current_user: User
    ):
        """Create inbound shipment from bundle."""
        data = payload.model_dump(exclude_none=True)

        laboratory = await self.resolve_ref_laboratory(
            payload.identifier.assigner, request
        )
        if not laboratory:
            return False

        comment_ext = self._find_extension(
            payload.extension, "beak/shipment-comment"
        )
        courier_ext = self._find_extension(
            payload.extension, "beak/courier-name"
        )
        manifest_ext = self._find_extension(
            payload.extension, "beak/shipment-manifest"
        )

        s_in = ShipmentCreate(
            comment=comment_ext.valueString if comment_ext else None,
            courier=courier_ext.valueString if courier_ext else None,
            assigned_count=payload.total or 0,
            laboratory_uid=laboratory.uid,
            data=data,
            incoming=True,
            state=ShipmentState.DUE,
        )
        shipment = await self.shipment_service.create(s_in)

        manifest_data = self._parse_manifest(manifest_ext)
        if manifest_data:
            try:
                await gen_pdf_manifest(manifest_data, shipment)
            except Exception:
                pass

    async def resolve_ref_laboratory(self, ref: Reference, request: Request):
        if not ref or not ref.identifier or not ref.identifier.value:
            return None
        referral = await self.referral_laboratory_service.get(
            code=ref.identifier.value
        )
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
        diagnostic_data: DiagnosticReport,
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

    async def create_patient(
        self, patient_data: Patient, request: Request, current_user: User
    ):
        client_code = None
        if (
            patient_data.managingOrganization
            and patient_data.managingOrganization.identifier
        ):
            client_code = patient_data.managingOrganization.identifier.value

        client = await self.client_service.get(code=client_code)
        if not client:
            return False

        patient_identifier = (
            patient_data.identifier[0].value if patient_data.identifier else None
        )
        name = patient_data.name[0] if patient_data.name else None
        phone = None
        if patient_data.telecom:
            for telecom in patient_data.telecom:
                if telecom.system == "phone":
                    phone = telecom.value
                    break

        if not patient_identifier or not name or not name.given or not name.family:
            return False

        patient_in: dict = {
            "created_by_uid": current_user.uid,
            "updated_by_uid": current_user.uid,
            "client_patient_id": patient_identifier,
            "client_uid": client.uid,
            "first_name": name.given[0] if name and name.given else None,
            "last_name": name.family if name else None,
            "gender": patient_data.gender,
            "date_of_birth": patient_data.birthDate,
            "phone_mobile": phone,
            "consent_sms": False,
        }
        pt_sch = PatientCreate(**patient_in)
        return await self.patient_service.create(pt_sch)

    async def create_service_request(
        self, service_request: ServiceRequest, request: Request, current_user: User
    ):
        patient_resource = self._resolve_patient(service_request)
        specimen_resource = self._resolve_specimen(service_request)
        if not patient_resource or not specimen_resource:
            return False

        client_code = None
        if (
            patient_resource.managingOrganization
            and patient_resource.managingOrganization.identifier
        ):
            client_code = patient_resource.managingOrganization.identifier.value

        client = await self.client_service.get(code=client_code)
        if not client:
            return False

        diff = "".join(
            random.SystemRandom().choice(string.ascii_letters + string.digits)
            for _ in range(4)
        )
        patient_identifier = (
            patient_resource.identifier[0].value
            if patient_resource.identifier
            else None
        )

        if (
            not patient_identifier
            or not patient_resource.name
            or not patient_resource.name[0].given
            or not patient_resource.name[0].family
        ):
            return False

        patient_in: dict = {
            "created_by_uid": current_user.uid,
            "updated_by_uid": current_user.uid,
            "client_patient_id": f"{patient_identifier}{diff}",
            "client_uid": client.uid,
            "first_name": (
                patient_resource.name[0].given[0]
                if patient_resource.name and patient_resource.name[0].given
                else None
            ),
            "last_name": (
                patient_resource.name[0].family if patient_resource.name else None
            ),
            "gender": patient_resource.gender,
            "date_of_birth": patient_resource.birthDate,
            "phone_mobile": (
                next(
                    (
                        telecom.value
                        for telecom in patient_resource.telecom or []
                        if telecom.system == "phone"
                    ),
                    None,
                )
            ),
            "consent_sms": False,
        }
        pt_sch = PatientCreate(**patient_in)
        patient = await self.patient_service.create(pt_sch)

        requisition_value = (
            service_request.requisition.value
            if service_request.requisition
            else None
        )
        subject_display = (
            specimen_resource.subject.display
            if specimen_resource.subject
            else None
        )
        request_id = requisition_value or subject_display
        if not request_id:
            return False
        client_request_id = f"{request_id}{diff}"

        ar_in = {
            "patient_uid": patient.uid,
            "client_uid": patient.client_uid,
            "client_request_id": client_request_id,
            "created_by_uid": current_user.uid,
            "updated_by_uid": current_user.uid,
        }
        ar_sch = AnalysisRequestCreate(**ar_in)
        analysis_request = await self.analysis_request_service.create(ar_sch)

        sample_type_code = None
        if specimen_resource.type and specimen_resource.type.coding:
            sample_type_code = (
                specimen_resource.type.coding[0].display
                or specimen_resource.type.coding[0].code
            )

        if not sample_type_code:
            return False

        sample_type = await self.sample_type_service.get(name=sample_type_code)
        if not sample_type:
            return False
        sam_in = {
            "analysis_request_uid": analysis_request.uid,
            "sample_type_uid": sample_type.uid,
            "priority": 0,
            "status": SampleState.EXPECTED,
            "created_by_uid": current_user.uid,
            "updated_by_uid": current_user.uid,
        }

        analyses = []
        if service_request.code and service_request.code.coding:
            for coding in service_request.code.coding:
                analysis = await self.analysis_service.get(keyword=coding.code)
                if analysis:
                    analyses.append(analysis)

        tat_lengths = []
        for anal in analyses:
            if anal.tat_length_minutes:
                tat_lengths.append(anal.tat_length_minutes)
        if tat_lengths:
            minutes = max(tat_lengths)
            sam_in["due_date"] = timenow_dt() + timedelta(minutes=minutes)

        sa_sch = SampleCreate(**sam_in)
        sample = await self.sample_service.create(sa_sch)

        await sample.receive(received_by=current_user)

        for _anal in analyses:
            await self.sample_service.repository.table_insert(
                table=sample_analysis,
                mappings=[{"sample_uid": sample.uid, "analysis_uid": _anal.uid}],
            )

        a_result_schema = AnalysisResultCreate(
            sample_uid=sample.uid,
            status=ResultState.PENDING,
            analysis_uid=None,
            due_date=None,
            created_by_uid=current_user.uid,
            updated_by_uid=current_user.uid,
        )

        result_schemas = []
        for _service in analyses:
            result_schemas.append(
                a_result_schema.model_copy(
                    update={
                        "analysis_uid": _service.uid,
                        "due_date": (
                            timenow_dt() + timedelta(minutes=_service.tat_length_minutes)
                            if _service.tat_length_minutes
                            else None
                        ),
                    }
                )
            )
        if result_schemas:
            created = await self.analysis_result_service.bulk_create(result_schemas)
            await ReflexEngineService().set_reflex_actions(created)
            await asyncio.sleep(1)

        return True

    @staticmethod
    def _find_extension(extensions: list[Extension] | None, url: str):
        if not extensions:
            return None
        for extension in extensions:
            if extension.url == url:
                return extension
        return None

    @staticmethod
    def _parse_manifest(extension: Extension | None):
        if not extension or not extension.valueString:
            return None
        try:
            return json.loads(extension.valueString).get("data")
        except json.JSONDecodeError:
            return None

    @staticmethod
    def _resolve_contained(service_request: ServiceRequest, reference_value: str):
        if not service_request.contained:
            return None
        if reference_value.startswith("#"):
            reference_value = reference_value[1:]
        for resource in service_request.contained:
            if resource.id == reference_value:
                return resource
        return None

    def _resolve_patient(self, service_request: ServiceRequest) -> Patient | None:
        if service_request.subject and service_request.subject.reference:
            patient = self._resolve_contained(
                service_request, service_request.subject.reference
            )
            if isinstance(patient, Patient):
                return patient
        for resource in service_request.contained or []:
            if isinstance(resource, Patient):
                return resource
        return None

    def _resolve_specimen(self, service_request: ServiceRequest) -> Specimen | None:
        if service_request.specimen:
            specimen_ref = service_request.specimen[0]
            if specimen_ref.reference:
                specimen = self._resolve_contained(
                    service_request, specimen_ref.reference
                )
                if isinstance(specimen, Specimen):
                    return specimen
        for resource in service_request.contained or []:
            if isinstance(resource, Specimen):
                return resource
        return None
