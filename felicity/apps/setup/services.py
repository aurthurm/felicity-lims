from felicity.apps.abstract.service import BaseService
from felicity.apps.setup.entities.location import Country, District, Province
from felicity.apps.setup.entities.setup import (
    Department,
    Laboratory,
    LaboratorySetting,
    Manufacturer,
    Supplier,
    Unit,
)
from felicity.apps.setup.repositories import (
    CountryRepository,
    DepartmentRepository,
    DistrictRepository,
    LaboratoryRepository,
    LaboratorySettingRepository,
    ManufacturerRepository,
    ProvinceRepository,
    SupplierRepository,
    UnitRepository,
)
from felicity.apps.setup.schemas import (
    CountryCreate,
    CountryUpdate,
    DepartmentCreate,
    DepartmentUpdate,
    DistrictCreate,
    DistrictUpdate,
    LaboratoryCreate,
    LaboratorySettingCreate,
    LaboratorySettingUpdate,
    LaboratoryUpdate,
    ManufacturerCreate,
    ManufacturerUpdate,
    ProvinceCreate,
    ProvinceUpdate,
    SupplierCreate,
    SupplierUpdate,
    UnitCreate,
    UnitUpdate,
)


class LaboratorySettingService(
    BaseService[LaboratorySetting, LaboratorySettingCreate, LaboratorySettingUpdate]
):
    def __init__(self):
        super().__init__(LaboratorySettingRepository())


class SupplierService(BaseService[Supplier, SupplierCreate, SupplierUpdate]):
    def __init__(self):
        super().__init__(SupplierRepository())


class ManufacturerService(
    BaseService[Manufacturer, ManufacturerCreate, ManufacturerUpdate]
):
    def __init__(self):
        super().__init__(ManufacturerRepository())


class DepartmentService(BaseService[Department, DepartmentCreate, DepartmentUpdate]):
    def __init__(self):
        super().__init__(DepartmentRepository())


class UnitService(BaseService[Unit, UnitCreate, UnitUpdate]):
    def __init__(self):
        super().__init__(UnitRepository())


class LaboratoryService(BaseService[Laboratory, LaboratoryCreate, LaboratoryUpdate]):
    def __init__(self):
        super().__init__(LaboratoryRepository())

    async def get_by_setup_name(self, keyword="felicity") -> Laboratory:
        return await self.get(setup_name=keyword)


class DistrictService(BaseService[District, DistrictCreate, DistrictUpdate]):
    def __init__(self):
        super().__init__(DistrictRepository())


class ProvinceService(BaseService[Province, ProvinceCreate, ProvinceUpdate]):
    def __init__(self):
        super().__init__(ProvinceRepository())


class CountryService(BaseService[Country, CountryCreate, CountryUpdate]):
    def __init__(self):
        super().__init__(CountryRepository())
