import logging
from typing import List
from datetime import datetime
from felicity.apps.analysis.models.analysis import Sample
from felicity.apps.analysis.conf import states
from felicity.apps.impress.models import ReportImpress
from felicity.apps.impress.reports.generic import FelicityImpress
from felicity.apps.impress.schemas import ReportImpressCreate
from felicity.apps.notification.utils import FelicityStreamer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

streamer = FelicityStreamer()


def impress_marshaller(obj):
    exclude = ["auth", "preference", "groups", "right", "left", "level", "tree_id", "parent_id", "parent"]
    if not hasattr(obj, "__dict__"):
        if obj is None:
            return ""
        if isinstance(obj, datetime):
            return obj.strftime("%Y-%m-%d %H:%M:%S")
        if hasattr(obj, "__str__"):
            return obj.__str__()
        return obj

    result = {}
    for key, val in obj.__dict__.items():
        if key.startswith("_") or key in exclude:
            continue
        element = []
        if isinstance(val, list):
            for item in val:
                element.append(impress_marshaller(item))
        else:
            element = impress_marshaller(val)
        result[key] = element
    return result


async def harvest_sample_metadata():
    sample = await Sample.get(uid=1207)
    d = impress_marshaller(sample)
    logger.info(d)


async def impress_samples(sample_meta: List[any], user):
    to_return = []

    for s_meta in sample_meta:
        sample = await Sample.get(uid=s_meta.get("uid"))
        logger.info(f"sample {sample} {sample.status}")
        if sample.status in [
            states.sample.RECEIVED,
            states.sample.AWAITING,
            states.sample.APPROVED,
            states.sample.PUBLISHING,
            states.sample.PUBLISHED
        ]:
            impress_meta = impress_marshaller(sample)

            report_state = "Unknown"
            action = s_meta.get("action")
            if action == "publish":
                report_state = "Final Report"
            if action == "re-publish":
                report_state = "Final Report -- republish"
            if action == "pre-publish":
                report_state = "Preliminary Report"

            impress_engine = FelicityImpress()
            sample_pdf = await impress_engine.generate(impress_meta, report_state)

            sc_in = ReportImpressCreate(**{
                "state": report_state,
                "sample_uid": sample.uid,
                "json_content": impress_meta,
                "pdf_content": sample_pdf,
                "email_required": False,
                "email_sent": False,
                "sms_required": False,
                "sms_sent": False,
                "generated_by_uid": user.uid,
                "date_generated": datetime.now()
            })

            await ReportImpress.create(sc_in)
            if action != "pre-publish":
                sample = await sample.publish(published_by=user)

            logger.info(f"sample {sample.sample_id} has been impressed.")
            to_return.append(sample)

            await streamer.stream(sample, user, "published", "sample")
        else:
            continue

    return to_return
