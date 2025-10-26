from typing import List

import sqlalchemy as sa
import strawberry  # noqa

from felicity.api.gql.instrument.types import (
    InstrumentCursorPage,
    InstrumentEdge,
    InstrumentType,
    InstrumentTypeCursorPage,
    InstrumentTypeEdge,
    InstrumentTypeType,
    LaboratoryInstrumentCursorPage,
    LaboratoryInstrumentEdge,
    LaboratoryInstrumentType,
    MethodCursorPage,
    MethodEdge,
    MethodType, InstrumentResultExclusionsType, InstrumentResultTranslationType,
)
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import PageInfo
from felicity.apps.instrument.services import (
    InstrumentService,
    InstrumentTypeService,
    LaboratoryInstrumentService,
    MethodService, InstrumentResultExclusionsService, InstrumentResultTranslationService,
)
from felicity.utils import has_value_or_is_truthy


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

    page = await InstrumentTypeService().paging_filter(
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

    page = await InstrumentService().paging_filter(
        page_size=page_size,
        after_cursor=after_cursor,
        before_cursor=before_cursor,
        filters=filters,
        sort_by=sort_by,
        get_related=["methods"],
    )

    total_count: int = page.total_count
    edges: List[InstrumentEdge[InstrumentType]] = page.edges
    items: List[InstrumentType] = page.items
    page_info: PageInfo = page.page_info

    return InstrumentCursorPage(
        total_count=total_count, edges=edges, items=items, page_info=page_info
    )


async def get_all_laboratory_instruments(
        self,
        info,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        sort_by: list[str] | None = None,
) -> LaboratoryInstrumentCursorPage:
    filters = {}

    _or_ = dict()
    if has_value_or_is_truthy(text):
        arg_list = [
            "lab_name__ilike",
            "serial_number__ilike",
            "instrument___name__ilike",
        ]
        for _arg in arg_list:
            _or_[_arg] = f"%{text}%"

        filters = {sa.or_: _or_}

    page = await LaboratoryInstrumentService().paging_filter(
        page_size=page_size,
        after_cursor=after_cursor,
        before_cursor=before_cursor,
        filters=filters,
        sort_by=sort_by,
        get_related=["instrument.methods"],
    )

    total_count: int = page.total_count
    edges: List[LaboratoryInstrumentEdge[LaboratoryInstrumentType]] = page.edges
    items: List[LaboratoryInstrumentType] = page.items
    page_info: PageInfo = page.page_info

    return LaboratoryInstrumentCursorPage(
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

    page = await MethodService().paging_filter(
        page_size=page_size,
        after_cursor=after_cursor,
        before_cursor=before_cursor,
        filters=filters,
        sort_by=sort_by,
        get_related=["instruments"],
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
        resolver=get_all_instrument_types, permission_classes=[IsAuthenticated]
    )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def instrument_type_by_uid(self, info, uid: str) -> InstrumentTypeType:
        query = await InstrumentTypeService().get(uid=uid)
        return query

    instrument_all: InstrumentCursorPage = strawberry.field(
        resolver=get_all_instruments, permission_classes=[IsAuthenticated]
    )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def instrument_by_uid(self, info, uid: str) -> InstrumentType:
        return await InstrumentService().get(uid=uid)

    laboratory_instrument_all: LaboratoryInstrumentCursorPage = strawberry.field(
        resolver=get_all_laboratory_instruments, permission_classes=[IsAuthenticated]
    )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def laboratory_instrument_by_uid(
            self, info, uid: str
    ) -> LaboratoryInstrumentType:
        return await LaboratoryInstrumentService().get(uid=uid)

    method_all: MethodCursorPage = strawberry.field(
        resolver=get_all_methods, permission_classes=[IsAuthenticated]
    )

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def method_by_uid(self, info, uid: str) -> MethodType:
        return await MethodService().get(uid=uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def instrument_result_exclusions(self, info, instrument_uid: str) -> list[InstrumentResultExclusionsType]:
        return await InstrumentResultExclusionsService().get_all(instrument_uid=instrument_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def instrument_result_translations(self, info, instrument_uid: str) -> list[InstrumentResultTranslationType]:
        return await InstrumentResultTranslationService().get_all(instrument_uid=instrument_uid)
