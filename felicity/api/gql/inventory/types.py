from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.setup.types import SupplierType
from felicity.api.gql.setup.types.department import DepartmentType
from felicity.api.gql.storage.types import StoreRoomType
from felicity.api.gql.types import PageInfo
from felicity.api.gql.user.types import UserType
from felicity.apps.inventory import models


@strawberry.type
class StockItemType:
    uid: str
    name: str
    department_uid: str | None
    department: Optional[DepartmentType]
    minimum_level: int | None
    maximum_level: int | None
    description: str | None
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None

    @strawberry.field
    async def variants(self, info) -> List[Optional["StockItemVariantType"]]:
        stock_item_variants = await models.StockItemVariant.get_all(stock_item_uid=self.uid)
        return [StockItemVariantType(**siv.marshal_simple()) for siv in stock_item_variants]

@strawberry.type
class StockItemEdge:
    cursor: str
    node: StockItemType


@strawberry.type
class StockItemCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockItemEdge]]
    items: Optional[List[StockItemType]]
    total_count: int


@strawberry.type
class StockItemVariantType:
    uid: str
    name: str
    stock_item_uid: str | None
    stock_item: Optional[StockItemType]
    minimum_level: int | None
    maximum_level: int | None
    description: str | None
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class StockCategoryType:
    uid: str
    name: str
    description: str | None
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class HazardType:
    uid: str
    name: str
    description: str | None
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class StockUnitType:
    uid: str
    name: str
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class StockPackagingType:
    uid: str
    name: str
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class StockProductType:
    uid: str
    name: str
    stock_item_uid: str | None
    stock_item: Optional[StockItemType]
    stock_item_variant_uid: str | None
    stock_item_variant: Optional[StockItemVariantType]
    department_uid: str | None
    department: Optional[DepartmentType]
    supplier_uid: str | None
    supplier: Optional[SupplierType]
    category_uid: str | None
    category: Optional[StockCategoryType]
    hazard_uid: str | None
    hazard: Optional[HazardType]
    store_room_uid: str | None
    store_room: Optional[StoreRoomType]
    lot_number: str | None
    batch: str | None
    size: int | None
    unit_uid: str | None
    unit: Optional[StockUnitType]
    packaging_uid: str | None
    packaging: Optional[StockPackagingType]
    conversion_factor: int | None
    price: int | None
    quantity_received: int | None
    remaining: int | None
    date_received: datetime | None
    expiry_date: str | None
    received_by_uid: str | None
    received_by: UserType | None
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class StockProductEdge:
    cursor: str
    node: StockProductType


@strawberry.type
class StockProductCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockProductEdge]]
    items: Optional[List[StockProductType]]
    total_count: int


@strawberry.type
class StockLotType:
    uid: str
    product_uid: str
    product: Optional[StockProductType]
    lot_number: str
    expiry_date: datetime
    remarks: str | None


@strawberry.type
class StockLotEdge:
    cursor: str
    node: StockLotType


@strawberry.type
class StockLotCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockLotEdge]]
    items: Optional[List[StockLotType]]
    total_count: int


@strawberry.type
class StockProductInventoryType:
    uid: str
    product_uid: str
    product: Optional[StockProductType]
    stock_lot_uid: str
    stock_lot: Optional[StockLotType]
    quantity: int
    remarks: str | None


@strawberry.type
class StockProductInventoryEdge:
    cursor: str
    node: StockProductInventoryType


@strawberry.type
class StockProductInventoryCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockProductInventoryEdge]]
    items: Optional[List[StockProductInventoryType]]
    total_count: int


@strawberry.type
class StockOrderType:
    uid: str
    fulfilled_by_uid: str | None
    fulfilled_by: UserType | None
    order_by_uid: str | None
    order_by: UserType | None
    department_uid: str | None
    department: Optional[DepartmentType]
    status: str | None
    remarks: str | None
    order_number: str | None
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class StockOrderEdge:
    cursor: str
    node: StockOrderType


@strawberry.type
class StockOrderCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockOrderEdge]]
    items: Optional[List[StockOrderType]]
    total_count: int


@strawberry.type
class StockOrderProductType:
    uid: str
    product_uid: str | None
    product: Optional[StockProductType]
    order_uid: str | None
    order: Optional[StockOrderType]
    price: int | None
    quantity: int | None
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class StockReceiptType:
    uid: str
    product_uid: str | None
    product: Optional[StockProductType]
    stock_lot_uid: str | None
    stock_lot: Optional[StockLotType]
    unit_price: float
    total_price: float
    supplier_uid: str | None
    supplier: Optional[SupplierType]
    unit_uid: str
    unit: Optional[StockUnitType]
    # number of non packages received
    singles_received: int | None
    # number of packages received
    packages_received: int | None
    # number of units in the package
    package_factor: int | None
    # total quantity received 
    quantity_received: int | None
    # receipt_type can be a purchase, transfer, return
    receipt_type: str
    receipt_by_uid: str
    receipt_by: Optional[UserType]
    receipt_date: datetime


@strawberry.type
class StockReceiptEdge:
    cursor: str
    node: StockReceiptType


@strawberry.type
class StockReceiptCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockReceiptEdge]]
    items: Optional[List[StockReceiptType]]
    total_count: int


@strawberry.type
class StockIssueType:
    uid: str
    product_uid: str | None
    product: Optional[StockProductType]
    stock_lot_uid: str | None
    stock_lot: Optional[StockLotType]
    issued: int
    issued_to_uid: str
    issued_to: Optional[UserType]
    department_uid: str
    department: Optional[DepartmentType]
    date_issued: datetime
    issue_by_uid: str
    issue_by: Optional[UserType]


@strawberry.type
class StockIssueEdge:
    cursor: str
    node: StockIssueType


@strawberry.type
class StockIssueCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockIssueEdge]]
    items: Optional[List[StockIssueType]]
    total_count: int


@strawberry.type
class StockTransactionType:
    uid: str
    product_uid: str | None
    product: Optional[StockProductType]
    issued: int | None
    issued_to_uid: str | None
    issued_to: UserType | None
    department_uid: str | None
    department: Optional[DepartmentType]
    date_issued: datetime | None
    transaction_by_uid: str | None
    transaction_by: UserType | None
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class StockTransactionEdge:
    cursor: str
    node: StockTransactionType


@strawberry.type
class StockTransactionCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockTransactionEdge]]
    items: Optional[List[StockTransactionType]]
    total_count: int


@strawberry.type
class StockAdjustmentType:
    uid: str
    product_uid: str | None
    product: Optional[StockProductType]
    adjustment_type: str | None
    adjust: int | None
    adjustment_date: str | None
    remarks: str | None
    adjustment_by_uid: str | None
    adjustment_by: UserType | None
    created_at: str | None
    created_by_uid: str | None
    created_by: UserType | None
    updated_at: str | None
    updated_by_uid: str | None
    updated_by: UserType | None


@strawberry.type
class StockAdjustmentEdge:
    cursor: str
    node: StockAdjustmentType


@strawberry.type
class StockAdjustmentCursorPage:
    page_info: PageInfo
    edges: Optional[List[StockAdjustmentEdge]]
    items: Optional[List[StockAdjustmentType]]
    total_count: int
