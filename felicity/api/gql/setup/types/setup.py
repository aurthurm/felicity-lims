from typing import List, Optional

import strawberry  # noqa

from api.gql.types import PageInfo
from api.gql.user.types import UserType


@strawberry.type
class LaboratoryType:
    uid: str
    setup_name: str
    lab_name: str
    lab_manager_uid: str | None
    lab_manager: Optional["UserType"]
    code: str | None
    email: str | None
    email_cc: str | None
    mobile_phone: str | None
    business_phone: str | None
    address: str | None
    logo: str | None
    #
    created_by_uid: str | None
    created_by: Optional["UserType"]
    created_at: str | None
    updated_by_uid: str | None
    updated_by: Optional["UserType"]
    updated_at: str | None


@strawberry.type
class LaboratorySettingType:
    created_by_uid: str | None
    created_by: Optional["UserType"]
    created_at: str | None
    updated_by_uid: str | None
    updated_by: Optional["UserType"]
    updated_at: str | None
    uid: str
    laboratory_uid: str
    laboratory: LaboratoryType
    allow_self_verification: bool | None = False
    allow_patient_registration: bool | None = True
    allow_sample_registration: bool | None = True
    allow_worksheet_creation: bool | None = True
    default_route: str | None = None
    password_lifetime: int | None = None
    default_tat_minutes: int | None = None
    inactivity_log_out: int | None = None
    default_theme: str | None = None
    auto_receive_samples: bool | None = True
    sticker_copies: int | None = 2
    allow_auto_billing: bool | None = True
    allow_billing: bool | None = False
    currency: str | None = "USD"
    #


@strawberry.type
class SupplierType:
    uid: str
    name: str | None
    description: str | None
    #
    created_by_uid: str | None
    created_by: Optional["UserType"]
    created_at: str | None
    updated_by_uid: str | None
    updated_by: Optional["UserType"]
    updated_at: str | None


@strawberry.type
class ManufacturerType:
    uid: str
    name: str | None
    description: str | None
    #
    created_by_uid: str | None
    created_by: Optional["UserType"]
    created_at: str | None
    updated_by_uid: str | None
    updated_by: Optional["UserType"]
    updated_at: str | None


@strawberry.type
class UnitType:
    uid: str
    name: str
    is_si_unit: bool
    #
    created_by_uid: str | None
    created_by: Optional["UserType"]
    created_at: str | None
    updated_by_uid: str | None
    updated_by: Optional["UserType"]
    updated_at: str | None


@strawberry.type
class CountryType:
    uid: str
    name: str | None
    code: str | None
    active: str | None
    #
    created_by_uid: str | None
    created_by: Optional["UserType"]
    created_at: str | None
    updated_by_uid: str | None
    updated_by: Optional["UserType"]
    updated_at: str | None


@strawberry.type
class ProvinceType:
    uid: str
    code: str | None
    name: str | None
    email: str | None
    email_cc: str | None
    mobile_phone: str | None
    business_phone: str | None
    active: bool | None
    country_uid: str | None
    country: Optional[CountryType]
    #
    created_by_uid: str | None
    created_by: Optional["UserType"]
    created_at: str | None
    updated_by_uid: str | None
    updated_by: Optional["UserType"]
    updated_at: str | None


#  relay paginations
@strawberry.type
class ProvinceEdge:
    cursor: str
    node: ProvinceType


@strawberry.type
class ProvinceCursorPage:
    page_info: PageInfo
    edges: Optional[List[ProvinceEdge]]
    items: Optional[List[ProvinceType]]
    total_count: int


@strawberry.type
class DistrictType:
    uid: str
    code: str | None
    name: str | None
    email: str | None
    email_cc: str | None
    mobile_phone: str | None
    business_phone: str | None
    active: bool | None
    province_uid: str | None
    province: Optional[ProvinceType]
    #
    created_by_uid: str | None
    created_by: Optional["UserType"]
    created_at: str | None
    updated_by_uid: str | None
    updated_by: Optional["UserType"]
    updated_at: str | None


#  relay paginations
@strawberry.type
class DistrictEdge:
    cursor: str
    node: DistrictType


@strawberry.type
class DistrictCursorPage:
    page_info: PageInfo
    edges: Optional[List[DistrictEdge]]
    items: Optional[List[DistrictType]]
    total_count: int
