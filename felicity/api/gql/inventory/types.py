from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from api.gql.setup.types import SupplierType
from api.gql.setup.types.department import DepartmentType
from api.gql.storage.types import StoreRoomType
from api.gql.types import PageInfo
from api.gql.user.types import UserType


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
