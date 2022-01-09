from typing import List, Optional

import strawberry  # noqa
from felicity.api.gql import PageInfo


@strawberry.type
class LaboratoryType:
    uid: int
    setup_name: str
    lab_name: str
    lab_manager_uid: Optional[str]
    # lab_manager = relationship(User, backref="lab_manager")
    email: Optional[str]
    email_cc: Optional[str]
    mobile_phone: Optional[str]
    business_phone: Optional[str]


@strawberry.type
class SupplierType:
    uid: int
    name: Optional[str]
    description: Optional[str]


@strawberry.type
class InstrumentType:
    uid: int
    name: Optional[str]
    description: Optional[str]
    keyword: Optional[str]
    supplier_uid: Optional[int]
    supplier: Optional[SupplierType]


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
class DepartmentType:
    uid: int
    name: Optional[str]
    description: Optional[str]
    code: Optional[str]


@strawberry.type
class MethodType:
    uid: int
    name: Optional[str]
    description: Optional[str]
    keyword: Optional[str]


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
    uid: int
    name: Optional[str]
    code: Optional[str]
    active: Optional[str]


@strawberry.type
class ProvinceType:
    uid: int
    code: Optional[str]
    name: Optional[str]
    email: Optional[str]
    email_cc: Optional[str]
    mobile_phone: Optional[str]
    business_phone: Optional[str]
    active: Optional[bool]
    country_uid: Optional[int]
    country: Optional[CountryType]


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
    uid: int
    code: Optional[str]
    name: Optional[str]
    email: Optional[str]
    email_cc: Optional[str]
    mobile_phone: Optional[str]
    business_phone: Optional[str]
    active: Optional[bool]
    province_uid: Optional[int]
    province: Optional[ProvinceType]


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
