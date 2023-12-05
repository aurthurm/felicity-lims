from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Boolean, Table, LargeBinary
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship


from apps import Auditable, DBModel
from apps.billing.schemas import (
    AnalysisPriceCreate, AnalysisPriceUpdate, ProfilePriceCreate, ProfilePriceUpdate, AnalysisDiscountCreate,
    AnalysisDiscountUpdate, ProfileDiscountCreate, ProfileDiscountUpdate, VoucherUpdate, VoucherCreate,
    VoucherCodeCreate, VoucherCodeUpdate, VoucherCustomerCreate, VoucherCustomerUpdate, TestBillCreate, TestBillUpdate,
    TestBillTransactionCreate, TestBillTransactionUpdate, TestBillInvoiceUpdate, TestBillInvoiceCreate
)
from apps.billing.config import DiscountType, DiscountValueType


class AnalysisPrice(Auditable):
    __tablename__ = "analysis_price"
    
    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=True)
    analysis = relationship("Analysis", lazy="selectin")
    is_active = Column(Boolean, nullable=False)
    amount = Column(Integer, nullable=False)

    @classmethod
    async def create(cls, obj_in: AnalysisPriceCreate) -> "AnalysisPrice":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: AnalysisPriceUpdate) -> "AnalysisPrice":
        data = self._import(obj_in)
        return await super().update(**data)


class ProfilePrice(Auditable):
    __tablename__ = "profile_price"
    
    profile_uid = Column(String, ForeignKey("profile.uid"), nullable=True)
    profile = relationship("Profile", lazy="selectin")
    is_active = Column(Boolean, nullable=False)
    amount = Column(Integer, nullable=False)

    @classmethod
    async def create(cls, obj_in: ProfilePriceCreate) -> "ProfilePrice":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: ProfilePriceUpdate) -> "ProfilePrice":
        data = self._import(obj_in)
        return await super().update(**data)



class AnalysisDiscount(Auditable):
    __tablename__ = "analysis_discount"
    
    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=True)
    analysis = relationship("Analysis", lazy="selectin")
    name = Column(String, nullable=False)
    discount_type = Column(String, nullable=False, default=DiscountType.VOUCHER)
    value_type = Column(String, nullable=False, default=DiscountValueType.PERCENTATE)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    voucher_uid = Column(String, ForeignKey("voucher.uid"), nullable=True)
    voucher = relationship("Voucher", lazy="selectin")
    value_percent = Column(Float, nullable=True)
    value_amount = Column(Float, nullable=True)
    is_active = Column(Boolean, nullable=False)

    @classmethod
    async def create(cls, obj_in: AnalysisDiscountCreate) -> "AnalysisDiscount":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: AnalysisDiscountUpdate) -> "AnalysisDiscount":
        data = self._import(obj_in)
        return await super().update(**data)


class ProfileDiscount(Auditable):
    __tablename__ = "profile_discount"
    
    profile_uid = Column(String, ForeignKey("profile.uid"), nullable=True)
    profile = relationship("Profile", lazy="selectin")
    name = Column(String, nullable=False)
    discount_type = Column(String, nullable=False, default=DiscountType.VOUCHER)
    value_type = Column(String, nullable=False, default=DiscountValueType.PERCENTATE)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    voucher_uid = Column(String, ForeignKey("voucher.uid"), nullable=True)
    voucher = relationship("Voucher", lazy="selectin")
    value_percent = Column(Float, nullable=True)
    value_amount = Column(Float, nullable=True)
    is_active = Column(Boolean, nullable=False)

    @classmethod
    async def create(cls, obj_in: ProfileDiscountCreate) -> "ProfileDiscount":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: ProfileDiscountUpdate) -> "ProfileDiscount":
        data = self._import(obj_in)
        return await super().update(**data)


class Voucher(Auditable):
    __tablename__ = "voucher"
    
    name = Column(String, nullable=False, unique=True)
    # The number of times a voucher can be used.
    usage_limit = Column(Integer, nullable=False, default=0)
    # Used count of the voucher.
    used = Column(Integer, nullable=False, default=0)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    # Determine if the voucher usage should be limited to one use per customer.
    once_per_customer = Column(Boolean, nullable=False)
    # Determine if the voucher should be applied once per order. If set to True, 
    # the voucher is applied to a single cheapest eligible product in checkout.
    once_per_order = Column(Boolean, nullable=False)

    @classmethod
    async def create(cls, obj_in: VoucherCreate) -> "Voucher":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: VoucherUpdate) -> "Voucher":
        data = self._import(obj_in)
        return await super().update(**data)


