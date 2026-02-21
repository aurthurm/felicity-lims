import asyncio
import json
from datetime import datetime

from fhir.resources.bundle import Bundle, BundleEntry, BundleEntryRequest
from fhir.resources.diagnosticreport import DiagnosticReport
from fhir.resources.extension import Extension
from fhir.resources.identifier import Identifier
from fhir.resources.observation import Observation
from fhir.resources.patient import Patient
from fhir.resources.reference import Reference
from fhir.resources.servicerequest import ServiceRequest
from fhir.resources.specimen import Specimen

from beak.modules.core.analysis.entities.analysis import Sample
from beak.modules.core.analysis.services.analysis import (
    AnalysisRequestService,
    SampleService,
)
from beak.modules.core.analysis.services.result import AnalysisResultService
from beak.modules.core.iol.fhir.utils.helpers import safe_fhir_datetime
from beak.core.dtz import format_datetime
from beak.modules.core.patient_gateway import get_patient_gateway
from beak.modules.core.setup.services import LaboratoryService
from beak.modules.core.shipment.services import ShipmentService, ShippedSampleService


class FhirReadService:
    def __init__(self):
        self.analysis_request_service = AnalysisRequestService()
        self.sample_service = SampleService()
        self.analysis_result_service = AnalysisResultService()
        self.shipped_sample_service = ShippedSampleService()
        self.shipment_service = ShipmentService()
        self.laboratory_service = LaboratoryService()

    @staticmethod
    def one_of_else(of: list, one: str, default=None):
        return one if one in of else default

    @staticmethod
    def dt_to_st(v: datetime):
        return safe_fhir_datetime(v)

    @staticmethod
    def _map_diagnostic_status(sample_status: str | None) -> str:
        if not sample_status:
            return "unknown"
        mapping = {
            "APPROVED": "final",
            "PUBLISHED": "final",
            "RECEIVED": "registered",
            "EXPECTED": "registered",
            "SCHEDULED": "registered",
            "AWAITING": "preliminary",
            "REFERRED": "preliminary",
            "PAIRED": "preliminary",
            "INVALIDATED": "entered-in-error",
            "CANCELLED": "cancelled",
            "REJECTED": "cancelled",
            "STORED": "registered",
        }
        return mapping.get(str(sample_status), "unknown")

    @staticmethod
    def _map_observation_status(result_status: str | None) -> str:
        if not result_status:
            return "unknown"
        mapping = {
            "PENDING": "registered",
            "RESULTED": "preliminary",
            "APPROVED": "final",
            "RETRACTED": "entered-in-error",
            "CANCELLED": "cancelled",
            "REFERRED": "registered",
        }
        return mapping.get(str(result_status), "unknown")

    async def get_diagnostic_report_resource(
        self, service_request_uid: str, obs_uids: list[str] = [], for_referral=False
    ) -> DiagnosticReport | None:
        ar, sample = await asyncio.gather(
            self.analysis_request_service.get(uid=service_request_uid),
            self.sample_service.get(analysis_request_uid=service_request_uid),
        )

        if not ar or not sample:
            return None

        analyses = await self.sample_service.get_analysis_results(sample.uid)
        if obs_uids:
            analyses = list(filter(lambda res: res.uid in obs_uids, analyses))

        observations = []
        result_refs = []
        for anal in analyses:
            last_verificator = await self.analysis_result_service.last_verificator(
                anal.uid
            )

            obs_id = f"obs-{anal.uid}"
            observations.append(
                Observation(
                    id=obs_id,
                    status=self._map_observation_status(anal.status),
                    code={"text": anal.analysis.keyword},
                    valueString=anal.result,
                    issued=self.dt_to_st(anal.date_verified),
                    identifier=[
                        {
                            "use": "official",
                            "type": {"text": anal.analysis.keyword},
                            "value": anal.result,
                        }
                    ],
                    performer=[
                        {
                            "identifier": {
                                "use": "official",
                                "type": {"text": "Full Name"},
                                "value": anal.submitted_by.full_name,
                            },
                            "display": "Analyst",
                        },
                        {
                            "identifier": {
                                "use": "official",
                                "type": {"text": "Full Name"},
                                "value": (
                                    last_verificator.full_name
                                    if last_verificator
                                    else None
                                ),
                            },
                            "display": "Reviewer",
                        },
                    ],
                )
            )
            result_refs.append(Reference(reference=f"#{obs_id}"))

        async def _resolve_based_on():
            values = [
                {
                    "type": "ServiceRequest",
                    "identifier": {
                        "use": "official",
                        "system": "beak/analysisrequest/client-request-id",
                        "type": {"text": "Client Request Id"},
                        "value": ar.client_request_id,
                    },
                    "display": "Service Request ID",
                }
            ]

            if for_referral:
                shipped = await self.shipped_sample_service.get(sample_uid=sample.uid)
                values.append(
                    {
                        "type": "ServiceRequest",
                        "identifier": {
                            "use": "official",
                            "system": "beak/shipment/id",
                            "type": {"text": "Shipment Id"},
                            "value": shipped.shipment.shipment_id,
                        },
                        "display": "Shipment Reference ID",
                    }
                )
                values.append(
                    {
                        "type": "ServiceRequest",
                        "identifier": {
                            "use": "official",
                            "system": "beak/sample/id",
                            "type": {"text": "Sample Id"},
                            "value": shipped.ext_sample_id,
                        },
                        "display": "Shipment Reference ID",
                    }
                )
                values.append(
                    {
                        "type": "ServiceRequest",
                        "identifier": {
                            "use": "official",
                            "system": "beak/sample/uid",
                            "type": {"text": "Sample UID"},
                            "value": shipped.ext_sample_uid,
                        },
                        "display": "Shipment Reference ID",
                    }
                )
            return values

        dr_vars = {
            "id": ar.uid,
            "identifier": [
                {
                    "use": "official",
                    "type": {"text": "Client Request Id"},
                    "value": ar.client_request_id,
                },
                {
                    "use": "official",
                    "type": {"text": "Analysis Request UID"},
                    "system": "beak/analysisrequest/uid",
                    "value": ar.uid,
                },
            ],
            "basedOn": await _resolve_based_on(),
            "status": self._map_diagnostic_status(sample.status),
            "code": {
                "text": "",
            },
            "subject": {
                "type": "Patient",
                "identifier": {"use": "official", "value": ar.patient_uid},
                "display": "Patient uid",
            },
            "issued": self.dt_to_st(ar.updated_at),
            "performer": [
                {
                    "type": "Analyst",
                    "display": (
                        sample.submitted_by.full_name if sample.submitted_by else None
                    ),
                }
            ],
            "resultsInterpreter": [
                {
                    "type": "Reviewer",
                    "display": (
                        sample.verified_by.full_name if sample.verified_by else None
                    ),
                }
            ],
            "specimen": [{"type": "Specimen", "display": sample.sample_id}],
            "result": result_refs,
            "contained": observations,
        }

        return DiagnosticReport(**dr_vars)

    async def get_patient_resource(self, patient_id: int) -> Patient | None:
        patient = await get_patient_gateway().get_patient(patient_id)
        if not patient:
            return None

        pt_vars = {
            "id": patient.uid,
            "identifier": [
                Identifier(
                    **{
                        "use": "official",
                        "type": {"text": "Client Patient Id"},
                        "value": patient.client_patient_id,
                    }
                )
            ],
            "active": True,
            "name": [
                {
                    "use": "official",
                    "text": f"{patient.first_name} {patient.last_name}",
                    "family": patient.last_name,
                    "given": [patient.first_name],
                }
            ],
            "telecom": (
                [{"system": "phone", "value": patient.phone_mobile, "use": "mobile"}]
                if patient.phone_mobile
                else []
            ),
            "gender": self.one_of_else(
                ["male", "female", "other"], patient.gender, "unknown"
            ),
            "birthDate": format_datetime(patient.date_of_birth, with_time=False),
            "managingOrganization": {
                "type": "Organization",
                "identifier": {
                    "use": "official",
                    "type": {"text": "National Health Record"},
                    "value": patient.client.code,
                },
                "display": patient.client.name,
            },
        }

        return Patient(**pt_vars)

    async def get_specimen_resource(self, specimen_id: str) -> Specimen:
        sample = await self.sample_service.get(uid=specimen_id)
        sp_values = {
            "id": sample.uid,
            "identifier": [
                {
                    "use": "official",
                    "system": "beak/sample/uid",
                    "value": sample.uid,
                }
            ],
            "accessionIdentifier": {
                "use": "official",
                "system": "beak/sample/id",
                "value": sample.sample_id,
            },
            "subject": {
                "type": "Patient",
                "identifier": {"use": "official", "value": sample.analysis_request.patient_uid},
                "display": "Patient uid",
            },
            "status": "available",
            "type": {
                "coding": [
                    {
                        "system": "beak/sample-type",
                        "code": sample.sample_type.abbr,
                        "display": sample.sample_type.name,
                    }
                ],
                "text": "Sample Type",
            },
            "receivedTime": self.dt_to_st(sample.date_received),
            "collection": {
                "collectedDateTime": self.dt_to_st(sample.date_collected),
            },
        }
        return Specimen(**sp_values)

    async def get_shipment_bundle_resource(
        self, shipment_uid: int
    ) -> Bundle | None:
        shipment = await self.shipment_service.get(uid=shipment_uid)
        shipped_samples = await self.shipped_sample_service.get_all(
            shipment_uid=shipment.uid
        )
        samples = list(map(lambda ss: ss.sample, shipped_samples))

        async def get_service_entry(sample: Sample):
            _, analytes = await self.sample_service.get_referred_analyses(sample.uid)
            services_meta = [
                {
                    "system": "beak/analysis",
                    "code": analyte.analysis.keyword,
                    "display": analyte.analysis.name,
                }
                for analyte in analytes
            ]

            patient_resource = await self.get_patient_resource(
                sample.analysis_request.patient_uid
            )
            specimen_resource = await self.get_specimen_resource(sample.uid)
            if not patient_resource or not specimen_resource:
                return None

            patient_resource.id = f"patient-{sample.analysis_request.patient_uid}"
            specimen_resource.id = f"specimen-{sample.uid}"

            return BundleEntry(
                resource=ServiceRequest(
                    status="active",
                    intent="order",
                    requisition=Identifier(
                        **{
                            "use": "official",
                            "system": "beak/analysis-request/id",
                            "value": sample.analysis_request.client_request_id,
                        }
                    ),
                    subject=Reference(
                        reference=f"#{patient_resource.id}",
                        type="Patient",
                        display=patient_resource.name[0].text if patient_resource.name else None,
                    ),
                    specimen=[
                        Reference(
                            reference=f"#{specimen_resource.id}",
                            type="Specimen",
                            display=(
                                specimen_resource.accessionIdentifier.value
                                if specimen_resource.accessionIdentifier
                                else None
                            ),
                        )
                    ],
                    code={"coding": services_meta},
                    contained=[patient_resource, specimen_resource],
                ),
                request=BundleEntryRequest(method="POST", url="ServiceRequest"),
            )

        service_entries = await asyncio.gather(
            *(get_service_entry(sample) for sample in samples)
        )
        service_entries = [entry for entry in service_entries if entry]

        laboratory = await self.laboratory_service.get_by_setup_name()

        bundle_vars = {
            "identifier": Identifier(
                **{
                    "use": "official",
                    "system": "beak/shipment/id",
                    "value": shipment.shipment_id,
                    "assigner": Reference(
                        **{
                            "type": "Organization",
                            "identifier": Identifier(
                                **{
                                    "use": "official",
                                    "system": "beak/laboratory/code",
                                    "value": laboratory.code,
                                }
                            ),
                            "display": laboratory.lab_name,
                        }
                    ),
                }
            ),
            "type": "batch",
            "timestamp": self.dt_to_st(shipment.created_at),
            "total": len(service_entries),
            "entry": service_entries,
            "extension": [
                Extension(url="beak/object-type", valueString="shipment"),
                Extension(url="beak/courier-name", valueString=shipment.courier),
                Extension(url="beak/shipment-comment", valueString=shipment.comment),
                Extension(
                    url="beak/shipment-manifest",
                    valueString=json.dumps(shipment.json_content or {}),
                ),
            ],
        }
        return Bundle(**bundle_vars)
