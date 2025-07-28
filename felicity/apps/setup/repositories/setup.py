import sqlalchemy as sa

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

    async def get_laboratories_by_organization(self, organization_uid: str) -> list[Laboratory]:
        """Get all laboratories belonging to a specific organization"""
        return await self.get_all(organization_uid__exact=organization_uid)

    async def get_laboratory_by_name(self, name: str, organization_uid: str = None) -> Laboratory | None:
        """Get laboratory by name within an organization"""
        filters = {"name__exact": name}
        if organization_uid:
            filters["organization_uid__exact"] = organization_uid
        return await self.get(**filters)

    async def search_laboratories(
        self, text: str, organization_uid: str = None
    ) -> list[Laboratory]:
        """Search laboratories by text in name, email, or address"""
        filters = {
            sa.or_: {
                "name__ilike": f"%{text}%",
                "email__ilike": f"%{text}%",
                "address__ilike": f"%{text}%",
            }
        }
        if organization_uid:
            filters["organization_uid__eq"] = organization_uid
        return await self.filter(**filters)


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
