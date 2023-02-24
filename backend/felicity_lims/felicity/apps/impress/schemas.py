from typing import Dict, Optional
import json
from datetime import datetime
from felicity.apps.analysis.schemas import SampleInDB
from pydantic import BaseModel


#
# ReportImpress Schemas
#

class ReportImpressBase(BaseModel):
    state: Optional[str] = None
    sample_uid: Optional[int] = None
    sample: Optional[SampleInDB] = None
    json_content: Optional[Dict] = {}
    pdf_content: Optional[bytes] = None
    email_required: Optional[bool] = False
    email_sent: Optional[bool] = False
    sms_required: Optional[bool] = False
    sms_sent: Optional[bool] = False
    generated_by_uid: Optional[int] = None
    created_by_uid: Optional[int] = None
    updated_by_uid: Optional[int] = None
    date_generated: Optional[datetime] = False


class ReportImpressBaseInDB(ReportImpressBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ReportImpressCreate(ReportImpressBase):
    pass


# Properties to receive via API on update
class ReportImpressUpdate(ReportImpressBase):
    pass
