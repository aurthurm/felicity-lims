from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from api.gql import PageInfo
from api.gql.setup.types import DistrictType, ProvinceType
from api.gql.user.types import UserAuthType, UserType
from core.uid_gen import FelicityID


@strawberry.type
class ClientType:
    uid: FelicityID
    name: str
    code: str
    district_uid: Optional[FelicityID]
    district: Optional[DistrictType]
    province_uid: Optional[FelicityID]
    province: Optional[ProvinceType]
    email: Optional[str]
    email_cc: Optional[str]
    consent_email: bool
    phone_mobile: Optional[str]
    phone_business: Optional[str]
    consent_sms: bool
    internal_use: bool
    active: bool
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]
    updated_at: Optional[datetime]


@strawberry.type
class ClientContactType:
    uid: FelicityID
    first_name: Optional[str]
    last_name: Optional[str]
    email: Optional[str]
    mobile_phone: Optional[str]
    business_phone: Optional[str]
    is_active: Optional[bool]
    email: Optional[str]
    email_cc: Optional[str]
    consent_sms: bool
    client_uid: FelicityID
    client: Optional[ClientType]
    #
    created_at: Optional[datetime]
    creator_name: Optional[str]
    creator_uid: Optional[FelicityID]
    updated_at: Optional[datetime]
    updator_name: Optional[str]
    updator_uid: Optional[FelicityID]


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
