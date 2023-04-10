from datetime import datetime
from typing import Optional

import strawberry  # noqa
from api.gql.analysis.types.analysis import SampleType
from api.gql.types import BytesScalar, JSONScalar
from api.gql.user.types import UserType
from core.uid_gen import FelicityID


@strawberry.type
class ReportImpressType:
    uid: FelicityID
    state: Optional[str]
    sample_uid: Optional[FelicityID]
    sample: Optional[SampleType]
    json_content: Optional[JSONScalar]
    pdf_content: Optional[BytesScalar]
    email_required: Optional[bool]
    email_sent: Optional[bool]
    sms_required: Optional[bool]
    sms_sent: Optional[bool]
    generated_by_uid: Optional[FelicityID]
    generated_by: Optional[UserType]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    date_generated: Optional[datetime]
