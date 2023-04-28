from typing import List, Optional

import sqlalchemy as sa
import strawberry  # noqa
from api.gql import PageInfo
from api.gql.setup.types.department import DepartmentType
from api.gql.setup.types import (
    CountryType,
    DistrictCursorPage,
    DistrictEdge,
    DistrictType,
    InstrumentCursorPage,
    InstrumentEdge,
    InstrumentType,
    InstrumentTypeCursorPage,
    InstrumentTypeEdge,
    InstrumentTypeType,
    LaboratorySettingType,
    LaboratoryType,
    ManufacturerType,
    MethodCursorPage,
    MethodEdge,
    MethodType,
    ProvinceCursorPage,
    ProvinceEdge,
    ProvinceType,
    SupplierType,
    UnitType,
)
from apps.setup import models
from core.uid_gen import FelicityID
from utils import has_value_or_is_truthy


async def get_laboratory(setup_name: str) -> LaboratoryType:
    return await models.Laboratory.get(setup_name=setup_name)


async def get_laboratory_setting(setup_name: str) -> LaboratorySettingType:
    laboratory = await models.Laboratory.get(setup_name=setup_name)
    return await models.LaboratorySetting.get(laboratory_uid=laboratory.uid)


async def get_all_suppliers() -> List[SupplierType]:
    return await models.Supplier.all()


async def get_all_manufacturers() -> List[ManufacturerType]:
    return await models.Manufacturer.all()


async def get_all_departments() -> List[DepartmentType]:
    return await models.Department.all()


async def get_all_units() -> List[UnitType]:
    return await models.Unit.all()


async def get_all_instrument_types(
    self,
    info,
    page_size: int | None = None,
    after_cursor: str | None = None,
    before_cursor: str | None = None,
    text: str | None = None,
    sort_by: list[str] | None = None,
) -> InstrumentTypeCursorPage:
    filters = {}

    _or_ = dict()
    if has_value_or_is_truthy(text):
        arg_list = ["name__ilike", "description__ilike"]
        for _arg in arg_list:
            _or_[_arg] = f"%{text}%"

        filters = {sa.or_: _or_}

    page = await models.InstrumentType.paginate_with_cursors(
        page_size=page_size,
        after_cursor=after_cursor,
        before_cursor=before_cursor,
        filters=filters,
        sort_by=sort_by,
    )

    total_count: int = page.total_count
    edges: List[InstrumentTypeEdge[InstrumentType]] = page.edges
    items: List[InstrumentTypeType] = page.items
    page_info: PageInfo = page.page_info

    return InstrumentTypeCursorPage(
        total_count=total_count, edges=edges, items=items, page_info=page_info
    )


async def get_all_instruments(
    self,
    info,
    page_size: int | None = None,
    after_cursor: str | None = None,
    before_cursor: str | None = None,
    text: str | None = None,
    sort_by: list[str] | None = None,
) -> InstrumentCursorPage:
    filters = {}

    _or_ = dict()
    if has_value_or_is_truthy(text):
        arg_list = [
            "name__ilike",
            "code__ilike",
            "email__ilike",
            "email_cc__ilike",
            "mobile_phone__ilike",
            "business_phone__ilike",
            "province___name__ilike",
            "province___code__ilike",
        ]
        for _arg in arg_list:
            _or_[_arg] = f"%{text}%"

        filters = {sa.or_: _or_}

    page = await models.Instrument.paginate_with_cursors(
        page_size=page_size,
        after_cursor=after_cursor,
        before_cursor=before_cursor,
        filters=filters,
        sort_by=sort_by,
        get_related="methods",
    )

    total_count: int = page.total_count
    edges: List[InstrumentEdge[InstrumentType]] = page.edges
    items: List[InstrumentType] = page.items
    page_info: PageInfo = page.page_info

    return InstrumentCursorPage(
        total_count=total_count, edges=edges, items=items, page_info=page_info
    )


async def get_all_methods(
    self,
    info,
    page_size: int | None = None,
    after_cursor: str | None = None,
    before_cursor: str | None = None,
    text: str | None = None,
    sort_by: list[str] | None = None,
) -> MethodCursorPage:
    filters = {}

    _or_ = dict()
    if has_value_or_is_truthy(text):
        arg_list = ["name__ilike", "keywork__ilike"]
        for _arg in arg_list:
            _or_[_arg] = f"%{text}%"

        filters = {sa.or_: _or_}

    page = await models.Method.paginate_with_cursors(
        page_size=page_size,
        after_cursor=after_cursor,
        before_cursor=before_cursor,
        filters=filters,
        sort_by=sort_by,
        get_related="instruments",
    )

    total_count: int = page.total_count
    edges: List[MethodEdge[MethodType]] = page.edges
    items: List[MethodType] = page.items
    page_info: PageInfo = page.page_info

    return MethodCursorPage(
        total_count=total_count, edges=edges, items=items, page_info=page_info
    )


