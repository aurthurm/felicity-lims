from typing import List, Optional

import sqlalchemy as sa
import strawberry  # noqa
from api.gql.types import PageInfo
from api.gql.billing import types
from api.gql.permissions import IsAuthenticated
from apps.billing import models
from utils import has_value_or_is_truthy


@strawberry.type
class BillingQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def bills(
        self,
        info,
        page_size: int | None = None,
        after_cursor: str | None = None,
        before_cursor: str | None = None,
        text: str | None = None,
        is_active: str | None = None,
        partial: str | None = None,
        client_uid: str | None = None,
        sort_by: list[str] | None = None,
    ) -> types.TestBillCursorPage:
        filters = []

        _or_text_ = {}
        if has_value_or_is_truthy(text):
            arg_list = [
                "bill_id__ilike",
                "patient___first_name__ilike",
                "patient___last_name__ilike",
                "patient___client_patient_id__ilike",
            ]
            for _arg in arg_list:
                _or_text_[_arg] = f"%{text}%"

            text_filters = {sa.or_: _or_text_}
            filters.append(text_filters)

        if client_uid:
            filters.append({"analysis_request___client_uid__exact": client_uid})

        filters.append({"is_active": is_active})
        filters.append({"partial": partial})

        page = await models.TestBill.paginate_with_cursors(
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

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def bill_by_uid(self, info, uid: str) -> Optional[types.TestBillType]:
        return await models.TestBill.get(uid=uid)
    
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def bills_for_patient(self, info, patient_uid: str) -> Optional[list[types.TestBillType]]:
        return await models.TestBill.get_all(patient_uid=patient_uid)
    
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def bills_for_client(self, info, client_uid: str) -> Optional[list[types.TestBillType]]:
        return await models.TestBill.get_all(client_uid=client_uid)
    
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def bill_transactions(self, info, bill_uid: str) -> Optional[list[types.TestBillTransactionType]]:
        return await models.TestBillTransaction.get_all(test_bill_uid=bill_uid)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def bill_invoices(self, info, bill_uid: str) -> Optional[list[types.TestBillInvoiceType]]:
        return await models.TestBillInvoice.get(test_bill_uid=bill_uid)

    async def bill_invoice(self, info, invoice_uid: str) -> Optional[types.TestBillInvoiceType]:
        return  await models.TestBillInvoice.get(uid=invoice_uid)

    async def price_for_profile(self, info, profile_uid: str) -> Optional[types.ProfilePriceType]:
        return  await models.ProfilePrice.get(profile_uid=profile_uid)

    async def price_for_analysis(self, info, analysis_uid: str) -> Optional[types.AnalysisPriceType]:
        return  await models.AnalysisPrice.get(analysis_uid=analysis_uid)

    async def discount_for_profile(self, info, profile_uid: str) -> Optional[types.ProfileDiscountType]:
        return  await models.ProfileDiscount.get(profile_uid=profile_uid)

    async def discount_for_analysis(self, info, analysis_uid: str) -> Optional[types.AnalysisDiscountType]:
        return  await models.AnalysisDiscount.get(analysis_uid=analysis_uid)

