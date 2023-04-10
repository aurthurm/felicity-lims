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
    lab_manager_uid: Optional[str]
    lab_manager: Optional["UserType"]
    email: Optional[str]
    email_cc: Optional[str]
    mobile_phone: Optional[str]
    business_phone: Optional[str]
    address: Optional[str]
    logo: Optional[str]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional["UserType"]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional["UserType"]
    updated_at: Optional[datetime]


@strawberry.type
class LaboratorySettingType:
    created_by_uid: Optional[FelicityID]
    created_by: Optional["UserType"]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional["UserType"]
    updated_at: Optional[datetime]
    uid: FelicityID
    laboratory_uid: FelicityID
    laboratory: LaboratoryType
    allow_self_verification: Optional[bool] = False
    allow_patient_registration: Optional[bool] = True
    allow_sample_registration: Optional[bool] = True
    allow_worksheet_creation: Optional[bool] = True
    default_route: Optional[str] = None
    password_lifetime: Optional[int] = None
    inactivity_log_out: Optional[int] = None
    default_theme: Optional[str] = None
    auto_receive_samples: Optional[bool] = True
    sticker_copies: Optional[int] = 2
    #


@strawberry.type
class SupplierType:
    uid: FelicityID
    name: Optional[str]
    description: Optional[str]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional["UserType"]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional["UserType"]
    updated_at: Optional[datetime]


@strawberry.type
class ManufacturerType:
    uid: FelicityID
    name: Optional[str]
    description: Optional[str]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional["UserType"]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional["UserType"]
    updated_at: Optional[datetime]


@strawberry.type
class InstrumentTypeType:
    uid: FelicityID
    name: Optional[str]
    description: Optional[str]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional["UserType"]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional["UserType"]
    updated_at: Optional[datetime]


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
    created_by_uid: Optional[FelicityID]
    created_by: Optional["UserType"]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional["UserType"]
    updated_at: Optional[datetime]


@strawberry.type
class InstrumentType:
    uid: FelicityID
    name: Optional[str]
    description: Optional[str]
    keyword: Optional[str]
    supplier_uid: Optional[FelicityID]
    supplier: Optional[SupplierType]
    manufacturer_uid: Optional[FelicityID]
    manufacturer: Optional[ManufacturerType]
    instrument_type_uid: Optional[FelicityID]
    instrument_type: Optional[InstrumentTypeType]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional["UserType"]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional["UserType"]
    updated_at: Optional[datetime]
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
    instrument: Optional[InstrumentType]
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
    instrument: Optional[InstrumentType]
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
class DepartmentType:
    uid: FelicityID
    name: Optional[str]
    description: Optional[str]
    code: Optional[str]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional["UserType"]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional["UserType"]
    updated_at: Optional[datetime]


@strawberry.type
class MethodType:
    uid: FelicityID
    name: Optional[str]
    description: Optional[str]
    keyword: Optional[str]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional["UserType"]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional["UserType"]
    updated_at: Optional[datetime]
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
    name: Optional[str]
    code: Optional[str]
    active: Optional[str]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional["UserType"]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional["UserType"]
    updated_at: Optional[datetime]


@strawberry.type
class ProvinceType:
    uid: FelicityID
    code: Optional[str]
    name: Optional[str]
    email: Optional[str]
    email_cc: Optional[str]
    mobile_phone: Optional[str]
    business_phone: Optional[str]
    active: Optional[bool]
    country_uid: Optional[FelicityID]
    country: Optional[CountryType]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional["UserType"]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional["UserType"]
    updated_at: Optional[datetime]


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
    code: Optional[str]
    name: Optional[str]
    email: Optional[str]
    email_cc: Optional[str]
    mobile_phone: Optional[str]
    business_phone: Optional[str]
    active: Optional[bool]
    province_uid: Optional[FelicityID]
    province: Optional[ProvinceType]
    #
    created_by_uid: Optional[FelicityID]
    created_by: Optional["UserType"]
    created_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional["UserType"]
    updated_at: Optional[datetime]


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
