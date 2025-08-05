import logging

import strawberry  # noqa

from felicity.api.gql.auth import auth_from_info
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.setup.types import (
    CountryType,
    DistrictType,
    LaboratorySettingType,
    LaboratoryType,
    ManufacturerType,
    ProvinceType,
    SupplierType,
    UnitType,
)
from felicity.api.gql.setup.types.department import DepartmentType
from felicity.api.gql.setup.types.setup import OrganizationType, OrganizationSettingType
from felicity.api.gql.types import OperationError
from felicity.apps.setup import schemas
from felicity.apps.setup.services import (
    CountryService,
    DepartmentService,
    DistrictService,
    LaboratoryService,
    LaboratorySettingService,
    ManufacturerService,
    ProvinceService,
    SupplierService,
    UnitService, OrganizationService, OrganizationSettingService,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

OrganizationResponse = strawberry.union(
    "OrganizationResponse",
    (OrganizationType, OperationError),
    description="",  # noqa
)
OrganizationSettingResponse = strawberry.union(
    "OrganizationSettingResponse",
    (OrganizationSettingType, OperationError),
    description="",  # noqa
)

LaboratoryResponse = strawberry.union(
    "LaboratoryResponse",
    (LaboratoryType, OperationError),
    description="",  # noqa
)
LaboratorySettingResponse = strawberry.union(
    "LaboratorySettingResponse",
    (LaboratorySettingType, OperationError),
    description="",  # noqa
)
CountryResponse = strawberry.union(
    "CountryResponse",
    (CountryType, OperationError),
    description="",  # noqa
)
ProvinceResponse = strawberry.union(
    "ProvinceResponse",
    (ProvinceType, OperationError),
    description="",  # noqa
)
DistrictResponse = strawberry.union(
    "DistrictResponse",
    (DistrictType, OperationError),
    description="",  # noqa
)
SupplierResponse = strawberry.union(
    "SupplierResponse",
    (SupplierType, OperationError),
    description="",  # noqa
)
ManufacturerResponse = strawberry.union(
    "ManufacturerResponse",
    (ManufacturerType, OperationError),
    description="",  # noqa
)
DepartmentResponse = strawberry.union(
    "DepartmentResponse",
    (DepartmentType, OperationError),
    description="",  # noqa
)
UnitResponse = strawberry.union(
    "UnitResponse",
    (UnitType, OperationError),
    description="",  # noqa
)


@strawberry.input
class OrganisationInputType:
    uid: str
    name: str | None = ""
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
    code: str | None = None
    country_uid: str | None = None
    province_uid: str | None = None
    district_uid: str | None = None


@strawberry.input
class OrganisationSettingInputType:
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
class LaboratoryInputType:
    name: str
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
    code: str | None = None
    country_uid: str | None = None
    province_uid: str | None = None
    district_uid: str | None = None


@strawberry.input
class LaboratoryCreateInputType:
    name: str
    organization_uid: str
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
    code: str | None = None
    country_uid: str | None = None
    province_uid: str | None = None
    district_uid: str | None = None


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
    async def update_organisation(
            self, info, payload: OrganisationInputType
    ) -> OrganizationResponse:  # noqa
        if not payload.uid:
            return OperationError(error="Organization UID is required")

        organization = await OrganizationService().get(uid=payload.uid)
        if not organization:
            return OperationError(
                error=f"Organization with uid {payload.uid} not found. Cannot update obj ..."
            )

        obj_data = organization.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(organization, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.OrganizationUpdate(**organization.to_dict())
        organisation = await OrganizationService().update(organization.uid, obj_in)
        return OrganizationType(**organisation.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_organisation_setting(
            self, info, uid: str, payload: OrganisationSettingInputType
    ) -> OrganizationSettingResponse:  # noqa
        await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        org_setting = await OrganizationSettingService().get(uid=uid)
        if not org_setting:
            return OperationError(
                error=f"Organization Setting with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = org_setting.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(org_setting, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.OrganizationSettingUpdate(**org_setting.to_dict())
        org_setting = await OrganizationSettingService().update(org_setting.uid, obj_in)
        return OrganizationSettingType(**org_setting.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_laboratory(
            self, info, payload: LaboratoryCreateInputType
    ) -> LaboratoryResponse:  # noqa
        if not payload.name:
            return OperationError(error="Laboratory name is required")

        if not payload.organization_uid:
            return OperationError(error="Organization UID is required")

        try:
            incoming: dict = dict()
            for k, v in payload.__dict__.items():
                incoming[k] = v

            obj_in = schemas.LaboratoryCreate(**incoming)
            laboratory = await LaboratoryService().create_laboratory(obj_in)
            return LaboratoryType(**laboratory.marshal_simple())
        except ValueError as e:
            return OperationError(error=str(e))
        except Exception as e:
            logger.error(f"Error creating laboratory: {e}")
            return OperationError(error="Failed to create laboratory")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_laboratory(
            self, info, uid: str, payload: LaboratoryInputType
    ) -> LaboratoryResponse:  # noqa
        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        laboratory = await LaboratoryService().get(uid=uid)
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
        laboratory = await LaboratoryService().update(laboratory.uid, obj_in)
        return LaboratoryType(**laboratory.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_laboratory_manager(
            self, info, laboratory_uid: str, manager_uid: str
    ) -> LaboratoryResponse:  # noqa
        if not laboratory_uid:
            return OperationError(error="Laboratory UID is required")

        if not manager_uid:
            return OperationError(error="Manager UID is required")

        try:
            laboratory = await LaboratoryService().update_laboratory_manager(
                laboratory_uid, manager_uid
            )
            return LaboratoryType(**laboratory.marshal_simple())
        except ValueError as e:
            return OperationError(error=str(e))
        except Exception as e:
            logger.error(f"Error updating laboratory manager: {e}")
            return OperationError(error="Failed to update laboratory manager")

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_laboratory_setting(
            self, info, uid: str, payload: LaboratorySettingInputType
    ) -> LaboratorySettingResponse:  # noqa
        await auth_from_info(info)

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        lab_setting = await LaboratorySettingService().get(uid=uid)
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
        lab_setting = await LaboratorySettingService().update(lab_setting.uid, obj_in)

        return LaboratorySettingType(**lab_setting.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_department(
            root, info, payload: DepartmentInputType
    ) -> DepartmentResponse:  # noqa
        if not payload.name:
            return OperationError(error="Please Provide a name for your department")

        exists = await DepartmentService().get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A Department named {payload.name} already exists"
            )

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.DepartmentCreate(**incoming)
        department = await DepartmentService().create(obj_in)
        return DepartmentType(
            **department.marshal_simple(exclude=["created_by", "updated_by"])
        )

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_department(
            self, info, uid: str, payload: DepartmentInputType
    ) -> DepartmentResponse:  # noqa
        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        department = await DepartmentService().get(uid=uid)
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
        department = await DepartmentService().update(department.uid, obj_in)
        return DepartmentType(
            **department.marshal_simple(exclude=["created_by", "updated_by"])
        )

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_supplier(
            self, info, payload: SupplierInputType
    ) -> SupplierResponse:  # noqa
        if not payload.name:
            return OperationError(error="Please Provide a name for your supplier")

        exists = await SupplierService().get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A Supplier named {payload.name} already exists"
            )

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.SupplierCreate(**incoming)
        supplier = await SupplierService().create(obj_in)
        return SupplierType(**supplier.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_supplier(
            self, info, uid: str, payload: SupplierInputType
    ) -> SupplierResponse:  # noqa
        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        supplier = await SupplierService().get(uid=uid)
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
        supplier = await SupplierService().update(supplier.uid, obj_in)
        return SupplierType(**supplier.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_manufacturer(
            self, info, payload: ManufacturerInputType
    ) -> ManufacturerResponse:  # noqa
        if not payload.name:
            return OperationError(error="Please a name for your manufacturer")

        exists = await ManufacturerService().get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A Manufacturer named {payload.name} already exists"
            )

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.ManufacturerCreate(**incoming)
        manufacturer = await ManufacturerService().create(obj_in)
        return ManufacturerType(**manufacturer.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_manufacturer(
            self, info, uid: str, payload: ManufacturerInputType
    ) -> ManufacturerResponse:  # noqa
        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        manufacturer = await ManufacturerService().get(uid=uid)
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
        manufacturer = await ManufacturerService().update(manufacturer.uid, obj_in)
        return ManufacturerType(**manufacturer.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_country(self, info, payload: CountryInputType) -> CountryResponse:  # noqa
        if not payload.name:
            return OperationError(error="Please Provide a name for the country")

        exists = await CountryService().get(code=payload.code)
        if exists:
            return OperationError(
                error=f"Country code {payload.code} already exists: This code belongs to {exists.name}"
            )

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.CountryCreate(**incoming)
        country = await CountryService().create(obj_in)
        return CountryType(**country.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_country(
            self, info, uid: str, payload: CountryInputType
    ) -> CountryResponse:  # noqa
        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        country = await CountryService().get(uid=uid)
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
        country = await CountryService().update(country.uid, obj_in)
        return CountryType(**country.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_province(
            self, info, payload: ProvinceInputType
    ) -> ProvinceResponse:  # noqa
        if not payload.name:
            return OperationError(error="Please Provide a name for the Province")

        exists = await ProvinceService().get(code=payload.code)
        if exists:
            return OperationError(
                error=f"Province code {payload.code} already belong to Province {exists.name}"
            )

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        province_in = schemas.ProvinceCreate(**incoming)
        province = await ProvinceService().create(province_in)
        return ProvinceType(**province.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_province(
            self, info, uid: str, payload: ProvinceInputType
    ) -> ProvinceResponse:  # noqa
        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        province = await ProvinceService().get(uid=uid)
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
        province = await ProvinceService().update(province.uid, obj_in)
        return ProvinceType(**province.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_district(
            self, info, payload: DistrictInputType
    ) -> DistrictResponse:  # noqa
        if not payload.name:
            return OperationError(error="Please Provide a name for the district")

        exists = await DistrictService().get(code=payload.code)
        if exists:
            return OperationError(
                error=f"District code {payload.code} already belong to district {exists.name}"
            )

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        district_in = schemas.DistrictCreate(**incoming)
        district = await DistrictService().create(district_in)
        return DistrictType(**district.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_district(
            self, info, uid: str, payload: DistrictInputType
    ) -> DistrictResponse:  # noqa
        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        district = await DistrictService().get(uid=uid)
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
        district = await DistrictService().update(district.uid, obj_in)
        return DistrictType(**district.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_unit(self, info, payload: UnitInputType) -> UnitResponse:  # noqa
        if not payload.name:
            return OperationError(error="Unit name is required")

        exists = await UnitService().get(name=payload.name)
        if exists:
            return OperationError(error=f"A Unit named {payload.name} already exists")

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.UnitCreate(**incoming)
        unit = await UnitService().create(obj_in)
        return UnitType(**unit.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_unit(self, info, uid: str, payload: UnitInputType) -> UnitResponse:  # noqa
        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        unit = await UnitService().get(uid=uid)
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
        unit = await UnitService().update(unit.uid, obj_in)
        return UnitType(**unit.marshal_simple())
