from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr
from felicity.apps import BaseAuditModel


#
#  Laboratory
#

# Shared properties


class LaboratoryBase(BaseModel):
    setup_name: Optional[str] = "felicity"
    lab_name: Optional[str] = None
    email: Optional[EmailStr] = None
    email_cc: Optional[str] = None
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    lab_manager_uid: Optional[int] = None


# Properties to receive via API on creation
class LaboratoryCreate(LaboratoryBase):
    pass


# Properties to receive via API on update
class LaboratoryUpdate(LaboratoryBase):
    pass


class LaboratoryInDBBase(LaboratoryBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Laboratory(LaboratoryInDBBase):
    pass


# Additional properties stored in DB
class LaboratoryInDB(LaboratoryInDBBase):
    pass


#
#  Department
#

# Shared properties
class DepartmentBase(BaseModel):
    name: str = None
    description: str = None
    code: str = None


# Properties to receive via API on creation
class DepartmentCreate(DepartmentBase):
    pass


# Properties to receive via API on update
class DepartmentUpdate(DepartmentBase):
    pass


class DepartmentInDBBase(DepartmentBase):
    uid: int = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Department(DepartmentInDBBase):
    pass


# Additional properties stored in DB
class DepartmentInDB(DepartmentInDBBase):
    pass


#
# InstrumentType Schemas
#

# Shared properties
class InstrumentTypeBase(BaseAuditModel):
    name: Optional[str] = None
    description: Optional[str] = None
    active: Optional[bool] = True


class InstrumentTypeBaseInDB(InstrumentTypeBase):
    uid: Optional[int] = None

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
    supplier_uid: int = None


# Properties to receive via API on creation
class InstrumentCreate(InstrumentBase):
    supplier_uid: Optional[int] = None


# Properties to receive via API on update
class InstrumentUpdate(InstrumentBase):
    supplier_uid: Optional[int] = None


class InstrumentInDBBase(InstrumentBase):
    uid: int = None

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
    instrument_uid: int
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
    uid: int = None

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
    instrument_uid: int
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
    uid: int = None

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
    instruments: Optional[List[Instrument]]


# Properties to receive via API on creation
class MethodCreate(MethodBase):
    pass


# Properties to receive via API on update
class MethodUpdate(MethodBase):
    pass


class MethodInDBBase(MethodBase):
    uid: int = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Method(MethodInDBBase):
    pass


# Additional properties stored in DB
class MethodInDB(MethodInDBBase):
    pass


#
#  Unit
#

# Shared properties
class UnitBase(BaseModel):
    name: str = None
    is_si_unit: bool = False


# Properties to receive via API on creation
class UnitCreate(UnitBase):
    pass


# Properties to receive via API on update
class UnitUpdate(UnitBase):
    pass


class UnitInDBBase(UnitBase):
    uid: int = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Unit(UnitInDBBase):
    pass


# Additional properties stored in DB
class UnitInDB(UnitInDBBase):
    pass


#
#  Supplier
#

# Shared properties
class SupplierBase(BaseModel):
    name: str = None
    description: str = None
    keyword: str = None


# Properties to receive via API on creation
class SupplierCreate(SupplierBase):
    pass


# Properties to receive via API on update
class SupplierUpdate(SupplierBase):
    pass


class SupplierInDBBase(SupplierBase):
    uid: int = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Supplier(SupplierInDBBase):
    pass


# Additional properties stored in DB
class SupplierInDB(SupplierInDBBase):
    pass


#
#  Manufacturer
#

# Shared properties
class ManufacturerBase(BaseModel):
    name: str = None
    description: str = None
    keyword: str = None


# Properties to receive via API on creation
class ManufacturerCreate(ManufacturerBase):
    pass


# Properties to receive via API on update
class ManufacturerUpdate(ManufacturerBase):
    pass


class ManufacturerInDBBase(ManufacturerBase):
    uid: int = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Manufacturer(ManufacturerInDBBase):
    pass


# Additional properties stored in DB
class ManufacturerInDB(ManufacturerInDBBase):
    pass


#
# Country s
#

# Shared properties
class CountryBase(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    active: Optional[bool] = True


class CountryBaseInDB(CountryBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class CountryCreate(CountryBase):
    pass


# Properties to receive via API on update
class CountryUpdate(CountryBase):
    pass


# Properties to return via API
class Country(CountryBaseInDB):
    pass


# Properties stored in DB
class CountryInDB(CountryBaseInDB):
    pass


#
# Province s
#

# Shared properties
class ProvinceBase(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    country_uid: Optional[str] = None
    email: Optional[str] = None
    email_cc: Optional[str] = None
    consent_email: Optional[str] = None
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    consent_sms: Optional[str] = None
    active: Optional[bool] = True


class ProvinceBaseInDB(ProvinceBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class ProvinceCreate(ProvinceBase):
    country_uid: int


# Properties to receive via API on update
class ProvinceUpdate(ProvinceBase):
    pass


# Properties to return via API
class Province(ProvinceBaseInDB):
    pass


# Properties stored in DB
class ProvinceInDB(ProvinceBaseInDB):
    pass


#
# District s
#

# Shared properties
class DistrictBase(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    province_uid: Optional[str] = None
    email: Optional[str] = None
    email_cc: Optional[str] = None
    consent_email: Optional[str] = None
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    consent_sms: Optional[str] = None
    active: Optional[bool] = True


class DistrictBaseInDB(DistrictBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


# Properties to receive via API on creation
class DistrictCreate(DistrictBase):
    province_uid: int


# Properties to receive via API on update
class DistrictUpdate(DistrictBase):
    pass


# Properties to return via API
class District(DistrictBaseInDB):
    pass


# Properties stored in DB
class DistrictInDB(DistrictBaseInDB):
    pass
