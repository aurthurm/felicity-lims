from .department import DepartmentType
from .setup import (CountryType, DistrictCursorPage, DistrictEdge,
                    DistrictType, LaboratorySettingType, LaboratoryType,
                    ManufacturerType, ProvinceCursorPage, ProvinceEdge,
                    ProvinceType, SupplierType, UnitType)

setup_types = [
    LaboratoryType,
    LaboratorySettingType,
    SupplierType,
    ManufacturerType,
    UnitType,
    CountryType,
    ProvinceType,
    ProvinceEdge,
    ProvinceCursorPage,
    DistrictType,
    DistrictEdge,
    DistrictCursorPage,
    DepartmentType,
]
