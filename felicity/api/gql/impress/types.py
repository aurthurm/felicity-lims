from datetime import datetime
from typing import Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import SampleType
from felicity.api.gql.types import BytesScalar, JSONScalar
from felicity.api.gql.user.types import UserType


@strawberry.type
class ReportImpressType:
    uid: str
    state: str | None
    sample_uid: str | None
    sample: Optional[SampleType]
    json_content: Optional[JSONScalar]
    pdf_content: Optional[BytesScalar]
    email_required: bool | None
    email_sent: bool | None
    sms_required: bool | None
    sms_sent: bool | None
    generated_by_uid: str | None
    generated_by: UserType | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_by_uid: str | None
    updated_by: UserType | None
    date_generated: datetime | None
