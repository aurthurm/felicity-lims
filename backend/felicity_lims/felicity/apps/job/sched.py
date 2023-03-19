import datetime
import logging

from apscheduler.events import EVENT_JOB_ERROR, EVENT_JOB_EXECUTED
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from felicity.apps.analysis.tasks import submit_results, verify_results
from felicity.apps.analytics.tasks import generate_report
from felicity.apps.impress.tasks import impress_results, prepare_for_impress
from felicity.apps.job import conf as job_conf
from felicity.apps.job import models as job_models
from felicity.apps.worksheet.tasks import (
    populate_worksheet_plate,
    populate_worksheet_plate_manually,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


def felicity_halt_workforce():
    scheduler.shutdown()
    logging.info(f"Felicity workforce has been shutdown")


def felicity_pause_workforce():
    scheduler.pause()
    logging.info(f"Felicity workforce has been paused.")


def felicity_resume_workforce():
    scheduler.resume()
    logging.info(f"Felicity workforce has been resumed.")


def run_job_now(job_id, arg_dict):
    job = scheduler.get_job(job_id)
    if job:
        job.modify(next_run_time=datetime.datetime.now())
    else:
        scheduler.add_job(next_run_time=datetime.datetime.now(), **arg_dict)


def jobs_execution_listener(event):
    try:
        job_id = event.job_id
        if event.exception:
            logging.error(f"job_id {job_id} error!")
        else:
            logging.info(f"job_id {job_id} success")

            run_job_now(job_id, {})
    except AttributeError:
        pass


async def run_jobs_if_exists():
    jobs = await job_models.Job.fetch_sorted()

    logging.info(f"There are {len(jobs)} Jobs pending running.")
    if len(jobs) == 0:
        felicity_pause_workforce()
    else:
        for job in jobs:
            if job.category == job_conf.categories.WORKSHEET:
                if job.action == job_conf.actions.WS_ASSIGN:
                    logging.warning(f"Running Task: {job.action}")
                    await populate_worksheet_plate(job.uid)
                elif job.action == job_conf.actions.WS_MANUAL_ASSIGN:
                    logging.warning(f"Running Task: {job.action}")
                    await populate_worksheet_plate_manually(job.uid)
                else:
                    logging.warning(f"Unknown Worksheet job action: {job.action}")
            elif job.category == job_conf.categories.REPORT:
                logging.warning(f"Running Task: {job.action}")
                await generate_report(job.uid)
            elif job.category == job_conf.categories.IMPRESS:
                logging.warning(f"Running Task: {job.action}")
                await impress_results(job.uid)
                # felicity_resume_workforce()
            elif job.category == job_conf.categories.RESULT:
                if job.action == job_conf.actions.RESULT_SUBMIT:
                    logging.warning(f"Running Task: {job.action}")
                    await submit_results(job.uid)
                elif job.action == job_conf.actions.RESULT_VERIFY:
                    logging.warning(f"Running Task: {job.action}")
                    await verify_results(job.uid)
                else:
                    logging.warning(f"Unknown result job action: {job.action}")
            else:
                logging.warning(f"Non categorised job found: {job.uid}")


def felicity_workforce_init():
    logging.info(f"Initialising felicity workforce ...")
    scheduler.add_job(
        func=run_jobs_if_exists, trigger="interval", seconds=5, id="felicity_wf"
    )
    scheduler.add_job(
        func=prepare_for_impress,
        trigger="interval",
        seconds=60 * 60,
        id="felicity_impress",
    )
    scheduler.add_listener(
        jobs_execution_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR
    )
    scheduler.start()
