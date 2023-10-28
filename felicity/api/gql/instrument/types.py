from dataclasses import field
from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from api.gql.types import PageInfo
from api.gql.user.types import UserType
from api.gql.setup.types import ManufacturerType, SupplierType
from apps.instrument.models import Method


@strawberry.type
class InstrumentTypeType:
    uid: str
    name: str | None
    description: str | None
    #
    created_by_uid: str | None
    created_by: Optional["UserType"]
    created_at: datetime | None
    updated_by_uid: str | None
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
class InstrumentType:
    uid: str
    name: str | None
    description: str | None
    keyword: str | None
    supplier_uid: str | None
    supplier: Optional[SupplierType]
    manufacturer_uid: str | None
    manufacturer: Optional[ManufacturerType]
    instrument_type_uid: str | None
    instrument_type: Optional[InstrumentTypeType]
    #
    created_by_uid: str | None
    created_by: Optional["UserType"]
    created_at: datetime | None
    updated_by_uid: str | None
    updated_by: Optional["UserType"]
    updated_at: datetime | None
    # methods: Optional[List["MethodType"]] = field(default_factory=list)
    
    @strawberry.field
    async def methods(self, info) -> Optional[List["MethodType"]]:
        return await Method.get(instruments___uid=self.uid)


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
    uid: str
    instrument_uid: str
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
    uid: str
    instrument_uid: str
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
    uid: str
    name: str | None
    description: str | None
    keyword: str | None
    #
    created_by_uid: str | None
    created_by: Optional["UserType"]
    created_at: datetime | None
    updated_by_uid: str | None
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
