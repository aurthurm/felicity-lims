from datetime import datetime

from sqlalchemy import (Boolean, Column, DateTime, Float, ForeignKey, Integer,
                        LargeBinary, String, Table)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from felicity.apps import Auditable, DBModel
from felicity.apps.billing.config import (DiscountType, DiscountValueType,
                                          TransactionKind)
from felicity.apps.billing.schemas import (AnalysisDiscountCreate,
                                           AnalysisDiscountUpdate,
                                           AnalysisPriceCreate,
                                           AnalysisPriceUpdate,
                                           ProfileDiscountCreate,
                                           ProfileDiscountUpdate,
                                           ProfilePriceCreate,
                                           ProfilePriceUpdate, TestBillCreate,
                                           TestBillInvoiceCreate,
                                           TestBillInvoiceUpdate,
                                           TestBillTransactionCreate,
                                           TestBillTransactionUpdate,
                                           TestBillUpdate, VoucherCodeCreate,
                                           VoucherCodeUpdate, VoucherCreate,
                                           VoucherCustomerCreate,
                                           VoucherCustomerUpdate,
                                           VoucherUpdate)
from felicity.apps.common.models import IdSequence


class AnalysisPrice(Auditable):
    __tablename__ = "analysis_price"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=True)
    analysis = relationship("Analysis", lazy="selectin")
    is_active = Column(Boolean, nullable=False)
    amount = Column(Float, nullable=False)

    @classmethod
    async def create(cls, obj_in: dict | AnalysisPriceCreate) -> "AnalysisPrice":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | AnalysisPriceUpdate) -> "AnalysisPrice":
        data = self._import(obj_in)
        return await super().update(**data)


class ProfilePrice(Auditable):
    __tablename__ = "profile_price"

    profile_uid = Column(String, ForeignKey("profile.uid"), nullable=True)
    profile = relationship("Profile", lazy="selectin")
    is_active = Column(Boolean, nullable=False)
    amount = Column(Float, nullable=False)

    @classmethod
    async def create(cls, obj_in: dict | ProfilePriceCreate) -> "ProfilePrice":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | ProfilePriceUpdate) -> "ProfilePrice":
        data = self._import(obj_in)
        return await super().update(**data)


class AnalysisDiscount(Auditable):
    __tablename__ = "analysis_discount"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=False)
    analysis = relationship("Analysis", lazy="selectin")
    name = Column(String, nullable=False)
    discount_type = Column(String, nullable=False, default=DiscountType.VOUCHER)
    value_type = Column(String, nullable=False, default=DiscountValueType.PERCENTATE)
    start_date = Column(DateTime, nullable=False, default=datetime.now())
    end_date = Column(DateTime, nullable=False, default=datetime.now())
    voucher_uid = Column(String, ForeignKey("voucher.uid"), nullable=True)
    voucher = relationship("Voucher", lazy="selectin")
    value_percent = Column(Float, nullable=True)
    value_amount = Column(Float, nullable=True)
    is_active = Column(Boolean, nullable=False)

    @classmethod
    async def create(cls, obj_in: dict | AnalysisDiscountCreate) -> "AnalysisDiscount":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | AnalysisDiscountUpdate) -> "AnalysisDiscount":
        data = self._import(obj_in)
        return await super().update(**data)


class ProfileDiscount(Auditable):
    __tablename__ = "profile_discount"

    profile_uid = Column(String, ForeignKey("profile.uid"), nullable=False)
    profile = relationship("Profile", lazy="selectin")
    name = Column(String, nullable=False)
    discount_type = Column(String, nullable=False, default=DiscountType.VOUCHER)
    value_type = Column(String, nullable=False, default=DiscountValueType.PERCENTATE)
    start_date = Column(DateTime, nullable=False, default=datetime.now())
    end_date = Column(DateTime, nullable=False, default=datetime.now())
    voucher_uid = Column(String, ForeignKey("voucher.uid"), nullable=True)
    voucher = relationship("Voucher", lazy="selectin")
    value_percent = Column(Float, nullable=True)
    value_amount = Column(Float, nullable=True)
    is_active = Column(Boolean, nullable=False)

    @classmethod
    async def create(cls, obj_in: dict | ProfileDiscountCreate) -> "ProfileDiscount":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | ProfileDiscountUpdate) -> "ProfileDiscount":
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
    async def create(cls, obj_in: dict | VoucherCreate) -> "Voucher":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | VoucherUpdate) -> "Voucher":
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
    async def create(cls, obj_in: dict | VoucherCodeCreate) -> "VoucherCode":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | VoucherCodeUpdate) -> "VoucherCode":
        data = self._import(obj_in)
        return await super().update(**data)


class VoucherCustomer(Auditable):
    __tablename__ = "voucher_customer"

    patient_uid = Column(String, ForeignKey("patient.uid"), nullable=False)
    patient = relationship("Patient", lazy="selectin")
    voucher_code_uid = Column(String, ForeignKey("voucher_code.uid"), nullable=False)
    voucher_code = relationship("VoucherCode", lazy="selectin")

    @classmethod
    async def create(cls, obj_in: dict | VoucherCustomerCreate) -> "VoucherCustomer":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | VoucherCustomerUpdate) -> "VoucherCustomer":
        data = self._import(obj_in)
        return await super().update(**data)


"""
 Many to Many Link between TestBill and AnalysisRequest
"""
test_bill_item = Table(
    "test_bill_item",
    DBModel.metadata,
    Column("test_bill_uid", ForeignKey("test_bill.uid"), primary_key=True),
    Column(
        "analysis_request_uid", ForeignKey("analysis_request.uid"), primary_key=True
    ),
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
    async def create(cls, obj_in: dict | TestBillCreate) -> "TestBill":
        data = cls._import(obj_in)
        data["bill_id"] = (await IdSequence.get_next_number(prefix="X", generic=True))[
            1
        ]
        return await super().create(**data)

    async def update(self, obj_in: dict | TestBillUpdate) -> "TestBill":
        data = self._import(obj_in)
        return await super().update(**data)


class TestBillTransaction(Auditable):
    __tablename__ = "test_bill_transaction"

    test_bill_uid = Column(String, ForeignKey("test_bill.uid"), nullable=True)
    test_bill = relationship("TestBill", lazy="selectin")
    kind = Column(String, nullable=False, default=TransactionKind.CASH)
    amount = Column(Float, nullable=False, default=0.0)
    notes = Column(String, nullable=True)
    is_success = Column(Boolean, nullable=False, default=False)
    processed = Column(Boolean, nullable=False, default=False)
    message = Column(String, nullable=True)
    action_required = Column(Boolean, nullable=False, default=False)
    action_message = Column(String, nullable=True)

    @classmethod
    async def create(
        cls, obj_in: dict | TestBillTransactionCreate
    ) -> "TestBillTransaction":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: dict | TestBillTransactionUpdate
    ) -> "TestBillTransaction":
        data = self._import(obj_in)
        return await super().update(**data)


class TestBillInvoice(Auditable):
    __tablename__ = "test_bill_invoice"

    test_bill_uid = Column(String, ForeignKey("test_bill.uid"), nullable=True)
    test_bill = relationship("TestBill", lazy="selectin")
    json_content: dict = Column(JSONB, nullable=True)
    pdf_content = Column(LargeBinary, nullable=True)

    @classmethod
    async def create(cls, obj_in: dict | TestBillInvoiceCreate) -> "TestBillInvoice":
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(self, obj_in: dict | TestBillInvoiceUpdate) -> "TestBillInvoice":
        data = self._import(obj_in)
        return await super().update(**data)
