from datetime import datetime
from typing import Optional

from felicity.apps.common.schemas import BaseAuditModel
from felicity.apps.setup.schemas import Department, Supplier
from felicity.apps.storage.schemas import StoreRoom
from felicity.apps.user.schemas import User


#
# StockItem Schemas
#
class StockItemBase(BaseAuditModel):
    """StockItem Standardization"""

    name: Optional[str] = None
    description: Optional[str] = None
    department_uid: Optional[int] = None
    department: Optional[Department] = None


class StockItem(StockItemBase):
    uid: Optional[int] = None

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
    uid: Optional[int] = None

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
    """Hazard
    """

    name: Optional[str] = None
    description: Optional[str] = None


class Hazard(HazardBase):
    uid: Optional[int] = None

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
    uid: Optional[int] = None

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
    uid: Optional[int] = None

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
    department_uid: Optional[int] = None
    department: Optional[Department] = None
    supplier_uid: Optional[int] = None
    supplier: Optional[Supplier] = None
    category_uid: Optional[int] = None
    category: Optional[StockCategory] = None
    hazard_uid: Optional[int] = None
    hazard: Optional[Hazard] = None
    store_room_uid: Optional[int] = None
    store_room: Optional[StoreRoom] = None
    lot_number: Optional[str] = None
    batch: Optional[str] = None
    size: Optional[float] = None
    unit_uid: Optional[int] = None
    unit: Optional[StockUnit] = None
    packaging_uid: Optional[int] = None
    packaging: Optional[StockPackaging] = None
    price: Optional[float] = None
    quantity_received: Optional[int] = None
    minimum_level: Optional[int] = None
    remaining: Optional[int] = None
    date_received: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    received_by_uid: Optional[int] = None
    received_by: Optional[User] = None


class StockProduct(StockProductBase):
    uid: Optional[int] = None

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
    order_by_uid: Optional[int] = None
    order_by: Optional[User] = None
    department_uid: Optional[int] = None
    department: Optional[Department] = None
    status: Optional[str] = None
    order_number: Optional[str] = None
    remarks: Optional[str] = None


class StockOrder(StockOrderBase):
    uid: Optional[int] = None

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
    product_uid: Optional[int] = None
    product: Optional[StockProduct] = None
    order_uid: Optional[int] = None
    order: Optional[StockOrder] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    remarks: Optional[str] = None


class StockOrderProduct(StockOrderProductBase):
    uid: Optional[int] = None

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
    product_uid: Optional[int] = None
    product: Optional[StockProduct] = None
    issued: Optional[int] = None
    department_uid: Optional[int] = None
    department: Optional[Department] = None
    date_issued: Optional[datetime] = None
    transaction_by_uid: Optional[int] = None
    transaction_by: Optional[User] = None


class StockTransaction(StockTransactionBase):
    uid: Optional[int] = None

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
    product_uid: Optional[int] = None
    product: Optional[StockProduct] = None
    adjustment_type: Optional[str] = None
    adjust: Optional[int] = None
    adjustment_date: Optional[datetime] = None
    remarks: Optional[str] = None
    adjustment_by_uid: Optional[int] = None
    adjustment_by: Optional[User] = None


class StockAdjustment(StockAdjustmentBase):
    uid: Optional[int] = None

    class Config:
        orm_mode = True


class StockAdjustmentCreate(StockAdjustmentBase):
    pass


class StockAdjustmentUpdate(StockAdjustmentBase):
    pass
