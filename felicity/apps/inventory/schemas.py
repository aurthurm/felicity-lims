from datetime import datetime
from typing import Optional

from pydantic import ConfigDict

from felicity.apps.common.schemas import BaseAuditModel
from felicity.apps.setup.schemas import Department
from felicity.apps.user.schemas import User


#
# StockItem Schemas
#
class StockItemBase(BaseAuditModel):
    """StockItem Standardization"""

    name: str | None = None
    description: str | None = None
    department_uid: str | None = None
    department: Optional[Department] = None
    category_uid: str | None = None
    hazard_uid: str | None = None
    minimum_level: int | None = None
    maximum_level: int | None = None


class StockItem(StockItemBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class StockItemCreate(StockItemBase):
    pass


class StockItemUpdate(StockItemBase):
    pass


#
# StockItemVariant Schemas
#
class StockItemVariantBase(BaseAuditModel):
    """StockItemVariant Standardization"""

    name: str | None = None
    description: str | None = None
    stock_item_uid: str | None = None
    stock_item: Optional[StockItem] = None
    minimum_level: int | None = None
    maximum_level: int | None = None


class StockItemVariant(StockItemVariantBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class StockItemVariantCreate(StockItemVariantBase):
    pass


class StockItemVariantUpdate(StockItemVariantBase):
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
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


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
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class HazardCreate(HazardBase):
    pass


class HazardUpdate(HazardBase):
    pass


#
# StockUnit Schemas
#
class StockUnitBase(BaseAuditModel):
    name: str | None = None
    description: str | None = None
    synonyms: str | None = None


class StockUnit(StockUnitBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class StockUnitCreate(StockUnitBase):
    pass


class StockUnitUpdate(StockUnitBase):
    pass


#
# StockLot Schemas
#
class StockLotBase(BaseAuditModel):
    product_uid: str | None = None
    lot_number: str | None = None
    expiry_date: Optional[datetime] = None
    remarks: str | None = None


class StockLot(StockLotBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class StockLotCreate(StockLotBase):
    pass


class StockLotUpdate(StockLotBase):
    pass


#
# StockProductInventory Schemas
#
class StockProductInventoryBase(BaseAuditModel):
    product_uid: str | None = None
    stock_lot_uid: str | None = None
    quantity: int = None
    remarks: str | None = None


class StockProductInventory(StockProductInventoryBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class StockProductInventoryCreate(StockProductInventoryBase):
    pass


class StockProductInventoryUpdate(StockProductInventoryBase):
    pass


#
# StockReceipt Schemas
#
class StockReceiptBase(BaseAuditModel):
    product_uid: str | None = None
    stock_lot_uid: str | None = None
    unit_price: float | None = None
    total_price: float | None = None
    supplier_uid: str | None = None
    unit_uid: str | None = None
    singles_received: int | None = None
    packages_received: int | None = None
    package_factor: int | None = None
    quantity_received: int | None = None
    receipt_type: str | None = None
    receipt_by_uid: str | None = None
    receipt_date: datetime | None = None
    expiry_date: datetime | None = None


class StockReceipt(StockReceiptBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class StockReceiptCreate(StockReceiptBase):
    pass


class StockReceiptUpdate(StockReceiptBase):
    pass


#
# StockOrder Schemas
#
class StockOrderBase(BaseAuditModel):
    order_by_uid: str | None = None
    order_by: Optional[User] = None
    department_uid: str | None = None
    department: Optional[Department] = None
    status: str | None = None
    order_number: str | None = None
    remarks: str | None = None
    fulfilled_by_uid: str | None = None
    fulfilled_by: Optional[User] = None


class StockOrder(StockOrderBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class StockOrderCreate(StockOrderBase):
    pass


class StockOrderUpdate(StockOrderBase):
    pass


#
# StockOrderProduct Schemas
#
class StockOrderProductBase(BaseAuditModel):
    product_uid: str | None = None
    product: Optional[StockItemVariant] = None
    stock_lot_uid: str | None = None
    order_uid: str | None = None
    order: Optional[StockOrder] = None
    quantity: int | None = None
    remarks: str | None = None


class StockOrderProduct(StockOrderProductBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class StockOrderProductCreate(StockOrderProductBase):
    pass


class StockOrderProductUpdate(StockOrderProductBase):
    pass


#
# StockAdjustment Schemas
#
class StockAdjustmentBase(BaseAuditModel):
    product_uid: str | None = None
    product: Optional[StockItemVariant] = None
    stock_lot_uid: str | None = None
    adjustment_type: str | None = None
    adjust: int | None = None
    adjustment_date: datetime | None = None
    remarks: str | None = None
    adjustment_by_uid: str | None = None
    adjustment_by: Optional[User] = None


class StockAdjustment(StockAdjustmentBase):
    uid: str | None = None

    model_config = ConfigDict(from_attributes=True)


class StockAdjustmentCreate(StockAdjustmentBase):
    pass


class StockAdjustmentUpdate(StockAdjustmentBase):
    pass
