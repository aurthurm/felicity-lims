import io
import logging
from functools import lru_cache
from io import BytesIO
from typing import List

import strawberry  # noqa
from PyPDF2 import PdfWriter
from pdf2image import convert_from_bytes

from felicity.api.gql.impress.types import ReportImpressType
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import BytesScalar
from felicity.apps.analysis.services.analysis import SampleService
from felicity.apps.analysis.utils import QC_SAMPLE
from felicity.apps.client.services import ClientService
from felicity.apps.impress.barcode.schema import BarCode, BarCodeMeta
from felicity.apps.impress.barcode.utils import impress_barcodes
from felicity.apps.impress.services import ReportImpressService
from felicity.apps.iol.minio import MinioClient
from felicity.apps.iol.minio.enum import MinioBucket
from felicity.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@strawberry.type
class ReportImpressQuery:
    @strawberry.field(permission_classes=[IsAuthenticated])
    async def impress_reports_meta(
            self, info, uids: List[str]
    ) -> List[ReportImpressType]:
        return await ReportImpressService().get_all(sample_uid__in=uids)  # noqa

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def impress_reports_download(
            self, info, sample_ids: List[str]
    ) -> BytesScalar | None:
        """Fetch Latest report given sample id"""
        if settings.OBJECT_STORAGE:
            reports = MinioClient().get_object(MinioBucket.DIAGNOSTIC_REPORT, sample_ids)

            merger = PdfWriter()
            for report in reports:
                merger.append(io.BytesIO(report))

            with io.BytesIO() as bytes_stream:
                merger.write(bytes_stream)
                bytes_stream.seek(0)
                out_stream = bytes_stream.getbuffer().tobytes()
        else:
            items = await ReportImpressService().get_all(sample___sample_id__in=sample_ids)

            def _first_of(things: list):
                if len(things) > 0:
                    return things[0]
                return None

            def _sorter(to_sort: list) -> list:
                return sorted(to_sort, key=lambda r: r.created_at, reverse=True)

            reports = []
            for sid in sample_ids:
                _report = _first_of(
                    _sorter(list(filter(lambda x: x.sample.sample_id == sid, items)))
                )
                if _report:
                    reports.append(_report)

            if not reports:
                return None

            merger = PdfWriter()
            for report in reports:
                merger.append(BytesIO(report.pdf_content))

            with BytesIO() as bytes_stream:
                merger.write(bytes_stream)
                bytes_stream.seek(0)
                out_stream = bytes_stream.getbuffer().tobytes()

        return out_stream

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def impress_report_download(self, info, uid: str) -> BytesScalar | None:
        """Download a specific impress report by impress uid"""
        report = await ReportImpressService().get(uid=uid)
        if not report:
            return None

        if settings.OBJECT_STORAGE:
            sample = await SampleService().get(uid=report.sample_uid)
            report = MinioClient().get_object(MinioBucket.DIAGNOSTIC_REPORT, [sample.sample_id])
            if not report:
                return None
            # TODO: Filter returned report to get the one whose metadata matched impress uid
            return report[0]
        else:
            return report.pdf_content

    @strawberry.field(permission_classes=[IsAuthenticated])
    async def barcode_samples(
            self, info, sample_uids: list[str]
    ) -> list[BytesScalar] | None:
        samples = await SampleService().get_all(uid__in=sample_uids)

        @lru_cache
        async def _client_name(uid: str) -> str:
            return (await ClientService().get(uid=uid)).name

        barcode_metas = []
        for _s in samples:
            barcode = BarCode(
                barcode=_s.sample_id,
                metadata=[BarCodeMeta(label="Sample Type", value=_s.sample_type.name)],
            )
            if _s.sample_type.name == QC_SAMPLE.get("name"):
                barcode.metadata.append(
                    BarCodeMeta(label="QC Level", value=_s.qc_level.level),
                )
            else:
                barcode.metadata.append(
                    BarCodeMeta(
                        label="CRID", value=_s.analysis_request.client_request_id
                    )
                )
                barcode.metadata.append(
                    BarCodeMeta(
                        label="Client",
                        value=_s.analysis_request.client.name,  # await _client_name(_s.analysis_request.client_uid)
                    )
                )
            barcode_metas.append(barcode)

        pdf_bytes = await impress_barcodes(barcode_metas)
        image_bytes = convert_from_bytes(pdf_file=pdf_bytes)
        return_bytes = []
        for page in image_bytes:
            in_mem_file = io.BytesIO()
            page.save(in_mem_file, format="png")
            return_bytes.append(in_mem_file.getvalue())
        return return_bytes
