import logging
from datetime import datetime
from typing import List
import json

from apps.analysis.conf import states
from apps.analysis.models.analysis import Sample
from apps.impress.models import ReportImpress
from apps.impress.reports.generic import FelicityImpress
from apps.impress.reports.utils import delete_from_nested
from apps.impress.schemas import ReportImpressCreate
from apps.notification.utils import FelicityStreamer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

streamer = FelicityStreamer()


def impress_marshaller(obj, path=None, memoize=None) -> dict:
    """Notes:
        1. We use memoization To prevent marshalling the same object again hence speed things up
        2. We use path tracking To stop marshalling when a path starts to repeat itself or meets a certain path restriction
    """
    if memoize is None:
        memoize = {}
        
    if path is None:
      path = []

    if id(obj) in memoize:
        return memoize[id(obj)]
        
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
        if (key.startswith("_") or key in exclude) or (path and path[-1] == key):
            continue
        
        element = []
        if isinstance(val, list):
            for item in val:
                element.append(impress_marshaller(item, path + [key], memoize))
        else:
            element = impress_marshaller(val, path + [key], memoize)
        result[key] = element
        
        memoize[id(obj)] = result
    return result


def clean_paths(obj: dict) -> dict:
    paths = [
        "profiles.analyses.profiles",
        "analyses.profiles.analyses",
        "analysis_results.analysis.profiles",
    ]
    for _path in paths:
        obj = delete_from_nested(obj, _path)
    return obj


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
            states.sample.PAIRED,
            states.sample.AWAITING,
            states.sample.APPROVED,
            states.sample.PUBLISHING,
            states.sample.PUBLISHED,
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
                
            logger.info(f"report_state {report_state}: running impress ....")
            impress_engine = FelicityImpress()
            sample_pdf = await impress_engine.generate(impress_meta, report_state)

            # TODO: fix saving of json data - skipping for now :::::: 
            #       Saving this json is paramount -> keeps track of the data it the same state as when it was impressed
            #      "json_content": impress_meta
            
            sc_in = ReportImpressCreate(
                **{
                    "state": report_state,
                    "sample_uid": sample.uid,
                    "json_content": {},
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
            logger.info(f"sample {sample.sample_id} could not be impressed - status: {sample.status}")
            

    return to_return
