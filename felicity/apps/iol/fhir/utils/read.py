import asyncio

from apps.analysis.services.analysis import SampleService, AnalysisRequestService
from apps.patient.services import PatientService
from apps.setup.services import LaboratoryService
from apps.shipment.services import ShippedSampleService, ShipmentService
from felicity.apps.analysis.entities.analysis import Sample
from felicity.apps.analysis.utils import get_last_verificator
from felicity.apps.iol.fhir.schema import (BundleResource,
                                           DiagnosticReportResource,
                                           Identifier, PatientResource,
                                           Reference, ServiceRequestResource,
                                           SpecimenResource)
from felicity.apps.shipment.entities import Shipment, ShippedSample
from felicity.core.dtz import format_datetime


def one_of_else(of: list, one: str, default=None):
    return one if one in of else default


async def get_diagnostic_report_resource(
        service_request_uid: str, obs_uids=None, for_referral=False
) -> DiagnosticReportResource | None:
    sample_service = SampleService()
    analysis_request_service = AnalysisRequestService()

    if obs_uids is None:
        obs_uids = []

    ar, sample = await asyncio.gather(
        analysis_request_service.get(uid=service_request_uid),
        sample_service.get(analysis_request_uid=service_request_uid),
    )

    if not ar or not sample:
        return None

    analyses = await sample_service.get_analysis_results(sample.uid)
    if obs_uids:
        analyses = list(filter(lambda res: res.uid in obs_uids, analyses))

    observations = []
    for anal in analyses:
        last_verificator = await get_last_verificator(anal.uid)

        observations.append(
            {
                "type": "Observation",
                "identifier": {
                    "use": "official",
                    "type": {"text": anal.analysis.keyword},
                    "value": anal.result,
                },
                "status": anal.status,
                "issued": format_datetime(anal.date_verified),
                "performer": [
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
                            "value": last_verificator.full_name
                            if last_verificator
                            else None,
                        },
                        "display": "Reviewer",
                    },
                ],
            }
        )

    async def _resolve_based_on():
        shipped_sample_service = ShippedSampleService()

        values = [
            {
                "type": "ServiceRequest",
                "identifier": {
                    "use": "official",
                    "system": "felicity/analysisrequest/client-request-id",
                    "type": {"text": "Client Request Id"},
                    "value": ar.client_request_id,
                },
                "display": "Service Request ID",
            }
        ]

        if for_referral:
            shipped = await shipped_sample_service.get(sample_uid=sample.uid)
            values.append(
                {
                    "type": "ServiceRequest",
                    "identifier": {
                        "use": "official",
                        "system": "felicity/shipment/id",
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
                        "system": "felicity/sample/id",
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
                        "system": "felicity/sample/uid",
                        "type": {"text": "Sample UID"},
                        "value": shipped.ext_sample_uid,
                    },
                    "display": "Shipment Reference ID",
                }
            )
        return values

    sr_vars = {
        "resourceType": "DiagnosticReport",
        "identifier": [
            {
                "use": "official",
                "type": {"text": "Client Request Id"},
                "value": ar.client_request_id,
            },
            {
                "use": "official",
                "type": {"text": "Analysis Request UID"},
                "system": "felicity/analysisrequest/uid",
                "value": ar.uid,
            },
        ],
        "basedOn": await _resolve_based_on(),
        "status": sample.status,
        "code": {
            "text": "",  # sample.profiles[0].name
        },
        "subject": {
            "type": "Patient",
            "identifier": {"use": "official", "value": ar.patient_uid},
            "display": "Patient uid",
        },
        "issued": format_datetime(ar.updated_at),
        "performer": [
            {
                "type": "Analyst",
                "display": sample.submitted_by.full_name
                if sample.submitted_by
                else None,
            }
        ],
        "resultsInterpreter": [
            {
                "type": "Reviewer",
                "display": sample.verified_by.full_name if sample.verified_by else None,
            }
        ],
        "specimen": [{"type": "Specimen", "display": sample.sample_id}],
        "result": observations,
    }

    return DiagnosticReportResource(**sr_vars)


