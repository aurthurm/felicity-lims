import logging
from typing import List
from datetime import datetime
import json
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


async def impress_from_sample_uids(uids: List[int], user):
    to_return = []

    for _sa_uid in uids:
        sample = await Sample.get(uid=_sa_uid)
        logger.info(f"sample {sample} {sample.status}")
        if sample.status in [states.sample.APPROVED, states.sample.PUBLISHING]:
            impress_meta = impress_marshaller(sample)
            impress_engine = FelicityImpress()
            sample_pdf = await impress_engine.generate(impress_meta)

            sc_in = ReportImpressCreate(**{
                "state": "final",
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
            published = await sample.publish(published_by=user)
            logger.info(f"sample {sample.sample_id} has been impressed.")
            to_return.append(published)

            if published.status == states.sample.PUBLISHED:
                await streamer.stream(sample, user, "published", "sample")
        else:
            continue

    return to_return
