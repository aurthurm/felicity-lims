from datetime import datetime
from typing import Optional

from apps.common.schemas import BaseAuditModel
from apps.setup.schemas import Department, Supplier
from apps.storage.schemas import StoreRoom
from apps.user.schemas import User
from core.uid_gen import FelicityIDType


#
# StockItem Schemas
#
class StockItemBase(BaseAuditModel):
    """StockItem Standardization"""

    name: str | None = None
    description: str | None = None
    department_uid: FelicityIDType| None = None
    department: Optional[Department] = None
    minimum_level: int | None = None
    maximum_level: int | None = None


class StockItem(StockItemBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


class StockItemCreate(StockItemBase):
    pass


class StockItemUpdate(StockItemBase):
    pass


#
# StockCategory Schemas
#
class StockCategoryBase(BaseAuditModel):
    """StockCategory
    Consumable, Reagents, Durables
    """

    name: str | None = None
    description: str | None = None


class StockCategory(StockCategoryBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


class StockCategoryCreate(StockCategoryBase):
    pass


class StockCategoryUpdate(StockCategoryBase):
    pass


#
# Hazard Schemas
#
class HazardBase(BaseAuditModel):
    """Hazard"""

    name: str | None = None
    description: str | None = None


class Hazard(HazardBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


class HazardCreate(HazardBase):
    pass


class HazardUpdate(HazardBase):
    pass


#
# StockUnit Schemas
#
class StockUnitBase(BaseAuditModel):
    name: str | None = None


class StockUnit(StockUnitBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


class StockUnitCreate(StockUnitBase):
    pass


class StockUnitUpdate(StockUnitBase):
    pass


#
# StockPackaging Schemas
#
class StockPackagingBase(BaseAuditModel):
    name: str | None = None


class StockPackaging(StockPackagingBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


class StockPackagingCreate(StockPackagingBase):
    pass


class StockPackagingUpdate(StockPackagingBase):
    pass


#
# StockProduct Schemas
#
class StockProductBase(BaseAuditModel):
    name: str | None = None
    stock_item_uid: FelicityIDType| None = None
    department_uid: FelicityIDType| None = None
    department: Optional[Department] = None
    supplier_uid: FelicityIDType| None = None
    supplier: Optional[Supplier] = None
    category_uid: FelicityIDType| None = None
    category: Optional[StockCategory] = None
    hazard_uid: FelicityIDType| None = None
    hazard: Optional[Hazard] = None
    store_room_uid: FelicityIDType| None = None
    store_room: Optional[StoreRoom] = None
    lot_number: str | None = None
    batch: str | None = None
    size: float| None = None
    unit_uid: FelicityIDType| None = None
    unit: Optional[StockUnit] = None
    packaging_uid: FelicityIDType| None = None
    packaging: Optional[StockPackaging] = None
    price: float| None = None
    quantity_received: int | None = None
    remaining: int | None = None
    date_received: datetime | None = None
    expiry_date: datetime | None = None
    received_by_uid: FelicityIDType| None = None
    received_by: Optional[User] = None


class StockProduct(StockProductBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


class StockProductCreate(StockProductBase):
    pass


class StockProductUpdate(StockProductBase):
    pass


#
# StockOrder Schemas
#
class StockOrderBase(BaseAuditModel):
    order_by_uid: FelicityIDType| None = None
    order_by: Optional[User] = None
    department_uid: FelicityIDType| None = None
    department: Optional[Department] = None
    status: str | None = None
    order_number: str | None = None
    remarks: str | None = None


class StockOrder(StockOrderBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


class StockOrderCreate(StockOrderBase):
    pass


class StockOrderUpdate(StockOrderBase):
    pass


#
# StockOrderProduct Schemas
#
class StockOrderProductBase(BaseAuditModel):
    product_uid: FelicityIDType| None = None
    product: Optional[StockProduct] = None
    order_uid: FelicityIDType| None = None
    order: Optional[StockOrder] = None
    price: float| None = None
    quantity: int | None = None
    remarks: str | None = None


class StockOrderProduct(StockOrderProductBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


class StockOrderProductCreate(StockOrderProductBase):
    pass


class StockOrderProductUpdate(StockOrderProductBase):
    pass


#
# StockTransaction Schemas
#
class StockTransactionBase(BaseAuditModel):
    product_uid: FelicityIDType| None = None
    product: Optional[StockProduct] = None
    issued: int | None = None
    department_uid: FelicityIDType| None = None
    department: Optional[Department] = None
    date_issued: datetime | None = None
    transaction_by_uid: FelicityIDType| None = None
    transaction_by: Optional[User] = None


class StockTransaction(StockTransactionBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


class StockTransactionCreate(StockTransactionBase):
    pass


class StockTransactionUpdate(StockTransactionBase):
    pass


#
# StockAdjustment Schemas
#
class StockAdjustmentBase(BaseAuditModel):
    product_uid: FelicityIDType| None = None
    product: Optional[StockProduct] = None
    adjustment_type: str | None = None
    adjust: int | None = None
    adjustment_date: datetime | None = None
    remarks: str | None = None
    adjustment_by_uid: FelicityIDType| None = None
    adjustment_by: Optional[User] = None


class StockAdjustment(StockAdjustmentBase):
    uid: FelicityIDType| None = None

    class Config:
        orm_mode = True


class StockAdjustmentCreate(StockAdjustmentBase):
    pass


class StockAdjustmentUpdate(StockAdjustmentBase):
    pass
