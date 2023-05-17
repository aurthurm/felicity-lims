from apps.analysis.models.analysis import AnalysisRequest, Sample
from apps.analysis.models.results import AnalysisResult
from apps.iol.fhir.schema import DiagnosticReportResource, PatientResource, BundleResource
from apps.patient.models import Patient


async def create_shipment_bundle_resource(patient_id: int) -> BundleResource | None:
    ...