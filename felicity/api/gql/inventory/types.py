from datetime import datetime
from typing import List, Optional

import strawberry  # noqa
from api.gql import PageInfo
from api.gql.setup.types import SupplierType
from api.gql.setup.types.department import DepartmentType
from api.gql.storage.types import StoreRoomType
from api.gql.user.types import UserType
from core.uid_gen import FelicityID


@strawberry.type
class StockItemType:
    uid: FelicityID
    name: str
    department_uid: FelicityID | None
    department: Optional[DepartmentType]
    minimum_level: int | None
    description: str | None
    created_at: datetime | None
    created_by_uid: FelicityID | None
    created_by: UserType | None
    updated_at: datetime | None
    updated_by_uid: FelicityID | None
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
    uid: FelicityID
    name: str
    description: str | None
    created_at: datetime | None
    created_by_uid: FelicityID | None
    created_by: UserType | None
    updated_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None


@strawberry.type
class HazardType:
    uid: FelicityID
    name: str
    description: str | None
    created_at: datetime | None
    created_by_uid: FelicityID | None
    created_by: UserType | None
    updated_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None


@strawberry.type
class StockUnitType:
    uid: FelicityID
    name: str
    created_at: datetime | None
    created_by_uid: FelicityID | None
    created_by: UserType | None
    updated_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None


@strawberry.type
class StockPackagingType:
    uid: FelicityID
    name: str
    created_at: datetime | None
    created_by_uid: FelicityID | None
    created_by: UserType | None
    updated_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None


@strawberry.type
class StockProductType:
    uid: FelicityID
    name: str
    stock_item_uid: FelicityID | None
    stock_item: Optional[StockItemType]
    department_uid: FelicityID | None
    department: Optional[DepartmentType]
    supplier_uid: FelicityID | None
    supplier: Optional[SupplierType]
    category_uid: FelicityID | None
    category: Optional[StockCategoryType]
    hazard_uid: FelicityID | None
    hazard: Optional[HazardType]
    store_room_uid: FelicityID | None
    store_room: Optional[StoreRoomType]
    lot_number: str | None
    batch: str | None
    size: int | None
    unit_uid: FelicityID | None
    unit: Optional[StockUnitType]
    packaging_uid: FelicityID | None
    packaging: Optional[StockPackagingType]
    price: int | None
    quantity_received: int | None
    remaining: int | None
    date_received: datetime | None
    expiry_date: datetime | None
    received_by_uid: FelicityID | None
    received_by: UserType | None
    created_at: datetime | None
    created_by_uid: FelicityID | None
    created_by: UserType | None
    updated_at: datetime | None
    updated_by_uid: FelicityID | None
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
    uid: FelicityID
    order_by_uid: FelicityID | None
    order_by: UserType | None
    department_uid: FelicityID | None
    department: Optional[DepartmentType]
    status: str | None
    remarks: str | None
    order_number: str | None
    created_at: datetime | None
    created_by_uid: FelicityID | None
    created_by: UserType | None
    updated_at: datetime | None
    updated_by_uid: FelicityID | None
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
    uid: FelicityID
    product_uid: FelicityID | None
    product: Optional[StockProductType]
    order_uid: FelicityID | None
    order: Optional[StockOrderType]
    price: int | None
    quantity: int | None
    created_at: datetime | None
    created_by_uid: FelicityID | None
    created_by: UserType | None
    updated_at: datetime | None
    updated_by_uid: FelicityID | None
    updated_by: UserType | None


@strawberry.type
class StockTransactionType:
    uid: FelicityID
    product_uid: FelicityID | None
    product: Optional[StockProductType]
    issued: int | None
    department_uid: FelicityID | None
    department: Optional[DepartmentType]
    date_issued: datetime | None
    transaction_by_uid: FelicityID | None
    transaction_by: UserType | None
    created_at: datetime | None
    created_by_uid: FelicityID | None
    created_by: UserType | None
    updated_at: datetime | None
    updated_by_uid: FelicityID | None
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
    uid: FelicityID
    product_uid: FelicityID | None
    product: Optional[StockProductType]
    adjustment_type: str | None
    adjust: int | None
    adjustment_date: datetime | None
    remarks: str | None
    adjustment_by_uid: FelicityID | None
    adjustment_by: UserType | None
    created_at: datetime | None
    created_by_uid: FelicityID | None
    created_by: UserType | None
    updated_at: datetime | None
    updated_by_uid: FelicityID | None
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
