import logging
from typing import NoReturn

from felicity.apps.analysis import utils
from felicity.apps.job.enum import JobState
from felicity.apps.job.services import JobService
from felicity.apps.notification.services import NotificationService
from felicity.apps.user.services import UserService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def submit_results(job_uid: str) -> NoReturn:
    job_service = JobService()
    user_service = UserService()
    notification_service = NotificationService()

    logger.info(f"starting job result submit {job_uid} ....")
    job = await job_service.get(uid=job_uid)
    if not job:
        return

    if not job.status == JobState.PENDING:
        return

    await job_service.change_status(job.uid, new_status=JobState.RUNNING)

    user = await user_service.get(uid=job.creator_uid)

    try:
        await utils.results_submitter(job.data, user)
        await job_service.change_status(job.uid, new_status=JobState.FINISHED)
        await notification_service.notify(
            f"Your results were successfully submitted", user
        )
    except Exception as e:
        await job_service.change_status(job.uid, new_status=JobState.FAILED, change_reason=str(e))
        await notification_service.notify(
            f"Failed to submit results in job with uid: {job.uid} with error: {str(e)}",
            user,
        )
        raise


async def verify_results(job_uid: str) -> NoReturn:
    logger.info(f"starting job result verification {job_uid} ....")
    job_service = JobService()
    user_service = UserService()
    notification_service = NotificationService()

    job = await job_service.get(uid=job_uid)
    if not job:
        return

    if not job.status == JobState.PENDING:
        return

    await job_service.change_status(job.uid, new_status=JobState.RUNNING)

    user = await user_service.get(uid=job.creator_uid)

    try:
        await utils.verify_from_result_uids(job.data, user)
        await job_service.change_status(job.uid, new_status=JobState.FINISHED)
        await notification_service.notify(
            "Your results were successfully verified", user
        )
    except Exception as e:
        logger.debug(f"Exception ....... {e}")
        await job_service.change_status(job.uid, new_status=JobState.FAILED, change_reason=str(e))
        await notification_service.notify(
            f"Failed to verify results in job with uid: {job.uid} with error: {str(e)}",
            user,
        )
        raise


async def setup_billing(job_uid: str) -> NoReturn:
    logger.info(f"starting job setup billing {job_uid} ....")
    job_service = JobService()
    user_service = UserService()
    notification_service = NotificationService()

    job = await job_service.get(uid=job_uid)
    if not job:
        return

    if not job.status == JobState.PENDING:
        return

    await job_service.change_status(job.uid, new_status=JobState.RUNNING)

    user = await user_service.get(uid=job.creator_uid)

    try:
        await utils.billing_setup_profiles(job.data.get("profiles", []))
        await utils.billing_setup_analysis(job.data.get("analyses", []))  # noqa
        await job_service.change_status(job.uid, new_status=JobState.FINISHED)  # noqa
        await notification_service.notify("Billing setup was successfully setup", user)
    except Exception as e:
        logger.debug(f"Exception ....... {e}")
        await job_service.change_status(job.uid, new_status=JobState.FAILED)
        await notification_service.notify(
            f"Failed to setup billing in job with uid: {job.uid} with error: {str(e)}",
            user,
        )
        raise