async def get_all_districts(
    self,
    info,
    page_size: int | None = None,
    after_cursor: str | None = None,
    before_cursor: str | None = None,
    text: str | None = None,
    sort_by: list[str] | None = None,
) -> DistrictCursorPage:
    filters = {}

    _or_ = dict()
    if has_value_or_is_truthy(text):
        arg_list = [
            "name__ilike",
            "code__ilike",
            "email__ilike",
            "email_cc__ilike",
            "mobile_phone__ilike",
            "business_phone__ilike",
            "province___name__ilike",
            "province___code__ilike",
        ]
        for _arg in arg_list:
            _or_[_arg] = f"%{text}%"

        filters = {sa.or_: _or_}

    page = await models.District.paginate_with_cursors(
        page_size=page_size,
        after_cursor=after_cursor,
        before_cursor=before_cursor,
        filters=filters,
        sort_by=sort_by,
    )

    total_count: int = page.total_count
    edges: List[DistrictEdge[DistrictType]] = page.edges
    items: List[DistrictType] = page.items
    page_info: PageInfo = page.page_info

    return DistrictCursorPage(
        total_count=total_count, edges=edges, items=items, page_info=page_info
    )


async def get_all_provinces(
    self,
    info,
    page_size: int | None = None,
    after_cursor: str | None = None,
    before_cursor: str | None = None,
    text: str | None = None,
    sort_by: list[str] | None = None,
) -> ProvinceCursorPage:
    filters = {}

    _or_ = dict()
    if has_value_or_is_truthy(text):
        arg_list = [
            "name__ilike",
            "code__ilike",
            "email__ilike",
            "email_cc__ilike",
            "mobile_phone__ilike",
            "business_phone__ilike",
        ]
        for _arg in arg_list:
            _or_[_arg] = f"%{text}%"

        filters = {sa.or_: _or_}

    page = await models.Province.paginate_with_cursors(
        page_size=page_size,
        after_cursor=after_cursor,
        before_cursor=before_cursor,
        filters=filters,
        sort_by=sort_by,
    )

    total_count: int = page.total_count
    edges: List[ProvinceEdge[ProvinceType]] = page.edges
    items: List[ProvinceType] = page.items
    page_info: PageInfo = page.page_info

    return ProvinceCursorPage(
        total_count=total_count, edges=edges, items=items, page_info=page_info
    )


async def get_all_countries() -> List[CountryType]:
    return await models.Country.all()


@strawberry.type
class SetupQuery:
    laboratory: LaboratoryType = strawberry.field(resolver=get_laboratory)

    laboratory_setting: LaboratorySettingType = strawberry.field(
        resolver=get_laboratory_setting
    )

    manufacturer_all: List[ManufacturerType] = strawberry.field(
        resolver=get_all_manufacturers
    )

    @strawberry.field
    async def manufacturer_by_uid(self, info, uid: FelicityID) -> ManufacturerType:
        query = await models.Manufacturer.get(uid=uid)
        return query

    supplier_all: List[SupplierType] = strawberry.field(resolver=get_all_suppliers)

    @strawberry.field
    async def supplier_by_uid(self, info, uid: FelicityID) -> SupplierType:
        query = await models.Supplier.get(uid=uid)
        return query

    department_all: List[DepartmentType] = strawberry.field(
        resolver=get_all_departments
    )

    @strawberry.field
    async def department_by_uid(self, info, uid: FelicityID) -> DepartmentType:
        query = await models.Department.get(uid=uid)
        return query

    instrument_type_all: InstrumentTypeCursorPage = strawberry.field(
        resolver=get_all_instrument_types
    )

    @strawberry.field
    async def instrument_type_by_uid(self, info, uid: FelicityID) -> InstrumentTypeType:
        query = await models.InstrumentType.get(uid=uid)
        return query

    instrument_all: InstrumentCursorPage = strawberry.field(
        resolver=get_all_instruments
    )

    @strawberry.field
    async def instrument_by_uid(self, info, uid: FelicityID) -> InstrumentType:
        query = await models.Instrument.get(uid=uid)
        return query

    method_all: MethodCursorPage = strawberry.field(resolver=get_all_methods)

    @strawberry.field
    async def method_by_uid(self, info, uid: FelicityID) -> MethodType:
        query = await models.Method.get(uid=uid)
        return query

    district_all: DistrictCursorPage = strawberry.field(resolver=get_all_districts)

    @strawberry.field
    async def district_by_uid(self, info, uid: FelicityID) -> DistrictType:
        district = await models.District.get(uid=uid)
        return district

    @strawberry.field
    async def districts_by_province_uid(
        self, info, uid: FelicityID
    ) -> List[DistrictType]:
        districts = await models.District.get_all(province_uid__exact=uid)
        return districts

    province_all: ProvinceCursorPage = strawberry.field(resolver=get_all_provinces)

    @strawberry.field
    async def province_by_uid(self, info, uid: FelicityID) -> ProvinceType:
        province = await models.Province.get(uid=uid)
        return province

    @strawberry.field
    async def provinces_by_country_uid(
        self, info, uid: FelicityID
    ) -> List[ProvinceType]:
        provinces = await models.Province.get_all(country_uid__exact=uid)
        return provinces

    country_all: List[CountryType] = strawberry.field(resolver=get_all_countries)

    @strawberry.field
    async def country_by_uid(self, info, uid: FelicityID) -> CountryType:
        country = await models.Country.find(uid)
        return country

    unit_all: List[UnitType] = strawberry.field(resolver=get_all_units)

    @strawberry.field
    async def unit_by_uid(self, info, uid: FelicityID) -> UnitType:
        unit = await models.Unit.find(uid)
        return unit
