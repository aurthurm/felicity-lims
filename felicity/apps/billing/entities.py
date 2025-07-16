from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    LargeBinary,
    String,
    Table,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from felicity.apps.abstract import LabScopedEntity
from felicity.apps.billing.enum import DiscountType, DiscountValueType, TransactionKind
from felicity.core.dtz import timenow_dt


class AnalysisPrice(LabScopedEntity):
    __tablename__ = "analysis_price"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=True)
    analysis = relationship("Analysis", lazy="selectin")
    is_active = Column(Boolean, nullable=False)
    amount = Column(Float, nullable=False)


class ProfilePrice(LabScopedEntity):
    __tablename__ = "profile_price"

    profile_uid = Column(String, ForeignKey("profile.uid"), nullable=True)
    profile = relationship("Profile", lazy="selectin")
    is_active = Column(Boolean, nullable=False)
    amount = Column(Float, nullable=False)


class AnalysisDiscount(LabScopedEntity):
    __tablename__ = "analysis_discount"

    analysis_uid = Column(String, ForeignKey("analysis.uid"), nullable=False)
    analysis = relationship("Analysis", lazy="selectin")
    name = Column(String, nullable=False)
    discount_type = Column(String, nullable=False, default=DiscountType.VOUCHER)
    value_type = Column(String, nullable=False, default=DiscountValueType.PERCENTAGE)
    start_date = Column(DateTime, nullable=False, default=timenow_dt())
    end_date = Column(DateTime, nullable=False, default=timenow_dt())
    voucher_uid = Column(String, ForeignKey("voucher.uid"), nullable=True)
    voucher = relationship("Voucher", lazy="selectin")
    value_percent = Column(Float, nullable=True)
    value_amount = Column(Float, nullable=True)
    is_active = Column(Boolean, nullable=False)


class ProfileDiscount(LabScopedEntity):
    __tablename__ = "profile_discount"

    profile_uid = Column(String, ForeignKey("profile.uid"), nullable=False)
    profile = relationship("Profile", lazy="selectin")
    name = Column(String, nullable=False)
    discount_type = Column(String, nullable=False, default=DiscountType.VOUCHER)
    value_type = Column(String, nullable=False, default=DiscountValueType.PERCENTAGE)
    start_date = Column(DateTime, nullable=False, default=timenow_dt())
    end_date = Column(DateTime, nullable=False, default=timenow_dt())
    voucher_uid = Column(String, ForeignKey("voucher.uid"), nullable=True)
    voucher = relationship("Voucher", lazy="selectin")
    value_percent = Column(Float, nullable=True)
    value_amount = Column(Float, nullable=True)
    is_active = Column(Boolean, nullable=False)


class Voucher(LabScopedEntity):
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


class VoucherCode(LabScopedEntity):
    __tablename__ = "voucher_code"

    code = Column(String(20), nullable=False, unique=True)
    voucher_uid = Column(String, ForeignKey("voucher.uid"), nullable=False)
    voucher = relationship("Voucher", lazy="selectin")
    # The number of times a voucher code can be used.
    usage_limit = Column(Integer, nullable=False, default=0)
    # Usage count of the voucher code.
    used = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False)


class VoucherCustomer(LabScopedEntity):
    __tablename__ = "voucher_customer"

    patient_uid = Column(String, ForeignKey("patient.uid"), nullable=False)
    patient = relationship("Patient", lazy="selectin")
    voucher_code_uid = Column(String, ForeignKey("voucher_code.uid"), nullable=False)
    voucher_code = relationship("VoucherCode", lazy="selectin")


"""
 Many to Many Link between TestBill and AnalysisRequest
"""
test_bill_item = Table(
    "test_bill_item",
    LabScopedEntity.metadata,
    Column("laboratory_uid", ForeignKey("laboratory.uid"), primary_key=True),
    Column("test_bill_uid", ForeignKey("test_bill.uid"), primary_key=True),
    Column(
        "analysis_request_uid", ForeignKey("analysis_request.uid"), primary_key=True
    ),
)


class TestBill(LabScopedEntity):
    __tablename__ = "test_bill"

    bill_id = Column(String, index=True, unique=True, nullable=False)
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


class TestBillTransaction(LabScopedEntity):
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


class TestBillInvoice(LabScopedEntity):
    __tablename__ = "test_bill_invoice"

    test_bill_uid = Column(String, ForeignKey("test_bill.uid"), nullable=True)
    test_bill = relationship("TestBill", lazy="selectin")
    json_content: dict = Column(JSONB, nullable=True)
    pdf_content = Column(LargeBinary, nullable=True)
