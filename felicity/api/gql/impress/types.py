from datetime import datetime
from typing import Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import SampleType
from felicity.api.gql.types import BytesScalar, JSONScalar
from felicity.api.gql.user.types import UserType


@strawberry.type
class ReportImpressType:
    uid: str
    state: str | None = None
    sample_uid: str | None = None
    sample: Optional[SampleType]
    json_content: Optional[JSONScalar] = None
    pdf_content: Optional[BytesScalar] = None
    email_required: bool | None = None
    email_sent: bool | None = None
    sms_required: bool | None = None
    sms_sent: bool | None = None
    generated_by_uid: str | None = None
    generated_by: UserType | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    date_generated: datetime | None = None
