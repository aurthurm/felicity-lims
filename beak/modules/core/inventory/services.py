import sqlalchemy as sa

from beak.modules.core.abstract.service import BaseService
from beak.modules.core.inventory.entities import (
    Hazard,
    StockAdjustment,
    StockCategory,
    StockItem,
    StockItemVariant,
    StockLot,
    StockOrder,
    StockOrderProduct,
    StockProductInventory,
    StockReceipt,
    StockUnit,
)
from beak.modules.core.inventory.repository import (
    HazardRepository,
    StockAdjustmentRepository,
    StockCategoryRepository,
    StockItemRepository,
    StockItemVariantRepository,
    StockLotRepository,
    StockOrderProductRepository,
    StockOrderRepository,
    StockProductInventoryRepository,
    StockReceiptRepository,
    StockUnitRepository,
)
from beak.modules.core.inventory.schemas import (
    HazardCreate,
    HazardUpdate,
    StockAdjustmentCreate,
    StockAdjustmentUpdate,
    StockCategoryCreate,
    StockCategoryUpdate,
    StockItemCreate,
    StockItemUpdate,
    StockItemVariantCreate,
    StockItemVariantUpdate,
    StockLotCreate,
    StockLotUpdate,
    StockOrderCreate,
    StockOrderProductCreate,
    StockOrderProductUpdate,
    StockOrderUpdate,
    StockProductInventoryCreate,
    StockProductInventoryUpdate,
    StockReceiptCreate,
    StockReceiptUpdate,
    StockUnitCreate,
    StockUnitUpdate,
)
from beak.core.tenant_context import get_current_lab_uid
from beak.database.session import async_session
from beak.database.paging import PageCursor


class StockItemService(BaseService[StockItem, StockItemCreate, StockItemUpdate]):
    def __init__(self) -> None:
        super().__init__(StockItemRepository())

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

        return await super().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class StockItemVariantService(
    BaseService[StockItemVariant, StockItemVariantCreate, StockItemVariantUpdate]
):
    def __init__(self) -> None:
        super().__init__(StockItemVariantRepository())


class StockCategoryService(
    BaseService[StockCategory, StockCategoryCreate, StockCategoryUpdate]
):
    def __init__(self) -> None:
        super().__init__(StockCategoryRepository())


class HazardService(BaseService[Hazard, HazardCreate, HazardUpdate]):
    def __init__(self) -> None:
        super().__init__(HazardRepository())


class StockUnitService(BaseService[StockUnit, StockUnitCreate, StockUnitUpdate]):
    def __init__(self) -> None:
        super().__init__(StockUnitRepository())


class StockLotService(BaseService[StockLot, StockLotCreate, StockLotUpdate]):
    def __init__(self) -> None:
        super().__init__(StockLotRepository())


class StockProductInventoryService(
    BaseService[
        StockProductInventory, StockProductInventoryCreate, StockProductInventoryUpdate
    ]
):
    def __init__(self) -> None:
        super().__init__(StockProductInventoryRepository())


class StockOrderService(BaseService[StockOrder, StockOrderCreate, StockOrderUpdate]):
    def __init__(self) -> None:
        super().__init__(StockOrderRepository())

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

        return await super().paging_filter(
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
        super().__init__(StockOrderProductRepository())


class StockReceiptService(
    BaseService[StockReceipt, StockReceiptCreate, StockReceiptUpdate]
):
    def __init__(self) -> None:
        super().__init__(StockReceiptRepository())


class StockAdjustmentService(
    BaseService[StockAdjustment, StockAdjustmentCreate, StockAdjustmentUpdate]
):
    def __init__(self) -> None:
        super().__init__(StockAdjustmentRepository())

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

        return await super().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )


class InventoryKPIService:
    async def get_kpis(
        self, text: str | None = None, limit: int | None = None
    ) -> list[dict]:
        current_lab_uid = get_current_lab_uid()

        inv = StockProductInventory
        variant = StockItemVariant
        item = StockItem

        join_condition = inv.product_uid == variant.uid
        if current_lab_uid:
            join_condition = sa.and_(
                join_condition, inv.laboratory_uid == current_lab_uid
            )

        stmt = (
            sa.select(
                variant.uid.label("variant_uid"),
                variant.name.label("variant_name"),
                variant.minimum_level.label("variant_min"),
                variant.maximum_level.label("variant_max"),
                item.uid.label("item_uid"),
                item.minimum_level.label("item_min"),
                item.maximum_level.label("item_max"),
                sa.func.coalesce(sa.func.sum(inv.quantity), 0).label("current_stock"),
            )
            .select_from(variant)
            .join(item, variant.stock_item_uid == item.uid, isouter=True)
            .join(inv, join_condition, isouter=True)
            .group_by(
                variant.uid,
                variant.name,
                variant.minimum_level,
                variant.maximum_level,
                item.uid,
                item.minimum_level,
                item.maximum_level,
            )
        )

        if text:
            stmt = stmt.where(
                sa.or_(
                    variant.name.ilike(f"%{text}%"),
                    item.name.ilike(f"%{text}%"),
                )
            )

        if limit:
            stmt = stmt.limit(limit)

        async with async_session() as session:
            result = await session.execute(stmt)

        kpis = []
        for row in result.all():
            min_level = row.variant_min
            max_level = row.variant_max
            if min_level is None:
                min_level = row.item_min
            if max_level is None:
                max_level = row.item_max

            if min_level is None or max_level is None or max_level < min_level:
                continue

            current_stock = int(row.current_stock or 0)
            reorder_quantity = max(0, int(max_level) - current_stock)
            reorder_point = int(min_level)
            low_stock_threshold = int(min_level * 1.2)

            kpis.append(
                {
                    "product_uid": row.variant_uid,
                    "product_name": row.variant_name,
                    "stock_item_uid": row.item_uid,
                    "current_stock": current_stock,
                    "minimum_level": int(min_level),
                    "maximum_level": int(max_level),
                    "reorder_point": reorder_point,
                    "reorder_quantity": reorder_quantity,
                    "low_stock": current_stock <= low_stock_threshold
                    and current_stock > reorder_point,
                    "reorder_now": current_stock <= reorder_point,
                }
            )

        return kpis
