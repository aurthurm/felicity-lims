import sqlalchemy as sa

from felicity.apps.abstract.service import BaseService
from felicity.apps.inventory.entities import Hazard, StockAdjustment, StockCategory, StockItem, StockOrder, StockOrderProduct, StockUnit
from felicity.apps.inventory.repository import HazardRepository, StockAdjustmentRepository, StockCategoryRepository, StockItemRepository, StockOrderProductRepository, StockOrderRepository, StockUnitRepository
from felicity.apps.inventory.schemas import HazardCreate, HazardUpdate, StockAdjustmentCreate, StockAdjustmentUpdate, StockCategoryCreate, StockCategoryUpdate, StockItemCreate, StockItemUpdate, StockOrderCreate, StockOrderProductCreate, StockOrderProductUpdate, StockOrderUpdate, StockUnitCreate, StockUnitUpdate
from felicity.database.paging import PageCursor



class StockItemService(BaseService[StockItem, StockItemCreate, StockItemUpdate]):
    def __init__(self) -> None:
        super().__init__(StockItemRepository)

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


class StockCategoryService(BaseService[StockCategory, StockCategoryCreate, StockCategoryUpdate]):
    def __init__(self) -> None:
        super().__init__(StockCategoryRepository)


class HazardService(BaseService[Hazard, HazardCreate, HazardUpdate]):
    def __init__(self) -> None:
        super().__init__(HazardRepository)


class StockUnitService(BaseService[StockUnit, StockUnitCreate, StockUnitUpdate]):
    def __init__(self) -> None:
        super().__init__(StockUnitRepository)


class StockOrderService(BaseService[StockOrder, StockOrderCreate, StockOrderUpdate]):
    def __init__(self) -> None:
        super().__init__(StockOrderRepository)

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


class StockOrderProductService(
    BaseService[StockOrderProduct, StockOrderProductCreate, StockOrderProductUpdate]
):
    def __init__(self) -> None:
        super().__init__(StockOrderProductRepository)



class StockAdjustmentService(
    BaseService[StockAdjustment, StockAdjustmentCreate, StockAdjustmentUpdate]
):
    def __init__(self) -> None:
        super().__init__(StockAdjustmentRepository)

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
