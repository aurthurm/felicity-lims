from dataclasses import field
from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.setup.types import ManufacturerType, SupplierType, LaboratoryType
from felicity.api.gql.types import BytesScalar, PageInfo
from felicity.api.gql.user.types import UserType
from felicity.apps.instrument.services import LaboratoryInstrumentService, MethodService


@strawberry.type
class InstrumentTypeType:
    uid: str
    name: str | None = None
    description: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: Optional["UserType"] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional["UserType"] = None
    updated_at: str | None = None


#  relay paginations
@strawberry.type
class InstrumentTypeEdge:
    cursor: str
    node: InstrumentTypeType


@strawberry.type
class InstrumentTypeCursorPage:
    page_info: PageInfo
    edges: Optional[List[InstrumentTypeEdge]] = None
    items: Optional[List[InstrumentTypeType]] = None
    total_count: int


@strawberry.type
class InstrumentType:
    uid: str
    name: str | None = None
    description: str | None = None
    keyword: str | None = None
    supplier_uid: str | None = None
    supplier: Optional[SupplierType] = None
    manufacturer_uid: str | None = None
    manufacturer: Optional[ManufacturerType] = None
    instrument_type_uid: str | None = None
    instrument_type: Optional[InstrumentTypeType] = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: Optional["UserType"] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional["UserType"] = None
    updated_at: str | None = None

    @strawberry.field
    async def methods(self, info) -> Optional[List["MethodType"]]:
        return await MethodService().get_all(instruments___uid=self.uid)

    @strawberry.field
    async def laboratory_instruments(self, info) -> Optional[List["LaboratoryInstrumentType"]]:
        return await LaboratoryInstrumentService().get_all(instrument_uid=self.uid)


#  relay paginations
@strawberry.type
class InstrumentEdge:
    cursor: str
    node: InstrumentType


@strawberry.type
class InstrumentCursorPage:
    page_info: PageInfo
    edges: Optional[List[InstrumentEdge]] = None
    items: Optional[List[InstrumentType]] = None
    total_count: int


@strawberry.type
class LaboratoryInstrumentType:
    uid: str
    instrument_uid: str | None = None
    instrument: InstrumentType | None = None
    lab_name: str | None = None
    serial_number: str | None = None
    date_commissioned: datetime | None = None
    date_decommissioned: datetime | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: Optional["UserType"] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional["UserType"] = None
    updated_at: str | None = None


@strawberry.type
class LaboratoryInstrumentEdge:
    cursor: str
    node: LaboratoryInstrumentType


@strawberry.type
class LaboratoryInstrumentCursorPage:
    page_info: PageInfo
    edges: Optional[List[LaboratoryInstrumentEdge]] = None
    items: Optional[List[LaboratoryInstrumentType]] = None
    total_count: int


@strawberry.type
class InstrumentCalibrationType:
    uid: str
    laboratory_instrument_uid: str
    laboratory_instrument: LaboratoryInstrumentType | None = None
    calibration_id: str
    date_reported: datetime
    report_id: str
    performed_by: str
    start_date: datetime
    end_date: datetime
    notes_before: str
    work_done: str
    remarks: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: Optional["UserType"] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional["UserType"] = None
    updated_at: str | None = None


@strawberry.type
class CalibrationCertificateType:
    uid: str
    laboratory_instrument_uid: str
    laboratory_instrument: LaboratoryInstrumentType | None = None
    certificate_code: str
    internal: bool
    issuer: str
    date_issued: datetime
    valid_from_date: datetime
    valid_to_date: datetime
    performed_by: str
    approved_by: str
    remarks: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: Optional["UserType"] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional["UserType"] = None
    updated_at: str | None = None


@strawberry.type
class InstrumentCompetenceType:
    uid: str
    instrument_uid: str
    instrument: InstrumentType | None = None
    description: str
    user_uid: str
    user: UserType | None = None
    issue_date: datetime
    expiry_date: datetime
    internal: bool
    competence: BytesScalar | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: Optional["UserType"] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional["UserType"] = None
    updated_at: str | None = None


@strawberry.type
class MethodType:
    uid: str
    name: str | None = None
    description: str | None = None
    keyword: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    #
    created_by_uid: str | None = None
    created_by: Optional["UserType"] = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: Optional["UserType"] = None
    updated_at: str | None = None
    instruments: Optional[List["InstrumentType"]] = field(default_factory=list)


#  relay paginations
@strawberry.type
class MethodEdge:
    cursor: str
    node: MethodType


@strawberry.type
class MethodCursorPage:
    page_info: PageInfo
    edges: Optional[List[MethodEdge]] = None
    items: Optional[List[MethodType]] = None
    total_count: int
