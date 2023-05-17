from typing import List

import sqlalchemy as sa
import strawberry  # noqa
from api.gql import PageInfo
from api.gql.instrument.types import (
    InstrumentCursorPage,
    InstrumentEdge,
    InstrumentType,
    InstrumentTypeCursorPage,
    InstrumentTypeEdge,
    InstrumentTypeType,
    MethodCursorPage,
    MethodEdge,
    MethodType
)
from apps.setup import models

from utils import has_value_or_is_truthy


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



@strawberry.type
class InstrumentQuery:
   
    instrument_type_all: InstrumentTypeCursorPage = strawberry.field(
        resolver=get_all_instrument_types
    )

    @strawberry.field
    async def instrument_type_by_uid(self, info, uid: str) -> InstrumentTypeType:
        query = await models.InstrumentType.get(uid=uid)
        return query

    instrument_all: InstrumentCursorPage = strawberry.field(
        resolver=get_all_instruments
    )

    @strawberry.field
    async def instrument_by_uid(self, info, uid: str) -> InstrumentType:
        query = await models.Instrument.get(uid=uid)
        return query

    method_all: MethodCursorPage = strawberry.field(resolver=get_all_methods)

    @strawberry.field
    async def method_by_uid(self, info, uid: str) -> MethodType:
        query = await models.Method.get(uid=uid)
        return query
