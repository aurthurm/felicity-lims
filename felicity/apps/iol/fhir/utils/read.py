import asyncio
from datetime import datetime
from apps.analysis.models.analysis import AnalysisRequest, Sample
from apps.analysis.utils import get_last_verificator
from apps.analysis.models.results import AnalysisResult
from apps.iol.fhir.schema import (
    DiagnosticReportResource, 
    PatientResource, 
    ServiceRequestResource,
    BundleResource,
    ObservationResource,
    Identifier,
    Reference,
    SpecimenResource,
    CodeableConcept,
)
from apps.patient.models import Patient
from apps.shipment.models import Shipment, ShippedSample
from apps.setup.models.setup import Laboratory


def one_of_else(of: list, one: str, default=None):
    return one if one in of else default

def dt_to_st(v: datetime):
    if not v: return ""
    return v.strftime("%Y-%m-%d %H:%M:%S")


async def get_diagnostic_report_resource(
    service_request_uid: str, obs_uids: list[str] = [], for_referral=False
) -> DiagnosticReportResource | None:
    ar, sample = await asyncio.gather(
        AnalysisRequest.get(uid=service_request_uid),
        Sample.get(analysis_request_uid=service_request_uid),
    )

    if not ar or not sample:
        return None

    analyses: list[AnalysisResult] = await sample.get_analysis_results()
    if obs_uids:
        analyses = list(filter(lambda res: res.uid in obs_uids, analyses))

    observations = []
    for anal in analyses:
        last_verificator = await get_last_verificator(anal.uid)

        observations.append({
            "type": "Observation",
            "identifier": {
                "use": "official",
                "type": {"text": anal.analysis.keyword },
                "value": anal.result,
            },
            "status": anal.status,
            "issued": dt_to_st(anal.date_verified),
            "performer": [
                {
                    "identifier": {
                        "use": "official", 
                        "type": {"text": "Full Name"},
                        "value": anal.submitted_by.full_name
                    },
                    "display": "Analyst"
                },
                {
                    "identifier": {
                        "use": "official", 
                        "type": {"text": "Full Name"},
                        "value": last_verificator.full_name if last_verificator else None
                    },
                    "display": "Reviewer"
                },
            ]
        })
    

    async def _resolve_based_on():
        values = [
            {
                "type": "ServiceRequest",
                "identifier": {
                    "use": "official", 
                    "system": "felicity/analysisrequest/client-request-id",
                    "type": {"text": "Client Request Id"},
                    "value": ar.client_request_id 
                },
                "display": "Service Request ID",
            }
        ]
    
        if for_referral:
            shipped: ShippedSample = await ShippedSample.get(sample_uid=sample.uid)
            values.append({
                "type": "ServiceRequest",
                "identifier": {
                    "use": "official", 
                    "system": "felicity/shipment/id",
                    "type": {"text": "Shipment Id"},
                    "value": shipped.shipment.shipment_id
                },
                "display": "Shipment Reference ID",
            })
            values.append({
                "type": "ServiceRequest",
                "identifier": {
                    "use": "official", 
                    "system": "felicity/sample/id",
                    "type": {"text": "Sample Id"},
                    "value": shipped.ext_sample_id
                },
                "display": "Shipment Reference ID",
            })
            values.append({
                "type": "ServiceRequest",
                "identifier": {
                    "use": "official", 
                    "system": "felicity/sample/uid",
                    "type": {"text": "Sample UID"},
                    "value": shipped.ext_sample_uid
                },
                "display": "Shipment Reference ID",
            })
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
            }
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
        "issued": dt_to_st(ar.updated_at),
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
                "display": sample.verified_by.full_name
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
            Identifier(**{
                "use": "official",
                "type": {"text": "Client Patient Id"},
                "value": patient.client_patient_id,
            })
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
        "birthDate": dt_to_st(patient.date_of_birth),
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
    sample: Sample = await Sample.get(uid=specimen_id)
    sp_values = {
        "resourceType": "Specimen",
        "identifier" : [
            {
                "use": "official",
                "system": "felicity/sample/uid",
                "value": sample.uid,                
            }
        ],
        "accessionIdentifier" : {
            "use": "official",
            "system": "felicity/sample/id",
            "value": sample.sample_id,                
        },
        "subject": {
            "type": "Analysis Request",
            "display": sample.analysis_request.client_request_id
        },
        "status" : "available",
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
        "receivedTime" : dt_to_st(sample.date_received),
        "collection" : { 
            "collectedDateTime" : dt_to_st(sample.date_collected),
        },
    }
    return SpecimenResource(**sp_values)

async def get_shipment_bundle_resource(shipment_uid: int) -> BundleResource | None:
    shipment: Shipment = await Shipment.get(uid=shipment_uid)
    shipped_samples: ShippedSample = await ShippedSample.get_all(shipment_uid=shipment.uid)
    samples: list[Sample] = list(map(lambda ss: ss.sample, shipped_samples))

    async def get_service_entry(sample: Sample):
        _, analytes = await sample.get_referred_analyses()
        services_meta = [{"system": "felicity/analysis", "code": analyte.analysis.keyword, "display": analyte.analysis.name} for analyte in analytes]

        patient_resource = await get_patient_resource(sample.analysis_request.patient_uid)
        specimen_resource = await get_specimen_resource(sample.uid)

        return {
            "resource": ServiceRequestResource(**{
                "resourceType": "ServiceRequest",
                "intent": "order",
                "requisition": Identifier(**{
                    "use": "official",
                    "system": "felicity/analysisrequest/id",
                    "value": sample.analysis_request.client_request_id,                     
                }),
                "subject": patient_resource,
                "specimen": [
                    specimen_resource
                ],
                "code": {
                    "coding": services_meta
                },
            }),
            "request": {
                "method": "POST",
                "url": "ServiceRequest"
            }
        }

    service_entries = await asyncio.gather(*(get_service_entry(sample) for sample in samples))

    laboratory = await Laboratory.get_by_setup_name()

    bundle_vars = {
        "resourceType": "Bundle",
        "identifier": Identifier(**{
            "use": "official",
            "system": "felicity/shipment/id",
            "value": shipment.shipment_id,
            "assigner": Reference(**{
                "type": "Laboratory",
                "identifier": Identifier(**{
                    "use": "official",
                    "system": "felicity/laboratory/code",
                    "value": laboratory.code,                    
                }),
                "display": laboratory.lab_name,
            })
        }),
        "type": "batch",
        "timestamp": dt_to_st(shipment.created_at),
        "total": len(samples),
        "entry": service_entries,
        "extension": [
            {   
                "url": "felicity/object-type",
                "valueString": "shipment"
            },
            {   
                "url": "felicity/courier-name",
                "valueString": shipment.courier
            },
            {   
                "url": "felicity/shipment-comment",
                "valueString": shipment.comment
            },
            {   
                "url": "felicity/shipment-manifest",
                "data": shipment.json_content
            }
        ]
    }
    return BundleResource(**bundle_vars)



# https://cloud.google.com/healthcare-api/docs/how-tos/fhir-bundles
# the return type of a bundle must also be a bundle of response type

# maybe this for extra metadata ?
# "meta": {
#     "extensions": []
# }