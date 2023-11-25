from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Boolean, Table, LargeBinary
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from apps import BaseAuditDBModel, DBModel
from apps.billing.schemas import (
    ServicePriceCreate, ServicePriceUpdate, ProfilePriceCreate, ProfilePriceUpdate, ServiceDiscountCreate,
    ServiceDiscountUpdate, ProfileDiscountCreate, ProfileDiscountUpdate, VoucherUpdate, VoucherCreate,
    VoucherCodeCreate, VoucherCodeUpdate, VoucherCustomerCreate, VoucherCustomerUpdate, TestBillCreate, TestBillUpdate,
    TestBillTransactionCreate, TestBillTransactionUpdate, TestBillInvoiceUpdate, TestBillInvoiceCreate
)


class BasePrice(BaseAuditDBModel):
    __abstract__ = True

    is_active = Column(Boolean, nullable=False)
    amount = Column(Integer, nullable=False)


class ServicePrice(BasePrice):
    analysis_service_uid = Column(String, ForeignKey("analysis_service.uid"), nullable=True)
    analysis_service = relationship("AnalysisService", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: ServicePriceCreate) -> "ServicePrice":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: ServicePriceUpdate) -> "ServicePrice":
        data = self._import(obj_in)
        return await super().update(**data)


class ProfilePrice(BasePrice):
    analysis_profile_uid = Column(String, ForeignKey("analysis_profile.uid"), nullable=True)
    analysis_profile = relationship("AnalysisProfile", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: ProfilePriceCreate) -> "ProfilePrice":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: ProfilePriceUpdate) -> "ProfilePrice":
        data = self._import(obj_in)
        return await super().update(**data)


class BaseDiscount(BaseAuditDBModel):
    __abstract__ = True

    name = Column(String, nullable=False)
    is_active = Column(Boolean, nullable=False)
    discount_type = Column(Boolean, nullable=False)
    value_type = Column(Boolean, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    voucher_uid = Column(String, ForeignKey("voucher.uid"), nullable=True)
    voucher = relationship("Voucher", lazy="selectin")
    voucher_code_uid = Column(String, ForeignKey("voucher_code.uid"), nullable=True)
    voucher_code = relationship("VoucherCode", lazy="selectin")
    value_percent = Column(Float, nullable=True)
    value_amount = Column(Float, nullable=True)


class ServiceDiscount(BaseDiscount):
    analysis_service_uid = Column(String, ForeignKey("analysis_service.uid"), nullable=True)
    analysis_service = relationship("AnalysisService", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: ServiceDiscountCreate) -> "ServiceDiscount":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: ServiceDiscountUpdate) -> "ServiceDiscount":
        data = self._import(obj_in)
        return await super().update(**data)


class ProfileDiscount(BaseDiscount):
    analysis_profile_uid = Column(String, ForeignKey("analysis_profile.uid"), nullable=True)
    analysis_profile = relationship("AnalysisProfile", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: ProfileDiscountCreate) -> "ProfileDiscount":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: ProfileDiscountUpdate) -> "ProfileDiscount":
        data = self._import(obj_in)
        return await super().update(**data)


class Voucher(BaseAuditDBModel):
    name = Column(String, nullable=False)
    usage_limit = Column(Integer, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    once_per_customer = Column(Boolean, nullable=False)
    once_per_order = Column(Boolean, nullable=False)
    single_use = Column(Boolean, nullable=False)
    only_for_staff = Column(Boolean, nullable=False)

    @classmethod
    async def create(cls, obj_in: VoucherCreate) -> "Voucher":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: VoucherUpdate) -> "Voucher":
        data = self._import(obj_in)
        return await super().update(**data)


class VoucherCode(BaseAuditDBModel):
    code = Column(String(20), nullable=False)
    used = Column(Integer, nullable=False)
    is_active = Column(Boolean, nullable=False)

    @classmethod
    async def create(cls, obj_in: VoucherCodeCreate) -> "VoucherCode":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: VoucherCodeUpdate) -> "VoucherCode":
        data = self._import(obj_in)
        return await super().update(**data)


class VoucherCustomer(BaseAuditDBModel):
    patient_uid = Column(String, ForeignKey("patient.uid"), nullable=True)
    patient = relationship("Patient", lazy="selectin")
    voucher_code_uid = Column(String, ForeignKey("voucher_code.uid"), nullable=True)
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


class TestBill(BaseAuditDBModel):
    bill_id = Column(String, nullable=False)
    patient_uid = Column(String, ForeignKey("patient.uid"), nullable=True)
    patient = relationship("Patient", lazy="selectin")
    client_uid = Column(String, ForeignKey("client.uid"), nullable=True)
    client = relationship("Client", lazy="selectin")
    is_active = Column(Boolean, nullable=False)
    to_confirm = Column(Boolean, nullable=False)
    partial = Column(Boolean, nullable=False)
    total_charged = Column(Float, nullable=False)
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


class TestBillTransaction(BaseAuditDBModel):
    test_bill_uid = Column(String, ForeignKey("test_bill.uid"), nullable=True)
    test_bill = relationship("TestBill", lazy="selectin")
    kind = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    error = Column(Boolean, nullable=False)
    is_success = Column(Boolean, nullable=False)
    action_required = Column(String, nullable=False)
    processed = Column(Boolean, nullable=False)

    @classmethod
    async def create(cls, obj_in: TestBillTransactionCreate) -> "TestBillTransaction":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: TestBillTransactionUpdate) -> "TestBillTransaction":
        data = self._import(obj_in)
        return await super().update(**data)


class TestBillInvoice(BaseAuditDBModel):
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
