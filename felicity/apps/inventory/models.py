from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from felicity.apps import BaseAuditDBModel
from felicity.apps.common.models import IdSequence
from felicity.apps.inventory import schemas
from felicity.apps.inventory.conf import order_states


class StockItem(BaseAuditDBModel):
    """StockItem Standardization"""

    __tablename__ = "stock_item"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category_uid = Column(String, ForeignKey("stock_category.uid"), nullable=True)
    category = relationship("StockCategory", lazy="selectin")
    hazard_uid = Column(String, ForeignKey("hazard.uid"), nullable=True)
    hazard = relationship("Hazard", lazy="selectin")
    minimum_level = Column(Integer, nullable=True)
    maximum_level = Column(Integer, nullable=True)

    @classmethod
    async def create(cls, obj_in: dict | schemas.StockItemCreate) -> schemas.StockItem:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | schemas.StockItemUpdate) -> schemas.StockItem:
        data = self._import(obj_in)
        return await super().update(**data)


class StockItemVariant(BaseAuditDBModel):
    """StockItem Variant Standardization"""

    __tablename__ = "stock_item_variant"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    stock_item_uid = Column(String, ForeignKey("stock_item.uid"), nullable=True)
    stock_item = relationship("StockItem", lazy="selectin")
    minimum_level = Column(Integer, nullable=True)
    maximum_level = Column(Integer, nullable=True)

    @classmethod
    async def create(cls, obj_in: dict | schemas.StockItemVariantCreate) -> schemas.StockItemVariant:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | schemas.StockItemVariantUpdate) -> schemas.StockItemVariant:
        data = self._import(obj_in)
        return await super().update(**data)


class StockCategory(BaseAuditDBModel):
    """StockCategory
    Consumable, Reagents, Durables
    """

    __tablename__ = "stock_category"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)

    @classmethod
    async def create(
            cls, obj_in: dict | schemas.StockCategoryCreate
    ) -> schemas.StockCategory:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
            self, obj_in: dict | schemas.StockCategoryUpdate
    ) -> schemas.StockCategory:
        data = self._import(obj_in)
        return await super().update(**data)


class Hazard(BaseAuditDBModel):
    """Hazard"""

    __tablename__ = "hazard"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)

    @classmethod
    async def create(cls, obj_in: dict | schemas.HazardCreate) -> schemas.Hazard:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | schemas.HazardUpdate) -> schemas.Hazard:
        data = self._import(obj_in)
        return await super().update(**data)


class StockUnit(BaseAuditDBModel):
    name = Column(String, nullable=False)
    __tablename__ = "stock_unit"

    @classmethod
    async def create(cls, obj_in: dict | schemas.StockUnitCreate) -> schemas.StockUnit:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | schemas.StockUnitUpdate) -> schemas.StockUnit:
        data = self._import(obj_in)
        return await super().update(**data)


class StockProduct(BaseAuditDBModel):
    __tablename__ = "stock_product"

    name = Column(String, nullable=True)
    stock_item_uid = Column(String, ForeignKey("stock_item.uid"), nullable=False)
    stock_item = relationship("StockItem", lazy="selectin")
    stock_item_variant_uid = Column(String, ForeignKey("stock_item_variant.uid"), nullable=False)
    stock_item_variant = relationship("StockItemVariant", lazy="selectin")

    @classmethod
    async def create(
            cls, obj_in: dict | schemas.StockProductCreate
    ) -> schemas.StockProduct:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
            self, obj_in: dict | schemas.StockProductUpdate
    ) -> schemas.StockProduct:
        data = self._import(obj_in)
        return await super().update(**data)


class StockLot(BaseAuditDBModel):
    __tablename__ = "stock_lot"

    product_uid = Column(String, ForeignKey("stock_product.uid"), nullable=True)
    product = relationship("StockProduct", lazy="selectin")
    lot_number = Column(String, nullable=False)
    expiry_date = Column(DateTime, nullable=False)
    remarks = Column(String, nullable=True)

    @classmethod
    async def create(cls, obj_in: dict | schemas.StockLotCreate) -> schemas.StockLot:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | schemas.StockLotUpdate) -> schemas.StockLot:
        data = self._import(obj_in)
        return await super().update(**data)


class StockProductInventory(BaseAuditDBModel):
    __tablename__ = "stock_product_inventory"

    product_uid = Column(String, ForeignKey("stock_product.uid"), nullable=True)
    product = relationship("StockProduct", lazy="selectin")
    stock_lot_uid = Column(String, ForeignKey("stock_lot.uid"), nullable=True)
    stock_lot = relationship("StockProduct", lazy="selectin")
    quantity = Column(Integer, nullable=False)
    remarks = Column(String, nullable=True)

    @classmethod
    async def create(
            cls, obj_in: dict | schemas.StockProductInventoryCreate
    ) -> schemas.StockProductInventory:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
            self, obj_in: dict | schemas.StockProductInventoryUpdate
    ) -> schemas.StockProductInventory:
        data = self._import(obj_in)
        return await super().update(**data)


