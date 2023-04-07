from datetime import datetime
from typing import Dict, Optional

from pydantic import BaseModel

from felicity.apps.analysis.schemas import SampleInDB
from felicity.core.uid_gen import FelicityIDType

#
# ReportImpress Schemas
#


class ReportImpressBase(BaseModel):
    state: Optional[str] = None
    sample_uid: Optional[FelicityIDType] = None
    sample: Optional[SampleInDB] = None
    json_content: Optional[Dict] = {}
    pdf_content: Optional[bytes] = None
    email_required: Optional[bool] = False
    email_sent: Optional[bool] = False
    sms_required: Optional[bool] = False
    sms_sent: Optional[bool] = False
    generated_by_uid: Optional[FelicityIDType] = None
    created_by_uid: Optional[FelicityIDType] = None
    updated_by_uid: Optional[FelicityIDType] = None
    date_generated: Optional[datetime] = False


class ReportImpressBaseInDB(ReportImpressBase):
    uid: Optional[FelicityIDType] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ReportImpressCreate(ReportImpressBase):
    pass


# Properties to receive via API on update
class ReportImpressUpdate(ReportImpressBase):
    pass
