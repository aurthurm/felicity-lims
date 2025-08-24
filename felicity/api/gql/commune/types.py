from datetime import datetime
from typing import List, Optional

import strawberry

from felicity.api.gql.setup.types import LaboratoryType
from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import UserType
from felicity.apps.commune.sms.enum import SmsTrigger, SmsAudience


# Document Category Type
@strawberry.type
class SmsTemplateType:
    uid: str
    name: str | None
    template: str | None
    description: str | None
    target_type: str | None
    target_uid: str | None
    specification_trigger: SmsTrigger | None
    audience: SmsAudience | None
    is_active: bool = False
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


# Document Tag Type
@strawberry.type
class SmsMessageType:
    uid: str
    template_uid: str | None
    recipient: str | None
    message: str | None
    status: str | None
    sent_at: datetime | None
    target_type: str | None
    target_uid: str | None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class SmsMessageEdge:
    cursor: str
    node: SmsMessageType


@strawberry.type
class SmsMessageCursorPage:
    page_info: PageInfo
    edges: Optional[List[SmsMessageEdge]] = None
    items: Optional[List[SmsMessageType]] = None
    total_count: int
