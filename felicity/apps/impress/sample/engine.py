# coding: utf-8
import logging
import os
from io import BytesIO
from tempfile import NamedTemporaryFile

from barcode import Code128
from barcode.writer import ImageWriter
from fpdf import FPDF

from felicity.apps.analysis.enum import ResultState
from felicity.apps.impress.sample.helpers import get_report_user
from felicity.core.config import get_settings
from felicity.core.dtz import timenow_str, format_datetime
from felicity.utils.helpers import get_from_nested, strtobool

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


class FelicityImpress:
    def __init__(self):
        self.logo_path = settings.BASE_DIR + "/assets/logo.png"
        self.pdf = PDF(orientation="P", unit="mm", format="A4")
        self.pdf.set_font("Helvetica")
        self.pdf.set_page_background((255, 255, 255))
        self.pdf_w = 210
        self.pdf_h = 297
        self.margin_top = 20
        self.margin_left = 20
        self.y_diff = 5  # space between rows

    async def _make(self, sample: dict, report_state):
        laboratory = get_from_nested(sample, "laboratory")

        profiles = [
            get_from_nested(p, "name") for p in get_from_nested(sample, "profiles")
        ]
        analyses = [
            get_from_nested(p, "name") for p in get_from_nested(sample, "analyses")
        ]
        #
        sampe_id = get_from_nested(sample, "sample_id")
        self.pdf.add_page()
        self.pdf.set_font("helvetica", "", 12)

        # Page Border
        self.pdf.set_line_width(0.0)
        self.pdf.rect(15.0, 15.0, 170.0, 245.0)

        # Logo
        self.pdf.image(self.logo_path, 20.0, 16.0, link="", type="", w=15.0, h=15.0)
        # Lab Details
        self.pdf.set_font("helvetica", "B", 12)
        self.pdf.set_xy(40.0, 16)
        self.pdf.cell(
            ln=0,
            h=5.5,
            align="L",
            w=10.0,
            text=get_from_nested(laboratory, "name"),
            border=0,
        )
        self.pdf.set_font("helvetica", "I", 8)
        self.pdf.set_xy(40.0, 22)
        self.pdf.multi_cell(40.0, 3.5, get_from_nested(laboratory, "address"))
        # Contact Details
        self.pdf.set_font("helvetica", "B", 6)
        self.pdf.set_xy(140.0, 15)
        self.pdf.cell(ln=0, h=5.5, align="R", w=10.0, text="Call: ", border=0)
        self.pdf.set_font("helvetica", "I", 6)
        self.pdf.set_xy(150.0, 13)
        self.pdf.cell(
            ln=0,
            h=9.5,
            align="L",
            w=10.0,
            text=get_from_nested(laboratory, "business_phone"),
            border=0,
        )
        # ---
        self.pdf.set_font("helvetica", "B", 6)
        self.pdf.set_xy(140.0, 17)
        self.pdf.cell(ln=0, h=5.5, align="R", w=10.0, text="Whatsapp: ", border=0)
        self.pdf.set_font("helvetica", "I", 6)
        self.pdf.set_xy(150.0, 15)
        self.pdf.cell(
            ln=0,
            h=9.5,
            align="L",
            w=10.0,
            text=get_from_nested(laboratory, "mobile_phone"),
            border=0,
        )
        # ---
        self.pdf.set_font("helvetica", "B", 6)
        self.pdf.set_xy(140.0, 19)
        self.pdf.cell(ln=0, h=5.5, align="R", w=10.0, text="Email: ", border=0)
        self.pdf.set_font("helvetica", "I", 6)
        self.pdf.set_xy(150.0, 17)
        self.pdf.cell(
            ln=0,
            h=9.5,
            align="L",
            w=10.0,
            text=get_from_nested(laboratory, "email"),
            border=0,
        )
        # Report BarCode
        svg_img_bytes = BytesIO()
        Code128(sampe_id, writer=ImageWriter()).write(
            svg_img_bytes, options={"write_text": False}
        )
        with NamedTemporaryFile(delete=False, suffix=".png") as temp:
            temp.write(svg_img_bytes.getvalue())
            temp_path = temp.name
        self.pdf.image(temp_path, x=142, y=25, w=40, h=5)
        os.unlink(temp_path)

        self.pdf.set_font("helvetica", "", 8)
        self.pdf.set_xy(143.5, 29.5)
        self.pdf.cell(ln=0, h=5, align="L", w=10.0, text=sampe_id, border=0)
        self.pdf.set_line_width(0.0)
        self.pdf.line(20.0, 35.0, 180.0, 35.0)

        # Lab Report Status
        self.pdf.set_font("helvetica", "B", 10)
        self.pdf.set_xy(20.0, 36)
        self.pdf.cell(
            ln=0, h=5.5, align="L", w=10.0, text="Diagnostic Report".upper(), border=0
        )
        self.pdf.set_font("helvetica", "B", 10)
        self.pdf.set_xy(170.0, 36)
        self.pdf.cell(ln=0, h=5.5, align="R", w=10.0, text=report_state, border=0)

        self.pdf.set_line_width(0.0)
        self.pdf.line(20.0, 42.0, 180.0, 42.0)

        # Customer Column
        patient = get_from_nested(sample, "analysis_request.patient")
        full_name = (
                get_from_nested(patient, "first_name")
                + " "
                + get_from_nested(patient, "last_name")
        )
        self.pdf.set_font("helvetica", "B", 10)
        self.pdf.set_xy(20, 42)
        self.pdf.cell(ln=0, h=9.5, align="L", w=20.0, text="MRN: ", border=0)
        self.pdf.set_font("helvetica", "", 10)
        self.pdf.set_xy(34, 42)
        self.pdf.cell(
            ln=0,
            h=9.5,
            align="l",
            w=20.0,
            text=get_from_nested(sample, "analysis_request.client_request_id"),
            border=0,
        )
        self.pdf.set_font("helvetica", "B", 10)
        self.pdf.set_xy(20, 46)
        self.pdf.cell(ln=0, h=9.5, align="L", w=20.0, text="Name: ", border=0)
        self.pdf.set_font("helvetica", "", 10)
        self.pdf.set_xy(34, 48)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text=full_name, border=0)
        self.pdf.set_font("helvetica", "B", 10)
        self.pdf.set_xy(20, 50)
        self.pdf.cell(ln=0, h=9.5, align="L", w=20.0, text="Age: ", border=0)
        self.pdf.set_font("helvetica", "", 10)
        self.pdf.set_xy(34, 52)
        self.pdf.cell(
            ln=0,
            h=5.5,
            align="L",
            w=10.0,
            text=get_from_nested(patient, "age"),
            border=0,
        )
        self.pdf.set_font("helvetica", "B", 10)
        self.pdf.set_xy(20, 54)
        self.pdf.cell(ln=0, h=9.5, align="L", w=20.0, text="Sex: ", border=0)
        self.pdf.set_font("helvetica", "", 10)
        self.pdf.set_xy(34, 56)
        self.pdf.cell(
            ln=0,
            h=5.5,
            align="L",
            w=10.0,
            text=get_from_nested(patient, "gender"),
            border=0,
        )

        self.pdf.set_line_width(0.0)
        self.pdf.line(73.0, 42.0, 73.0, 64.0)
        # Primary Referrer Details
        client = get_from_nested(sample, "analysis_request.client")
        name = get_from_nested(client, "name")
        address = get_from_nested(client, "address")
        self.pdf.set_font("helvetica", "B", 10)
        self.pdf.set_xy(80, 42)
        self.pdf.cell(
            ln=0, h=9.5, align="L", w=20.0, text="Primary Referrer: ", border=0
        )
        self.pdf.set_font("helvetica", "I", 10)
        self.pdf.set_xy(80, 50)
        self.pdf.multi_cell(40.0, 3.5, f"{name}, \n{address}")

        self.pdf.set_line_width(0.0)
        self.pdf.line(120.0, 42.0, 120.0, 64.0)

        # Sample Details
        sample_type = get_from_nested(sample, "sample_type.name")
        self.pdf.set_font("helvetica", "B", 8)
        self.pdf.set_xy(128.0, 43)
        self.pdf.cell(ln=0, h=5, align="L", w=10.0, text="Sample Type:", border=0)
        self.pdf.set_font("helvetica", "I", 8)
        self.pdf.set_xy(149.5, 43)
        self.pdf.cell(ln=0, h=5, align="L", w=10.0, text=sample_type, border=0)
        # ---
        self.pdf.set_font("helvetica", "B", 8)
        self.pdf.set_xy(128.0, 47)
        self.pdf.cell(ln=0, h=5, align="L", w=10.0, text="Collected on:", border=0)
        self.pdf.set_font("helvetica", "I", 8)
        self.pdf.set_xy(149.5, 47)
        self.pdf.cell(
            ln=0,
            h=5,
            align="L",
            w=10.0,
            text=format_datetime(get_from_nested(sample, "date_collected")),
            border=0,
        )
        # ---
        self.pdf.set_font("helvetica", "B", 8)
        self.pdf.set_xy(128.0, 51)
        self.pdf.cell(ln=0, h=5, align="L", w=10.0, text="Received on:", border=0)
        self.pdf.set_font("helvetica", "I", 8)
        self.pdf.set_xy(149.5, 51)
        self.pdf.cell(
            ln=0,
            h=5,
            align="L",
            w=10.0,
            text=format_datetime(get_from_nested(sample, "date_received")),
            border=0,
        )
        # ---
        self.pdf.set_font("helvetica", "B", 8)
        self.pdf.set_xy(128.0, 55)
        self.pdf.cell(ln=0, h=5, align="L", w=10.0, text="Registered on:", border=0)
        self.pdf.set_font("helvetica", "I", 8)
        self.pdf.set_xy(149.5, 55)
        self.pdf.cell(
            ln=0,
            h=5,
            align="L",
            w=10.0,
            text=format_datetime(get_from_nested(sample, "created_at")),
            border=0,
        )  # ---
        self.pdf.set_font("helvetica", "B", 8)
        self.pdf.set_xy(128.0, 59)
        self.pdf.cell(ln=0, h=5, align="L", w=10.0, text="Reported on:", border=0)
        self.pdf.set_font("helvetica", "I", 8)
        self.pdf.set_xy(149.5, 59)
        self.pdf.cell(
            ln=0,
            h=5,
            align="L",
            w=10.0,
            text=format_datetime(get_from_nested(sample, "date_published")),
            border=0,
        )

        self.pdf.set_line_width(0.0)
        self.pdf.line(20.0, 64.0, 180.0, 64.0)

        # Diagnostics Results
        _p = ", ".join(profiles)
        _a = ", ".join(analyses)
        investigations = _p
        if _a:
            investigations += ", " + _a

        self.pdf.dashed_line(20, 70.0, 50, 70.0, dash_length=1, space_length=1)
        self.pdf.set_font("helvetica", "B", 10)
        self.pdf.set_xy(55, 67)
        self.pdf.cell(ln=0, h=5, align="L", w=20.0, text=investigations, border=0)

        # Results Heading
        self.pdf.set_font("helvetica", "B", 10)
        self.pdf.set_xy(20, 75)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Investigation", border=0)
        self.pdf.set_xy(120, 75)
        self.pdf.cell(ln=0, h=5.5, align="R", w=10.0, text="Result", border=0)
        self.pdf.set_xy(130, 75)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Unit", border=0)
        self.pdf.set_xy(150, 75)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Ref Range", border=0)

        # Results
        y_pos = 80

        analyses_results = get_from_nested(sample, "analysis_results")
        analyses_results = list(
            filter(
                lambda r: strtobool(get_from_nested(r, "reportable")) and \
                          get_from_nested(r, "status") in [ResultState.RESULTED, ResultState.APPROVED],
                analyses_results
            )
        )

        for result in analyses_results:
            self.pdf.set_font("helvetica", "", 8)
            self.pdf.set_xy(20, y_pos)
            self.pdf.cell(
                ln=0,
                h=5.5,
                align="L",
                w=10.0,
                text=get_from_nested(result, "analysis.name"),
                border=0,
            )
            self.pdf.set_xy(120, y_pos)
            self.pdf.cell(
                ln=0,
                h=5.5,
                align="R",
                w=10.0,
                text=get_from_nested(result, "result"),
                border=0,
            )
            self.pdf.set_xy(130, y_pos)
            self.pdf.cell(
                ln=0,
                h=5.5,
                align="L",
                w=10.0,
                text=get_from_nested(result, "analysis.unit.name"),
                border=0,
            )
            self.pdf.set_xy(150, y_pos)
            self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="", border=0)  # ref range
            # ---
            y_pos += 4
            inst_meth = f"{get_from_nested(result, 'laboratory_instrument.lab_name')} | {get_from_nested(result, 'method.name')}"
            self.pdf.set_font("helvetica", "I", 6)
            self.pdf.set_xy(20, y_pos)
            self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text=inst_meth, border=0)
            # ---
            y_pos += 5

            if y_pos >= (self.pdf_h - self.margin_top * 3):
                self.pdf.add_page()
                y_pos = self.margin_top

        # End of report
        y_pos += 5
        self.pdf.set_line_width(0.0)
        self.pdf.line(20.0, y_pos, 180.0, y_pos)

        # -- Signature Section
        # -- --Reviewed by:
        self.pdf.set_font("helvetica", "B", 8)
        self.pdf.set_xy(20, y_pos)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Reviewed By:", border=0)
        self.pdf.set_font("helvetica", "I", 8)
        self.pdf.set_xy(40, y_pos)
        _user = await get_report_user(sample, "submitted_by", analyses_results)
        self.pdf.cell(
            ln=0, h=5.5,
            align="L",
            w=10.0,
            text=_user,
            border=0
        )

        # -- -- Approved by:
        self.pdf.set_font("helvetica", "B", 8)
        self.pdf.set_xy(90, y_pos)
        self.pdf.cell(ln=0, h=5.5, align="L", w=10.0, text="Approved By:", border=0)
        self.pdf.set_font("helvetica", "I", 8)
        self.pdf.set_xy(110, y_pos)
        _user = await get_report_user(sample, "verified_by", analyses_results)
        self.pdf.cell(
            ln=0,
            h=5.5,
            align="L",
            w=10.0,
            text=_user,
            border=0
        )

        # -- -- end of report marker
        self.pdf.set_font("helvetica", "I", 8)
        self.pdf.set_xy(170, y_pos)
        self.pdf.cell(ln=0, h=5.5, align="R", w=10.0, text="* End of Report", border=0)

        # --- Quality Statement
        self.pdf.set_line_width(0.0)
        self.pdf.line(15.0, 255.0, 185.0, 255.0)
        self.pdf.set_font("helvetica", "I", 8)
        self.pdf.set_xy(20, 255)
        self.pdf.cell(
            ln=0,
            h=5.5,
            align="L",
            w=150.0,
            text=get_from_nested(laboratory, "quality_statement"),
            border=0,
        )
        self.pdf.set_xy(162, 255)
        self.pdf.cell(
            ln=0,
            h=5.5,
            align="R",
            w=20.0,
            text=f"Generated on: {timenow_str()}",
            border=0,
        )

        return self.pdf

    async def generate(self, sample: dict, report_state="final"):
        pdf = await self._make(sample, report_state)
        return pdf.output()
