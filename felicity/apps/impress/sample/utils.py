import logging
from datetime import datetime
from typing import List

from apps.analysis.conf import states
from apps.analysis.models.analysis import Sample
from apps.impress.sample.engine import FelicityImpress
from apps.impress.sample.models import ReportImpress
from apps.impress.sample.schemas import ReportImpressCreate
from apps.notification.utils import FelicityStreamer
from apps.setup.caches import get_laboratory
from utils import marshaller, remove_circular_refs

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

streamer = FelicityStreamer()

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
        sample = await Sample.get(uid=s_meta.get("uid"))
        logger.info(f"sample {sample} {sample.status}")

        if sample.status in [
            states.sample.RECEIVED,
            states.sample.PAIRED,
            states.sample.AWAITING,
            states.sample.APPROVED,
            states.sample.PUBLISHING,
            states.sample.PUBLISHED,
        ]:
            impress_meta = marshaller(sample, exclude=exclude)
            impress_meta["laboratory"] = laboratory.marshal_simple(
                exclude=["lab_manager"]
            )
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
                    "pdf_content": sample_pdf,
                    "email_required": False,
                    "email_sent": False,
                    "sms_required": False,
                    "sms_sent": False,
                    "generated_by_uid": user.uid,
                    "date_generated": datetime.now(),
                }
            )
            await ReportImpress.create(sc_in)

            if action != "pre-publish":
                sample = await sample.publish(published_by=user)

            logger.info(f"sample {sample.sample_id} has been impressed.")
            to_return.append(sample)

            await streamer.stream(sample, user, "published", "sample")
        else:
            logger.info(
                f"sample {sample.sample_id} could not be impressed - status: {sample.status}"
            )

    return to_return
