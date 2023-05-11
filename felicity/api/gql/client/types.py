from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from api.gql import PageInfo
from api.gql.setup.types import DistrictType, ProvinceType
from api.gql.user.types import UserAuthType, UserType



@strawberry.type
class ClientType:
    uid: str
    name: str
    code: str
    district_uid: str | None
    district: Optional[DistrictType]
    province_uid: str | None
    province: Optional[ProvinceType]
    email: str | None
    email_cc: str | None
    consent_email: bool
    phone_mobile: str | None
    phone_business: str | None
    consent_sms: bool
    internal_use: bool
    active: bool
    #
    created_by_uid: str | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class ClientContactType:
    uid: str
    first_name: str | None
    last_name: str | None
    email: str | None
    mobile_phone: str | None
    business_phone: str | None
    is_active: bool| None
    email: str | None
    email_cc: str | None
    consent_sms: bool
    client_uid: str
    client: Optional[ClientType]
    #
    created_at: datetime | None
    creator_name: str | None
    creator_uid: str | None
    updated_at: datetime | None
    updator_name: str | None
    updator_uid: str | None


#  relay paginations
@strawberry.type
class ClientEdge:
    cursor: str
    node: ClientType


@strawberry.type
class ClientCursorPage:
    page_info: PageInfo
    edges: Optional[List[ClientEdge]]
    items: Optional[List[ClientType]]
    total_count: int
