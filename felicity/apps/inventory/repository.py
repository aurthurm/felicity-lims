import sqlalchemy as sa

from domain.inventory.ports.repository import (
    IStockCategoryRepository,
    IHazardRepository,
    IStockUnitRepository,
    IStockPackagingRepository,
    IStockProductRepository,
    IStockOrderRepository,
    IStockOrderProductRepository,
    IStockTransactionRepository,
    IStockAdjustmentRepository,
    IStockItemRepository,
)
from domain.shared.ports.paginator.cursor import PageCursor
from infrastructure.database.inventory.entities import (
    StockItem,
    StockCategory,
    Hazard,
    StockUnit,
    StockPackaging,
    StockProduct,
    StockOrder,
    StockOrderProduct,
    StockTransaction,
    StockAdjustment,
)
from infrastructure.database.repository.base import BaseRepository


class StockItemRepository(BaseRepository[StockItem], IStockItemRepository):
    def __init__(self) -> None:
        self.model = StockItem
        super().__init__()

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

        return super().paginate(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class StockCategoryRepository(BaseRepository[StockCategory], IStockCategoryRepository):
    def __init__(self) -> None:
        self.model = StockCategory
        super().__init__()


class HazardRepository(BaseRepository[Hazard], IHazardRepository):
    def __init__(self) -> None:
        self.model = Hazard
        super().__init__()


class StockUnitRepository(BaseRepository[StockUnit], IStockUnitRepository):
    def __init__(self) -> None:
        self.model = StockUnit
        super().__init__()


class StockPackagingRepository(
    BaseRepository[StockPackaging], IStockPackagingRepository
):
    def __init__(self) -> None:
        self.model = StockPackaging
        super().__init__()


class StockProductRepository(BaseRepository[StockProduct], IStockProductRepository):
    def __init__(self) -> None:
        self.model = StockProduct
        super().__init__()

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

        return super().paginate(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class StockOrderRepository(BaseRepository[StockOrder], IStockOrderRepository):
    def __init__(self) -> None:
        self.model = StockOrder
        super().__init__()

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

        return super().paginate(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class StockOrderProductRepository(
    BaseRepository[StockOrderProduct], IStockOrderProductRepository
):
    def __init__(self) -> None:
        self.model = StockOrderProduct
        super().__init__()


class StockTransactionRepository(
    BaseRepository[StockTransaction], IStockTransactionRepository
):
    def __init__(self) -> None:
        self.model = StockTransaction
        super().__init__()

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
            arg_list = ["name__ilike", "product___name__ilike"]
            for _arg in arg_list:
                _or_[_arg] = f"%{text}%"

        filters = {sa.or_: _or_}

        return super().paginate(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class StockAdjustmentRepository(
    BaseRepository[StockAdjustment], IStockAdjustmentRepository
):
    def __init__(self) -> None:
        self.model = StockAdjustment
        super().__init__()

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

        return super().paginate(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )
