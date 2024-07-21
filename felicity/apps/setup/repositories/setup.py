from domain.setup.ports.repository import (
    IDepartmentRepository,
    ILaboratoryRepository,
    ILaboratorySettingRepository,
    IManufacturerRepository,
    ISupplierRepository,
    IUnitRepository,
)

from infrastructure.database.repository.base import BaseRepository

from infrastructure.database.setup.entities import (
    Department,
    Laboratory,
    LaboratorySetting,
    Manufacturer,
    Supplier,
    Unit,
)


class DepartmentRepository(BaseRepository[Department], IDepartmentRepository):
    def __init__(self) -> None:
        self.model = Department
        super().__init__()


class LaboratoryRepository(BaseRepository[Laboratory], ILaboratoryRepository):
    def __init__(self) -> None:
        self.model = Laboratory
        super().__init__()


class LaboratorySettingRepository(
    BaseRepository[LaboratorySetting], ILaboratorySettingRepository
):
    def __init__(self) -> None:
        self.model = LaboratorySetting
        super().__init__()


class ManufacturerRepository(BaseRepository[Manufacturer], IManufacturerRepository):
    def __init__(self) -> None:
        self.model = Manufacturer
        super().__init__()


class SupplierRepository(BaseRepository[Supplier], ISupplierRepository):
    def __init__(self) -> None:
        self.model = Supplier
        super().__init__()


class UnitRepository(BaseRepository[Unit], IUnitRepository):
    def __init__(self) -> None:
        self.model = Unit
        super().__init__()
