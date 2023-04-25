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
    district_uid: FelicityID | None
    district: Optional[DistrictType]
    province_uid: FelicityID | None
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
    created_by_uid: FelicityID | None
    created_by: UserType | None
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None
    updated_at: datetime | None


@strawberry.type
class ClientContactType:
    uid: FelicityID
    first_name: str | None
    last_name: str | None
    email: str | None
    mobile_phone: str | None
    business_phone: str | None
    is_active: bool| None
    email: str | None
    email_cc: str | None
    consent_sms: bool
    client_uid: FelicityID
    client: Optional[ClientType]
    #
    created_at: datetime | None
    creator_name: str | None
    creator_uid: FelicityID | None
    updated_at: datetime | None
    updator_name: str | None
    updator_uid: FelicityID | None


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
