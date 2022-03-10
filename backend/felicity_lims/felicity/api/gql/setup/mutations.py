import logging
from dataclasses import field
from typing import Dict, Optional, List
from datetime import datetime
import strawberry  # noqa
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.apps.setup import models, schemas
from felicity.api.gql import OperationError
from felicity.api.gql.setup.types import (
    CountryType,
    DepartmentType,
    DistrictType,
    InstrumentType,
    LaboratoryType,
    MethodType,
    ProvinceType,
    SupplierType, ManufacturerType, InstrumentTypeType, UnitType, InstrumentCalibrationType, CalibrationCertificateType,
    LaboratorySettingType,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

LaboratoryResponse = strawberry.union(
    "LaboratoryResponse", (LaboratoryType, OperationError), description=""  # noqa
)
LaboratorySettingResponse = strawberry.union(
    "LaboratorySettingResponse", (LaboratorySettingType, OperationError), description=""  # noqa
)
InstrumentTypeResponse = strawberry.union(
    "InstrumentTypeResponse", (InstrumentTypeType, OperationError), description="" # noqa
)
InstrumentResponse = strawberry.union(
    "InstrumentResponse", (InstrumentType, OperationError), description=""  # noqa
)
MethodResponse = strawberry.union(
    "MethodResponse", (MethodType, OperationError), description=""  # noqa
)
CountryResponse = strawberry.union(
    "CountryResponse", (CountryType, OperationError), description=""  # noqa
)
ProvinceResponse = strawberry.union(
    "ProvinceResponse", (ProvinceType, OperationError), description=""  # noqa
)
DistrictResponse = strawberry.union(
    "DistrictResponse", (DistrictType, OperationError), description=""  # noqa
)
SupplierResponse = strawberry.union(
    "SupplierResponse", (SupplierType, OperationError), description=""  # noqa
)
ManufacturerResponse = strawberry.union(
    "ManufacturerResponse", (ManufacturerType, OperationError), description=""  # noqa
)
DepartmentResponse = strawberry.union(
    "DepartmentResponse", (DepartmentType, OperationError), description=""  # noqa
)
UnitResponse = strawberry.union(
    "UnitResponse", (UnitType, OperationError), description="" # noqa
)
InstrumentCalibrationResponse = strawberry.union(
    "InstrumentCalibrationResponse", (InstrumentCalibrationType, OperationError), description="" # noqa
)
CalibrationCertificateResponse = strawberry.union(
    "CalibrationCertificateResponse", (CalibrationCertificateType, OperationError), description="" # noqa
)


@strawberry.input
class LaboratoryInputType:
    lab_name: str
    setup_name: str = "felicity"
    email: Optional[str] = None
    email_cc: Optional[str] = None
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    lab_manager_uid: Optional[int] = None
    address: Optional[str] = None
    logo: Optional[str] = None


@strawberry.input
class LaboratorySettingInputType:
    laboratory_uid: int
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


@strawberry.input
class DepartmentInputType:
    name: str
    description: Optional[str] = None
    code: Optional[str] = None


@strawberry.input
class SupplierInputType:
    name: str
    description: Optional[str] = None
    code: Optional[str] = None


@strawberry.input
class ManufacturerInputType:
    name: str
    description: Optional[str] = None


@strawberry.input
class InstrumentTypeInputType:
    name: str
    description: Optional[str] = None


@strawberry.input
class InstrumentInputType:
    name: str
    keyword: str
    description: Optional[str] = None
    instrument_type_uid: Optional[int] = None
    supplier_uid: Optional[int] = None
    manufacturer_uid: Optional[int] = None


@strawberry.input
class MethodInputType:
    name: str
    instruments: Optional[List[int]] = field(default_factory=list)
    analyses: Optional[List[int]] = field(default_factory=list)
    keyword: Optional[str] = None
    description: Optional[str] = None


@strawberry.input
class CountryInputType:
    name: str
    code: str
    active: Optional[bool] = True


@strawberry.input
class ProvinceInputType:
    name: Optional[str]
    country_uid: Optional[int]
    code: Optional[str] = None
    email: Optional[str] = None
    email_cc: Optional[str] = None
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    active: Optional[bool] = True


@strawberry.input
class DistrictInputType:
    name: str
    province_uid: Optional[int]
    code: Optional[str] = None
    email: Optional[str] = None
    email_cc: Optional[str] = None
    mobile_phone: Optional[str] = None
    business_phone: Optional[str] = None
    active: Optional[bool] = True


@strawberry.input
class UnitInputType:
    name: int
    is_si_unit: bool


@strawberry.input
class InstrumentCalibrationInput:
    instrument_uid: int
    date_reported: Optional[datetime]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    calibration_id: Optional[str] = ""
    report_id: Optional[str] = ""
    performed_by: Optional[str] = ""
    notes_before: Optional[str] = ""
    work_done: Optional[str] = ""
    remarks: Optional[str] = ""


@strawberry.input
class CalibrationCertificateInput:
    instrument_uid: int
    date_issued: Optional[datetime]
    valid_from_date: Optional[datetime]
    valid_to_date: Optional[datetime]
    certificate_code: Optional[str] = ""
    issuer: Optional[str] = ""
    performed_by: Optional[str] = ""
    approved_by: Optional[str] = ""
    remarks: Optional[str] = ""
    internal: bool = True


@strawberry.type
class SetupMutations:
    @strawberry.mutation
    async def update_laboratory(
        self, info, uid: int, payload: LaboratoryInputType
    ) -> LaboratoryResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        laboratory = await models.Laboratory.get(uid=uid)
        if not laboratory:
            return OperationError(
                error=f"Laboratory with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = laboratory.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(laboratory, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.LaboratoryUpdate(**laboratory.to_dict())
        laboratory = await laboratory.update(obj_in)
        return LaboratoryType(**laboratory.marshal_simple())

    @strawberry.mutation
    async def update_laboratory_setting(
        self, info, uid: int, payload: LaboratorySettingInputType
    ) -> LaboratorySettingResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        lab_setting = await models.LaboratorySetting.get(uid=uid)
        if not lab_setting:
            return OperationError(
                error=f"Laboratory Setting with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = lab_setting.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(lab_setting, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.LaboratoryUpdate(**lab_setting.to_dict())
        lab_setting = await lab_setting.update(obj_in)
        return LaboratorySettingType(**lab_setting.marshal_simple())

    @strawberry.mutation
    async def create_department(
        root, info, payload: DepartmentInputType
    ) -> DepartmentResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please Provide a name for your department")

        exists = await models.Department.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A Department named {payload.name} already exists"
            )

        incoming: Dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.DepartmentCreate(**incoming)
        department: models.Department = await models.Department.create(obj_in)
        return DepartmentType(**department.marshal_simple())

    @strawberry.mutation
    async def update_department(
        self, info, uid: int, payload: DepartmentInputType
    ) -> DepartmentResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        department = await models.Department.get(uid=uid)
        if not department:
            return OperationError(
                error=f"department with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = department.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(department, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.DepartmentUpdate(**department.to_dict())
        department = await department.update(obj_in)
        return DepartmentType(**department.marshal_simple())

    @strawberry.mutation
    async def create_supplier(
        self, info, payload: SupplierInputType
    ) -> SupplierResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please Provide a name for your supplier")

        exists = await models.Supplier.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A Supplier named {payload.name} already exists"
            )

        incoming: Dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.SupplierCreate(**incoming)
        supplier: models.Supplier = await models.Supplier.create(obj_in)
        return SupplierType(**supplier.marshal_simple())

    @strawberry.mutation
    async def update_supplier(
        self, info, uid: int, payload: SupplierInputType
    ) -> SupplierResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        supplier = await models.Supplier.get(uid=uid)
        if not supplier:
            return OperationError(
                error=f"supplier with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = supplier.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(supplier, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.SupplierUpdate(**supplier.to_dict())
        supplier = await supplier.update(obj_in)
        return SupplierType(**supplier.marshal_simple())

    @strawberry.mutation
    async def create_manufacturer(
        self, info, payload: ManufacturerInputType
    ) -> ManufacturerResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please a name for your manufacturer")

        exists = await models.Manufacturer.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A Manufacturer named {payload.name} already exists"
            )

        incoming: Dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.ManufacturerCreate(**incoming)
        manufacturer: models.Manufacturer = await models.Manufacturer.create(obj_in)
        return ManufacturerType(**manufacturer.marshal_simple())

    @strawberry.mutation
    async def update_manufacturer(
        self, info, uid: int, payload: ManufacturerInputType
    ) -> ManufacturerResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        manufacturer = await models.Manufacturer.get(uid=uid)
        if not manufacturer:
            return OperationError(
                error=f"manufacturer with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = manufacturer.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(manufacturer, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.ManufacturerUpdate(**manufacturer.to_dict())
        manufacturer = await manufacturer.update(obj_in)
        return ManufacturerType(**manufacturer.marshal_simple())

    @strawberry.mutation
    async def create_instrument_type(
        self, info, payload: InstrumentTypeInputType
    ) -> InstrumentTypeResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please a name for your instrument type")

        exists = await models.InstrumentType.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A InstrumentType named {payload.name} already exists"
            )

        incoming: Dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.InstrumentTypeCreate(**incoming)
        inst_type: models.InstrumentType = await models.InstrumentType.create(obj_in)
        return InstrumentTypeType(**inst_type.marshal_simple())

    @strawberry.mutation
    async def update_instrument_type(
        self, info, uid: int, payload: InstrumentTypeInputType
    ) -> InstrumentTypeResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        inst_type = await models.InstrumentType.get(uid=uid)
        if not inst_type:
            return OperationError(
                error=f"manufacturer with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = inst_type.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(inst_type, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentTypeUpdate(**inst_type.to_dict())
        inst_type = await inst_type.update(obj_in)
        return InstrumentTypeType(**inst_type.marshal_simple())

    @strawberry.mutation
    async def create_instrument(
        self, info, payload: InstrumentInputType
    ) -> InstrumentResponse:  # noqa

        if not payload.name or not payload.keyword:
            return OperationError(
                error="Provide a name and a unique keyword for your instrument"
            )

        taken = await models.Instrument.get(keyword=payload.keyword)
        if taken:
            return OperationError(
                error=f"Provided keyword already assigned to instrument {taken.name}"
            )

        exists = await models.Instrument.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"An Instrument named {payload.name} already exists"
            )

        incoming: Dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.InstrumentCreate(**incoming)
        instrument: models.Instrument = await models.Instrument.create(obj_in)
        return InstrumentType(**instrument.marshal_simple())

    @strawberry.mutation
    async def update_instrument(
        self, info, uid: int, payload: InstrumentInputType
    ) -> InstrumentResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        if "keyword" in payload.__dict__:
            taken = await models.Instrument.get(keyword=payload.keyword)
            if taken and not (str(uid) == str(taken.uid)):
                return OperationError(
                    error=f"Provided keyword already assigned to instrument {taken.name}"
                )

        instrument = await models.Instrument.get(uid=uid)
        if not instrument:
            return OperationError(
                error=f"instrument with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = instrument.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(instrument, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentUpdate(**instrument.to_dict())
        instrument = await instrument.update(obj_in)
        return InstrumentType(**instrument.marshal_simple())

    @strawberry.mutation
    async def create_instrument_caliberation(
        self, info, payload: InstrumentCalibrationInput
    ) -> InstrumentCalibrationResponse:  # noqa

        incoming: Dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.InstrumentCalibrationCreate(**incoming)
        calib: models.InstrumentCalibration = await models.InstrumentCalibration.create(obj_in)
        return InstrumentCalibrationType(**calib.marshal_simple())

    @strawberry.mutation
    async def update_instrument_caliberation(
        self, info, uid: int, payload: InstrumentInputType
    ) -> InstrumentCalibrationResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        caliberation = await models.InstrumentCalibration.get(uid=uid)
        if not caliberation:
            return OperationError(
                error=f"caliberation with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = caliberation.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(caliberation, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentCalibrationUpdate(**caliberation.to_dict())
        caliberation = await caliberation.update(obj_in)
        return InstrumentCalibrationType(**caliberation.marshal_simple())

    @strawberry.mutation
    async def create_caliberation_certificate(
        self, info, payload: CalibrationCertificateInput
    ) -> CalibrationCertificateResponse:  # noqa

        incoming: Dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.CalibrationCertificateCreate(**incoming)
        certificate: models.CalibrationCertificate = await models.CalibrationCertificate.create(obj_in)
        return CalibrationCertificateType(**certificate.marshal_simple())

    @strawberry.mutation
    async def update_caliberation_certificate(
        self, info, uid: int, payload: CalibrationCertificateInput
    ) -> CalibrationCertificateResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        certificate = await models.CalibrationCertificate.get(uid=uid)
        if not certificate:
            return OperationError(
                error=f"caliberation certificate with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = certificate.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(certificate, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.CalibrationCertificateUpdate(**certificate.to_dict())
        certificate = await certificate.update(obj_in)
        return CalibrationCertificateType(**certificate.marshal_simple())

    @strawberry.mutation
    async def create_method(
        self, info, payload: MethodInputType
    ) -> MethodResponse:  # noqa

        if not payload.name:
            return OperationError(error="Provide a name for your method")

        if "keyword" in payload.__dict__:
            taken = await models.Method.get(keyword=payload.keyword)
            if taken:
                return OperationError(
                    error=f"Provided keyword already assigned to Method {taken.name}"
                )

        exists = await models.Method.get(name=payload.name)
        if exists:
            return OperationError(error=f"A Method named {payload.name} already exists")

        incoming = {}
        for k, v in payload.__dict__.items():
            if k not in ['instruments', 'analyses']:
                incoming[k] = v

        obj_in = schemas.MethodCreate(**incoming)
        method: models.Method = await models.Method.create(obj_in)

        _instruments = set()
        for i_uid in payload.instruments:
            instrument = await models.Instrument.get(uid=i_uid)
            if instrument not in _instruments:
                _instruments.add(instrument)
                await models.Method.table_insert(
                    table=models.method_instrument,
                    mappings={"method_uid": method.uid, "instrument_uid": instrument.uid}
                )

        for a_uid in payload.analyses:
            analysis = await analysis_models.Analysis.get(uid=a_uid)
            meth_uids = [meth.uid for meth in analysis.methods]
            if method.uid not in meth_uids:
                await analysis_models.Analysis.table_insert(
                    table=analysis_models.analysis_method,
                    mappings={"method_uid": method.uid, "analysis_uid": analysis.uid}
                )

            for inst in method.instruments:
                inst_uids = [inst.uid for inst in analysis.instruments]
                if inst.uid not in inst_uids:
                    analysis.instruments.append(inst)
                    await analysis_models.Analysis.table_insert(
                        table=analysis_models.analysis_instrument,
                        mappings={"instrument_uid": inst.uid, "analysis_uid": analysis.uid}
                    )

        return MethodType(**method.marshal_simple(exclude=['instruments', 'analyses']))

    @strawberry.mutation
    async def update_method(
        self, info, uid: int, payload: MethodInputType
    ) -> MethodResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        if "keyword" in payload.__dict__:
            taken = await models.Method.get(keyword=payload.keyword)
            if taken and not (str(uid) == str(taken.uid)):
                return OperationError(
                    error=f"Provided keyword already assigned to method {taken.name}"
                )

        method = await models.Method.get(uid=uid)
        if not method:
            return OperationError(
                error=f"method with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = method.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(method, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.MethodUpdate(**method.to_dict())
        method = await method.update(obj_in)

        # instrument management
        inst_uids = [inst.uid for inst in method.instruments]
        for _inst in inst_uids:
            if _inst not in payload.instruments:
                instruments = filter(lambda i: i.uid == _inst, method.instruments)
                instrument = list(instruments)[0]
                method.instruments.remove(instrument)
        for _inst in payload.instruments:
            if _inst not in inst_uids:
                instrument = await models.Instrument.get(uid=_inst)
                method.instruments.append(instrument)
        method = await method.save()

        # manage analyses
        all_analyses = await analysis_models.Analysis.all()
        analyses = set()
        for analysis in all_analyses:
            for _meth in analysis.methods:
                if _meth.uid == method.uid:
                    analyses.add(analysis)

        an_uids = [an.uid for an in analyses]
        for _anal in an_uids:
            if _anal not in payload.analyses:
                analysis = filter(lambda a: a.uid == _anal, analyses)
                analysis = list(analysis)[0]
                for _method in analysis.methods:
                    if _method.uid == method.uid:
                        analysis.methods.remove(_method)
                        await analysis.save()

        for _anal in payload.analyses:
            if _anal not in an_uids:
                analysis = await analysis_models.Analysis.get(uid=_anal)
                await analysis_models.Analysis.table_insert(
                    table=analysis_models.analysis_method,
                    mappings={"method_uid": method.uid, "analysis_uid": analysis.uid}
                )

        return MethodType(**method.marshal_simple())

    @strawberry.mutation
    async def create_country(
        self, info, payload: CountryInputType
    ) -> CountryResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please Provide a name for the country")

        exists = await models.Country.get(code=payload.code)
        if exists:
            return OperationError(
                error=f"Country code {payload.code} already exists: This code belongs to {exists.name}"
            )

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.CountryCreate(**incoming)
        country: models.Country = await models.Country.create(obj_in)
        return CountryType(**country.marshal_simple())

    @strawberry.mutation
    async def update_country(
        self, info, uid: int, payload: CountryInputType
    ) -> CountryResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        country = await models.Country.get(uid=uid)
        if not country:
            return OperationError(
                error=f"country with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = country.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(country, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.CountryUpdate(**country.to_dict())
        country = await country.update(obj_in)
        return CountryType(**country.marshal_simple())

    @strawberry.mutation
    async def create_province(
        self, info, payload: ProvinceInputType
    ) -> ProvinceResponse:  # noqa
        if not payload.name:
            return OperationError(error="Please Provide a name for the Province")

        exists = await models.Province.get(code=payload.code)
        if exists:
            return OperationError(
                error=f"Province code {payload.code} already belong to Province {exists.name}"
            )

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        province_in = schemas.ProvinceCreate(**incoming)
        province: models.Province = await models.Province.create(province_in)
        return ProvinceType(**province.marshal_simple())

    @strawberry.mutation
    async def update_province(
        self, info, uid: int, payload: ProvinceInputType
    ) -> ProvinceResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        province = await models.Province.get(uid=uid)
        if not province:
            return OperationError(
                error=f"province with id {uid} not found. Cannot update obj ..."
            )

        obj_data = province.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(province, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.ProvinceUpdate(**province.to_dict())
        province = await province.update(obj_in)
        return ProvinceType(**province.marshal_simple())

    @strawberry.mutation
    async def create_district(
        self, info, payload: DistrictInputType
    ) -> DistrictResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please Provide a name for the district")

        exists = await models.District.get(code=payload.code)
        if exists:
            return OperationError(
                error=f"District code {payload.code} already belong to district {exists.name}"
            )

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        district_in = schemas.DistrictCreate(**incoming)
        district: models.District = await models.District.create(district_in)
        return DistrictType(**district.marshal_simple())

    @strawberry.mutation
    async def update_district(
        self, info, uid: int, payload: DistrictInputType
    ) -> DistrictResponse:  # noqa
        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        district = await models.District.get(uid=uid)
        if not district:
            return OperationError(
                error=f"district with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = district.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(district, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.DistrictUpdate(**district.to_dict())
        district = await district.update(obj_in)
        return DistrictType(**district.marshal_simple())

    @strawberry.mutation
    async def create_unit(
        self, info, payload: UnitInputType
    ) -> UnitResponse:  # noqa

        if not payload.name:
            return OperationError(error="Unit name is required")

        exists = await models.Unit.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A Unit named {payload.name} already exists"
            )

        incoming: Dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.UnitCreate(**incoming)
        unit: models.Unit = await models.Unit.create(obj_in)
        return UnitType(**unit.marshal_simple())

    @strawberry.mutation
    async def update_unit(
        self, info, uid: int, payload: UnitInputType
    ) -> UnitResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        unit = await models.Unit.get(uid=uid)
        if not unit:
            return OperationError(
                error=f"unit with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = unit.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(unit, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.UnitUpdate(**unit.to_dict())
        unit = await unit.update(obj_in)
        return UnitType(**unit.marshal_simple())
