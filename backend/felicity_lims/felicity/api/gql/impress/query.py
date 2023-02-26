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
    async def impress_reports_meta(self, info, uids: List[int]) -> List[ReportImpressType]:
        return await ReportImpress.get_all(sample_uid__in=uids)

    @strawberry.field
    async def impress_reports_download(self, info, uids: List[int]) -> BytesScalar | None:
        """Fetch Latest report given sample id"""
        items = await ReportImpress.get_all(sample_uid__in=uids)

        def _first_of(things: List):
            if len(things) > 0:
                return things[0]
            return None

        def _sorter(to_sort: List) -> List:
            return sorted(to_sort, key=lambda r: r.date_generated, reverse=True)

        reports = []
        for suid in uids:
            _report = _first_of(_sorter(list(filter(lambda x: x.sample_uid == suid, items))))
            if _report:
                reports.append(_report)

        if not reports:
            return None

        merger = PdfWriter()
        for report in reports:
            merger.append(io.BytesIO(report.pdf_content))

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

    @strawberry.field
    async def impress_report_download(self, info, uid: int) -> BytesScalar | None:
        report = await ReportImpress.get(uid=uid)

        if not report:
            return None

        # io.BytesIO()
        return report.pdf_content
