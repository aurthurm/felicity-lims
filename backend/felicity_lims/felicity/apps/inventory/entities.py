from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship

from felicity.apps import BaseAuditDBModel


class StockItem(BaseAuditDBModel):
    """StockItem Standardization"""
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    department_uid = Column(Integer, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")


class StockCategory(BaseAuditDBModel):
    """StockCategory
    Consumable, Reagents, Durables
    """
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)


class Hazard(BaseAuditDBModel):
    """Hazard
    """
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)


class StockUnit(BaseAuditDBModel):
    name = Column(String, nullable=False)


class StockPackaging(BaseAuditDBModel):
    name = Column(String, nullable=False)


class StockProduct(BaseAuditDBModel):
    name = Column(String, nullable=False)
    department_uid = Column(Integer, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    supplier_uid = Column(Integer, ForeignKey("supplier.uid"), nullable=True)
    supplier = relationship("Supplier", lazy="selectin")
    category_uid = Column(Integer, ForeignKey("stockcategory.uid"), nullable=True)
    category = relationship("StockCategory", lazy="selectin")
    hazard_uid = Column(Integer, ForeignKey("hazard.uid"), nullable=True)
    hazard = relationship("Hazard", lazy="selectin")
    store_room_uid = Column(Integer, ForeignKey("storeroom.uid"), nullable=True)
    store_room = relationship("StoreRoom", lazy="selectin")
    lot_number = Column(String, nullable=False)
    batch = Column(String, nullable=False)
    size = Column(Float, nullable=False)
    unit_uid = Column(Integer, ForeignKey("stockunit.uid"), nullable=True)
    unit = relationship("StockUnit", lazy="selectin")
    packaging_uid = Column(Integer, ForeignKey("stockpackaging.uid"), nullable=True)
    packaging = relationship("StockPackaging", lazy="selectin")
    price = Column(Float, nullable=False)
    quantity_received = Column(Integer, nullable=False)
    minimum_level = Column(Integer, nullable=False)
    remaining = Column(Integer, nullable=False)
    date_received = Column(DateTime, nullable=False)
    expiry_date = Column(DateTime, nullable=False)
    received_by_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    received_by = relationship("User", foreign_keys=[received_by_uid], lazy="selectin")


class StockOrder(BaseAuditDBModel):
    order_by_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    order_by = relationship("User", foreign_keys=[order_by_uid], lazy="selectin")
    department_uid = Column(Integer, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    status = Column(String, nullable=False)
    order_number = Column(String, nullable=False)


class StockOrderProduct(BaseAuditDBModel):
    product_uid = Column(Integer, ForeignKey("stockproduct.uid"), nullable=True)
    product = relationship("StockProduct", lazy="selectin")
    order_uid = Column(Integer, ForeignKey("stockorder.uid"), nullable=True)
    order = relationship("StockOrder", lazy="selectin")
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)


# transactions are issues
class StockTransaction(BaseAuditDBModel):
    product_uid = Column(Integer, ForeignKey("stockproduct.uid"), nullable=True)
    product = relationship("StockProduct", lazy="selectin")
    issued = Column(Integer, nullable=False)
    department_uid = Column(Integer, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    date_issued = Column(DateTime, nullable=False)
    transaction_by_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    transaction_by = relationship("User", foreign_keys=[transaction_by_uid], lazy="selectin")


class StockAdjustment(BaseAuditDBModel):
    product_uid = Column(Integer, ForeignKey("stockproduct.uid"), nullable=True)
    product = relationship("StockProduct", lazy="selectin")
    adjustment_type = Column(String, nullable=False)
    adjust = Column(Integer, nullable=False)
    adjustment_date = Column(DateTime, nullable=False)
    remarks = Column(String, nullable=False)
    adjustment_by_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    adjustment_by = relationship("User", foreign_keys=[adjustment_by_uid], lazy="selectin")
