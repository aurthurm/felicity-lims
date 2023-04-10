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

    name: Optional[str] = None
    description: Optional[str] = None
    department_uid: Optional[FelicityIDType] = None
    department: Optional[Department] = None
    minimum_level: Optional[int] = None
    maximum_level: Optional[int] = None


class StockItem(StockItemBase):
    uid: Optional[FelicityIDType] = None

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

    name: Optional[str] = None
    description: Optional[str] = None


class StockCategory(StockCategoryBase):
    uid: Optional[FelicityIDType] = None

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

    name: Optional[str] = None
    description: Optional[str] = None


class Hazard(HazardBase):
    uid: Optional[FelicityIDType] = None

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
    name: Optional[str] = None


class StockUnit(StockUnitBase):
    uid: Optional[FelicityIDType] = None

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
    name: Optional[str] = None


class StockPackaging(StockPackagingBase):
    uid: Optional[FelicityIDType] = None

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
    name: Optional[str] = None
    stock_item_uid: Optional[FelicityIDType] = None
    department_uid: Optional[FelicityIDType] = None
    department: Optional[Department] = None
    supplier_uid: Optional[FelicityIDType] = None
    supplier: Optional[Supplier] = None
    category_uid: Optional[FelicityIDType] = None
    category: Optional[StockCategory] = None
    hazard_uid: Optional[FelicityIDType] = None
    hazard: Optional[Hazard] = None
    store_room_uid: Optional[FelicityIDType] = None
    store_room: Optional[StoreRoom] = None
    lot_number: Optional[str] = None
    batch: Optional[str] = None
    size: Optional[float] = None
    unit_uid: Optional[FelicityIDType] = None
    unit: Optional[StockUnit] = None
    packaging_uid: Optional[FelicityIDType] = None
    packaging: Optional[StockPackaging] = None
    price: Optional[float] = None
    quantity_received: Optional[int] = None
    remaining: Optional[int] = None
    date_received: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    received_by_uid: Optional[FelicityIDType] = None
    received_by: Optional[User] = None


class StockProduct(StockProductBase):
    uid: Optional[FelicityIDType] = None

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
    order_by_uid: Optional[FelicityIDType] = None
    order_by: Optional[User] = None
    department_uid: Optional[FelicityIDType] = None
    department: Optional[Department] = None
    status: Optional[str] = None
    order_number: Optional[str] = None
    remarks: Optional[str] = None


class StockOrder(StockOrderBase):
    uid: Optional[FelicityIDType] = None

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
    product_uid: Optional[FelicityIDType] = None
    product: Optional[StockProduct] = None
    order_uid: Optional[FelicityIDType] = None
    order: Optional[StockOrder] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    remarks: Optional[str] = None


class StockOrderProduct(StockOrderProductBase):
    uid: Optional[FelicityIDType] = None

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
    product_uid: Optional[FelicityIDType] = None
    product: Optional[StockProduct] = None
    issued: Optional[int] = None
    department_uid: Optional[FelicityIDType] = None
    department: Optional[Department] = None
    date_issued: Optional[datetime] = None
    transaction_by_uid: Optional[FelicityIDType] = None
    transaction_by: Optional[User] = None


class StockTransaction(StockTransactionBase):
    uid: Optional[FelicityIDType] = None

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
    product_uid: Optional[FelicityIDType] = None
    product: Optional[StockProduct] = None
    adjustment_type: Optional[str] = None
    adjust: Optional[int] = None
    adjustment_date: Optional[datetime] = None
    remarks: Optional[str] = None
    adjustment_by_uid: Optional[FelicityIDType] = None
    adjustment_by: Optional[User] = None


class StockAdjustment(StockAdjustmentBase):
    uid: Optional[FelicityIDType] = None

    class Config:
        orm_mode = True


class StockAdjustmentCreate(StockAdjustmentBase):
    pass


class StockAdjustmentUpdate(StockAdjustmentBase):
    pass
