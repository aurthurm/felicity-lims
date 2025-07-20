from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity, BaseEntity


class StockItem(BaseEntity):
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


class StockItemVariant(BaseEntity):
    """StockItem Variant as the StockProduct"""

    __tablename__ = "stock_item_variant"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    stock_item_uid = Column(String, ForeignKey("stock_item.uid"), nullable=True)
    stock_item = relationship("StockItem", lazy="selectin")
    minimum_level = Column(Integer, nullable=True)
    maximum_level = Column(Integer, nullable=True)


class StockCategory(BaseEntity):
    """StockCategory
    Consumable, Reagents, Durables
    """

    __tablename__ = "stock_category"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)


class Hazard(BaseEntity):
    """Hazard"""

    __tablename__ = "hazard"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)


class StockUnit(BaseEntity):
    __tablename__ = "stock_unit"

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    synonyms = Column(String, nullable=True)


class StockLot(BaseEntity):
    __tablename__ = "stock_lot"

    product_uid = Column(String, ForeignKey("stock_item_variant.uid"), nullable=True)
    product = relationship("StockItemVariant", lazy="selectin")
    lot_number = Column(String, nullable=False)
    expiry_date = Column(DateTime, nullable=False)
    remarks = Column(String, nullable=True)


class StockProductInventory(LabScopedEntity):
    __tablename__ = "stock_product_inventory"

    product_uid = Column(String, ForeignKey("stock_item_variant.uid"), nullable=True)
    product = relationship("StockItemVariant", lazy="selectin")
    stock_lot_uid = Column(String, ForeignKey("stock_lot.uid"), nullable=True)
    stock_lot = relationship("StockLot", lazy="selectin")
    quantity = Column(Integer, nullable=False)
    remarks = Column(String, nullable=True)


class StockOrder(LabScopedEntity):
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


class StockOrderProduct(LabScopedEntity):
    __tablename__ = "stock_order_product"

    product_uid = Column(String, ForeignKey("stock_item_variant.uid"), nullable=True)
    product = relationship("StockItemVariant", lazy="selectin")
    stock_lot_uid = Column(String, ForeignKey("stock_lot.uid"), nullable=True)
    stock_lot = relationship("StockLot", lazy="selectin")
    order_uid = Column(String, ForeignKey("stock_order.uid"), nullable=True)
    order = relationship("StockOrder", lazy="selectin")
    quantity = Column(Integer, nullable=False)
    remarks = Column(String, nullable=True)


class StockReceipt(LabScopedEntity):
    __tablename__ = "stock_receipt"

    product_uid = Column(String, ForeignKey("stock_item_variant.uid"), nullable=False)
    product = relationship("StockItemVariant", lazy="selectin")
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


class StockAdjustment(LabScopedEntity):
    __tablename__ = "stock_adjustment"

    product_uid = Column(String, ForeignKey("stock_item_variant.uid"), nullable=True)
    product = relationship("StockItemVariant", lazy="selectin")
    stock_lot_uid = Column(String, ForeignKey("stock_lot.uid"), nullable=True)
    stock_lot = relationship("StockLot", lazy="selectin")
    adjustment_type = Column(String, nullable=False)
    adjust = Column(Integer, nullable=False)
    adjustment_date = Column(DateTime, nullable=False)
    remarks = Column(String, nullable=False)
    adjustment_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    adjustment_by = relationship(
        "User", foreign_keys=[adjustment_by_uid], lazy="selectin"
    )
    adjustment_for_uid = Column(Integer, nullable=True)
    adjustment_for = Column(String, ForeignKey("user.uid"), nullable=True)
