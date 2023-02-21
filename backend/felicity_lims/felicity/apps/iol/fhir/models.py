from sqlalchemy.dialects.postgresql import JSONB


class BaseFhirModel:
    status: str
    incoming: False
    content: JSONB


class FhirTask(BaseFhirModel):
    pass


class FhirServiceRequest(BaseFhirModel):
    pass


class FhirPatient(BaseFhirModel):
    pass


class FhirObservation(BaseFhirModel):
    pass


class FhirDiagnosticReport(BaseFhirModel):
    pass
