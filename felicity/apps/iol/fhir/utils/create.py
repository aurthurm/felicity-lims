import logging

from apps.analysis.models.analysis import AnalysisRequest, Sample
from apps.analysis.models.results import AnalysisResult
from apps.iol.fhir.schema import DiagnosticReportResource, PatientResource, BundleResource,ServiceRequestResource
from apps.patient.models import Patient

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
        logger.info(f"This is a shipment creation Ask")
        
    return True


async def create_shipment():
    ...