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


async def harvest_sample_metadata(sample):
    return {
        "patient": {},
        "analysis_request": {},
        "sample": {},
        "profiles": [],
        "analyses": [],
        "analysis_results": [],
    }


async def impress_from_sample_uids(uids: List[int], user):
    to_return = []

    for _sa_uid in uids:
        sample: Sample = await Sample.get(uid=_sa_uid)

        logger.info(f" impress_from_sample_uids sample {sample.sample_id} ....")
        if not sample:
            raise Exception(f"Sample with uid {_sa_uid} not found")

        # No Empty Results
        status = getattr(sample, "status", None)
        if status in [states.sample.APPROVED, states.sample.PUBLISHING]:
            # impress now
            logger.info(f"starting impress for sample {sample.sample_id} ....")
            impress_engine = FelicityImpress()
            sample_pdf = await impress_engine.generate(sample)
            logger.info(f"pdf_bytes ....")
            metadata = await harvest_sample_metadata(sample)
            sc_in = ReportImpressCreate(**{
                "state": "final",
                "sample_uid": sample.uid,
                "json_content": metadata,
                "pdf_content": sample_pdf,
                "email_required": False,
                "email_sent": False,
                "sms_required": False,
                "sms_sent": False,
                "generated_by_uid": user.uid,
                "date_generated": datetime.now()
            })
            logger.info(f"sc_in {sc_in}")

            impressed = await ReportImpress.create(sc_in)
            logger.info(f"impressed {impressed}")
            published = await sample.publish(published_by=user)
            logger.info(f"sample has been impressed.")
            to_return.append(published)

            if published.status == states.sample.PUBLISHED:
                await streamer.stream(sample, user, "published", "sample")
        else:
            continue

    return to_return
