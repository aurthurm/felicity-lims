from domain.exceptions import *
from domain.setup.ports.repository import (
    ILaboratoryRepository,
    ICountryRepository,
    ILaboratorySettingRepository,
    ISupplierRepository,
    IManufacturerRepository,
    IDepartmentRepository,
    IUnitRepository,
    IDistrictRepository,
    IProvinceRepository,
)
from domain.setup.ports.service import (
    ILaboratorySettingService,
    ISupplierService,
    IManufacturerService,
    IDepartmentService,
    IUnitService,
    ILaboratoryService,
    IDistrictService,
    IProvinceService,
    ICountryService,
)
from domain.setup.schemas import (
    LaboratorySetting,
    Supplier,
    Manufacturer,
    Department,
    Unit,
    Laboratory,
    District,
    Province,
    Country,
    LaboratoryUpdate,
    SupplierCreate,
    SupplierUpdate,
    ManufacturerCreate,
    ManufacturerUpdate,
    DepartmentCreate,
    DepartmentUpdate,
    UnitCreate,
    UnitUpdate,
    DistrictCreate,
    DistrictUpdate,
    ProvinceCreate,
    ProvinceUpdate,
    CountryCreate,
    CountryUpdate,
)
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal


class LaboratorySettingService(
    BaseService[LaboratorySetting], ILaboratorySettingService
):
    def __init__(self, repository: ILaboratorySettingRepository):
        self.repository = repository

    async def update(
        self,
        uid: str,
        laboratory_uid: str,
        allow_self_verification: bool | None,
        allow_patient_registration: bool | None,
        allow_sample_registration: bool | None,
        allow_worksheet_creation: bool | None,
        default_route: str | None,
        password_lifetime: int | None,
        inactivity_log_out: int | None,
        default_theme: str | None,
        auto_receive_samples: bool | None,
        sticker_copies: int | None,
        **kwargs,
    ) -> LaboratorySetting:  # noqa
        payload = locals()

        lab_setting = await self.get(uid=uid)

        obj_data = marshal(lab_setting)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(lab_setting, field, payload.__dict__[field])
                except Exception as e:
                    ...

        obj_in = LaboratoryUpdate(**marshal(lab_setting))
        return await super().update(lab_setting, **marshal(obj_in))


class SupplierService(BaseService[Supplier], ISupplierService):
    def __init__(self, repository: ISupplierRepository):
        self.repository = repository

    async def create(
        self,
        name: str,
        description: str | None,
        code: str | None = None,
    ) -> Supplier:  # noqa
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"Suppler named {name} already exists")

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = SupplierCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        name: str,
        description: str | None,
        code: str | None = None,
    ) -> Supplier:  # noqa
        payload = locals()

        supplier = await self.get(uid=uid)
        obj_data = marshal(supplier)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(supplier, field, payload.__dict__[field])
                except Exception as e:
                    ...

        obj_in = SupplierUpdate(**marshal(supplier))
        return await super().update(supplier, **marshal(obj_in))


class ManufacturerService(BaseService[Manufacturer], IManufacturerService):
    def __init__(self, repository: IManufacturerRepository):
        self.repository = repository

    async def create(
        self,
        name: str,
        description: str | None,
    ) -> Manufacturer:  # noqa
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"Manufacturer named {name} already exists")

        incoming = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = ManufacturerCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self, uid: str, name: str, description: str | None
    ) -> Manufacturer:
        payload = locals()

        manufacturer = await self.get(uid=uid)

        obj_data = marshal(manufacturer)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(manufacturer, field, payload.__dict__[field])
                except Exception as e:
                    ...

        obj_in = ManufacturerUpdate(**marshal(manufacturer))
        return await super().update(manufacturer, **marshal(obj_in))


class DepartmentService(BaseService[Department], IDepartmentService):
    def __init__(self, repository: IDepartmentRepository):
        self.repository = repository

    async def create(
        self,
        name: str,
        description: str | None,
        code: str | None,
    ) -> Department:
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"Department named {name} already exists")

        incoming = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = DepartmentCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self, uid: str, name: str, description: str | None, code: str | None
    ) -> Department:
        payload = locals()

        department = await self.get(uid=uid)

        obj_data = marshal(department)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(department, field, payload.__dict__[field])
                except Exception as e:
                    ...

        obj_in = DepartmentUpdate(**marshal(department))
        return await super().update(department, **marshal(obj_in))


