import logging
from typing import List

from felicity.apps.analysis.entities.analysis import Sample
from felicity.apps.analysis.enum import SampleState
from felicity.apps.impress.sample import utils
from felicity.apps.job import entities as job_entities
from felicity.apps.job import schemas as job_schemas
from felicity.apps.job.enum import JobAction, JobCategory, JobState
from felicity.apps.user import entities as user_entities
from felicity.apps.user.entities import User
from felicity.core.config import get_settings

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def impress_results(job_uid: str):
    logger.info(f"starting impress job {job_uid} ....")
    job = await job_entities.Job.get(uid=job_uid)
    if not job:
        return

    if job.status != JobState.PENDING:
        return

    await job.change_status(new_status=JobState.RUNNING)

    user = await user_entities.User.get(uid=job.creator_uid)

    try:
        await utils.impress_samples(job.data, user)
        await job.change_status(new_status=JobState.FINISHED)
        await report_notifier.notify("Your results were successfully published", user)
    except Exception as e:
        await job.change_status(new_status=JobState.FAILED)
        logger.info(f"Failed impress job {job_uid} with errr: {str(e)}")
        await report_notifier.notify(
            f"Failed to publish results in job with uid: {job.uid} with error: {str(e)}",
            user,
        )


async def prepare_for_impress():
    samples: List[Sample] = await Sample.get_all(status__in=[SampleState.APPROVED])
    sample_uids = [sample.uid for sample in samples]

    await Sample.bulk_update_with_mappings(
        [{"uid": uid, "status": SampleState.PUBLISHING} for uid in sample_uids]
    )

    system_daemon: User = await User.get(email=settings.SYSTEM_DAEMON_EMAIL)

    job_schema = job_schemas.JobCreate(
        action=JobAction.IMPRESS_REPORT,
        category=JobCategory.IMPRESS,
        priority=JobCategory.NORMAL,
        job_id="0",
        status=JobState.PENDING,
        creator_uid=system_daemon.uid,
        data=sample_uids,
    )

    await job_entities.Job.create(job_schema)
