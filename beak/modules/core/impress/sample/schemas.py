from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from beak.modules.core.analysis.schemas import SampleInDB


#
# ReportImpress Schemas
#


class ReportImpressBase(BaseModel):
    state: str | None = None
    sample_uid: str | None = None
    sample: Optional[SampleInDB] = None
    json_content: Optional[dict] = {}
    pdf_content: Optional[bytes] = None
    email_required: bool | None = False
    email_sent: bool | None = False
    sms_required: bool | None = False
    sms_sent: bool | None = False
    generated_by_uid: str | None = None
    created_by_uid: str | None = None
    updated_by_uid: str | None = None


class ReportImpressBaseInDB(ReportImpressBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ReportImpressCreate(ReportImpressBase):
    pass


# Properties to receive via API on update
class ReportImpressUpdate(ReportImpressBase):
    pass


############################################
## Schemas for Sample Metadata Harvesting ##
############################################
class UserMeta(BaseModel):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    @property
    def name(self) -> str:
        if self.first_name is None or self.last_name is None:
            return self.username
        return f"{self.first_name} {self.last_name}"


class UnitMeta(BaseModel):
    name: Optional[str] = None


class AnalysisMeta(BaseModel):
    name: Optional[str] = None
    unit: UnitMeta


class MethodMeta(BaseModel):
    name: Optional[str] = None


class InstrumentMeta(BaseModel):
    name: Optional[str] = None
    lab_name: Optional[str] = None


class AnalysisResultMeta(BaseModel):
    uid: str
    analysis: AnalysisMeta
    result: Optional[str] = None
    status: Optional[str] = None
    reportable: Optional[bool] = False
    unit: UnitMeta
    method: MethodMeta
    laboratory_instrument: InstrumentMeta
    submitted_by: UserMeta
    date_submitted: Optional[str] = None
    verified_by: UserMeta
    date_verified: Optional[str] = None


class ProfileMeta(BaseModel):
    name: Optional[str] = None


class SampleTypeMeta(BaseModel):
    name: Optional[str] = None


class PatientMeta(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    age: Optional[str] = None
    gender: Optional[str] = None


class ClientMeta(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None


class AnalysisRequestMeta(BaseModel):
    patient: PatientMeta
    client: ClientMeta
    client_request_id: Optional[str] = None


class LaboratoryMeta(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    business_phone: Optional[str] = None
    mobile_phone: Optional[str] = None
    email: Optional[str] = None
    quality_statement: Optional[str] = None


class SampleImpressMetadata(BaseModel):
    """Minimal metadata required for PDF report generation"""

    sample_id: str
    status: str
    laboratory: LaboratoryMeta
    profiles: List[ProfileMeta] = []
    analyses: List[AnalysisMeta] = []
    sample_type: SampleTypeMeta
    analysis_request: AnalysisRequestMeta
    analysis_results: List[AnalysisResultMeta] = []
    created_at: Optional[str] = None
    created_by: UserMeta
    date_collected: Optional[str] = None
    date_received: Optional[str] = None
    received_by: UserMeta
    submitted_by: UserMeta
    date_submitted: Optional[str] = None
    verified_by: UserMeta
    date_verified: Optional[str] = None
    date_published: Optional[str] = None
    published_by: UserMeta

    class Config:
        from_attributes = True
