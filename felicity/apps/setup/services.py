from felicity.apps.abstract.service import BaseService
from felicity.apps.setup.entities import Organization, OrganizationSetting
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
from felicity.apps.setup.repositories.setup import OrganizationRepository, OrganizationSettingRepository
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
    UnitUpdate, OrganizationCreate, OrganizationUpdate, OrganizationSettingCreate, OrganizationSettingUpdate,
)


class OrganizationService(BaseService[Organization, OrganizationCreate, OrganizationUpdate]):
    def __init__(self):
        super().__init__(OrganizationRepository())

    async def get_by_setup_name(self, keyword="felicity") -> Organization:
        return await self.get(setup_name=keyword)


class OrganizationSettingService(
    BaseService[OrganizationSetting, OrganizationSettingCreate, OrganizationSettingUpdate]
):
    def __init__(self):
        super().__init__(OrganizationSettingRepository())


class LaboratoryService(BaseService[Laboratory, LaboratoryCreate, LaboratoryUpdate]):
    def __init__(self):
        super().__init__(LaboratoryRepository())

    async def create_laboratory(self, laboratory_data: LaboratoryCreate) -> Laboratory:
        """Create a new laboratory with validation"""
        existing = await self.repository.get_laboratory_by_name(
            laboratory_data.name, laboratory_data.organization_uid
        )
        if existing:
            raise ValueError(f"Laboratory with name '{laboratory_data.name}' already exists in this organization")
        
        return await self.create(laboratory_data)

    async def get_laboratories_by_organization(self, organization_uid: str) -> list[Laboratory]:
        """Get all laboratories for an organization"""
        return await self.repository.get_laboratories_by_organization(organization_uid)

    async def search_laboratories(
        self, text: str, organization_uid: str = None, limit: int = 10
    ) -> list[Laboratory]:
        """Search laboratories by text"""
        return await self.repository.search_laboratories(text, organization_uid, limit)

    async def get_laboratory_by_name(self, name: str, organization_uid: str = None) -> Laboratory | None:
        """Get laboratory by name"""
        return await self.repository.get_laboratory_by_name(name, organization_uid)

    async def update_laboratory_manager(self, laboratory_uid: str, manager_uid: str) -> Laboratory:
        """Update laboratory manager"""
        laboratory = await self.get(uid=laboratory_uid)
        if not laboratory:
            raise ValueError(f"Laboratory with uid '{laboratory_uid}' not found")
        
        update_data = LaboratoryUpdate(**laboratory.to_dict())
        update_data.lab_manager_uid = manager_uid
        
        return await self.update(laboratory_uid, update_data)


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


class DistrictService(BaseService[District, DistrictCreate, DistrictUpdate]):
    def __init__(self):
        super().__init__(DistrictRepository())


class ProvinceService(BaseService[Province, ProvinceCreate, ProvinceUpdate]):
    def __init__(self):
        super().__init__(ProvinceRepository())


class CountryService(BaseService[Country, CountryCreate, CountryUpdate]):
    def __init__(self):
        super().__init__(CountryRepository())
