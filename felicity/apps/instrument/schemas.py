from dataclasses import field
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from felicity.apps.common.schemas import BaseAuditModel
from felicity.apps.setup.schemas import ManufacturerInDB, SupplierInDB


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

    model_config = ConfigDict(from_attributes=True)


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
    name: str
    description: str | None = None
    keyword: str | None = None
    instrument_type_uid: str | None = None
    instrument_type: InstrumentType | None = None
    manufacturer_uid: str | None = None
    manufacturer: ManufacturerInDB | None = None
    supplier_uid: str | None = None
    supplier: SupplierInDB | None = None
    driver_mapping: dict | None = None  # JSON driver for field mapping


# Properties to receive via API on creation
class InstrumentCreate(InstrumentBase):
    supplier_uid: str | None = None
    keyword: str | None = None
    instrument_type_uid: str | None = None
    manufacturer_uid: str | None = None


# Properties to receive via API on update
class InstrumentUpdate(InstrumentBase):
    supplier_uid: str | None = None


class InstrumentInDBBase(InstrumentBase):
    uid: str

    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class Instrument(InstrumentInDBBase):
    pass


# Additional properties stored in DB
class InstrumentInDB(InstrumentInDBBase):
    pass


#
# Laboratory Instrument
#


# Shared properties
class LaboratoryInstrumentBase(BaseModel):
    instrument_uid: str | None = None
    instrument: Instrument | None = None
    lab_name: str | None = None
    serial_number: str | None = None
    date_commissioned: datetime | None = None
    date_decommissioned: datetime | None = None
    is_active: Optional[bool] = False
    host: Optional[str] = None
    port: Optional[int] = None
    auto_reconnect: bool
    protocol_type: Optional[str] = None
    socket_type: Optional[str] = None
    connection: Optional[str] = None
    transmission: Optional[str] = None
    is_active: bool
    lims_uid: Optional[str] = None
    sync_units: Optional[bool] = False
    driver_mapping: dict | None = None  # Lab-specific override of generic driver


# Properties to receive via API on creation
class LaboratoryInstrumentCreate(LaboratoryInstrumentBase):
    instrument_uid: str


# Properties to receive via API on update
class LaboratoryInstrumentUpdate(LaboratoryInstrumentBase):
    pass


class LaboratoryInstrumentInDBBase(LaboratoryInstrumentBase):
    uid: str

    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class LaboratoryInstrument(LaboratoryInstrumentInDBBase):
    pass


# Additional properties stored in DB
class LaboratoryInstrumentInDB(LaboratoryInstrumentInDBBase):
    pass


#
#  InstrumentCalibration
#


# Shared properties
class InstrumentCalibrationBase(BaseModel):
    laboratory_instrument_uid: str
    laboratory_instrument: Optional[LaboratoryInstrument] = None
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
    uid: str | None = None
    model_config = ConfigDict(from_attributes=True)


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
    laboratory_instrument_uid: str
    laboratory_instrument: Optional[LaboratoryInstrument] = None
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
    uid: str | None = None
    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class CalibrationCertificate(CalibrationCertificateInDBBase):
    pass


# Additional properties stored in DB
class CalibrationCertificateInDB(CalibrationCertificateInDBBase):
    pass


#
#  InstrumentCompetence
#


# Shared properties
class InstrumentCompetenceBase(BaseModel):
    instrument_uid: str
    instrument: Optional[Instrument] = None
    description: str
    user_uid: str
    issue_date: datetime
    expiry_date: datetime
    internal: bool
    competence: str


# Properties to receive via API on creation
class InstrumentCompetenceCreate(InstrumentCompetenceBase):
    pass


# Properties to receive via API on update
class InstrumentCompetenceUpdate(InstrumentCompetenceBase):
    pass


class InstrumentCompetenceInDBBase(InstrumentCompetenceBase):
    uid: str | None = None
    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class InstrumentCompetence(InstrumentCompetenceInDBBase):
    pass


# Additional properties stored in DB
class InstrumentCompetenceInDB(InstrumentCompetenceInDBBase):
    pass


#
#  Method
#


# Shared properties
class MethodBase(BaseModel):
    name: str | None = None
    description: str | None = None
    keyword: str | None = None
    instruments: Optional[List[Instrument]] = field(default_factory=list)


# Properties to receive via API on creation
class MethodCreate(MethodBase):
    pass


# Properties to receive via API on update
class MethodUpdate(MethodBase):
    pass


class MethodInDBBase(MethodBase):
    uid: str | None = None
    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class Method(MethodInDBBase):
    pass


# Additional properties stored in DB
class MethodInDB(MethodInDBBase):
    pass


#
#  InstrumentRawData
#


# Shared properties
class InstrumentRawDataBase(BaseModel):
    content: str
    laboratory_instrument_uid: str
    is_transformed: bool | None = False
    transformation_attempts: int | None = 0
    last_transformation_attempt: str | None = None
    transformation_error: str | None = None


# Properties to receive via API on creation
class InstrumentRawDataCreate(InstrumentRawDataBase):
    pass


# Properties to receive via API on update
class InstrumentRawDataUpdate(InstrumentRawDataBase):
    pass


class InstrumentRawDataInDBBase(InstrumentRawDataBase):
    uid: str | None = None
    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class InstrumentRawData(InstrumentRawDataInDBBase):
    pass


# Additional properties stored in DB
class InstrumentRawDataInDB(InstrumentRawDataInDBBase):
    pass


#
#  InstrumentResultExclusions
#


# Shared properties
class InstrumentResultExclusionsBase(BaseModel):
    instrument_uid: str
    result: str | None = None
    reason: str | None = None


# Properties to receive via API on creation
class InstrumentResultExclusionsCreate(InstrumentResultExclusionsBase):
    pass


# Properties to receive via API on update
class InstrumentResultExclusionsUpdate(InstrumentResultExclusionsBase):
    pass


class InstrumentResultExclusionsInDBBase(InstrumentResultExclusionsBase):
    uid: str | None = None
    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class InstrumentResultExclusions(InstrumentResultExclusionsInDBBase):
    pass


# Additional properties stored in DB
class InstrumentResultExclusionsInDB(InstrumentResultExclusionsInDBBase):
    pass


#
#  InstrumentResultTranslation
#


# Shared properties
class InstrumentResultTranslationBase(BaseModel):
    instrument_uid: str
    original: str
    translated: str
    keyword: str | None = None
    reason: str | None = None


# Properties to receive via API on creation
class InstrumentResultTranslationCreate(InstrumentResultTranslationBase):
    pass


# Properties to receive via API on update
class InstrumentResultTranslationUpdate(InstrumentResultTranslationBase):
    pass


class InstrumentResultTranslationInDBBase(InstrumentResultTranslationBase):
    uid: str | None = None
    model_config = ConfigDict(from_attributes=True)


# Additional properties to return via API
class InstrumentResultTranslation(InstrumentResultTranslationInDBBase):
    pass


# Additional properties stored in DB
class InstrumentResultTranslationInDB(InstrumentResultTranslationInDBBase):
    pass
