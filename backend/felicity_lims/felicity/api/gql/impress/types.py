from typing import Optional
from datetime import datetime

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import SampleType
from felicity.api.gql.types import JSONScalar, BytesScalar
from felicity.api.gql.user.types import UserType


@strawberry.type
class ReportImpressType:
    state: Optional[str]
    sample_uid: Optional[int]
    sample: Optional[SampleType]
    json_content: Optional[JSONScalar]
    pdf_content: Optional[BytesScalar]
    email_required: Optional[bool]
    email_sent: Optional[bool]
    sms_required: Optional[bool]
    sms_sent: Optional[bool]
    generated_by_uid: Optional[int]
    generated_by: Optional[UserType]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]
    date_generated: Optional[datetime]
