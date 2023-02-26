import logging
from typing import List

from felicity.apps.analysis.models.analysis import Sample
from felicity.apps.user import models as user_models
from felicity.apps.notification.utils import ReportNotifier
from felicity.apps.impress import utils
from felicity.apps.analysis.conf import states
from felicity.apps.job import models as job_models
from felicity.apps.job import schemas as job_schemas
from felicity.apps.job.conf import (
    actions, categories, priorities, states as job_states
)
from felicity.apps.user.models import User
from felicity.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

report_notifier = ReportNotifier()


async def impress_results(job_uid: int):
    logger.info(f"starting impress job {job_uid} ....")
    job = await job_models.Job.get(uid=job_uid)
    if not job:
        return

    if not job.status == job_states.PENDING:
        return

    await job.change_status(new_status=job_states.RUNNING)

    user = await user_models.User.get(uid=job.creator_uid)

    try:
        user = user
        await utils.impress_samples(job.data, user)
        await job.change_status(new_status=job_states.FINISHED)
        await report_notifier.notify(f"Your results were successfully published", user)
    except Exception as e:
        await job.change_status(new_status=job_states.FAILED)
        await report_notifier.notify(
            f"Failed to publish results in job with uid: {job.uid} with error: {str(e)}",
            user,
        )


async def prepare_for_impress():
    samples: List[Sample] = await Sample.get_all(status=states.sample.APPROVED)
    sample_uids = [sample.uid for sample in samples]

    await Sample.bulk_update_with_mappings([
        {'uid': uid, "status": states.sample.PUBLISHING} for uid in sample_uids
    ])

    system_daemon: User = await User.get(email=settings.SYSTEM_DAEMONUSER_EMAIL)

    job_schema = job_schemas.JobCreate(
        action=actions.IMPRESS_REPORT,
        category=categories.IMPRESS,
        priority=priorities.NORMAL,
        job_id=0,
        status=job_states.PENDING,
        creator_uid=system_daemon.uid,
        data=sample_uids,
    )

    await job_models.Job.create(job_schema)
