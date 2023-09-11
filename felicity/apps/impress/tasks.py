import logging
from typing import List

from apps.analysis.conf import states
from apps.analysis.models.analysis import Sample
from apps.impress import utils
from apps.job import models as job_models
from apps.job import schemas as job_schemas
from apps.job.conf import actions, categories, priorities
from apps.job.conf import states as job_states
from apps.notification.utils import ReportNotifier
from apps.user import models as user_models
from apps.user.models import User
from core.config import settings


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

report_notifier = ReportNotifier()


async def impress_results(job_uid: str):
    logger.info(f"starting impress job {job_uid} ....")
    job = await job_models.Job.get(uid=job_uid)
    if not job:
        return

    if job.status != job_states.PENDING:
        return

    await job.change_status(new_status=job_states.RUNNING)

    user = await user_models.User.get(uid=job.creator_uid)

    try:
        user = user
        await utils.impress_samples(job.data, user)
        await job.change_status(new_status=job_states.FINISHED)
        await report_notifier.notify("Your results were successfully published", user)
    except Exception as e:
        await job.change_status(new_status=job_states.FAILED)
        await report_notifier.notify(
            f"Failed to publish results in job with uid: {job.uid} with error: {str(e)}",
            user,
        )


async def prepare_for_impress():
    samples: List[Sample] = await Sample.get_all(status__in=[states.sample.APPROVED])
    sample_uids = [sample.uid for sample in samples]

    await Sample.bulk_update_with_mappings(
        [{"uid": uid, "status": states.sample.PUBLISHING} for uid in sample_uids]
    )

    system_daemon: User = await User.get(email=settings.SYSTEM_DAEMONUSER_EMAIL)

    job_schema = job_schemas.JobCreate(
        action=actions.IMPRESS_REPORT,
        category=categories.IMPRESS,
        priority=priorities.NORMAL,
        job_id="0",
        status=job_states.PENDING,
        creator_uid=system_daemon.uid,
        data=sample_uids,
    )

    await job_models.Job.create(job_schema)
