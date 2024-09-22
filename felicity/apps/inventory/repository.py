from felicity.apps.abstract.repository import BaseRepository
from felicity.apps.inventory.entities import (
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


class StockItemRepository(BaseRepository[StockItem]):
    def __init__(self) -> None:
        super().__init__(StockItem)


class StockItemVariantRepository(BaseRepository[StockItemVariant]):
    def __init__(self) -> None:
        super().__init__(StockItemVariant)


class StockCategoryRepository(BaseRepository[StockCategory]):
    def __init__(self) -> None:
        super().__init__(StockCategory)


class HazardRepository(BaseRepository[Hazard]):
    def __init__(self) -> None:
        super().__init__(Hazard)


class StockUnitRepository(BaseRepository[StockUnit]):
    def __init__(self) -> None:
        super().__init__(StockUnit)


class StockLotRepository(BaseRepository[StockLot]):
    def __init__(self) -> None:
        super().__init__(StockLot)


class StockProductInventoryRepository(BaseRepository[StockProductInventory]):
    def __init__(self) -> None:
        super().__init__(StockProductInventory)


class StockOrderRepository(BaseRepository[StockOrder]):
    def __init__(self) -> None:
        super().__init__(StockOrder)


class StockOrderProductRepository(BaseRepository[StockOrderProduct]):
    def __init__(self) -> None:
        super().__init__(StockOrderProduct)


class StockReceiptRepository(BaseRepository[StockReceipt]):
    def __init__(self) -> None:
        super().__init__(StockReceipt)


class StockAdjustmentRepository(BaseRepository[StockAdjustment]):
    def __init__(self) -> None:
        super().__init__(StockAdjustment)
