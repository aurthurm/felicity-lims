import logging
import json
from apps.analysis.models.analysis import AnalysisRequest, Sample
from apps.analysis.models.results import AnalysisResult
from apps.iol.fhir.schema import DiagnosticReportResource, PatientResource, BundleResource,ServiceRequestResource
from apps.patient.models import Patient
from apps.shipment.schemas import ShipmentCreate
from apps.shipment.models import Shipment
from apps.shipment.conf import shipment_states


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def create_resource(resource_type: str, resource_data: BundleResource | PatientResource | ServiceRequestResource):
    logger.info(f"create resource {resource_type} ..................")
    resource_mappings = {
        "Bundle": create_bundle,
    }
    if not resource_type in resource_mappings:
        return False
    return await resource_mappings[resource_type](resource_data)


async def create_bundle(resource_data: BundleResource):
    logger.info(f"Bundle data: ........")
    if resource_data.extension[0].valueString == "shipment":
        await create_inbound_shipment(resource_data)
        
    return True


async def create_inbound_shipment(payload: BundleResource):
    """Create inbound shipment from bundle"""
    logger.info(f"Incoming Inbound shipment ....")

    data = payload.dict(exclude_none=True)
    data["timestamp"] = payload.timestamp.strftime("%Y-%m-%d %H:%M:%S")

    s_in = ShipmentCreate(
        comment="",
        courier="",
        assigned_count=payload.total,
        laboratory_uid=None,
        data=data,
        incoming=True,
        state=shipment_states.DUE,
    )
    await Shipment.create(s_in)