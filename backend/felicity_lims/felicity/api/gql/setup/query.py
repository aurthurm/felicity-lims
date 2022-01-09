from typing import List, Optional

import sqlalchemy as sa
import strawberry  # noqa
from felicity.apps.setup import models
from felicity.gql import PageInfo
from felicity.gql.setup.types import (
    CountryType,
    DepartmentType,
    DistrictCursorPage,
    DistrictEdge,
    DistrictType,
    InstrumentCursorPage,
    InstrumentEdge,
    InstrumentType,
    LaboratoryType,
    MethodCursorPage,
    MethodEdge,
    MethodType,
    ProvinceCursorPage,
    ProvinceEdge,
    ProvinceType,
    SupplierType,
)
from felicity.utils import has_value_or_is_truthy


async def get_all_laboratories() -> List[LaboratoryType]:
    return await models.Laboratory.all()


async def get_all_suppliers() -> List[SupplierType]:
    return await models.Supplier.all()


async def get_all_departments() -> List[DepartmentType]:
    return await models.Department.all()


async def get_all_instruments(
    self,
    info,
    page_size: Optional[int] = None,
    after_cursor: Optional[str] = None,
    before_cursor: Optional[str] = None,
    text: Optional[str] = None,
    sort_by: Optional[List[str]] = None,
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
    page_size: Optional[int] = None,
    after_cursor: Optional[str] = None,
    before_cursor: Optional[str] = None,
    text: Optional[str] = None,
    sort_by: Optional[List[str]] = None,
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
    page_size: Optional[int] = None,
    after_cursor: Optional[str] = None,
    before_cursor: Optional[str] = None,
    text: Optional[str] = None,
    sort_by: Optional[List[str]] = None,
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
    page_size: Optional[int] = None,
    after_cursor: Optional[str] = None,
    before_cursor: Optional[str] = None,
    text: Optional[str] = None,
    sort_by: Optional[List[str]] = None,
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
    laboratory_all: List[LaboratoryType] = strawberry.field(
        resolver=get_all_laboratories
    )

    @strawberry.field
    async def laboratory_by_uid(self, info, uid: int) -> Optional[LaboratoryType]:
        query = await models.Laboratory.get(uid=uid)
        return query

    supplier_all: List[SupplierType] = strawberry.field(resolver=get_all_suppliers)

    @strawberry.field
    async def supplier_by_uid(self, info, uid: int) -> SupplierType:
        query = await models.Supplier.get(uid=uid)
        return query

    department_all: List[DepartmentType] = strawberry.field(
        resolver=get_all_departments
    )

    @strawberry.field
    async def department_by_uid(self, info, uid: int) -> DepartmentType:
        query = await models.Department.get(uid=uid)
        return query

    instrument_all: InstrumentCursorPage = strawberry.field(
        resolver=get_all_instruments
    )

    @strawberry.field
    async def instrument_by_uid(self, info, uid: int) -> InstrumentType:
        query = await models.Instrument.get(uid=uid)
        return query

    method_all: MethodCursorPage = strawberry.field(resolver=get_all_methods)

    @strawberry.field
    async def method_by_uid(self, info, uid: int) -> MethodType:
        query = await models.Method.get(uid=uid)
        return query

    district_all: DistrictCursorPage = strawberry.field(resolver=get_all_districts)

    @strawberry.field
    async def district_by_uid(self, info, uid: int) -> DistrictType:
        district = await models.District.get(uid=uid)
        return district

    @strawberry.field
    async def districts_by_province_uid(self, info, uid: int) -> List[DistrictType]:
        districts = await models.District.get_all(province_uid__exact=uid)
        return districts

    province_all: ProvinceCursorPage = strawberry.field(resolver=get_all_provinces)

    @strawberry.field
    async def province_by_uid(self, info, uid: int) -> ProvinceType:
        province = await models.Province.get(uid=uid)
        return province

    @strawberry.field
    async def provinces_by_country_uid(self, info, uid: int) -> List[ProvinceType]:
        provinces = await models.Province.get_all(country_uid__exact=uid)
        return provinces

    country_all: List[CountryType] = strawberry.field(resolver=get_all_countries)

    @strawberry.field
    async def country_by_uid(self, info, uid: int) -> CountryType:
        country = await models.Country.find(uid)
        return country
