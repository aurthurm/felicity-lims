from __future__ import annotations

from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.setup.types import DistrictType, ProvinceType, LaboratoryType
from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import UserType
from felicity.apps.client.services import ClientContactService


@strawberry.type
class ClientType:
    uid: str
    name: str
    code: str
    district_uid: str | None = None
    district: Optional[DistrictType] = None
    province_uid: str | None = None
    province: Optional[ProvinceType] = None
    email: str | None = None
    email_cc: str | None = None
    consent_email: bool
    phone_mobile: str | None = None
    phone_business: str | None = None
    consent_sms: bool
    internal_use: bool
    active: bool
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None

    @strawberry.field
    async def contacts(self) -> List[ClientContactType] | None:
        return await ClientContactService().get_all(client_uid=self.uid)


@strawberry.type
class ClientContactType:
    uid: str
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    is_active: bool | None = None
    email: str | None = None
    email_cc: str | None = None
    consent_sms: bool
    client_uid: str
    client: Optional[ClientType] = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_at: str | None = None
    creator_name: str | None = None
    creator_uid: str | None = None
    updated_at: str | None = None
    updator_name: str | None = None
    updator_uid: str | None = None


#  relay paginations
@strawberry.type
class ClientEdge:
    cursor: str
    node: ClientType


@strawberry.type
class ClientCursorPage:
    page_info: PageInfo
    edges: Optional[List[ClientEdge]] = None
    items: Optional[List[ClientType]] = None
    total_count: int
