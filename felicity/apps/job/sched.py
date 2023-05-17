import datetime
import logging

from apps.analysis.tasks import submit_results, verify_results
from apps.analytics.tasks import generate_report
from apps.impress.tasks import impress_results, prepare_for_impress
from apps.job import conf as job_conf
from apps.job import models as job_models
from apps.worksheet.tasks import (
    populate_worksheet_plate,
    populate_worksheet_plate_manually,
)
from apps.shipment.tasks import (
    populate_shipment_manually,
    dispatch_shipment
)
from apscheduler.events import EVENT_JOB_ERROR, EVENT_JOB_EXECUTED
from apscheduler.schedulers.asyncio import AsyncIOScheduler

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
    async def unknown_action(action):
        logging.warning(f"Unknown job action: {action}")

    jobs: list[job_models.Job] = await job_models.Job.fetch_sorted()

    logging.info(f"There are {len(jobs)} Jobs pending running.")
    if len(jobs) == 0:
        felicity_pause_workforce()
    else:
        job_dispatch_table = {
            job_conf.categories.WORKSHEET: {
                job_conf.actions.WS_ASSIGN: populate_worksheet_plate,
                job_conf.actions.WS_MANUAL_ASSIGN: populate_worksheet_plate_manually,
            },
            job_conf.categories.REPORT: {
                None: generate_report,
            },
            job_conf.categories.IMPRESS: {
                None: impress_results,
            },
            job_conf.categories.RESULT: {
                job_conf.actions.RESULT_SUBMIT: submit_results,
                job_conf.actions.RESULT_VERIFY: verify_results,
            },
            job_conf.categories.SHIPMENT: {
                job_conf.actions.SH_MANUAL_ASSIGN: populate_shipment_manually,
                job_conf.actions.SH_DISPATCH: dispatch_shipment,
            },
        }

        for job in jobs:
            action_function = job_dispatch_table.get(job.category, {}).get(
                job.action, unknown_action
            )
            logging.warning(f"Running Task: {job.action}")
            await action_function(job.uid)


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
