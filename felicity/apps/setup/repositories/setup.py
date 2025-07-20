from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.setup.entities import (
    Department,
    Organization,
    OrganizationSetting,
    Laboratory,
    LaboratorySetting,
    Manufacturer,
    Supplier,
    Unit,
)


class DepartmentRepository(BaseRepository[Department]):
    def __init__(self) -> None:
        super().__init__(Department)


class OrganizationRepository(BaseRepository[Organization]):
    def __init__(self) -> None:
        super().__init__(Organization)


class OrganizationSettingRepository(BaseRepository[OrganizationSetting]):
    def __init__(self) -> None:
        super().__init__(OrganizationSetting)


class LaboratoryRepository(BaseRepository[Laboratory]):
    def __init__(self) -> None:
        super().__init__(Laboratory)


class LaboratorySettingRepository(BaseRepository[LaboratorySetting]):
    def __init__(self) -> None:
        super().__init__(LaboratorySetting)


class ManufacturerRepository(BaseRepository[Manufacturer]):
    def __init__(self) -> None:
        super().__init__(Manufacturer)


class SupplierRepository(BaseRepository[Supplier]):
    def __init__(self) -> None:
        super().__init__(Supplier)


class UnitRepository(BaseRepository[Unit]):
    def __init__(self) -> None:
        super().__init__(Unit)
