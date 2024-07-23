import logging

import strawberry  # noqa

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.setup.types import (CountryType, DistrictType,
                                          LaboratorySettingType,
                                          LaboratoryType, ManufacturerType,
                                          ProvinceType, SupplierType, UnitType)
from felicity.api.gql.setup.types.department import DepartmentType
from felicity.api.gql.types import OperationError
from felicity.apps.setup import entities, schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

LaboratoryResponse = strawberry.union(
    "LaboratoryResponse", (LaboratoryType, OperationError), description=""  # noqa
)
LaboratorySettingResponse = strawberry.union(
    "LaboratorySettingResponse",
    (LaboratorySettingType, OperationError),
    description="",  # noqa
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
    "UnitResponse", (UnitType, OperationError), description=""  # noqa
)


@strawberry.input
class LaboratoryInputType:
    lab_name: str
    setup_name: str = "felicity"
    tag_line: str | None = ""
    email: str | None = None
    email_cc: str | None = None
    mobile_phone: str | None = None
    business_phone: str | None = None
    lab_manager_uid: str | None = None
    address: str | None = None
    banking: str | None = None
    logo: str | None = None
    quality_statement: str | None = None


@strawberry.input
class LaboratorySettingInputType:
    laboratory_uid: str
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
    allow_billing: bool | None = False
    allow_auto_billing: bool | None = False
    currency: str | None = "USD"
    payment_terms_days: int | None = 0


@strawberry.input
class DepartmentInputType:
    name: str
    description: str | None = ""
    code: str | None = ""


@strawberry.input
class SupplierInputType:
    name: str
    description: str | None = ""
    code: str | None = ""


@strawberry.input
class ManufacturerInputType:
    name: str
    description: str | None = ""


@strawberry.input
class CountryInputType:
    name: str
    code: str
    active: bool | None = True


@strawberry.input
class ProvinceInputType:
    name: str | None
    country_uid: str | None
    code: str | None = ""
    email: str | None = ""
    email_cc: str | None = ""
    mobile_phone: str | None = ""
    business_phone: str | None = ""
    active: bool | None = True


@strawberry.input
class DistrictInputType:
    name: str
    province_uid: str | None
    code: str | None = ""
    email: str | None = ""
    email_cc: str | None = ""
    mobile_phone: str | None = ""
    business_phone: str | None = ""
    active: bool | None = True


@strawberry.input
class UnitInputType:
    name: str
    is_si_unit: bool


@strawberry.type
class SetupMutations:
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_laboratory(
        self, info, uid: str, payload: LaboratoryInputType
    ) -> LaboratoryResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        laboratory = await entities.Laboratory.get(uid=uid)
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

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_laboratory_setting(
        self, info, uid: str, payload: LaboratorySettingInputType
    ) -> LaboratorySettingResponse:  # noqa

        is_authenticated, felicity_user = await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        lab_setting: entities.LaboratorySetting = await entities.LaboratorySetting.get(
            uid=uid
        )
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

        obj_in = schemas.LaboratorySettingUpdate(**lab_setting.to_dict())
        lab_setting = await lab_setting.update(obj_in)

        return LaboratorySettingType(**lab_setting.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_department(
        root, info, payload: DepartmentInputType
    ) -> DepartmentResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please Provide a name for your department")

        exists = await entities.Department.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A Department named {payload.name} already exists"
            )

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.DepartmentCreate(**incoming)
        department: entities.Department = await entities.Department.create(obj_in)
        return DepartmentType(
            **department.marshal_simple(exclude=["created_by", "updated_by"])
        )

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_department(
        self, info, uid: str, payload: DepartmentInputType
    ) -> DepartmentResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        department = await entities.Department.get(uid=uid)
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
        return DepartmentType(
            **department.marshal_simple(exclude=["created_by", "updated_by"])
        )

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_supplier(
        self, info, payload: SupplierInputType
    ) -> SupplierResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please Provide a name for your supplier")

        exists = await entities.Supplier.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A Supplier named {payload.name} already exists"
            )

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.SupplierCreate(**incoming)
        supplier: entities.Supplier = await entities.Supplier.create(obj_in)
        return SupplierType(**supplier.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_supplier(
        self, info, uid: str, payload: SupplierInputType
    ) -> SupplierResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        supplier = await entities.Supplier.get(uid=uid)
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

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_manufacturer(
        self, info, payload: ManufacturerInputType
    ) -> ManufacturerResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please a name for your manufacturer")

        exists = await entities.Manufacturer.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A Manufacturer named {payload.name} already exists"
            )

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.ManufacturerCreate(**incoming)
        manufacturer: entities.Manufacturer = await entities.Manufacturer.create(obj_in)
        return ManufacturerType(**manufacturer.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_manufacturer(
        self, info, uid: str, payload: ManufacturerInputType
    ) -> ManufacturerResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        manufacturer = await entities.Manufacturer.get(uid=uid)
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

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_country(
        self, info, payload: CountryInputType
    ) -> CountryResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please Provide a name for the country")

        exists = await entities.Country.get(code=payload.code)
        if exists:
            return OperationError(
                error=f"Country code {payload.code} already exists: This code belongs to {exists.name}"
            )

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.CountryCreate(**incoming)
        country: entities.Country = await entities.Country.create(obj_in)
        return CountryType(**country.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_country(
        self, info, uid: str, payload: CountryInputType
    ) -> CountryResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        country = await entities.Country.get(uid=uid)
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

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_province(
        self, info, payload: ProvinceInputType
    ) -> ProvinceResponse:  # noqa
        if not payload.name:
            return OperationError(error="Please Provide a name for the Province")

        exists = await entities.Province.get(code=payload.code)
        if exists:
            return OperationError(
                error=f"Province code {payload.code} already belong to Province {exists.name}"
            )

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        province_in = schemas.ProvinceCreate(**incoming)
        province: entities.Province = await entities.Province.create(province_in)
        return ProvinceType(**province.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_province(
        self, info, uid: str, payload: ProvinceInputType
    ) -> ProvinceResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        province = await entities.Province.get(uid=uid)
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

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_district(
        self, info, payload: DistrictInputType
    ) -> DistrictResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please Provide a name for the district")

        exists = await entities.District.get(code=payload.code)
        if exists:
            return OperationError(
                error=f"District code {payload.code} already belong to district {exists.name}"
            )

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        district_in = schemas.DistrictCreate(**incoming)
        district: entities.District = await entities.District.create(district_in)
        return DistrictType(**district.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_district(
        self, info, uid: str, payload: DistrictInputType
    ) -> DistrictResponse:  # noqa
        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        district = await entities.District.get(uid=uid)
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

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_unit(self, info, payload: UnitInputType) -> UnitResponse:  # noqa

        if not payload.name:
            return OperationError(error="Unit name is required")

        exists = await entities.Unit.get(name=payload.name)
        if exists:
            return OperationError(error=f"A Unit named {payload.name} already exists")

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.UnitCreate(**incoming)
        unit: entities.Unit = await entities.Unit.create(obj_in)
        return UnitType(**unit.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_unit(
        self, info, uid: str, payload: UnitInputType
    ) -> UnitResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        unit = await entities.Unit.get(uid=uid)
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
