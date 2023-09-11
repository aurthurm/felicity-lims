import logging
from apps.impress.reports.utils import get_from_nested, strtobool
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle
import io


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FelicityImpress:
    def __init__(self):
        self.buffer = io.BytesIO()
        self.canvas = canvas.Canvas(self.buffer, pagesize=A4)
        self.styles = getSampleStyleSheet()
        self.page_width, self.page_height = A4
        self.margin_top = 20
        self.margin_left = 10
        self.y_diff = 5  # space between rows

    def _add_page(self):
        self.canvas.showPage()

    def _style_heading_1(self):
        self.canvas.setFillColorRGB(0, 125 / 255, 225 / 255)
        self.canvas.setFont("Helvetica-Bold", 16)

    def _style_heading_2(self):
        self.canvas.setFillColorRGB(0, 125 / 255, 225 / 255)
        self.canvas.setFont("Helvetica-Bold", 14)

    def _style_heading_3(self):
        self.canvas.setFillColorRGB(0, 125 / 255, 225 / 255)
        self.canvas.setFont("Helvetica-Bold", 12)

    def _style_heading_4(self):
        self.canvas.setFillColorRGB(0, 125 / 255, 225 / 255)
        self.canvas.setFont("Helvetica-Bold", 10)

    def _style_text(self):
        self.canvas.setFillColorRGB(0, 0, 0)
        self.canvas.setFont("Helvetica", 10)

    async def _add_patient_details(self, sample, report_state):
        self._add_page()

        heading_top = self.margin_top + 15
        self._style_heading_1()
        self.canvas.drawString(self.margin_left, heading_top, report_state)

        patient_top = heading_top + 15
        left_col_xl = self.margin_left
        left_col_xv = left_col_xl + 40

        self._style_heading_3()
        self.canvas.drawString(left_col_xl, patient_top, "Patient Details:")
        self._style_text()

        patient = get_from_nested(sample, "analysis_request.patient")

        details = [
            ("First Name", get_from_nested(patient, "first_name")),
            ("Last Name", get_from_nested(patient, "last_name")),
            ("Gender", get_from_nested(patient, "gender")),
            ("Age", get_from_nested(patient, "age")),
            ("D.O.B", get_from_nested(patient, "date_of_birth")),
        ]

        for i, (label, value) in enumerate(details):
            self.canvas.drawString(
                left_col_xl, patient_top + self.y_diff * (i + 1), label
            )
            self.canvas.drawString(
                left_col_xv, patient_top + self.y_diff * (i + 1), value
            )

    async def _add_client_details(self, sample, sample_top):
        client_top = sample_top + self.y_diff * 5

        self._style_heading_3()
        self.canvas.drawString(left_col_xl, client_top, "Client Details:")
        self._style_text()

        client = get_from_nested(sample, "analysis_request.client")

        details = [
            ("Client ID", get_from_nested(client, "client_id")),
            ("Client Name", get_from_nested(client, "name")),
            ("Client Email", get_from_nested(client, "email")),
            ("Client Phone", get_from_nested(client, "phone")),
        ]

        for i, (label, value) in enumerate(details):
            self.canvas.drawString(
                left_col_xl, client_top + self.y_diff * (i + 1), label
            )
            self.canvas.drawString(
                left_col_xv, client_top + self.y_diff * (i + 1), value
            )

    async def _add_sample_details_section(self, sample, patient_top, analyses):
        sample_top = patient_top + self.y_diff * 7

        self._style_heading_3()
        self.canvas.drawString(left_col_xl, sample_top, "Sample Details:")
        self._style_text()

        details_left = [
            ("Sample ID:", get_from_nested(sample, "sample_id")),
            ("Sample Type:", get_from_nested(sample, "sample_type.name")),
            ("Tests:", ", ".join(analyses)),
        ]

        details_right = [
            ("Date Collected:", get_from_nested(sample, "date_collected")),
            ("Date Received:", get_from_nested(sample, "date_received")),
            ("Date Published:", get_from_nested(sample, "date_published")),
        ]

        for i, (label, value) in enumerate(details_left):
            self.canvas.drawString(
                left_col_xl, sample_top + self.y_diff * (i + 1), label
            )
            self.canvas.drawString(
                left_col_xv, sample_top + self.y_diff * (i + 1), value
            )

        for i, (label, value) in enumerate(details_right):
            self.canvas.drawString(
                right_col_xl, sample_top + self.y_diff * (i + 1), label
            )
            self.canvas.drawString(
                right_col_xv, sample_top + self.y_diff * (i + 1), value
            )

    async def _add_analysis_results_section(self, sample, results_top):
        columns = 5
        column_total_width = self.page_width - self.margin_left * 2
        column_width = column_total_width / columns

        self._style_heading_3()
        self.canvas.drawString(left_col_xl, results_top, "Analyses Results:")
        self._style_heading_4()

        headers = ["Analysis", "Instrument", "Method", "Result", "Unit"]

        for i, header in enumerate(headers):
            self.canvas.drawString(
                left_col_xl + column_width * i, results_top + self.y_diff * 1, header
            )

        self._style_text()

        analyses_results = get_from_nested(sample, "analysis_results")
        analyses_results = list(
            filter(
                lambda r: strtobool(get_from_nested(r, "reportable")), analyses_results
            )
        )

        count = 0
        for result in analyses_results:
            y_pos = results_top + self.y_diff * (count + 2)

            result_data = [
                get_from_nested(result, "analysis.name"),
                get_from_nested(result, "instrument.name"),
                get_from_nested(result, "method.name"),
                get_from_nested(result, "result"),
                get_from_nested(result, "analysis.unit.name"),
            ]

            for i, data in enumerate(result_data):
                self.canvas.drawString(left_col_xl + column_width * i, y_pos, data)

            if y_pos >= (self.page_height - self.margin_top * 3):
                self._add_page()
                results_top = self.margin_top
                count = 0

            count += 1

    async def _add_sample(self, sample, report_state):
        # Add your drawing and text methods here using ReportLab's API
        # Example: Add a text to the canvas
        self._style_heading_1()
        self.canvas.drawString(50, 750, "Sample Heading 1")

        # Add other elements like tables, images, etc., using ReportLab's API
        # ...

    async def generate(self, sample: dict, report_state="final"):
        get_from_nested(sample, "sample_id")
        await self._add_sample(sample, report_state)
        await self._add_sample_details(sample, report_state)
        await self._add_sample_details_section(sample, patient_top, analyses)
        await self._add_client_details(sample, sample_top)
        await self._add_analysis_results_section(sample, results_top)
        self.canvas.save()
        pdf_data = self.buffer.getvalue()
        return pdf_data
