from apps.analysis.models.analysis import AnalysisRequest
from apps.billing.models import TestBill, test_bill_item, TestBillTransaction, ProfilePrice, AnalysisPrice, \
    TestBillInvoice
from apps.billing.schemas import TestBillInvoiceCreate
from apps.impress.invoicing.engine import FelicityInvoice
from apps.setup.caches import get_laboratory_setting

invoicer = FelicityInvoice()


async def impress_invoice(test_bill: TestBill):
    print("invicing")
    impress_meta = dict()

    # bill
    impress_meta["bill"] = test_bill.marshal_simple()

    # laboratory
    lab, lab_setting = await get_laboratory_setting()
    impress_meta["laboratory"] = lab.marshal_simple()
    impress_meta["laboratory_settings"] = lab_setting.marshal_simple()

    # customer
    impress_meta["customer"] = test_bill.patient.marshal_simple()
    impress_meta["client"] = test_bill.client.marshal_simple()

    # orders
    impress_meta["orders"] = []
    analysis_request_uids = await TestBill.query_table(
        test_bill_item, ["analysis_request_uid"], test_bill_uid=test_bill.uid
    )
    orders = await AnalysisRequest.get_by_uids(uids=analysis_request_uids)
    for order in orders:
        _order = order.marshal_simple()
        _order["samples"] = []
        for _sample in order.samples:
            _s = _sample.marshal_simple()
            _s["profiles"] = []
            _s["analyses"] = []
            for _p in _sample.profiles:
                __p = {"name": _p.name, "price": ""}
                p_price = await ProfilePrice.get(profile_uid=_p.uid)
                if not p_price:
                    continue

                __p["price"] = p_price.amount
                _s["profiles"].append(__p)

            for _a in _sample.analyses:
                __a = {"name": _a.name, "price": ""}
                a_price = await AnalysisPrice.get(analysis_uid=_a.uid)
                if not a_price:
                    continue

                __a["price"] = a_price.amount
                _s["analyses"].append(__a)

            _order["samples"].append(_s)

        impress_meta["orders"].append(_order)

    # transactions
    transactions = await TestBillTransaction.get_all(test_bill_uid=test_bill.uid)
    impress_meta["transactions"] = [t.marshal_simple() for t in transactions]
    pdf = await invoicer.generate(impress_meta)

    sc_in = TestBillInvoiceCreate(
        **{
            "v": test_bill.uid,
            "json_content": impress_meta,
            "pdf_content": pdf,
        }
    )
    await TestBillInvoice.create(sc_in)

    return pdf
