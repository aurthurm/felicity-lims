from typing import List, Optional

import strawberry  # noqa
from felicity.gql import PageInfo
from felicity.gql.setup.types import DistrictType, ProvinceType
from felicity.gql.user.types import UserAuthType


@strawberry.type
class ClientType:
    uid: int
    name: str
    code: str
    district_uid: Optional[int]
    district: Optional[DistrictType]
    province_uid: Optional[int]
    province: Optional[ProvinceType]
    email: Optional[str]
    email_cc: Optional[str]
    consent_email: bool
    phone_mobile: Optional[str]
    phone_business: Optional[str]
    consent_sms: bool
    internal_use: bool
    active: bool


@strawberry.type
class ClientContactType:
    uid: int
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    mobile_phone: Optional[str]
    business_phone: Optional[str]
    is_active: Optional[bool]
    auth_uid: Optional[int]
    auth: Optional[UserAuthType]
    email: Optional[str]
    email_cc: Optional[str]
    consent_sms: bool
    client_uid: int
    client: Optional[ClientType]


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
