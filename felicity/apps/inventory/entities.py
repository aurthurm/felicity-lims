from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from infrastructure.database import BaseAuditDBModel


class StockItem(BaseAuditDBModel):
    """StockItem Standardization"""

    __tablename__ = "stock_item"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    department_uid = Column(String, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    minimum_level = Column(Integer, nullable=True)
    maximum_level = Column(Integer, nullable=True)


class StockCategory(BaseAuditDBModel):
    """StockCategory
    Consumable, Reagents, Durables
    """

    __tablename__ = "stock_category"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)


class Hazard(BaseAuditDBModel):
    """Hazard"""

    __tablename__ = "hazard"

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)


class StockUnit(BaseAuditDBModel):
    __tablename__ = "stock_unit"

    name = Column(String, nullable=False)


class StockPackaging(BaseAuditDBModel):
    __tablename__ = "stock_packaging"

    name = Column(String, nullable=False)


class StockProduct(BaseAuditDBModel):
    __tablename__ = "stock_product"

    name = Column(String, nullable=True)
    stock_item_uid = Column(String, ForeignKey("stock_item.uid"), nullable=False)
    stock_item = relationship("StockItem", lazy="selectin")
    department_uid = Column(String, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    supplier_uid = Column(String, ForeignKey("supplier.uid"), nullable=True)
    supplier = relationship("Supplier", lazy="selectin")
    category_uid = Column(String, ForeignKey("stock_category.uid"), nullable=True)
    category = relationship("StockCategory", lazy="selectin")
    hazard_uid = Column(String, ForeignKey("hazard.uid"), nullable=True)
    hazard = relationship("Hazard", lazy="selectin")
    store_room_uid = Column(String, ForeignKey("store_room.uid"), nullable=True)
    store_room = relationship("StoreRoom", lazy="selectin")
    lot_number = Column(String, nullable=True)
    batch = Column(String, nullable=True)
    size = Column(Float, nullable=True)
    unit_uid = Column(String, ForeignKey("stock_unit.uid"), nullable=True)
    unit = relationship("StockUnit", lazy="selectin")
    packaging_uid = Column(String, ForeignKey("stock_packaging.uid"), nullable=True)
    packaging = relationship("StockPackaging", lazy="selectin")
    price = Column(Float, nullable=True)
    quantity_received = Column(Integer, nullable=False)
    remaining = Column(Integer, nullable=True)
    date_received = Column(DateTime, nullable=False)
    expiry_date = Column(DateTime, nullable=True)
    received_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    received_by = relationship("User", foreign_keys=[received_by_uid], lazy="selectin")


class StockOrder(BaseAuditDBModel):
    __tablename__ = "stock_order"

    order_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    order_by = relationship("User", foreign_keys=[order_by_uid], lazy="selectin")
    department_uid = Column(String, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    status = Column(String, nullable=False)
    order_number = Column(String, nullable=False)
    remarks = Column(String, nullable=True)
    fullfilled_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    fullfilled_by = relationship(
        "User", foreign_keys=[fullfilled_by_uid], lazy="selectin"
    )


class StockOrderProduct(BaseAuditDBModel):
    __tablename__ = "stock_order_product"

    product_uid = Column(String, ForeignKey("stock_product.uid"), nullable=True)
    product = relationship("StockProduct", lazy="selectin")
    order_uid = Column(String, ForeignKey("stock_order.uid"), nullable=True)
    order = relationship("StockOrder", lazy="selectin")
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    remarks = Column(String, nullable=True)


# transactions are issues
class StockTransaction(BaseAuditDBModel):
    __tablename__ = "stock_transaction"

    product_uid = Column(String, ForeignKey("stock_product.uid"), nullable=True)
    product = relationship("StockProduct", lazy="selectin")
    issued = Column(Integer, nullable=False)
    issued_to_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    issued_to = relationship("User", foreign_keys=[issued_to_uid], lazy="selectin")
    department_uid = Column(String, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    date_issued = Column(DateTime, nullable=False)
    transaction_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    transaction_by = relationship(
        "User", foreign_keys=[transaction_by_uid], lazy="selectin"
    )


class StockAdjustment(BaseAuditDBModel):
    __tablename__ = "stock_adjustment"

    product_uid = Column(String, ForeignKey("stock_product.uid"), nullable=True)
    product = relationship("StockProduct", lazy="selectin")
    adjustment_type = Column(String, nullable=False)
    adjust = Column(Integer, nullable=False)
    adjustment_date = Column(DateTime, nullable=False)
    remarks = Column(String, nullable=False)
    adjustment_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    adjustment_by = relationship(
        "User", foreign_keys=[adjustment_by_uid], lazy="selectin"
    )
