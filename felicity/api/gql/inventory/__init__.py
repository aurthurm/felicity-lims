from .types import (
    HazardType,
    StockAdjustmentCursorPage,
    StockAdjustmentEdge,
    StockAdjustmentType,
    StockCategoryType,
    StockItemCursorPage,
    StockItemEdge,
    StockItemType,
    StockItemVariantCursorPage,
    StockItemVariantEdge,
    StockItemVariantType,
    StockOrderCursorPage,
    StockOrderEdge,
    StockOrderProductType,
    StockOrderType,
    StockPackagingType,
    StockTransactionCursorPage,
    StockTransactionEdge,
    StockTransactionType,
    StockUnitType,
)

inventory_types = [
    StockItemType,
    StockItemEdge,
    StockItemCursorPage,
    StockCategoryType,
    HazardType,
    StockUnitType,
    StockPackagingType,
    StockItemVariantType,
    StockItemVariantEdge,
    StockItemVariantCursorPage,
    StockOrderType,
    StockOrderEdge,
    StockOrderCursorPage,
    StockOrderProductType,
    StockTransactionType,
    StockTransactionEdge,
    StockTransactionCursorPage,
    StockAdjustmentType,
    StockAdjustmentEdge,
    StockAdjustmentCursorPage,
]
