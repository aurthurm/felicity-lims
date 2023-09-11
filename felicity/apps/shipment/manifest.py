# coding: utf-8
import logging

from apps.impress.reports.utils import get_from_nested
from fpdf import FPDF

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class PDF(FPDF):
    def header(self):
        # Rendering logo:
        # self.image("../docs/fpdf2-logo.png", 10, 8, 33)
        # Setting font: helvetica bold 15
        self.set_font("helvetica", "B", 15)
        # Moving cursor to the right:
        self.cell(1)
        # Printing title:
        self.cell(60, 10, "Felicity Shipment Mannifest", border=1, align="C")
        # Performing a line break:
        self.ln(20)

    def footer(self):
        # Position cursor at 1.5 cm from bottom:
        self.set_y(-15)
        # Setting font: helvetica italic 8
        self.set_font("helvetica", "I", 8)
        # Printing page number:
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")


class ManifetReport:
    def __init__(self):
        self.pdf = PDF(orientation="P", unit="mm", format="A4")
        self.pdf.set_font("Helvetica")
        self.pdf.set_page_background((255, 255, 255))
        self.pdf_w = 210
        self.pdf_h = 297
        self.margin_top = 20
        self.margin_left = 10
        self.y_diff = 5  # space between rows

    def _add_page(self):
        self.pdf.add_page()

    def _style_heading_1(self):
        self.pdf.set_text_color(0, 125, 225)
        self.pdf.set_font("Helvetica", "B", 16)

    def _style_heading_2(self):
        self.pdf.set_text_color(0, 125, 225)
        self.pdf.set_font("Helvetica", "B", 14)

    def _style_heading_3(self):
        self.pdf.set_text_color(0, 125, 225)
        self.pdf.set_font("Helvetica", "B", 12)

    def _style_heading_4(self):
        self.pdf.set_text_color(0, 125, 225)
        self.pdf.set_font("Helvetica", "B", 10)

    def _style_text(self):
        self.pdf.set_text_color(0, 0, 0)
        self.pdf.set_font("Helvetica", "", 10)

    async def run(self, data: list[dict]):
        self._add_page()

        heading_top = self.margin_top + 15
        self._style_heading_1()
        self.pdf.text(self.margin_left, heading_top, "Shipment Consignment Manifest")

        # Samples listing Results Section
        results_top = heading_top + self.y_diff * 5
        left_col_xl = self.margin_left

        # Result column headers
        columns = 5
        column_total_width = self.pdf_w - self.margin_left * 2
        column_width = column_total_width / columns

        self._style_heading_3()
        self.pdf.text(left_col_xl, results_top, "Sample Details:")
        self._style_heading_4()
        self.pdf.text(
            left_col_xl + column_width * 0, results_top + self.y_diff * 1, "Sample ID"
        )
        self.pdf.text(
            left_col_xl + column_width * 1,
            results_top + self.y_diff * 1,
            "Client Sample ID",
        )
        self.pdf.text(
            left_col_xl + column_width * 2,
            results_top + self.y_diff * 1,
            "Date Sampled",
        )
        self.pdf.text(
            left_col_xl + column_width * 3, results_top + self.y_diff * 1, "Sample Type"
        )
        self.pdf.text(
            left_col_xl + column_width * 3, results_top + self.y_diff * 1, "Tests"
        )

        self._style_text()

        count = 0
        for sample_meta in data:
            y_pos = results_top + self.y_diff * (count + 2)

            self.pdf.text(
                left_col_xl + column_width * 0,
                y_pos,
                get_from_nested(sample_meta, "sample_id"),
            )
            self.pdf.text(
                left_col_xl + column_width * 1,
                y_pos,
                get_from_nested(sample_meta, "client_sample_id"),
            )
            self.pdf.text(
                left_col_xl + column_width * 2,
                y_pos,
                get_from_nested(sample_meta, "date_collected"),
            )
            self.pdf.text(
                left_col_xl + column_width * 3,
                y_pos,
                get_from_nested(sample_meta, "sample_type"),
            )
            self.pdf.text(
                left_col_xl + column_width * 4,
                y_pos,
                ",".join(get_from_nested(sample_meta, "services")),
            )

            if y_pos >= (self.pdf_h - self.margin_top * 3):
                self._add_page()
                results_top = self.margin_top
                count = 0

            count += 1

        return self.pdf

    async def generate(self, manifet_data: list[dict]):
        pdf = await self.run(manifet_data)
        return pdf.output()
