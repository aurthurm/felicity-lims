from apps.analysis.models.analysis import AnalysisRequest
from apps.billing.invoicing.generic import FelicityInvoice
from apps.billing.models import TestBill, test_bill_item, TestBillTransaction, ProfilePrice, AnalysisPrice
from apps.setup.models.setup import Laboratory

invoicer = FelicityInvoice()


async def generate_invoice(test_bill: TestBill):
    impress_meta = dict()

    # bill
    impress_meta["bill"] = test_bill.marshal_simple()

    # laboratory
    lab = await Laboratory.get_by_setup_name()
    impress_meta["laboratory"] = lab.marshal_simple()

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

    # sc_in = ReportImpressCreate(
    #     **{
    #         "state": report_state,
    #         "sample_uid": sample.uid,
    #         "json_content": impress_meta,
    #         "pdf_content": sample_pdf,
    #         "email_required": False,
    #         "email_sent": False,
    #         "sms_required": False,
    #         "sms_sent": False,
    #         "generated_by_uid": user.uid,
    #         "date_generated": datetime.now(),
    #     }
    # )
    # await ReportImpress.create(sc_in)

    return pdf