class UnitService(BaseService[Unit], IUnitService):
    def __init__(self, repository: IUnitRepository):
        self.repository = repository

    async def create(self, name: str, is_si_unit: bool) -> Unit:  # noqa
        payload = locals()

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"Unit named {name} already exists")

        incoming = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = UnitCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(self, uid: str, name: str, is_si_unit: bool) -> Unit:
        payload = locals()

        unit = await self.get(uid=uid)

        obj_data = marshal(unit)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(unit, field, payload.__dict__[field])
                except Exception as e:
                    ...

        obj_in = UnitUpdate(**marshal(unit))
        return await super().update(unit, **marshal(obj_in))


class LaboratoryService(BaseService[Laboratory], ILaboratoryService):
    def __init__(self, repository: ILaboratoryRepository):
        self.repository = repository

    async def get_by_setup_name(self, keyword="felicity") -> Laboratory:
        return await self.get(setup_name=keyword)

    async def update(
        self,
        uid: str,
        lab_name: str,
        setup_name: str,
        email: str | None,
        email_cc: str | None,
        mobile_phone: str | None,
        business_phone: str | None,
        lab_manager_uid: str | None,
        address: str | None,
        logo: str | None,
    ) -> Laboratory:  # noqa
        payload = locals()

        laboratory = await self.get(uid=uid)

        obj_data = marshal(laboratory)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(laboratory, field, payload.__dict__[field])
                except Exception as e:
                    ...

        obj_in = LaboratoryUpdate(**marshal(laboratory))
        return await super().update(laboratory, **marshal(obj_in))


class DistrictService(BaseService[District], IDistrictService):
    def __init__(self, repository: IDistrictRepository):
        self.repository = repository

    async def create(
        self,
        name: str,
        province_uid: str | None,
        code: str | None,
        email: str | None,
        email_cc: str | None,
        mobile_phone: str | None,
        business_phone: str | None,
        active: bool | None = True,
    ) -> District:  # noqa
        payload = locals()

        exists = await self.get(code=code)
        if exists:
            raise AlreadyExistsError(f"District code {code} not unique")

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        district_in = DistrictCreate(**incoming)
        return await super().create(**marshal(district_in))

    async def update(
        self,
        info,
        uid: str,
        name: str,
        province_uid: str | None,
        code: str | None,
        email: str | None,
        email_cc: str | None,
        mobile_phone: str | None,
        business_phone: str | None,
        active: bool | None = True,
    ) -> District:
        payload = locals()

        district = await self.get(uid=uid)

        obj_data = district.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(district, field, payload.__dict__[field])
                except Exception as e:
                    ...

        obj_in = DistrictUpdate(**marshal(district))
        return await super().update(district, **marshal(obj_in))


class ProvinceService(BaseService[Province], IProvinceService):
    def __init__(self, repository: IProvinceRepository):
        self.repository = repository

    async def create(
        self,
        name: str | None,
        country_uid: str | None,
        code: str | None,
        email: str | None,
        email_cc: str | None,
        mobile_phone: str | None,
        business_phone: str | None,
        active: bool | None,
    ) -> Province:
        payload = locals()

        exists = await self.get(code=code)
        if exists:
            raise AlreadyExistsError(
                f"Province code {code} already belong to Province {exists.name}"
            )

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        province_in = ProvinceCreate(**incoming)
        return await super().create(**marshal(province_in))

    async def update(
        self,
        info,
        uid: str,
        name: str | None,
        country_uid: str | None,
        code: str | None,
        email: str | None,
        email_cc: str | None,
        mobile_phone: str | None,
        business_phone: str | None,
        active: bool | None,
    ) -> Province:  # noqa
        payload = locals()

        province = await self.get(uid=uid)

        obj_data = province.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(province, field, payload.__dict__[field])
                except Exception as e:
                    ...

        obj_in = ProvinceUpdate(**marshal(province))
        return await super().update(province, **marshal(obj_in))


class CountryService(BaseService[Country], ICountryService):
    def __init__(self, repository: ICountryRepository):
        self.repository = repository

    async def create(
        self, name: str, code: str, active: bool | None
    ) -> Country:  # noqa
        payload = locals()
        exists = await self.get(code=code)
        if exists:
            raise AlreadyExistsError(
                f"Country code {code} already exists: This code belongs to {exists.name}"
            )

        incoming = {}
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = CountryCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self, uid: str, name: str, code: str, active: bool | None
    ) -> Country:  # noqa
        payload = locals()

        country = await self.get(uid=uid)

        obj_data = marshal(country)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(country, field, payload.__dict__[field])
                except Exception as e:
                    ...

        obj_in = CountryUpdate(**marshal(country))
        return await super().update(country, **marshal(obj_in))
