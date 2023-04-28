from dataclasses import field
from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from api.gql import PageInfo
from api.gql.user.types import UserType
from core.uid_gen import FelicityID

@strawberry.type
class LaboratoryType:
    uid: FelicityID
    setup_name: str
    lab_name: str
    lab_manager_uid: str | None
    lab_manager: Optional["UserType"]
    email: str | None
    email_cc: str | None
    mobile_phone: str | None
    business_phone: str | None
    address: str | None
    logo: str | None
    #
    created_by_uid: FelicityID | None
    created_by: Optional["UserType"]
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: Optional["UserType"]
    updated_at: datetime | None


@strawberry.type
class LaboratorySettingType:
    created_by_uid: FelicityID | None
    created_by: Optional["UserType"]
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: Optional["UserType"]
    updated_at: datetime | None
    uid: FelicityID
    laboratory_uid: FelicityID
    laboratory: LaboratoryType
    allow_self_verification: bool| None = False
    allow_patient_registration: bool| None = True
    allow_sample_registration: bool| None = True
    allow_worksheet_creation: bool| None = True
    default_route: str | None = None
    password_lifetime: int | None = None
    inactivity_log_out: int | None = None
    default_theme: str | None = None
    auto_receive_samples: bool| None = True
    sticker_copies: int | None = 2
    #


@strawberry.type
class SupplierType:
    uid: FelicityID
    name: str | None
    description: str | None
    #
    created_by_uid: FelicityID | None
    created_by: Optional["UserType"]
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: Optional["UserType"]
    updated_at: datetime | None


@strawberry.type
class ManufacturerType:
    uid: FelicityID
    name: str | None
    description: str | None
    #
    created_by_uid: FelicityID | None
    created_by: Optional["UserType"]
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: Optional["UserType"]
    updated_at: datetime | None


@strawberry.type
class InstrumentTypeType:
    uid: FelicityID
    name: str | None
    description: str | None
    #
    created_by_uid: FelicityID | None
    created_by: Optional["UserType"]
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: Optional["UserType"]
    updated_at: datetime | None


#  relay paginations
@strawberry.type
class InstrumentTypeEdge:
    cursor: str
    node: InstrumentTypeType


@strawberry.type
class InstrumentTypeCursorPage:
    page_info: PageInfo
    edges: Optional[List[InstrumentTypeEdge]]
    items: Optional[List[InstrumentTypeType]]
    total_count: int


@strawberry.type
class UnitType:
    uid: FelicityID
    name: str
    is_si_unit: bool
    #
    created_by_uid: FelicityID | None
    created_by: Optional["UserType"]
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: Optional["UserType"]
    updated_at: datetime | None


@strawberry.type
class InstrumentType:
    uid: FelicityID
    name: str | None
    description: str | None
    keyword: str | None
    supplier_uid: FelicityID | None
    supplier: Optional[SupplierType]
    manufacturer_uid: FelicityID | None
    manufacturer: Optional[ManufacturerType]
    instrument_type_uid: FelicityID | None
    instrument_type: Optional[InstrumentTypeType]
    #
    created_by_uid: FelicityID | None
    created_by: Optional["UserType"]
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: Optional["UserType"]
    updated_at: datetime | None
    methods: Optional[List["MethodType"]] = field(default_factory=list)


#  relay paginations
@strawberry.type
class InstrumentEdge:
    cursor: str
    node: InstrumentType


@strawberry.type
class InstrumentCursorPage:
    page_info: PageInfo
    edges: Optional[List[InstrumentEdge]]
    items: Optional[List[InstrumentType]]
    total_count: int


@strawberry.type
class InstrumentCalibrationType:
    uid: FelicityID
    instrument_uid: FelicityID
    instrument: InstrumentType | None
    calibration_id: str
    date_reported: datetime
    report_id: str
    performed_by: str
    start_date: datetime
    end_date: datetime
    notes_before: str
    work_done: str
    remarks: str


@strawberry.type
class CalibrationCertificateType:
    uid: FelicityID
    instrument_uid: FelicityID
    instrument: InstrumentType | None
    certificate_code: str
    internal: bool
    issuer: str
    date_issued: datetime
    valid_from_date: datetime
    valid_to_date: datetime
    performed_by: str
    approved_by: str
    remarks: str


@strawberry.type
class MethodType:
    uid: FelicityID
    name: str | None
    description: str | None
    keyword: str | None
    #
    created_by_uid: FelicityID | None
    created_by: Optional["UserType"]
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: Optional["UserType"]
    updated_at: datetime | None
    instruments: Optional[List["InstrumentType"]] = field(default_factory=list)


#  relay paginations
@strawberry.type
class MethodEdge:
    cursor: str
    node: MethodType


@strawberry.type
class MethodCursorPage:
    page_info: PageInfo
    edges: Optional[List[MethodEdge]]
    items: Optional[List[MethodType]]
    total_count: int


@strawberry.type
class CountryType:
    uid: FelicityID
    name: str | None
    code: str | None
    active: str | None
    #
    created_by_uid: FelicityID | None
    created_by: Optional["UserType"]
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: Optional["UserType"]
    updated_at: datetime | None


@strawberry.type
class ProvinceType:
    uid: FelicityID
    code: str | None
    name: str | None
    email: str | None
    email_cc: str | None
    mobile_phone: str | None
    business_phone: str | None
    active: bool| None
    country_uid: FelicityID | None
    country: Optional[CountryType]
    #
    created_by_uid: FelicityID | None
    created_by: Optional["UserType"]
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: Optional["UserType"]
    updated_at: datetime | None


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
    uid: FelicityID
    code: str | None
    name: str | None
    email: str | None
    email_cc: str | None
    mobile_phone: str | None
    business_phone: str | None
    active: bool| None
    province_uid: FelicityID | None
    province: Optional[ProvinceType]
    #
    created_by_uid: FelicityID | None
    created_by: Optional["UserType"]
    created_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: Optional["UserType"]
    updated_at: datetime | None


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
