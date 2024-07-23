from felicity.apps.setup.entities import (
    Department,
    Laboratory,
    LaboratorySetting,
    Manufacturer,
    Supplier,
    Unit,
)
from felicity.apps.abstract.repository import BaseRepository


class DepartmentRepository(BaseRepository[Department]):
    def __init__(self) -> None:
        super().__init__(Department)

class LaboratoryRepository(BaseRepository[Laboratory]):
    def __init__(self) -> None:
        super().__init__(Laboratory)

class LaboratorySettingRepository(
    BaseRepository[LaboratorySetting]
):
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
