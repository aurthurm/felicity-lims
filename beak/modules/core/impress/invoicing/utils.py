from beak.modules.core.analysis.services.analysis import AnalysisRequestService
from beak.modules.core.billing.entities import TestBill, test_bill_item
from beak.modules.core.billing.schemas import TestBillInvoiceCreate
from beak.modules.core.billing.services import (
    TestBillInvoiceService,
    TestBillTransactionService,
    AnalysisPriceService,
    ProfilePriceService,
    TestBillService,
)
from beak.modules.core.common.utils.serializer import marshaller
from beak.modules.core.impress.invoicing.engine import BeakInvoice
from beak.modules.core.iol.minio import MinioClient
from beak.modules.core.iol.minio.enum import MinioBucket
from beak.modules.core.setup.caches import get_laboratory_setting
from beak.core.config import settings
from beak.database.mongo import MongoService, MongoCollection


async def impress_invoice(test_bill: TestBill):
    impress_meta = dict()

    # bill
    impress_meta["bill"] = marshaller(test_bill, depth=1)

    # laboratory
    lab, lab_setting = await get_laboratory_setting()
    impress_meta["laboratory"] = marshaller(lab, depth=1)
    impress_meta["laboratory_settings"] = marshaller(lab_setting, depth=1)

    # customer (resolved from order metadata snapshot when available)
    impress_meta["customer"] = {"uid": test_bill.patient_uid}
    impress_meta["client"] = marshaller(test_bill.client, depth=1)

    # orders
    impress_meta["orders"] = []
    analysis_request_uids = await TestBillService().repository.table_query(
        test_bill_item, ["analysis_request_uid"], test_bill_uid=test_bill.uid
    )
    orders = await AnalysisRequestService().get_by_uids(uids=analysis_request_uids)
    for order in orders:
        if (
            impress_meta["customer"] == {"uid": test_bill.patient_uid}
            and order.metadata_snapshot
            and order.metadata_snapshot.get("patient")
        ):
            impress_meta["customer"] = marshaller(order.metadata_snapshot.get("patient"))
        _order = marshaller(order, depth=1)
        _order["samples"] = []
        for _sample in order.samples:
            _s = marshaller(_sample)
            _s["profiles"] = []
            _s["analyses"] = []
            for _p in _sample.profiles:
                __p = {"name": _p.name, "price": ""}
                p_price = await ProfilePriceService().get(profile_uid=_p.uid)
                if not p_price:
                    continue

                __p["price"] = p_price.amount
                _s["profiles"].append(__p)

            for _a in _sample.analyses:
                __a = {"name": _a.name, "price": ""}
                a_price = await AnalysisPriceService().get(analysis_uid=_a.uid)
                if not a_price:
                    continue

                __a["price"] = a_price.amount
                _s["analyses"].append(__a)

            _order["samples"].append(_s)

        impress_meta["orders"].append(_order)

    # transactions
    transactions = await TestBillTransactionService().get_all(
        test_bill_uid=test_bill.uid
    )
    impress_meta["transactions"] = [marshaller(t, depth=1) for t in transactions]
    pdf = await BeakInvoice().generate(impress_meta)

    in_i = {
        "test_bill_uid": test_bill.uid,
        "pdf_content": pdf,
    }

    if settings.DOCUMENT_STORAGE:
        in_i["json_content"] = impress_meta

    if settings.OBJECT_STORAGE:
        in_i["pdf_content"] = pdf

    sc_in = TestBillInvoiceCreate(**in_i)
    await TestBillInvoiceService().create(sc_in)

    if settings.OBJECT_STORAGE:
        MinioClient().put_object(
            bucket=MinioBucket.INVOICE,
            object_name=f"{test_bill.bill_id}.pdf",
            data=pdf,
            metadata={
                "test_bill_uid": test_bill.uid,
            },
            content_type="application/pdf",
        )

    # Save the json to mongodb
    if settings.DOCUMENT_STORAGE:
        await MongoService().upsert(
            collection_name=MongoCollection.INVOICE,
            uid=test_bill.uid,
            data=impress_meta,
        )

    return pdf
