from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from api.gql import PageInfo
from api.gql.setup.types import DepartmentType, SupplierType
from api.gql.storage.types import StoreRoomType
from api.gql.user.types import UserType
from core.uid_gen import FelicityID


@strawberry.type
class StockItemType:
    uid: FelicityID
    name: str
    department_uid: Optional[FelicityID]
    department: Optional[DepartmentType]
    minimum_level: Optional[int]
    description: Optional[str]
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
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
    uid: FelicityID
    name: str
    description: Optional[str]
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]


@strawberry.type
class HazardType:
    uid: FelicityID
    name: str
    description: Optional[str]
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]


@strawberry.type
class StockUnitType:
    uid: FelicityID
    name: str
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]


@strawberry.type
class StockPackagingType:
    uid: FelicityID
    name: str
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]


@strawberry.type
class StockProductType:
    uid: FelicityID
    name: str
    stock_item_uid: Optional[FelicityID]
    stock_item: Optional[StockItemType]
    department_uid: Optional[FelicityID]
    department: Optional[DepartmentType]
    supplier_uid: Optional[FelicityID]
    supplier: Optional[SupplierType]
    category_uid: Optional[FelicityID]
    category: Optional[StockCategoryType]
    hazard_uid: Optional[FelicityID]
    hazard: Optional[HazardType]
    store_room_uid: Optional[FelicityID]
    store_room: Optional[StoreRoomType]
    lot_number: Optional[str]
    batch: Optional[str]
    size: Optional[int]
    unit_uid: Optional[FelicityID]
    unit: Optional[StockUnitType]
    packaging_uid: Optional[FelicityID]
    packaging: Optional[StockPackagingType]
    price: Optional[int]
    quantity_received: Optional[int]
    remaining: Optional[int]
    date_received: Optional[datetime]
    expiry_date: Optional[datetime]
    received_by_uid: Optional[FelicityID]
    received_by: Optional[UserType]
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
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
    uid: FelicityID
    order_by_uid: Optional[FelicityID]
    order_by: Optional[UserType]
    department_uid: Optional[FelicityID]
    department: Optional[DepartmentType]
    status: Optional[str]
    remarks: Optional[str]
    order_number: Optional[str]
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
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
    uid: FelicityID
    product_uid: Optional[FelicityID]
    product: Optional[StockProductType]
    order_uid: Optional[FelicityID]
    order: Optional[StockOrderType]
    price: Optional[int]
    quantity: Optional[int]
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
    updated_by: Optional[UserType]


@strawberry.type
class StockTransactionType:
    uid: FelicityID
    product_uid: Optional[FelicityID]
    product: Optional[StockProductType]
    issued: Optional[int]
    department_uid: Optional[FelicityID]
    department: Optional[DepartmentType]
    date_issued: Optional[datetime]
    transaction_by_uid: Optional[FelicityID]
    transaction_by: Optional[UserType]
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
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
    uid: FelicityID
    product_uid: Optional[FelicityID]
    product: Optional[StockProductType]
    adjustment_type: Optional[str]
    adjust: Optional[int]
    adjustment_date: Optional[datetime]
    remarks: Optional[str]
    adjustment_by_uid: Optional[FelicityID]
    adjustment_by: Optional[UserType]
    created_at: Optional[datetime]
    created_by_uid: Optional[FelicityID]
    created_by: Optional[UserType]
    updated_at: Optional[datetime]
    updated_by_uid: Optional[FelicityID]
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