class VoucherCode(Auditable):
    __tablename__ = "voucher_code"
    
    code = Column(String(20), nullable=False, unique=True)
    voucher_uid = Column(String, ForeignKey("voucher.uid"), nullable=False)
    voucher = relationship("Voucher", lazy="selectin")
    # The number of times a voucher code can be used.
    usage_limit = Column(Integer, nullable=False, default=0)
    # Usage count of the voucher code.
    used = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False)

    @classmethod
    async def create(cls, obj_in: VoucherCodeCreate) -> "VoucherCode":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: VoucherCodeUpdate) -> "VoucherCode":
        data = self._import(obj_in)
        return await super().update(**data)


class VoucherCustomer(Auditable):
    __tablename__ = "voucher_customer"
    
    patient_uid = Column(String, ForeignKey("patient.uid"), nullable=False)
    patient = relationship("Patient", lazy="selectin")
    voucher_code_uid = Column(String, ForeignKey("voucher_code.uid"), nullable=False)
    voucher_code = relationship("VoucherCode", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: VoucherCustomerCreate) -> "VoucherCustomer":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: VoucherCustomerUpdate) -> "VoucherCustomer":
        data = self._import(obj_in)
        return await super().update(**data)


"""
 Many to Many Link between TestBill and AnalysisRequest
"""
test_bill_item = Table(
    "test_bill_item",
    DBModel.metadata,
    Column("test_bill_uid", ForeignKey("test_bill.uid"), primary_key=True),
    Column("analysis_request_uid", ForeignKey("analysis_request.uid"), primary_key=True),
)


class TestBill(Auditable):
    __tablename__ = "test_bill"
    
    bill_id = Column(String, nullable=False)
    patient_uid = Column(String, ForeignKey("patient.uid"), nullable=True)
    patient = relationship("Patient", lazy="selectin")
    client_uid = Column(String, ForeignKey("client.uid"), nullable=True)
    client = relationship("Client", lazy="selectin")
    is_active = Column(Boolean, nullable=False)
    to_confirm = Column(Boolean, nullable=False)
    partial = Column(Boolean, nullable=False)
    total_charged = Column(Float, nullable=False, default=0.0)
    total_paid = Column(Float, nullable=False, default=0.0)
    json_content: dict = Column(JSONB, nullable=True)
    orders = relationship(
        "AnalysisRequest",
        secondary=test_bill_item,
        lazy="selectin",
    )

    @classmethod
    async def create(cls, obj_in: TestBillCreate) -> "TestBill":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: TestBillUpdate) -> "TestBill":
        data = self._import(obj_in)
        return await super().update(**data)


class TestBillTransaction(Auditable):
    __tablename__ = "test_bill_transaction"
    
    test_bill_uid = Column(String, ForeignKey("test_bill.uid"), nullable=True)
    test_bill = relationship("TestBill", lazy="selectin")
    kind = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    error = Column(Boolean, nullable=False)
    is_success = Column(Boolean, nullable=False)
    action_required = Column(String, nullable=False)
    processed = Column(Boolean, nullable=False)
    notes = Column(String, nullable=False)

    @classmethod
    async def create(cls, obj_in: TestBillTransactionCreate) -> "TestBillTransaction":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: TestBillTransactionUpdate) -> "TestBillTransaction":
        data = self._import(obj_in)
        return await super().update(**data)


class TestBillInvoice(Auditable):
    __tablename__ = "test_bill_invoice"
    
    test_bill_uid = Column(String, ForeignKey("test_bill.uid"), nullable=True)
    test_bill = relationship("TestBill", lazy="selectin")
    json_content: dict = Column(JSONB, nullable=True)
    pdf_content = Column(LargeBinary, nullable=True)

    @classmethod
    async def create(cls, obj_in: TestBillInvoiceCreate) -> "TestBillInvoice":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: TestBillInvoiceUpdate) -> "TestBillInvoice":
        data = self._import(obj_in)
        return await super().update(**data)
