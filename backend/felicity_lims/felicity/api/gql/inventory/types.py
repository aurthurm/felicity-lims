from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql import PageInfo
from felicity.api.gql.setup.types import DepartmentType, SupplierType
from felicity.api.gql.storage.types import StoreRoomType
from felicity.api.gql.user.types import UserType


@strawberry.type
class StockItemType:
    uid: int
    name: str
    department_uid: Optional[int]
    department: Optional[DepartmentType]
    description: Optional[str]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]


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
    uid: int
    name: str
    description: Optional[str]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]


@strawberry.type
class HazardType:
    uid: int
    name: str
    description: Optional[str]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]


@strawberry.type
class StockUnitType:
    uid: int
    name: str
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]


@strawberry.type
class StockPackagingType:
    uid: int
    name: str
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]


@strawberry.type
class StockProductType:
    uid: int
    name: str
    department_uid: Optional[int]
    department: Optional[DepartmentType]
    supplier_uid: Optional[int]
    supplier: Optional[SupplierType]
    category_uid: Optional[int]
    category: Optional[StockCategoryType]
    hazard_uid: Optional[int]
    hazard: Optional[HazardType]
    store_room_uid: Optional[int]
    store_room: Optional[StoreRoomType]
    lot_number: Optional[str]
    batch: Optional[str]
    size: Optional[int]
    unit_uid: Optional[int]
    unit: Optional[StockUnitType]
    packaging_uid: Optional[int]
    packaging: Optional[StockPackagingType]
    price: Optional[int]
    quantity_received: Optional[int]
    minimum_level: Optional[int]
    remaining: Optional[int]
    date_received: Optional[datetime]
    expiry_date: Optional[datetime]
    received_by_uid: Optional[int]
    received_by: Optional[UserType]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]


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
    uid: int
    order_by_uid: Optional[int]
    order_by: Optional[UserType]
    department_uid: Optional[int]
    department: Optional[DepartmentType]
    status: Optional[str]
    order_number: Optional[str]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]


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
    uid: int
    product_uid: Optional[int]
    product: Optional[StockProductType]
    order_uid: Optional[int]
    order: Optional[StockOrderType]
    price: Optional[int]
    quantity: Optional[int]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]


@strawberry.type
class StockTransactionType:
    uid: int
    product_uid: Optional[int]
    product: Optional[StockProductType]
    issued: Optional[int]
    department_uid: Optional[int]
    department: Optional[DepartmentType]
    date_issued: Optional[datetime]
    transaction_by_uid: Optional[int]
    transaction_by: Optional[UserType]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]


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
    uid: int
    product_uid: Optional[int]
    product: Optional[StockProductType]
    adjustment_type: Optional[str]
    adjust: Optional[int]
    adjustment_date: Optional[datetime]
    remarks: Optional[str]
    adjustment_by_uid: Optional[int]
    adjustment_by: Optional[UserType]
    created_at: Optional[datetime]
    created_by_uid: Optional[int]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[int]
    updated_by: Optional[UserType]


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
