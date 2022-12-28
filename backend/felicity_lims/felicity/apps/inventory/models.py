from felicity.apps import BaseAuditDBModel
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from felicity.apps.common.models import IdSequence
from felicity.apps.inventory import schemas


class StockItem(BaseAuditDBModel):
    """StockItem Standardization"""

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    department_uid = Column(Integer, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.StockItemCreate) -> schemas.StockItem:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.StockItemUpdate) -> schemas.StockItem:
        data = self._import(obj_in)
        return await super().update(**data)


class StockCategory(BaseAuditDBModel):
    """StockCategory
    Consumable, Reagents, Durables
    """

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)

    @classmethod
    async def create(cls, obj_in: schemas.StockCategoryCreate) -> schemas.StockCategory:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.StockCategoryUpdate
    ) -> schemas.StockCategory:
        data = self._import(obj_in)
        return await super().update(**data)


class Hazard(BaseAuditDBModel):
    """Hazard
    """

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)


    @classmethod
    async def create(cls, obj_in: schemas.HazardCreate) -> schemas.Hazard:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.HazardUpdate) -> schemas.Hazard:
        data = self._import(obj_in)
        return await super().update(**data)


class StockUnit(BaseAuditDBModel):
    name = Column(String, nullable=False)

    @classmethod
    async def create(cls, obj_in: schemas.StockUnitCreate) -> schemas.StockUnit:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.StockUnitUpdate) -> schemas.StockUnit:
        data = self._import(obj_in)
        return await super().update(**data)


class StockPackaging(BaseAuditDBModel):
    name = Column(String, nullable=False)

    @classmethod
    async def create(
        cls, obj_in: schemas.StockPackagingCreate
    ) -> schemas.StockPackaging:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.StockPackagingUpdate
    ) -> schemas.StockPackaging:
        data = self._import(obj_in)
        return await super().update(**data)


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
    lot_number = Column(String, nullable=True)
    batch = Column(String, nullable=True)
    size = Column(Float, nullable=True)
    unit_uid = Column(Integer, ForeignKey("stockunit.uid"), nullable=True)
    unit = relationship("StockUnit", lazy="selectin")
    packaging_uid = Column(Integer, ForeignKey("stockpackaging.uid"), nullable=True)
    packaging = relationship("StockPackaging", lazy="selectin")
    price = Column(Float, nullable=True)
    quantity_received = Column(Integer, nullable=False)
    minimum_level = Column(Integer, nullable=True)
    remaining = Column(Integer, nullable=True)
    date_received = Column(DateTime, nullable=False)
    expiry_date = Column(DateTime, nullable=True)
    received_by_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    received_by = relationship("User", foreign_keys=[received_by_uid], lazy="selectin")

    @classmethod
    async def create(cls, obj_in: schemas.StockProductCreate) -> schemas.StockProduct:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: schemas.StockProductUpdate) -> schemas.StockProduct:
        data = self._import(obj_in)
        return await super().update(**data)


class StockOrder(BaseAuditDBModel):
    order_by_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    order_by = relationship("User", foreign_keys=[order_by_uid], lazy="selectin")
    department_uid = Column(Integer, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    status = Column(String, nullable=False)
    order_number = Column(String, nullable=False)

    @classmethod
    async def create(cls, obj_in: schemas.StockOrderCreate) -> schemas.StockOrder:
        data = cls._import(obj_in)
        data["status"] = "created"
        data["order_number"] = (await IdSequence.get_next_number("SON"))[1]
        return await super().create(**data)

    async def update(self, obj_in: schemas.StockOrderUpdate) -> schemas.StockOrder:
        data = self._import(obj_in)
        return await super().update(**data)


class StockOrderProduct(BaseAuditDBModel):
    product_uid = Column(Integer, ForeignKey("stockproduct.uid"), nullable=True)
    product = relationship("StockProduct", lazy="selectin")
    order_uid = Column(Integer, ForeignKey("stockorder.uid"), nullable=True)
    order = relationship("StockOrder", lazy="selectin")
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)

    @classmethod
    async def create(
        cls, obj_in: schemas.StockOrderProductCreate
    ) -> schemas.StockOrderProduct:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.StockOrderProductUpdate
    ) -> schemas.StockOrderProduct:
        data = self._import(obj_in)
        return await super().update(**data)


# transactions are issues
class StockTransaction(BaseAuditDBModel):
    product_uid = Column(Integer, ForeignKey("stockproduct.uid"), nullable=True)
    product = relationship("StockProduct", lazy="selectin")
    issued = Column(Integer, nullable=False)
    department_uid = Column(Integer, ForeignKey("department.uid"), nullable=True)
    department = relationship("Department", lazy="selectin")
    date_issued = Column(DateTime, nullable=False)
    transaction_by_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    transaction_by = relationship(
        "User", foreign_keys=[transaction_by_uid], lazy="selectin"
    )

    @classmethod
    async def create(
        cls, obj_in: schemas.StockTransactionCreate
    ) -> schemas.StockTransaction:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.StockTransactionUpdate
    ) -> schemas.StockTransaction:
        data = self._import(obj_in)
        return await super().update(**data)


class StockAdjustment(BaseAuditDBModel):
    product_uid = Column(Integer, ForeignKey("stockproduct.uid"), nullable=True)
    product = relationship("StockProduct", lazy="selectin")
    adjustment_type = Column(String, nullable=False)
    adjust = Column(Integer, nullable=False)
    adjustment_date = Column(DateTime, nullable=False)
    remarks = Column(String, nullable=False)
    adjustment_by_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    adjustment_by = relationship(
        "User", foreign_keys=[adjustment_by_uid], lazy="selectin"
    )

    @classmethod
    async def create(
        cls, obj_in: schemas.StockAdjustmentCreate
    ) -> schemas.StockAdjustment:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.StockAdjustmentUpdate
    ) -> schemas.StockAdjustment:
        data = self._import(obj_in)
        return await super().update(**data)
