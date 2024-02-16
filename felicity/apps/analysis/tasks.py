import logging

from felicity.apps.analysis import utils
from felicity.apps.job import models as job_models
from felicity.apps.job.conf import states as job_states
from felicity.apps.notification.utils import ReportNotifier
from felicity.apps.user import models as user_models

report_notifier = ReportNotifier()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def submit_results(job_uid: str):
    logger.info(f"starting job result submit {job_uid} ....")
    job = await job_models.Job.get(uid=job_uid)
    if not job:
        return

    if not job.status == job_states.PENDING:
        return

    await job.change_status(new_status=job_states.RUNNING)

    user = await user_models.User.get(uid=job.creator_uid)

    try:
        await utils.results_submitter(job.data, user)
        await job.change_status(new_status=job_states.FINISHED)
        await report_notifier.notify(f"Your results were successfully submitted", user)
    except Exception as e:
        await job.change_status(new_status=job_states.FAILED)
        await report_notifier.notify(
            f"Failed to submit results in job with uid: {job.uid} with error: {str(e)}",
            user,
        )


async def verify_results(job_uid: str):
    logger.info(f"starting job result verification {job_uid} ....")
    job = await job_models.Job.get(uid=job_uid)
    if not job:
        return

    if not job.status == job_states.PENDING:
        return

    await job.change_status(new_status=job_states.RUNNING)

    user = await user_models.User.get(uid=job.creator_uid)

    try:
        await utils.verify_from_result_uids(job.data, user)
        await job.change_status(new_status=job_states.FINISHED)
        await report_notifier.notify("Your results were successfully verified", user)
    except Exception as e:
        logger.debug(f"Exception ....... {e}")
        await job.change_status(new_status=job_states.FAILED)
        await report_notifier.notify(
            f"Failed to verify results in job with uid: {job.uid} with error: {str(e)}",
            user,
        )


async def setup_billing(job_uid: str):
    logger.info(f"starting job setup billing {job_uid} ....")
    job = await job_models.Job.get(uid=job_uid)
    if not job:
        return

    if not job.status == job_states.PENDING:
        return

    await job.change_status(new_status=job_states.RUNNING)

    user = await user_models.User.get(uid=job.creator_uid)

    try:
        await utils.billing_setup_profiles(job.data.get("profiles", []), user)
        await utils.billing_setup_analysis(job.data.get("analyses", []), user)
        await job.change_status(new_status=job_states.FINISHED)
        await report_notifier.notify("Billing setup was successfully setup", user)
    except Exception as e:
        logger.debug(f"Exception ....... {e}")
        await job.change_status(new_status=job_states.FAILED)
        await report_notifier.notify(
            f"Failed to setup billing in job with uid: {job.uid} with error: {str(e)}",
            user,
        )
