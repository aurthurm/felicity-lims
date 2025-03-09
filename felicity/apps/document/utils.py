import base64
import io

from pdf2image import convert_from_bytes
from xhtml2pdf import pisa


def convert_html_to_pdf_bytes(html_string):
    """Convert HTML to PDF and return bytes."""
    pdf_bytes = io.BytesIO()
    pisa_status = pisa.CreatePDF(html_string, dest=pdf_bytes)

    if pisa_status.err:
        return None  # PDF conversion failed

    return pdf_bytes.getvalue()


def get_compressed_thumbnail_base64(pdf_bytes, thumbnail_size=(200, 500), quality=60):
    """Generate a base64-encoded compressed thumbnail preview of the first page."""
    images = convert_from_bytes(pdf_bytes, first_page=1, last_page=1)

    if images:
        img = images[0]  # First page image
        img.thumbnail(thumbnail_size)  # Resize image to thumbnail

        img_bytes = io.BytesIO()
        img.save(img_bytes, format="JPEG", quality=quality, optimize=True)  # ,   # Heavily compressed JPEG
        img_base64 = base64.b64encode(img_bytes.getvalue()).decode("utf-8")
        return img_base64

    return None


def get_thumbnail(html_content):
    html = f'''
    <html>
      <head>
          <title>Thumbnail</title>
      </head>
      <body>
        {html_content}
      </body>
    </html>
    '''
    pdf_bytes = convert_html_to_pdf_bytes(html)
    return get_compressed_thumbnail_base64(pdf_bytes)
