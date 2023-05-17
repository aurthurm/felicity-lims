import asyncio
from apps.analysis.models.analysis import AnalysisRequest, Sample
from apps.analysis.models.results import AnalysisResult
from apps.iol.fhir.schema import DiagnosticReportResource, PatientResource, BundleResource
from apps.patient.models import Patient
from apps.shipment.models import Shipment, ShipedSample


def one_of_else(of: list, one: str, default=None):
    return one if one in of else default


async def get_diagnostic_report_resource(
    service_request_id: int,
) -> DiagnosticReportResource | None:
    ar, sample = await asyncio.gather(
        AnalysisRequest.get(uid=service_request_id),
        Sample.get(analysis_request_uid=service_request_id),
    )

    if not ar or not sample:
        return None

    analyses: list[AnalysisResult] = await sample.get_analysis_results()
    observations = [
        {
            "type": "Observation",
            "identifier": {
                "use": "official",
                "type": {"text": anal.analysis.keyword},
                "value": anal.result,
            },
            "display": anal.analysis.name,
        }
        for anal in analyses
    ]

    sr_vars = {
        "resourceType": "DiagnosticReport",
        "identifier": [
            {
                "use": "official",
                "type": {"text": "Client Request Id"},
                "value": ar.client_request_id,
            }
        ],
        "basedOn": [
            {
                "type": "ServiceRequest",
                "identifier": {"use": "official", "value": ar.uid},
                "display": "Service Request Id",
            }
        ],
        # R!  registered | partial | preliminary | final +
        "status": sample.status,
        "code": {
            "text": "",  # sample.profiles[0].name
        },
        "subject": {
            "type": "Patient",
            "identifier": {"use": "official", "value": ar.patient_uid},
            "display": "Patient uid",
        },
        "issued": ar.updated_at,
        "performer": [
            {
                "type": "Scientist",
                "display": sample.submitted_by.first_name
                if sample.submitted_by
                else None,
            }
        ],
        "resultsInterpreter": [
            {
                "type": "Scientist",
                "display": sample.verified_by.first_name
                if sample.verified_by
                else None,
            }
        ],
        "specimen": [{"type": "Specimen", "display": sample.sample_id}],
        "result": observations,
    }

    return DiagnosticReportResource(**sr_vars)


async def get_patient_resource(patient_id: int) -> PatientResource | None:
    patient: Patient = await Patient.get(uid=patient_id)
    if not patient:
        return None

    pt_vars = {
        "resourceType": "Patient",
        "identifier": [
            {
                "use": "official",
                "type": {"text": "Client Patient Id"},
                "value": patient.client_patient_id,
            }
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
        "birthDate": patient.date_of_birth,
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


async def get_shipment_bundle_resource(shipment_uid: int) -> BundleResource | None:
    shipment: Shipment = await Shipment.get(uid=shipment_uid)
    shipped_samples: ShipedSample = await ShipedSample.get_all(shipment_uid=shipment.uid)
    samples: list[Sample] = list(map(lambda ss: ss.sample, shipped_samples))

    async def get_service_entry(sample: Sample):
        analytes: list[AnalysisResult] = await sample.get_referred_analyses()
        tests_meta = [{"system": "felicity/analysis", "code": analyte.analysis.keyword, "display": analyte.analysis.name} for analyte in analytes]
        return {
            "resource": {
                "resourceType": "ServiceRequest",
                "code": {
                    "coding": tests_meta
                }
            },
            "request": {
                "method": "POST",
                "url": "ServiceRequest"
            }
        }

    service_entries = await asyncio.gather(*(get_service_entry(sample) for sample in samples))

    bundle_vars = {
        "resourceType": "Bundle",
        "identifier": shipment.shipment_id,
        "type": "batch",
        "timestamp": shipment.created_at,
        "total": len(samples),
        "entry": service_entries,
        "extension": [
            {
                "valueString": "shipment"
            }
        ]
    }
    return BundleResource(**bundle_vars)
