from typing import Optional

from pydantic import BaseModel, EmailStr
from pydantic import ConfigDict

from apps.common.schemas import BaseAuditModel


#
#  Laboratory
#

# Shared properties


class LaboratoryBase(BaseModel):
    setup_name: str | None = "felicity"
    lab_name: str | None = None
    email: Optional[EmailStr] = None
    email_cc: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    lab_manager_uid: str | None = None
    address: str | None = ""


# Properties to receive via API on creation
class LaboratoryCreate(LaboratoryBase):
    pass


# Properties to receive via API on update
class LaboratoryUpdate(LaboratoryBase):
    pass


class LaboratoryInDBBase(LaboratoryBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class Laboratory(LaboratoryInDBBase):
    pass


# Additional properties stored in DB
class LaboratoryInDB(LaboratoryInDBBase):
    pass


class LaboratorySettingBase(BaseAuditModel):
    laboratory_uid: str | None = None
    laboratory: Optional[Laboratory] = None
    allow_self_verification: bool | None = False
    allow_patient_registration: bool | None = True
    allow_sample_registration: bool | None = True
    allow_worksheet_creation: bool | None = True
    default_route: str | None = None
    password_lifetime: int | None = None
    inactivity_log_out: int | None = None
    default_theme: str | None = None
    auto_receive_samples: bool | None = True
    sticker_copies: int | None = 2


class LaboratorySettingCreate(LaboratorySettingBase):
    pass


class LaboratorySettingUpdate(LaboratorySettingBase):
    pass


class LaboratorySetting(LaboratorySettingBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


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
    uid: str = None


model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class Department(DepartmentInDBBase):
    pass


# Additional properties stored in DB
class DepartmentInDB(DepartmentInDBBase):
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
    uid: str = None


model_config = ConfigDict(from_attributes=True)


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
    uid: str = None


model_config = ConfigDict(from_attributes=True)


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
    uid: str = None


model_config = ConfigDict(from_attributes=True)


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
    name: str | None = None
    code: str | None = None
    active: bool | None = True


class CountryBaseInDB(CountryBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


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
    name: str | None = None
    country_uid: str | None = None
    code: str | None = None
    email: str | None = None
    email_cc: str | None = None
    consent_email: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    consent_sms: str | None = None
    active: bool | None = True


class ProvinceBaseInDB(ProvinceBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class ProvinceCreate(ProvinceBase):
    country_uid: str


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
    name: str | None = None
    province_uid: str | None = None
    code: str | None = None
    email: str | None = None
    email_cc: str | None = None
    consent_email: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    consent_sms: str | None = None
    active: bool | None = True


class DistrictBaseInDB(DistrictBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


# Properties to receive via API on creation
class DistrictCreate(DistrictBase):
    province_uid: str


# Properties to receive via API on update
class DistrictUpdate(DistrictBase):
    pass


# Properties to return via API
class District(DistrictBaseInDB):
    pass


# Properties stored in DB
class DistrictInDB(DistrictBaseInDB):
    pass
