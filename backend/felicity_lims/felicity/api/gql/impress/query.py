import logging
from typing import List
from PyPDF2 import PdfWriter
import strawberry  # noqa
import io

from felicity.api.gql.impress.types import ReportImpressType
from felicity.api.gql.types import BytesScalar
from felicity.apps.impress.models import ReportImpress

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class ReportImpressQuery:
    @strawberry.field
    async def impress_report_by_uids(self, info, uids: List[int]) -> List[ReportImpressType]:
        return await ReportImpress.get_all(sample_uid__in=uids)

    @strawberry.field
    async def download(self, info, uids: List[int]) -> BytesScalar:
        items = await ReportImpress.get_all(sample_uid__in=uids)
        merger = PdfWriter()

        for item in items:
            merger.append(io.BytesIO(item.pdf_content))

        # Write to an output PDF document
        # output = open("merged-output.pdf", "wb")
        # merger.write(output)
        # merger.close()
        # output.close()

        with io.BytesIO() as bytes_stream:
            merger.write(bytes_stream)
            bytes_stream.seek(0)
            out_stream = bytes_stream.getbuffer().tobytes()

        return out_stream
