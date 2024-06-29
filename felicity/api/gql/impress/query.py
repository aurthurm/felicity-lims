import io
import logging
from functools import lru_cache
from typing import List

import strawberry  # noqa
from PyPDF2 import PdfWriter
from pdf2image import convert_from_bytes

from felicity.api.gql.impress.types import ReportImpressType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import BytesScalar
from felicity.apps.client import Client
from felicity.apps.impress.barcode.schema import BarCode, BarCodeMeta
from felicity.apps.impress.barcode.utils import impress_barcodes
from felicity.apps.impress.sample.models import ReportImpress
from felicity.apps.storage.models import Sample

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class ReportImpressQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def impress_reports_meta(
            self, info, uids: List[str]
    ) -> List[ReportImpressType]:
        return await ReportImpress.get_all(sample_uid__in=uids)

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def impress_reports_download(
            self, info, uids: List[str]
    ) -> BytesScalar | None:
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
            _report = _first_of(
                _sorter(list(filter(lambda x: x.sample_uid == suid, items)))
            )
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

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def impress_report_download(self, info, uid: str) -> BytesScalar | None:
        report = await ReportImpress.get(uid=uid)

        if not report:
            return None

        # io.BytesIO()
        return report.pdf_content

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def barcode_samples(self, info, sample_uids: list[str]) -> list[BytesScalar] | None:
        samples = await Sample.get_all(uid__in=sample_uids)

        @lru_cache
        async def _client_name(uid: str) -> str:
            return (await Client.get(uid=uid)).name

        barcode_metas = [
            BarCode(
                barcode=_s.sample_id,
                metadata=[
                    BarCodeMeta(
                        label="CRID", value=_s.analysis_request.client_request_id
                    ),
                    BarCodeMeta(label="Sample Type", value=_s.sample_type.name),
                    BarCodeMeta(
                        label="Client",
                        value=_s.analysis_request.client.name,  # await _client_name(_s.analysis_request.client_uid)
                    ),
                ],
            )
            for _s in samples
        ]
        pdf_bytes = await impress_barcodes(barcode_metas)
        image_bytes = convert_from_bytes(pdf_file=pdf_bytes)
        return_bytes = []
        for page in image_bytes:
            in_mem_file = io.BytesIO()
            page.save(in_mem_file, format="png")
            # return_bytes.append(in_mem_file.seek(0))
            return_bytes.append(in_mem_file.getvalue())
        return return_bytes
