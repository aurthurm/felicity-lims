from datetime import datetime
from typing import Optional

from pydantic import BaseModel
from pydantic import ConfigDict

from felicity.apps.analysis.schemas import SampleInDB


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
    date_generated: datetime | None = False


class ReportImpressBaseInDB(ReportImpressBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ReportImpressCreate(ReportImpressBase):
    pass


# Properties to receive via API on update
class ReportImpressUpdate(ReportImpressBase):
    pass