class StockOrder(BaseAuditDBModel):
    __tablename__ = "stock_order"

    order_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    order_by = relationship("User", foreign_keys=[order_by_uid], lazy="selectin")
    department_uid = Column(String, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    status = Column(String, nullable=False)
    order_number = Column(String, nullable=False)
    remarks = Column(String, nullable=True)
    fulfilled_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    fulfilled_by = relationship(
        "User", foreign_keys=[fulfilled_by_uid], lazy="selectin"
    )

    @classmethod
    async def create(
            cls, obj_in: dict | schemas.StockOrderCreate
    ) -> schemas.StockOrder:
        data = cls._import(obj_in)
        data["status"] = order_states.PREPARATION
        data["order_number"] = (await IdSequence.get_next_number("SON"))[1]
        return await super().create(**data)

    async def update(
            self, obj_in: dict | schemas.StockOrderUpdate
    ) -> schemas.StockOrder:
        data = self._import(obj_in)
        return await super().update(**data)


class StockOrderProduct(BaseAuditDBModel):
    __tablename__ = "stock_order_product"

    product_uid = Column(String, ForeignKey("stock_product.uid"), nullable=True)
    product = relationship("StockProduct", lazy="selectin")
    order_uid = Column(String, ForeignKey("stock_order.uid"), nullable=True)
    order = relationship("StockOrder", lazy="selectin")
    price = Column(Float, nullable=True)
    quantity = Column(Integer, nullable=False)
    remarks = Column(String, nullable=True)

    @classmethod
    async def create(
            cls, obj_in: dict | schemas.StockOrderProductCreate
    ) -> schemas.StockOrderProduct:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
            self, obj_in: dict | schemas.StockOrderProductUpdate
    ) -> schemas.StockOrderProduct:
        data = self._import(obj_in)
        return await super().update(**data)


class StockReceipt(BaseAuditDBModel):
    __tablename__ = "stock_receipt"

    product_uid = Column(String, ForeignKey("stock_product.uid"), nullable=False)
    product = relationship("StockProduct", lazy="selectin")
    stock_lot_uid = Column(String, ForeignKey("stock_lot.uid"), nullable=True)
    stock_lot = relationship("StockLot", lazy="selectin")
    unit_price = Column(Float, nullable=True)
    total_price = Column(Float, nullable=True)
    supplier_uid = Column(String, ForeignKey("supplier.uid"), nullable=True)
    supplier = relationship("Supplier", lazy="selectin")
    unit_uid = Column(String, ForeignKey("stock_unit.uid"), nullable=True)
    unit = relationship("StockUnit", lazy="selectin")
    # number of non packages received
    singles_received = Column(Integer, nullable=True)
    # number of packages received
    packages_received = Column(Integer, nullable=True)
    # number of units in the package
    package_factor = Column(Integer, nullable=True)
    # total quantity received 
    quantity_received = Column(Integer, nullable=False)
    # receipt_type can be a purchase, transfer, return
    receipt_type = Column(String, nullable=False)
    receipt_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    receipt_by = relationship("User", foreign_keys=[receipt_by_uid], lazy="selectin")
    receipt_date = Column(DateTime, nullable=False)
    expiry_date = Column(DateTime, nullable=False)

    @classmethod
    async def create(
            cls, obj_in: dict | schemas.StockReceiptCreate
    ) -> schemas.StockReceipt:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
            self, obj_in: dict | schemas.StockReceiptUpdate
    ) -> schemas.StockReceipt:
        data = self._import(obj_in)
        return await super().update(**data)


class StockIssue(BaseAuditDBModel):
    __tablename__ = "stock_issue"

    product_uid = Column(String, ForeignKey("stock_product.uid"), nullable=True)
    product = relationship("StockProduct", lazy="selectin")
    issued = Column(Integer, nullable=False)
    issued_to_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    issued_to = relationship("User", foreign_keys=[issued_to_uid], lazy="selectin")
    department_uid = Column(String, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    date_issued = Column(DateTime, nullable=False)
    issue_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    issue_by = relationship(
        "User", foreign_keys=[issue_by_uid], lazy="selectin"
    )

    @classmethod
    async def create(
            cls, obj_in: dict | schemas.StockIssueCreate
    ) -> schemas.StockIssue:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
            self, obj_in: dict | schemas.StockIssueUpdate
    ) -> schemas.StockIssue:
        data = self._import(obj_in)
        return await super().update(**data)


class StockAdjustment(BaseAuditDBModel):
    __tablename__ = "stock_adjustment"

    product_uid = Column(String, ForeignKey("stock_product.uid"), nullable=True)
    product = relationship("StockProduct", lazy="selectin")
    lot_number = Column(String, nullable=True)
    adjustment_type = Column(String, nullable=False)
    adjust = Column(Integer, nullable=False)
    adjustment_date = Column(DateTime, nullable=False)
    remarks = Column(String, nullable=False)
    adjustment_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    adjustment_by = relationship(
        "User", foreign_keys=[adjustment_by_uid], lazy="selectin"
    )

    @classmethod
    async def create(
            cls, obj_in: dict | schemas.StockAdjustmentCreate
    ) -> schemas.StockAdjustment:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
            self, obj_in: dict | schemas.StockAdjustmentUpdate
    ) -> schemas.StockAdjustment:
        data = self._import(obj_in)
        return await super().update(**data)
