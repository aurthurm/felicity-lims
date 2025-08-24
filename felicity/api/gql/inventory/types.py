from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.setup.types import SupplierType, LaboratoryType
from felicity.api.gql.setup.types.department import DepartmentType
from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import UserType
from felicity.apps.inventory.services import (
    StockItemVariantService,
    StockProductInventoryService,
)


@strawberry.type
class StockItemType:
    uid: str
    name: str
    category_uid: str | None = None
    category: Optional["StockCategoryType"] = None
    hazard_uid: str | None = None
    hazard: Optional["HazardType"] = None
    minimum_level: int | None = None
    maximum_level: int | None = None
    description: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None

    @strawberry.field
    async def variants(self, info) -> Optional[List["StockItemVariantType"]]:
        stock_item_variants = await StockItemVariantService().get_all(
            stock_item_uid=self.uid
        )
        return [
            StockItemVariantType(**siv.marshal_simple()) for siv in stock_item_variants
        ]


@strawberry.type
class StockItemEdge:
    cursor: str
    node: StockItemType


@strawberry.type
class StockItemCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockItemEdge]] = None
    items: Optional[List[StockItemType]] = None
    total_count: int


@strawberry.type
class StockItemVariantType:
    uid: str
    name: str
    stock_item_uid: str | None = None
    stock_item: Optional[StockItemType] = None
    minimum_level: int | None = None
    maximum_level: int | None = None
    description: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    quantity: int

    @strawberry.field
    async def quantity(self, info) -> int:
        total = 0
        inventories = await StockProductInventoryService().get_all(product_uid=self.uid)
        for inv in inventories:
            total += inv.quantity
        return total


@strawberry.type
class StockItemVariantEdge:
    cursor: str
    node: StockItemVariantType


@strawberry.type
class StockItemVariantCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockItemVariantType]] = None
    items: Optional[List[StockItemVariantType]] = None
    total_count: int


@strawberry.type
class StockCategoryType:
    uid: str
    name: str
    description: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class HazardType:
    uid: str
    name: str
    description: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class StockUnitType:
    uid: str
    name: str
    description: str
    synonyms: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class StockPackagingType:
    uid: str
    name: str
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class StockLotType:
    uid: str
    product_uid: str
    product: Optional[StockItemVariantType] = None
    lot_number: str
    expiry_date: datetime
    remarks: str | None = None
    quantity: int
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None

    @strawberry.field
    async def quantity(self, info) -> int:
        total = 0
        inventories = await StockProductInventoryService().get_all(
            product_uid=self.product_uid, stock_lot_uid=self.uid
        )
        for inv in inventories:
            total += inv.quantity
        return total


@strawberry.type
class StockLotEdge:
    cursor: str
    node: StockLotType


@strawberry.type
class StockLotCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockLotEdge]] = None
    items: Optional[List[StockLotType]] = None
    total_count: int


@strawberry.type
class StockProductInventoryType:
    uid: str
    product_uid: str
    product: Optional[StockItemVariantType] = None
    stock_lot_uid: str
    stock_lot: Optional[StockLotType] = None
    quantity: int
    remarks: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None


@strawberry.type
class StockProductInventoryEdge:
    cursor: str
    node: StockProductInventoryType


@strawberry.type
class StockProductInventoryCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockProductInventoryEdge]] = None
    items: Optional[List[StockProductInventoryType]] = None
    total_count: int


@strawberry.type
class StockOrderType:
    uid: str
    fulfilled_by_uid: str | None = None
    fulfilled_by: UserType | None = None
    order_by_uid: str | None = None
    order_by: UserType | None = None
    department_uid: str | None = None
    department: Optional[DepartmentType] = None
    status: str | None = None
    remarks: str | None = None
    order_number: str | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class StockOrderEdge:
    cursor: str
    node: StockOrderType


@strawberry.type
class StockOrderCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockOrderEdge]] = None
    items: Optional[List[StockOrderType]] = None
    total_count: int


@strawberry.type
class StockOrderProductType:
    uid: str
    product_uid: str | None = None
    product: Optional[StockItemVariantType] = None
    stock_lot_uid: str
    stock_lot: Optional[StockLotType] = None
    order_uid: str | None = None
    order: Optional[StockOrderType] = None
    quantity: int | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class StockReceiptType:
    uid: str
    product_uid: str | None = None
    product: Optional[StockItemVariantType] = None
    stock_lot_uid: str | None = None
    stock_lot: Optional[StockLotType] = None
    unit_price: float
    total_price: float
    supplier_uid: str | None = None
    supplier: Optional[SupplierType] = None
    unit_uid: str
    unit: Optional[StockUnitType] = None
    # number of non packages received
    singles_received: int | None = None
    # number of packages received
    packages_received: int | None = None
    # number of units in the package
    package_factor: int | None = None
    # total quantity received
    quantity_received: int | None = None
    # receipt_type can be a purchase, transfer, return
    receipt_type: str
    receipt_by_uid: str
    receipt_by: Optional[UserType] = None
    receipt_date: datetime
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None


@strawberry.type
class StockReceiptEdge:
    cursor: str
    node: StockReceiptType


@strawberry.type
class StockReceiptCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockReceiptEdge]] = None
    items: Optional[List[StockReceiptType]] = None
    total_count: int


@strawberry.type
class StockIssueType:
    uid: str
    product_uid: str | None = None
    product: Optional[StockItemVariantType] = None
    stock_lot_uid: str | None = None
    stock_lot: Optional[StockLotType] = None
    issued: int
    issued_to_uid: str
    issued_to: Optional[UserType] = None
    department_uid: str
    department: Optional[DepartmentType] = None
    date_issued: datetime
    issue_by_uid: str
    issue_by: Optional[UserType] = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None


@strawberry.type
class StockIssueEdge:
    cursor: str
    node: StockIssueType


@strawberry.type
class StockIssueCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockIssueEdge]] = None
    items: Optional[List[StockIssueType]] = None
    total_count: int


@strawberry.type
class StockTransactionType:
    uid: str
    product_uid: str | None = None
    product: Optional[StockItemVariantType] = None
    issued: int | None = None
    issued_to_uid: str | None = None
    issued_to: UserType | None = None
    department_uid: str | None = None
    department: Optional[DepartmentType] = None
    date_issued: datetime | None = None
    transaction_by_uid: str | None = None
    transaction_by: UserType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None


@strawberry.type
class StockTransactionEdge:
    cursor: str
    node: StockTransactionType


@strawberry.type
class StockTransactionCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockTransactionEdge]] = None
    items: Optional[List[StockTransactionType]] = None
    total_count: int


@strawberry.type
class StockAdjustmentType:
    uid: str
    product_uid: str | None = None
    product: Optional[StockItemVariantType] = None
    stock_lot_uid: str | None = None
    stock_lot: Optional[StockLotType] = None
    adjustment_type: str | None = None
    adjust: int | None = None
    adjustment_date: str | None = None
    remarks: str | None = None
    adjustment_by_uid: str | None = None
    adjustment_by: UserType | None = None
    adjustment_for_uid: str | None = None
    adjustment_for: UserType | None = None
    laboratory_uid: str | None = None
    laboratory: LaboratoryType | None = None
    created_at: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    updated_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None


@strawberry.type
class StockAdjustmentEdge:
    cursor: str
    node: StockAdjustmentType


@strawberry.type
class StockAdjustmentCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockAdjustmentEdge]] = None
    items: Optional[List[StockAdjustmentType]] = None
    total_count: int
