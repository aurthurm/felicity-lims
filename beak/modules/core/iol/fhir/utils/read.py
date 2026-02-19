from beak.modules.core.iol.fhir.services.read import FhirReadService


async def get_diagnostic_report_resource(
    service_request_uid: str, obs_uids=None, for_referral=False
):
    service = FhirReadService()
    if obs_uids is None:
        obs_uids = []
    return await service.get_diagnostic_report_resource(
        service_request_uid, obs_uids, for_referral
    )


async def get_patient_resource(patient_id: str):
    service = FhirReadService()
    return await service.get_patient_resource(patient_id)


async def get_shipment_bundle_resource(shipment_uid: str):
    service = FhirReadService()
    return await service.get_shipment_bundle_resource(shipment_uid)
