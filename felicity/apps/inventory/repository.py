import sqlalchemy as sa

from felicity.apps.inventory.entities import Hazard, StockAdjustment, StockCategory, StockItem, StockOrder, StockOrderProduct, StockUnit
from felicity.database.paging import PageCursor
from felicity.database.repository import BaseRepository



class StockItemRepository(BaseRepository[StockItem]):
    def __init__(self) -> None:
        super().__init__(StockItem)

    async def paginate_with_cursors(
        self,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        sort_by: list[str] | None = None,
    ) -> PageCursor:

        _or_ = dict()

        if text:
            arg_list = ["name__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

        filters = {sa.or_: _or_}

        return super().paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class StockCategoryRepository(BaseRepository[StockCategory]):
    def __init__(self) -> None:
        super().__init__(StockCategory)


class HazardRepository(BaseRepository[Hazard]):
    def __init__(self) -> None:
        super().__init__(Hazard)


class StockUnitRepository(BaseRepository[StockUnit]):
    def __init__(self) -> None:
        super().__init__(StockUnit)


class StockOrderRepository(BaseRepository[StockOrder]):
    def __init__(self) -> None:
        super().__init__(StockOrder)

    async def paginate_with_cursors(
        self,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        status: None = None,
        sort_by: list[str] | None = None,
    ) -> PageCursor:

        filters = []

        _or_ = dict()
        if text:
            arg_list = ["order_number__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

            filters.append({sa.or_: _or_})

        if status:
            filters.append({"status__exact": status})

        return super().paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class StockOrderProductRepository(
    BaseRepository[StockOrderProduct]
):
    def __init__(self) -> None:
        super().__init__(StockOrderProduct)



class StockAdjustmentRepository(
    BaseRepository[StockAdjustment]
):
    def __init__(self) -> None:
        super().__init__(StockAdjustment)

    async def paginate_with_cursors(
        self,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        sort_by: list[str] | None = None,
    ) -> PageCursor:

        _or_ = dict()

        if text:
            arg_list = [
                "name__ilike",
                "adjustment_type__ilike",
                "remarks__ilike",
                "product___name__ilike",
            ]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

        filters = {sa.or_: _or_}

        return super().paginate_with_cursors(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )
