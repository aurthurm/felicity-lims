# coding: utf-8
import logging

from fpdf import FPDF

from felicity.core.config import get_settings
from felicity.core.dtz import datetime_math, format_datetime, timenow_str
from felicity.utils.helpers import get_from_nested

settings = get_settings()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class PDF(FPDF):
    def footer(self):
        # Position cursor at 1.5 cm from bottom:
        self.set_y(-15)
        # Setting font: helvetica italic 8
        self.set_font("helvetica", "I", 8)
        # Printing page number:
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")


class FelicityInvoice:
    def __init__(self):
        self.logo_path = settings.BASE_DIR + "/assets/logo.png"
        self.pdf = PDF(orientation="P", unit="mm", format="A4")
        self.pdf.set_font("helvetica", "", 13)
        self.pdf.set_page_background((255, 255, 255))
        self.pdf_w = 210
        self.pdf_h = 297
        self.margin_top = 20
        self.margin_left = 10
        self.y_diff = 5  # space between rows

    async def _make(self, meta):
        bill = get_from_nested(meta, "bill")
        laboratory = get_from_nested(meta, "laboratory")
        laboratory_settings = get_from_nested(meta, "laboratory_settings")
        customer = get_from_nested(meta, "customer")
        client = get_from_nested(meta, "client")
        orders = get_from_nested(meta, "orders")
        transactions = get_from_nested(meta, "transactions")

        self.pdf.add_page()

        # Page Border
        self.pdf.set_line_width(0.0)
        self.pdf.rect(15.0, 15.0, 170.0, 245.0)

        # Logo
        self.pdf.image(self.logo_path, 20.0, 16.0, link="", type="", w=20.0, h=20.0)

        # Barcode
        bill_id = get_from_nested(bill, "bill_id")
        self.pdf.code39(bill_id, x=20, y=42, w=1, h=5)
        self.pdf.set_font("arial", "", 8)
        self.pdf.set_xy(20.0, 47)
        self.pdf.cell(ln=0, h=5, align="L", w=10.0, text=bill_id, border=0)

        # Invoice Box
        self.pdf.set_line_width(0.0)
        self.pdf.rect(85.0, 15.0, 30.0, 10.0)

        # Invoice
        self.pdf.set_font("arial", "B", 16)
        self.pdf.set_xy(95.0, 18.0)
        self.pdf.cell(ln=0, h=2.0, align="C", w=10.0, text="INVOICE", border=0)
        self.pdf.set_font("arial", "", 8)
        self.pdf.set_xy(63.0, 21.0)
        self.pdf.cell(ln=0, h=4.0, align="C", w=75.0, text="- original -", border=0)

        # invoice Details
        self.pdf.set_font("arial", "B", 12)
        self.pdf.set_xy(135.0, 25)
        self.pdf.cell(ln=0, h=5.5, align="R", w=10.0, text="Invoice #: ", border=0)
        self.pdf.set_font("arial", "", 12)
        self.pdf.set_xy(170.0, 23)
        self.pdf.cell(ln=0, h=9.5, align="R", w=10.0, text=bill_id, border=0)
        # ---inst_in
        self.pdf.set_font("arial", "B", 12)
        self.pdf.set_xy(135.0, 30)
        self.pdf.cell(ln=0, h=5.5, align="R", w=10.0, text="Invoice Date: ", border=0)
        self.pdf.set_font("arial", "", 12)
        self.pdf.set_xy(170.0, 28)
        self.pdf.cell(ln=0, h=9.5, align="R", w=10.0, text=timenow_str(), border=0)
        # ---
        bill_created = get_from_nested(bill, "created_at")
        self.pdf.set_font("arial", "B", 12)
        self.pdf.set_xy(135.0, 35)
        self.pdf.cell(ln=0, h=5.5, align="R", w=10.0, text="Billed on: ", border=0)
        self.pdf.set_font("arial", "", 12)
        self.pdf.set_xy(170.0, 33)
        self.pdf.cell(ln=0, h=9.5, align="R", w=10.0, text=format_datetime(bill_created), border=0)
        # ---
        terms_days = int(get_from_nested(laboratory_settings, "payment_terms_days"))
        days = "Immediate"
        due_date = bill_created
        if terms_days > 0:
            days = f"{terms_days} days"
            _delta_datetime = datetime_math(bill_created, terms_days, addition=True)
            due_date = format_datetime(_delta_datetime)

        self.pdf.set_font("arial", "B", 12)
        self.pdf.set_xy(135.0, 40)
        self.pdf.cell(ln=0, h=5.5, align="R", w=10.0, text="Payment Terms: ", border=0)
        self.pdf.set_font("arial", "", 12)
        self.pdf.set_xy(170.0, 38)
        self.pdf.cell(ln=0, h=9.5, align="R", w=10.0, text=days, border=0)
        # ---
        self.pdf.set_font("arial", "B", 12)
        self.pdf.set_xy(135.0, 45)
        self.pdf.cell(ln=0, h=5.5, align="R", w=10.0, text="Due Date: ", border=0)
        self.pdf.set_font("arial", "", 12)
        self.pdf.set_xy(170.0, 43)
        self.pdf.cell(ln=0, h=9.5, align="R", w=10.0, text=format_datetime(due_date), border=0)

        self.pdf.set_line_width(0.0)
        self.pdf.line(20.0, 53.0, 180.0, 53.0)

        # Customer Details
        full_name = (
                get_from_nested(customer, "first_name")
                + " "
                + get_from_nested(customer, "last_name")
        )
        self.pdf.set_font("arial", "B", 14)
        self.pdf.set_xy(20, 55)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Bill to: ", border=0)
        # ---
        self.pdf.set_font("arial", "B", 12)
        self.pdf.set_xy(20, 60)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Full Name: ", border=0)
        self.pdf.set_font("arial", "", 12)
        self.pdf.set_xy(45, 58)
        self.pdf.cell(ln=0, h=9.5, align="L", w=20.0, text=full_name, border=0)
        # ---
        self.pdf.set_font("arial", "B", 12)
        self.pdf.set_xy(20, 65)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Client: ", border=0)
        self.pdf.set_font("arial", "", 12)
        self.pdf.set_xy(45, 63)
        self.pdf.cell(
            ln=0,
            h=9.5,
            align="L",
            w=10.0,
            text=get_from_nested(client, "name"),
            border=0,
        )

        self.pdf.set_line_width(0.0)
        self.pdf.line(20.0, 72.0, 180.0, 72.0)

        # Order Details
        oy = 75
        self.pdf.set_font("arial", "B", 12)
        self.pdf.set_xy(20, oy)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Order Details: ", border=0)
        # ---
        oy += 5
        self.pdf.set_font("arial", "B", 10)
        self.pdf.set_xy(20, oy)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Quantity", border=0)
        self.pdf.set_xy(45, oy)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Details", border=0)
        self.pdf.set_xy(130, oy)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Unit Price", border=0)
        self.pdf.set_xy(150, oy)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Sub-Total", border=0)
        # ---
        for order in orders:
            for sample in get_from_nested(order, "samples"):
                x = 0
                for profile in get_from_nested(sample, "profiles"):
                    oy += 5 if x == 0 else 3
                    self.pdf.set_font("helvetica", "I", 8)
                    self.pdf.set_xy(20, oy)
                    self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="1 x", border=0)
                    self.pdf.set_xy(45, oy)
                    self.pdf.cell(
                        ln=0,
                        h=5.5,
                        align="L",
                        w=10.0,
                        text=get_from_nested(profile, "name"),
                        border=0,
                    )
                    self.pdf.set_xy(130, oy)
                    self.pdf.cell(
                        ln=0,
                        h=5.5,
                        align="L",
                        w=10.0,
                        text="$" + str(get_from_nested(profile, "price")),
                        border=0,
                    )
                    self.pdf.set_xy(150, oy)
                    self.pdf.cell(
                        ln=0,
                        h=5.5,
                        align="L",
                        w=10.0,
                        text="$" + str(get_from_nested(profile, "price")),
                        border=0,
                    )
                for analysis in get_from_nested(sample, "analyses"):
                    oy += 5 if x == 0 else 3
                    self.pdf.set_font("helvetica", "I", 8)
                    self.pdf.set_xy(20, oy)
                    self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="1 x", border=0)
                    self.pdf.set_xy(45, oy)
                    self.pdf.cell(
                        ln=0,
                        h=5.5,
                        align="L",
                        w=10.0,
                        text=get_from_nested(analysis, "name"),
                        border=0,
                    )
                    self.pdf.set_xy(130, oy)
                    self.pdf.cell(
                        ln=0,
                        h=5.5,
                        align="L",
                        w=10.0,
                        text="$" + str(get_from_nested(analysis, "price")),
                        border=0,
                    )
                    self.pdf.set_xy(150, oy)
                    self.pdf.cell(
                        ln=0,
                        h=5.5,
                        align="L",
                        w=10.0,
                        text="$" + str(get_from_nested(analysis, "price")),
                        border=0,
                    )

        # ---
        total_charged = float(get_from_nested(bill, "total_charged"))
        oy += 5
        self.pdf.set_font("arial", "B", 10)
        self.pdf.set_xy(120, oy)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Total Charged:", border=0)
        self.pdf.set_xy(150, oy)
        self.pdf.cell(
            ln=0, h=5.5, align="L", w=10.0, text="$" + str(total_charged), border=0
        )

        oy += 8
        self.pdf.set_line_width(0.0)
        self.pdf.line(20.0, oy, 180.0, oy)

        # Transaction Details
        ty = oy + 2
        self.pdf.set_font("arial", "B", 12)
        self.pdf.set_xy(20, ty)
        self.pdf.cell(
            ln=0, h=5.5, align="L", w=10.0, text="Transaction Details: ", border=0
        )
        ty += 5
        # ---
        self.pdf.set_font("arial", "B", 10)
        self.pdf.set_xy(20, ty)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Date", border=0)
        self.pdf.set_xy(70, ty)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Kind", border=0)
        self.pdf.set_xy(150, ty)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Amount", border=0)
        # ---
        x = 0
        for transaction in transactions:
            ty += 5 if x == 0 else 3
            self.pdf.set_font("helvetica", "I", 8)
            self.pdf.set_xy(20, ty)
            self.pdf.cell(
                ln=0,
                h=5.5,
                align="L",
                w=10.0,
                text=format_datetime(get_from_nested(transaction, "created_at")),
                border=0,
            )
            self.pdf.set_xy(70, ty)
            self.pdf.cell(
                ln=0,
                h=5.5,
                align="L",
                w=10.0,
                text=get_from_nested(transaction, "kind"),
                border=0,
            )
            self.pdf.set_xy(150, ty)
            self.pdf.cell(
                ln=0,
                h=5.5,
                align="L",
                w=10.0,
                text="$" + str(round(float(get_from_nested(transaction, "amount")), 2)),
                border=0,
            )

        # ---
        total_paid = float(get_from_nested(bill, "total_paid"))
        ty += 5
        self.pdf.set_font("arial", "B", 10)
        self.pdf.set_xy(130, ty)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Total Paid:", border=0)
        self.pdf.set_xy(150, ty)
        self.pdf.cell(
            ln=0, h=5.5, align="L", w=10.0, text="$" + str(round(float(total_paid), 2)), border=0
        )

        ty += 8
        self.pdf.set_line_width(0.0)
        self.pdf.line(20.0, ty, 180.0, ty)

        # Balance Remaining
        br = ty + 2
        self.pdf.set_font("arial", "B", 14)
        self.pdf.set_xy(20, br)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Balance Due: ", border=0)
        self.pdf.set_xy(150, br)
        self.pdf.cell(
            ln=0,
            h=5.5,
            align="L",
            w=10.0,
            text="$" + str(round(total_charged - total_paid, 2)),
            border=0,
        )

        # Footer
        self.pdf.set_line_width(0.0)
        self.pdf.line(20.0, 220.0, 180.0, 220.0)
        # ---
        self.pdf.set_font("arial", "B", 14)
        self.pdf.set_xy(20, 225)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Our Location", border=0)
        self.pdf.set_font("arial", "", 10)
        self.pdf.set_xy(20, 231)
        self.pdf.cell(
            ln=0,
            h=5.5,
            align="L",
            w=10.0,
            text=get_from_nested(laboratory, "lab_name"),
            border=0,
        )
        self.pdf.set_xy(20, 236)
        self.pdf.multi_cell(40.0, 3.5, get_from_nested(laboratory, "address"))
        # ---
        self.pdf.set_font("arial", "B", 14)
        self.pdf.set_xy(80, 225)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Get in touch", border=0)
        self.pdf.set_font("arial", "", 10)
        self.pdf.set_xy(80, 231)
        self.pdf.cell(
            ln=0,
            h=5.5,
            align="L",
            w=10.0,
            text="Email: " + get_from_nested(laboratory, "email"),
            border=0,
        )
        self.pdf.set_xy(80, 235)
        self.pdf.cell(
            ln=0,
            h=5.5,
            align="L",
            w=10.0,
            text="Call: " + get_from_nested(laboratory, "business_phone"),
            border=0,
        )
        self.pdf.set_xy(80, 239)
        self.pdf.cell(
            ln=0,
            h=5.5,
            align="L",
            w=10.0,
            text="Whatsapp: " + get_from_nested(laboratory, "mobile_phone"),
            border=0,
        )
        # ---
        self.pdf.set_font("arial", "B", 14)
        self.pdf.set_xy(140, 225)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Payment Details", border=0)
        self.pdf.set_font("arial", "", 10)
        self.pdf.set_xy(140, 231)
        self.pdf.multi_cell(40.0, 3.5, get_from_nested(laboratory, "banking"))

        # --- Quality Statement
        self.pdf.set_line_width(0.0)
        self.pdf.line(30.0, 251.0, 170.0, 251.0)
        # ---
        self.pdf.set_font("arial", "I", 10)
        self.pdf.set_xy(20, 253)
        self.pdf.cell(
            w=150.0,
            h=5.5,
            text=get_from_nested(laboratory, "quality_statement"),
            border=0,
            ln=0,
            align="C",
        )
        #
        return self.pdf

    async def generate(self, bill: dict):
        pdf = await self._make(bill)
        return pdf.output()
