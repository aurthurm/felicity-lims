import logging
from typing import List

from felicity.apps.analysis.enum import SampleState
from felicity.apps.analysis.services.analysis import SampleService
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.impress.sample.engine import FelicityImpress
from felicity.apps.impress.sample.schemas import ReportImpressCreate
from felicity.apps.impress.services import ReportImpressService
from felicity.apps.iol.minio.client import MinioClient
from felicity.apps.iol.minio.enum import MinioBucket
from felicity.apps.notification.services import ActivityStreamService
from felicity.apps.setup.caches import get_laboratory
from felicity.utils import remove_circular_refs

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

exclude = [
    "auth",
    "preference",
    "groups",
    "right",
    "left",
    "level",
    "tree_id",
    "parent_id",
    "parent",
]


async def impress_samples(sample_meta: List[any], user):
    laboratory = await get_laboratory()
    to_return = []

    for s_meta in sample_meta:
        sample = await SampleService().get(uid=s_meta.get("uid"))
        logger.info(f"sample {sample} {sample.status}")

        if sample.status in [
            SampleState.RECEIVED,
            SampleState.PAIRED,
            SampleState.AWAITING,
            SampleState.APPROVED,
            SampleState.PUBLISHING,
            SampleState.PUBLISHED,
        ]:
            impress_meta = marshaller(sample, exclude=exclude, depth=3)
            impress_meta["laboratory"] = marshaller(laboratory, exclude=["lab_manager"])
            impress_meta = remove_circular_refs(impress_meta)
            report_state = "Unknown"
            action = s_meta.get("action")
            if action == "publish":
                report_state = "Final Report"
            if action == "re-publish":
                report_state = "Final Report [Re]"
            if action == "pre-publish":
                report_state = "Preliminary Report"

            logger.info(f"report_state {report_state}: running impress ....")
            impress_engine = FelicityImpress()
            sample_pdf = await impress_engine.generate(impress_meta, report_state)
            sc_in = ReportImpressCreate(
                **{
                    "state": report_state,
                    "sample_uid": sample.uid,
                    "json_content": impress_meta,
                    # "pdf_content": sample_pdf,
                    "email_required": False,
                    "email_sent": False,
                    "sms_required": False,
                    "sms_sent": False,
                    "generated_by_uid": user.uid,
                }
            )
            await ReportImpressService().create(sc_in)
            # save pdf to external storage
            MinioClient().put_object(
                bucket=MinioBucket.DIAGNOSTIC_REPORT,
                object_name=sample.sample_id,
                data=sample_pdf,
                metadata={
                    "state": report_state,
                    "sample_uid": sample.uid,
                }
            )

            if action != "pre-publish":
                sample = await SampleService().publish(sample.uid, published_by=user)

            logger.info(f"sample {sample.sample_id} has been impressed.")
            to_return.append(sample)

            await ActivityStreamService().stream(sample, user, "published", "sample")
        else:
            logger.info(
                f"sample {sample.sample_id} could not be impressed - status: {sample.status}"
            )

    return to_return
