from datetime import datetime
from typing import List, Optional

from apps.common.schemas import BaseAuditModel
from apps.setup.schemas import ManufacturerInDB, SupplierInDB
from pydantic import BaseModel


#
# InstrumentType Schemas
#

# Shared properties
class InstrumentTypeBase(BaseAuditModel):
    name: str | None = None
    description: str | None = None
    active: bool | None = True


class InstrumentTypeBaseInDB(InstrumentTypeBase):
    uid: str | None = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class InstrumentTypeCreate(InstrumentTypeBase):
    pass


# Properties to receive via API on update
class InstrumentTypeUpdate(InstrumentTypeBase):
    pass


# Properties to return via API
class InstrumentType(InstrumentTypeBaseInDB):
    pass


# Properties stored in DB
class AnalysisCategoryInDB(InstrumentTypeBaseInDB):
    pass


#
#  Instrument
#

# Shared properties
class InstrumentBase(BaseModel):
    name: str = None
    description: str = None
    keyword: str = None
    instrument_type_uid: str = None
    instrument_type: InstrumentType | None
    manufacturer_uid: str = None
    manufacturer: ManufacturerInDB | None
    supplier_uid: str = None
    supplier: SupplierInDB | None


# Properties to receive via API on creation
class InstrumentCreate(InstrumentBase):
    supplier_uid: str | None = None


# Properties to receive via API on update
class InstrumentUpdate(InstrumentBase):
    supplier_uid: str | None = None


class InstrumentInDBBase(InstrumentBase):
    uid: str = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Instrument(InstrumentInDBBase):
    pass


# Additional properties stored in DB
class InstrumentInDB(InstrumentInDBBase):
    pass


#
#  InstrumentCalibration
#

# Shared properties
class InstrumentCalibrationBase(BaseModel):
    instrument_uid: str
    instrument: Optional[Instrument]
    calibration_id: str
    date_reported: datetime
    report_id: str
    performed_by: str
    start_date: datetime
    end_date: datetime
    notes_before: str
    work_done: str
    remarks: str


# Properties to receive via API on creation
class InstrumentCalibrationCreate(InstrumentCalibrationBase):
    pass


# Properties to receive via API on update
class InstrumentCalibrationUpdate(InstrumentCalibrationBase):
    pass


class InstrumentCalibrationInDBBase(InstrumentCalibrationBase):
    uid: str = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class InstrumentCalibration(InstrumentCalibrationInDBBase):
    pass


# Additional properties stored in DB
class InstrumentCalibrationInDB(InstrumentCalibrationInDBBase):
    pass


#
#  CalibrationCertificate
#

# Shared properties
class CalibrationCertificateBase(BaseModel):
    instrument_uid: str
    instrument: Optional[Instrument]
    certificate_code: str
    internal: bool = True
    issuer: str
    date_issued: datetime
    valid_from_date: datetime
    valid_to_date: datetime
    performed_by: str
    approved_by: str
    remarks: str


# Properties to receive via API on creation
class CalibrationCertificateCreate(CalibrationCertificateBase):
    pass


# Properties to receive via API on update
class CalibrationCertificateUpdate(CalibrationCertificateBase):
    pass


class CalibrationCertificateInDBBase(CalibrationCertificateBase):
    uid: str = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class CalibrationCertificate(CalibrationCertificateInDBBase):
    pass


# Additional properties stored in DB
class CalibrationCertificateInDB(CalibrationCertificateInDBBase):
    pass


#
#  Method
#

# Shared properties
class MethodBase(BaseModel):
    name: str = None
    description: str = None
    keyword: str = None
    instruments: Optional[List[Instrument]] = []


# Properties to receive via API on creation
class MethodCreate(MethodBase):
    pass


# Properties to receive via API on update
class MethodUpdate(MethodBase):
    pass


class MethodInDBBase(MethodBase):
    uid: str = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Method(MethodInDBBase):
    pass


# Additional properties stored in DB
class MethodInDB(MethodInDBBase):
    pass
