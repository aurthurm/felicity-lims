from datetime import datetime
from typing import List, Optional

import sqlalchemy as sa
import strawberry  # noqa
from strawberry.permission import PermissionExtension

from felicity.api.gql.analysis.types import AnalysisRequestType
from felicity.api.gql.billing import types
from felicity.api.gql.permissions import IsAuthenticated, HasPermission
from felicity.api.gql.types import BytesScalar, PageInfo
from felicity.apps.billing.services import (
    AnalysisDiscountService,
    AnalysisPriceService,
    ProfileDiscountService,
    ProfilePriceService,
    TestBillInvoiceService,
    TestBillService,
    TestBillTransactionService,
    VoucherCodeService,
    VoucherService,
)
from felicity.apps.guard import FAction, FObject
from felicity.apps.impress.invoicing.utils import impress_invoice
from felicity.utils import has_value_or_is_truthy


@strawberry.type
class BillingQuery:
    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def search_bills(
        self,
        info,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        is_active: bool | None = None,
        partial: bool | None = None,
        client_uid: str | None = None,
        sort_by: list[str] | None = None,
    ) -> types.TestBillCursorPage:
        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                "bill_id__ilike",
                "client___name__ilike",
                "orders___request_id__ilike",
                "orders___client_request_id__ilike",
                "orders___samples___sample_id__ilike",
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        if client_uid:
            filters.append({"analysis_request___client_uid__exact": client_uid})

        if has_value_or_is_truthy(is_active):
            filters.append({"is_active": is_active})

        if has_value_or_is_truthy(partial):
            filters.append({"partial": partial})

        page = await TestBillService().paging_filter(
            page_size=page_size,
            after_cursor=after_cursor,
            before_cursor=before_cursor,
            filters=filters,
            sort_by=sort_by,
        )

        total_count: int = page.total_count
        edges: List[types.TestBillEdge[types.TestBillType]] = page.edges
        items: List[types.TestBillType] = page.items
        page_info: PageInfo = page.page_info

        return types.TestBillCursorPage(
            total_count=total_count, edges=edges, items=items, page_info=page_info
        )

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def orders_by_bill_uid(self, info, uid: str) -> list[AnalysisRequestType]:
        bill = await TestBillService().get(uid=uid, is_active=True, related=["orders"])
        return bill.orders if hasattr(bill, "orders") else []

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def bill_by_uid(self, info, uid: str) -> Optional[types.TestBillType]:
        return await TestBillService().get(uid=uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def bills_for_patient(
        self, info, patient_uid: str
    ) -> Optional[list[types.TestBillType]]:
        bills = await TestBillService().get_all(patient_uid=patient_uid)
        return sorted(bills, key=lambda b: b.uid, reverse=True)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def bills_for_client(
        self, info, client_uid: str
    ) -> Optional[list[types.TestBillType]]:
        bills = await TestBillService().get_all(client_uid=client_uid)
        return sorted(bills, key=lambda b: b.uid, reverse=True)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def bill_transactions(
        self, info, bill_uid: str
    ) -> Optional[list[types.TestBillTransactionType]]:
        transactions = await TestBillTransactionService().get_all(
            test_bill_uid=bill_uid
        )
        return sorted(transactions, key=lambda t: t.uid, reverse=True)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def bill_invoices(
        self, info, bill_uid: str
    ) -> Optional[list[types.TestBillInvoiceType]]:
        return await TestBillInvoiceService().get(test_bill_uid=bill_uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def bill_invoice(
        self, info, invoice_uid: str
    ) -> Optional[types.TestBillInvoiceType]:
        return await TestBillInvoiceService().get(uid=invoice_uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def bill_invoice_create(self, info, bill_uid: str) -> BytesScalar | None:
        bill = await TestBillService().get(uid=bill_uid)
        return await impress_invoice(bill)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def price_for_profile(
        self, info, profile_uid: str
    ) -> Optional[types.ProfilePriceType]:
        return await ProfilePriceService().get(profile_uid=profile_uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def price_for_analysis(
        self, info, analysis_uid: str
    ) -> Optional[types.AnalysisPriceType]:
        return await AnalysisPriceService().get(analysis_uid=analysis_uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def prices_for_batch(
        self,
        info,
        profile_uids: list[str],
        analysis_uids: list[str],
    ) -> types.BatchPricesType:
        """Batch fetch prices for multiple profiles and analyses in one request"""
        profile_prices = []
        analysis_prices = []

        # Fetch all profile prices if profile UIDs provided
        if profile_uids:
            profile_prices = await ProfilePriceService().get_all(
                profile_uid__in=profile_uids, is_active=True
            )

        # Fetch all analysis prices if analysis UIDs provided
        if analysis_uids:
            analysis_prices = await AnalysisPriceService().get_all(
                analysis_uid__in=analysis_uids, is_active=True
            )

        return types.BatchPricesType(
            profile_prices=profile_prices or [],
            analysis_prices=analysis_prices or [],
        )

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def discount_for_profile(
        self, info, profile_uid: str
    ) -> Optional[types.ProfileDiscountType]:
        return await ProfileDiscountService().get(profile_uid=profile_uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def discount_for_analysis(
        self, info, analysis_uid: str
    ) -> Optional[types.AnalysisDiscountType]:
        return await AnalysisDiscountService().get(analysis_uid=analysis_uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def voucher_all(self, info) -> Optional[list[types.VoucherType]]:
        return await VoucherService().all()

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def voucher_by_uid(self, info, uid: str) -> Optional[types.VoucherType]:
        return await VoucherService().get(uid=uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def voucher_codes(
        self, info, voucher_uid: str
    ) -> Optional[list[types.VoucherCodeType]]:
        return await VoucherCodeService().get_all(voucher_uid=voucher_uid)

    @strawberry.field(
        extensions=[
            PermissionExtension(
                permissions=[
                    IsAuthenticated(),
                    HasPermission(FAction.READ, FObject.BILLING),
                ]
            )
        ]
    )
    async def billing_overview_metrics(
        self,
        info,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> types.BillingOverviewMetrics:
        """Get complete billing overview metrics with optional date range filtering"""
        bill_service = TestBillService()
        voucher_service = VoucherService()

        # Get all metrics with optional date range
        key_metrics_data = await bill_service.get_key_metrics(
            start_date=start_date, end_date=end_date
        )
        volume_metrics_data = await bill_service.get_volume_metrics(
            start_date=start_date, end_date=end_date
        )
        transaction_metrics_data = await bill_service.get_transaction_metrics(
            start_date=start_date, end_date=end_date
        )
        discount_metrics_data = await voucher_service.get_discount_metrics(
            start_date=start_date, end_date=end_date
        )

        # Create metric objects
        key_metrics = types.KeyMetrics(
            total_charged=float(key_metrics_data["total_charged"]),
            total_paid=float(key_metrics_data["total_paid"]),
            outstanding_balance=float(key_metrics_data["outstanding_balance"]),
            collection_rate=round(key_metrics_data["collection_rate"], 2),
        )

        volume_metrics = types.VolumeMetrics(
            active_bills=volume_metrics_data["active_bills"],
            inactive_bills=volume_metrics_data["inactive_bills"],
            pending_confirmation=volume_metrics_data["pending_confirmation"],
            partial_bills=volume_metrics_data["partial_bills"],
            complete_bills=volume_metrics_data["complete_bills"],
        )

        transaction_metrics = types.TransactionMetrics(
            successful_transactions=transaction_metrics_data["successful_transactions"],
            failed_transactions=transaction_metrics_data["failed_transactions"],
            pending_transactions=transaction_metrics_data["pending_transactions"],
            total_transaction_amount=float(
                transaction_metrics_data["total_transaction_amount"]
            ),
        )

        discount_metrics = types.DiscountMetrics(
            total_discount_amount=float(discount_metrics_data["total_discount_amount"]),
            active_vouchers=discount_metrics_data["active_vouchers"],
            total_vouchers=discount_metrics_data["total_vouchers"],
            voucher_redemption_rate=round(
                discount_metrics_data["voucher_redemption_rate"], 2
            ),
            vouchers_with_available_usage=discount_metrics_data[
                "vouchers_with_available_usage"
            ],
        )

        return types.BillingOverviewMetrics(
            key_metrics=key_metrics,
            volume_metrics=volume_metrics,
            transaction_metrics=transaction_metrics,
            discount_metrics=discount_metrics,
        )