async def get_patient_resource(patient_id: str) -> PatientResource | None:
    patient_service = PatientService()

    patient = await patient_service.get(uid=patient_id)
    if not patient:
        return None

    pt_vars = {
        "resourceType": "Patient",
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
        "telecom": [{"system": "phone", "value": patient.phone_mobile, "use": "mobile"}]
        if patient.phone_mobile
        else [],
        "gender": one_of_else(["male", "female", "other"], patient.gender, "unknown"),
        "birthDate": format_datetime(patient.date_of_birth, with_time=False),
        "managingOrganization": {
            "type": "Organisation",
            "identifier": {
                "use": "official",
                "type": {"text": "National Health Record"},
                "value": patient.client.code,
            },
            "display": patient.client.name,
        },
    }

    return PatientResource(**pt_vars)


async def get_specimen_resource(specimen_id: str) -> SpecimenResource:
    sample_service = SampleService()

    sample: Sample = await sample_service.get(uid=specimen_id)
    sp_values = {
        "resourceType": "Specimen",
        "identifier": [
            {
                "use": "official",
                "system": "felicity/sample/uid",
                "value": sample.uid,
            }
        ],
        "accessionIdentifier": {
            "use": "official",
            "system": "felicity/sample/id",
            "value": sample.sample_id,
        },
        "subject": {
            "type": "Analysis Request",
            "display": sample.analysis_request.client_request_id,
        },
        "status": "available",
        "type": {
            "coding": [
                {
                    "system": "felicity/sample-type",
                    "code": sample.sample_type.abbr,
                    "display": sample.sample_type.name,
                }
            ],
            "text": "Sample Type",
        },
        "receivedTime": format_datetime(sample.date_received),
        "collection": {
            "collectedDateTime": format_datetime(sample.date_collected),
        },
    }
    return SpecimenResource(**sp_values)


async def get_shipment_bundle_resource(shipment_uid: str) -> BundleResource | None:
    laboratory_service = LaboratoryService()
    shipment_service = ShipmentService()
    shipped_sample_service = ShippedSampleService()
    sample_service = SampleService()

    shipment: Shipment = await shipment_service.get(uid=shipment_uid)
    shipped_samples: list[ShippedSample] = await shipped_sample_service.get_all(
        shipment_uid=shipment.uid
    )
    samples: list[Sample] = list(map(lambda ss: ss.sample, shipped_samples))

    async def get_service_entry(sample: Sample):
        _, analytes = await sample_service.get_referred_analyses(sample.uid)
        services_meta = [
            {
                "system": "felicity/analysis",
                "code": analyte.analysis.keyword,
                "display": analyte.analysis.name,
            }
            for analyte in analytes
        ]

        patient_resource = await get_patient_resource(
            sample.analysis_request.patient_uid
        )
        specimen_resource = await get_specimen_resource(sample.uid)

        return {
            "resource": ServiceRequestResource(
                **{
                    "resourceType": "ServiceRequest",
                    "intent": "order",
                    "requisition": Identifier(
                        **{
                            "use": "official",
                            "system": "felicity/analysisrequest/id",
                            "value": sample.analysis_request.client_request_id,
                        }
                    ),
                    "subject": patient_resource,
                    "specimen": [specimen_resource],
                    "code": {"coding": services_meta},
                }
            ),
            "request": {"method": "POST", "url": "ServiceRequest"},
        }

    service_entries = await asyncio.gather(
        *(get_service_entry(sample) for sample in samples)
    )

    laboratory = await laboratory_service.get_by_setup_name()

    bundle_vars = {
        "resourceType": "Bundle",
        "identifier": Identifier(
            **{
                "use": "official",
                "system": "felicity/shipment/id",
                "value": shipment.shipment_id,
                "assigner": Reference(
                    **{
                        "type": "Laboratory",
                        "identifier": Identifier(
                            **{
                                "use": "official",
                                "system": "felicity/laboratory/code",
                                "value": laboratory.code,
                            }
                        ),
                        "display": laboratory.lab_name,
                    }
                ),
            }
        ),
        "type": "batch",
        "timestamp": format_datetime(shipment.created_at),
        "total": len(samples),
        "entry": service_entries,
        "extension": [
            {"url": "felicity/object-type", "valueString": "shipment"},
            {"url": "felicity/courier-name", "valueString": shipment.courier},
            {"url": "felicity/shipment-comment", "valueString": shipment.comment},
            {"url": "felicity/shipment-manifest", "data": shipment.json_content},
        ],
    }
    return BundleResource(**bundle_vars)

# https://cloud.google.com/healthcare-api/docs/how-tos/fhir-bundles
# the return type of a bundle must also be a bundle of response type

# maybe this for extra metadata ?
# "meta": {
#     "extensions": []
# }
