from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import UserType
from felicity.apps.setup.services import LaboratorySettingService, OrganizationSettingService
from felicity.apps.billing.enum import PaymentStatus


@strawberry.type
class SupplierType:
    uid: str
    name: str | None = None
    description: str | None = None
    #
    created_by_uid: str | None = None
    created_by: Optional[UserType] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional[UserType] = None
    updated_at: str | None = None


@strawberry.type
class ManufacturerType:
    uid: str
    name: str | None = None
    description: str | None = None
    #
    created_by_uid: str | None = None
    created_by: Optional[UserType] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional[UserType] = None
    updated_at: str | None = None


@strawberry.type
class UnitType:
    uid: str
    name: str
    description: str | None = None
    #
    created_by_uid: str | None = None
    created_by: Optional[UserType] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional[UserType] = None
    updated_at: str | None = None


@strawberry.type
class CountryType:
    uid: str
    name: str | None = None
    code: str | None = None
    active: str | None = None
    #
    created_by_uid: str | None = None
    created_by: Optional[UserType] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional[UserType] = None
    updated_at: str | None = None


@strawberry.type
class ProvinceType:
    uid: str
    code: str | None = None
    name: str | None = None
    email: str | None = None
    email_cc: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    active: bool | None = None
    country_uid: str | None = None
    country: Optional[CountryType] = None
    #
    created_by_uid: str | None = None
    created_by: Optional[UserType] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional[UserType] = None
    updated_at: str | None = None


#  relay paginations
@strawberry.type
class ProvinceEdge:
    cursor: str
    node: ProvinceType


@strawberry.type
class ProvinceCursorPage:
    page_info: PageInfo
    edges: Optional[List[ProvinceEdge]] = None
    items: Optional[List[ProvinceType]] = None
    total_count: int


@strawberry.type
class DistrictType:
    uid: str
    code: str | None = None
    name: str | None = None
    email: str | None = None
    email_cc: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    active: bool | None = None
    province_uid: str | None = None
    province: Optional[ProvinceType] = None
    #
    created_by_uid: str | None = None
    created_by: Optional[UserType] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional[UserType] = None
    updated_at: str | None = None


#  relay paginations
@strawberry.type
class DistrictEdge:
    cursor: str
    node: DistrictType


@strawberry.type
class DistrictCursorPage:
    page_info: PageInfo
    edges: Optional[List[DistrictEdge]] = None
    items: Optional[List[DistrictType]] = None
    total_count: int


@strawberry.type
class OrganizationType:
    uid: str
    name: str
    setup_name: str
    tag_line: str | None = None
    timezone: str | None = None
    code: str | None = None
    email: str | None = None
    email_cc: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    address: str | None = None
    banking: str | None = None
    logo: str | None = None
    quality_statement: str | None = None
    country_uid: str | None = None
    country: CountryType | None = None
    province_uid: str | None = None
    province: ProvinceType | None = None
    district_uid: str | None = None
    district: DistrictType | None = None
    #
    created_by_uid: str | None = None
    created_by: Optional[UserType] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional[UserType] = None
    updated_at: str | None = None

    @strawberry.field
    async def settings(self, info) -> "OrganizationSettingType":
        return await OrganizationSettingService().get(organization_uid=self.uid)


@strawberry.type
class OrganizationSettingType:
    uid: str
    organization_uid: str | None = None
    organization: OrganizationType | None = None
    password_lifetime: int | None = None
    inactivity_log_out: int | None = None
    allow_auto_billing: bool | None = True
    allow_billing: bool | None = False
    process_billed_only: bool | None = False
    min_payment_status: PaymentStatus | None = None
    min_partial_perentage: float | None = 0.5
    currency: str | None = "USD"
    payment_terms_days: int | None = 0
    #
    created_by_uid: str | None = None
    created_by: Optional[UserType] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional[UserType] = None
    updated_at: str | None = None


@strawberry.type
class LaboratoryType:
    uid: str
    name: str
    organization_uid: str | None = None
    organization: OrganizationType | None = None
    tag_line: str | None = None
    lab_manager_uid: str | None = None
    lab_manager: Optional[UserType] = None
    code: str | None = None
    email: str | None = None
    email_cc: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    address: str | None = None
    banking: str | None = None
    logo: str | None = None
    quality_statement: str | None = None
    country_uid: str | None = None
    country: CountryType | None = None
    province_uid: str | None = None
    province: ProvinceType | None = None
    district_uid: str | None = None
    district: DistrictType | None = None
    #
    created_by_uid: str | None = None
    created_by: Optional[UserType] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional[UserType] = None
    updated_at: str | None = None

    @strawberry.field
    async def settings(self, info) -> Optional["LaboratorySettingType"]:
        print(f"lab uid == {self.uid}")
        l = await LaboratorySettingService().get(laboratory_uid=self.uid)
        print(f"lab  == {l}")
        return l


@strawberry.type
class LaboratoryEdge:
    cursor: str
    node: LaboratoryType


@strawberry.type
class LaboratoryCursorPage:
    page_info: PageInfo
    edges: Optional[List[LaboratoryEdge]] = None
    items: Optional[List[LaboratoryType]] = None
    total_count: int


@strawberry.type
class LaboratorySettingType:
    created_by_uid: str | None = None
    created_by: Optional[UserType] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional[UserType] = None
    updated_at: str | None = None
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
    process_billed_only: bool | None = False
    min_payment_status: PaymentStatus | None = None
    min_partial_perentage: float | None = 0.5
    currency: str | None = "USD"
    payment_terms_days: int | None = 0
    #
