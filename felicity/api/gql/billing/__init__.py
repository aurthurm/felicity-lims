from .types import (AnalysisDiscountType, AnalysisPriceType,
                    ProfileDiscountType, ProfilePriceType, TestBillCursorPage,
                    TestBillEdge, TestBillInvoiceType, TestBillTransactionType,
                    TestBillType, VoucherCodeType, VoucherCustomerType,
                    VoucherType)

billing_types = [
    AnalysisPriceType,
    ProfilePriceType,
    AnalysisDiscountType,
    ProfileDiscountType,
    VoucherType,
    VoucherCodeType,
    VoucherCustomerType,
    TestBillType,
    TestBillEdge,
    TestBillCursorPage,
    TestBillTransactionType,
    TestBillInvoiceType,
]
