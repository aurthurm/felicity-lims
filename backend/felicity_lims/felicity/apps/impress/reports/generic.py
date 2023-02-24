# coding: utf-8
from typing import List

from fpdf import FPDF

from felicity.apps.analysis.models.analysis import Sample


import logging
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
        self.cell(60, 10, "Felicity Patient Report", border=1, align="C")
        # Performing a line break:
        self.ln(20)

    def footer(self):
        # Position cursor at 1.5 cm from bottom:
        self.set_y(-15)
        # Setting font: helvetica italic 8
        self.set_font("helvetica", "I", 8)
        # Printing page number:
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")


class FelicityImpress:
    def __init__(self):
        self.pdf = PDF(orientation='P', unit='mm', format='A4')
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

    async def _add_sample(self, sample=None):
        sample_tests = [p.name for p in sample.profiles]
        logger.info(f"_add_page {sample.sample_id} ....")
        self._add_page()

        # Felicity Health Report
        # self._style_heading_1()
        # self.pdf.text(self.margin_left, self.margin_top, "Felicity Patient Report")

        # Patient Details Column
        patient_top = self.margin_top + 15
        left_col_xl = self.margin_left
        left_col_xv = left_col_xl + 40

        self._style_heading_3()
        self.pdf.text(left_col_xl, patient_top, "Patient Details:")
        self._style_text()

        patient = sample.analysis_request.patient
        logger.info(f"patient {patient} ....")

        # First Name
        self.pdf.text(left_col_xl, patient_top + self.y_diff * 1, "First Name")
        self.pdf.text(left_col_xv, patient_top + self.y_diff * 1, str(patient.first_name))
        logger.info(f"patient fn ....")
        # Last Name
        self.pdf.text(left_col_xl, patient_top + self.y_diff * 2, "Last Name")
        self.pdf.text(left_col_xv, patient_top + self.y_diff * 2, str(patient.last_name))
        logger.info(f"patient ln ....")
        # Gender
        self.pdf.text(left_col_xl, patient_top + self.y_diff * 3, "Gender")
        self.pdf.text(left_col_xv, patient_top + self.y_diff * 3, str(patient.gender))
        logger.info(f"patient gender ....{patient.gender}")
        # Age
        self.pdf.text(left_col_xl, patient_top + self.y_diff * 4, "Age")
        self.pdf.text(left_col_xv, patient_top + self.y_diff * 4, str(patient.age))
        logger.info(f"patient age ....{patient.age}")
        # D.O.B
        self.pdf.text(left_col_xl, patient_top + self.y_diff * 5, "D.O.B")
        self.pdf.text(left_col_xv, patient_top + self.y_diff * 5, str(patient.date_of_birth))
        logger.info(f"patient date_of_birth ....")

        # Client Details Column
        right_col_xl = self.pdf_w / 2
        right_col_xv = right_col_xl + 40

        client = sample.analysis_request.client
        logger.info(f"client {client} ....")

        # Client Patient Id
        self.pdf.text(right_col_xl, patient_top + self.y_diff * 1, "Client Patient Id:")
        self.pdf.text(right_col_xv, patient_top + self.y_diff * 1, str(sample.analysis_request.client_request_id))
        logger.info(f"client Email....")
        # Client Name
        self.pdf.text(right_col_xl, patient_top + self.y_diff * 2, "Client Name:")
        self.pdf.text(right_col_xv, patient_top + self.y_diff * 2, str(client.name))
        logger.info(f"client name....")
        # Client Phone
        self.pdf.text(right_col_xl, patient_top + self.y_diff * 3, "Client Phone:")
        self.pdf.text(right_col_xv, patient_top + self.y_diff * 3, str(client.phone_mobile))
        logger.info(f"client phone_mobile....")
        # Client Email
        self.pdf.text(right_col_xl, patient_top + self.y_diff * 4, "Client Email:")
        self.pdf.text(right_col_xv, patient_top + self.y_diff * 4, str(client.email))
        logger.info(f"client Email....")

        # Sample Details Section
        sample_top = patient_top + self.y_diff * 7

        self._style_heading_3()
        self.pdf.text(left_col_xl, sample_top, "Sample Details:")
        self._style_text()
        # Sample ID
        self.pdf.text(left_col_xl, sample_top + self.y_diff * 1, "Sample ID:")
        self.pdf.text(left_col_xv, sample_top + self.y_diff * 1, str(sample.sample_id))
        # Sample Type
        self.pdf.text(left_col_xl, sample_top + self.y_diff * 2, "Sample Type:")
        self.pdf.text(left_col_xv, sample_top + self.y_diff * 2, str(sample.sample_type.name))
        # Test(s)
        self.pdf.text(left_col_xl, sample_top + self.y_diff * 3, "Tests:")
        self.pdf.text(left_col_xv, sample_top + self.y_diff * 3, ", ".join(sample_tests))
        #
        # Date Collected
        self.pdf.text(right_col_xl, sample_top + self.y_diff * 1, "Date Collected:")
        self.pdf.text(right_col_xv, sample_top + self.y_diff * 1, str(sample.date_collected))
        # Date Received
        self.pdf.text(right_col_xl, sample_top + self.y_diff * 2, "Date Received:")
        self.pdf.text(right_col_xv, sample_top + self.y_diff * 2, str(sample.date_received))
        # Date Published
        self.pdf.text(right_col_xl, sample_top + self.y_diff * 3, "Date Published:")
        self.pdf.text(right_col_xv, sample_top + self.y_diff * 3, str(sample.date_published))

        # Analyses Results Section
        results_top = sample_top + self.y_diff * 5

        # Result column headers
        columns = 5
        column_total_width = self.pdf_w - self.margin_left * 2
        column_width = column_total_width / columns

        self._style_heading_3()
        self.pdf.text(left_col_xl, results_top, "Analyses Results:")
        self._style_heading_4()
        self.pdf.text(left_col_xl + column_width * 0, results_top + self.y_diff * 1, "Analysis")
        self.pdf.text(left_col_xl + column_width * 1, results_top + self.y_diff * 1, "Instrument")
        self.pdf.text(left_col_xl + column_width * 2, results_top + self.y_diff * 1, "Method")
        self.pdf.text(left_col_xl + column_width * 3, results_top + self.y_diff * 1, "Result")
        self.pdf.text(left_col_xl + column_width * 4, results_top + self.y_diff * 1, "Unit")

        self._style_text()

        results = await sample.get_analysis_results()
        logger.info(f"results exe {results}")
        count = 0
        for result in results:
            y_pos = results_top + self.y_diff * (count + 2)

            unit = None
            analysis = result.analysis
            if analysis:
                unit = analysis.unit

            self.pdf.text(left_col_xl + column_width * 0, y_pos, analysis.name if analysis else "")
            logger.info(f"analysis ..")
            self.pdf.text(left_col_xl + column_width * 1, y_pos, result.instrument.name if result.instrument else "")
            logger.info(f"instrument ..")
            self.pdf.text(left_col_xl + column_width * 2, y_pos, result.method.name if result.method else "")
            logger.info(f"method ..")
            self.pdf.text(left_col_xl + column_width * 3, y_pos, str(result.result))
            logger.info(f"result ..")
            self.pdf.text(left_col_xl + column_width * 4, y_pos, unit.name if unit else "")
            logger.info(f"unit ..")

            if y_pos >= (self.pdf_h - self.margin_top * 3):
                self._add_page()
                results_top = self.margin_top
                count = 0

            count += 1

        return self.pdf

    async def generate(self, sample: Sample):
        logger.info(f"generate {sample} ....")
        logger.info(f"_add_sample {sample.sample_id} ....")
        pdf = await self._add_sample(sample)
        another = pdf
        another.output(f"{sample.sample_id}.pdf")
        return pdf.output()
