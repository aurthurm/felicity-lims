from datetime import datetime
from typing import Dict, Optional

from apps.analysis.schemas import SampleInDB
from core.uid_gen import FelicityIDType
from pydantic import BaseModel

#
# ReportImpress Schemas
#


class ReportImpressBase(BaseModel):
    state: str | None = None
    sample_uid: FelicityIDType| None = None
    sample: Optional[SampleInDB] = None
    json_content: Optional[dict] = {}
    pdf_content: Optional[bytes] = None
    email_required: bool| None = False
    email_sent: bool| None = False
    sms_required: bool| None = False
    sms_sent: bool| None = False
    generated_by_uid: FelicityIDType| None = None
    created_by_uid: FelicityIDType| None = None
    updated_by_uid: FelicityIDType| None = None
    date_generated: datetime | None = False


class ReportImpressBaseInDB(ReportImpressBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ReportImpressCreate(ReportImpressBase):
    pass


# Properties to receive via API on update
class ReportImpressUpdate(ReportImpressBase):
    pass
