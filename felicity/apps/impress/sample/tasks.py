import logging
from typing import List

from felicity.apps.analysis.entities.analysis import Sample
from felicity.apps.analysis.enum import SampleState
from felicity.apps.analysis.services.analysis import SampleService
from felicity.apps.impress.sample import utils
from felicity.apps.iol.redis import process_tracker
from felicity.apps.iol.redis.enum import TrackableObject
from felicity.apps.job import schemas as job_schemas
from felicity.apps.job.enum import JobAction, JobCategory, JobState
from felicity.apps.job.enum import JobPriority
from felicity.apps.job.services import JobService
from felicity.apps.notification.services import NotificationService
from felicity.apps.user.entities import User
from felicity.apps.user.services import UserService
from felicity.core.config import get_settings

settings = get_settings()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def impress_results(job_uid: str):
    logger.info(f"starting impress job {job_uid} ....")
    job = await JobService().get(uid=job_uid)
    if not job:
        return

    if job.status != JobState.PENDING:
        return

    await JobService().change_status(job.uid, new_status=JobState.RUNNING)

    user = await UserService().get(uid=job.creator_uid)

    await utils.impress_samples(job.data, user)
    try:
        await JobService().change_status(job.uid, new_status=JobState.FINISHED)
        await process_tracker.release(uid=job.uid, object_type=TrackableObject.SAMPLE)
        await NotificationService().notify("Your results were successfully published", user)
    except Exception as e:
        await JobService().change_status(job.uid, new_status=JobState.FAILED)
        logger.info(f"Failed impress job {job_uid} with errr: {str(e)}")
        await NotificationService().notify(
            f"Failed to publish results in job with uid: {job.uid} with error: {str(e)}",
            user,
        )


async def prepare_for_impress():
    samples: List[Sample] = await SampleService().get_all(status__in=[SampleState.APPROVED])
    data = [{"uid": s.uid, "action": "publish"} for s in samples]
    system_daemon: User = await UserService().get(email=settings.SYSTEM_DAEMON_EMAIL)
    job_schema = job_schemas.JobCreate(
        action=JobAction.IMPRESS_REPORT,
        category=JobCategory.IMPRESS,
        priority=JobPriority.NORMAL,
        job_id="0",
        status=JobState.PENDING,
        creator_uid=system_daemon.uid,
        data=data,
    )

    await JobService().create(job_schema)
    for sample in samples:
        await process_tracker.process(uid=sample.uid, object_type=TrackableObject.SAMPLE)


async def cleanup_jobs():
    """Cleanup jobs that were successfully executed"""
    jobs = await JobService().get_all(status=JobState.FINISHED)
    for job in jobs:
        await JobService().delete(job.uid)
