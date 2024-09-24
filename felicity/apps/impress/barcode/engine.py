import os
from io import BytesIO
from tempfile import NamedTemporaryFile

from barcode import Code128
from barcode.base import Barcode
from barcode.writer import ImageWriter
from fpdf import FPDF

from felicity.apps.impress.barcode.schema import BarCode

Barcode.default_writer_options["write_text"] = False
ImageWriter.human = " "


class FelicityBarCoder:
    def __init__(
        self, page_width=40.0, page_height=30.0, barcode_width=30, barcode_height=7.5
    ):
        assert page_width > barcode_width and page_height > barcode_height
        self.pdf = FPDF(unit="mm", format=(page_width, page_height))
        self.pdf.set_auto_page_break(auto=False, margin=0.0)
        self.margin_left = (self.pdf.w - barcode_width) / 2
        self.margin_top = 3
        self.txt_left = self.margin_left  # + 0.5
        self.barcode_bottom = self.margin_top + barcode_height
        self.metadata_spacer = 3
        self.metadata_shift = 2
        self.barcode_width = barcode_width
        self.barcode_height = barcode_height

    async def _make(self, data: list[BarCode]):
        for _meta in data:
            self.pdf.add_page()

            # Barcode
            svg_img_bytes = BytesIO()
            Code128(_meta.barcode, writer=ImageWriter()).write(svg_img_bytes)
            with NamedTemporaryFile(delete=False, suffix=".png") as temp:
                temp.write(svg_img_bytes.getvalue())
                temp_path = temp.name
            self.pdf.image(
                temp_path,
                x=self.margin_left,
                y=self.margin_top,
                w=self.barcode_width,
                h=self.barcode_height,
            )
            os.unlink(temp_path)

            # Barcode txt
            y_next_txt = self.barcode_bottom + 1
            self.pdf.set_font("helvetica", "", 6)
            self.pdf.set_xy(self.txt_left, y_next_txt)
            self.pdf.cell(w=1, h=1, text=_meta.barcode, border=0)

            # Extra Metadata
            x = 0
            for _xtra in _meta.metadata:
                y_next_txt += self.metadata_spacer if x == 0 else self.metadata_shift
                x += 1
                # Label Name
                self.pdf.set_font("helvetica", "B", 4)
                self.pdf.set_xy(self.txt_left, y_next_txt)
                self.pdf.cell(w=1, h=1, align="L", text=f"{_xtra.label}: ", border=0)
                # Label Value
                self.pdf.set_font("helvetica", "", 4)
                self.pdf.set_xy(self.pdf.w - self.margin_left, y_next_txt)
                self.pdf.cell(w=1, h=1, align="R", text=str(_xtra.value), border=0)

        return self.pdf

    async def generate(self, data: list[BarCode]):
        pdf = await self._make(data)
        return pdf.output()
