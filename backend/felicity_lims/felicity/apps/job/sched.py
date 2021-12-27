import logging
import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR

from felicity.apps.job import (
    models as job_models,
    conf as job_conf
)
from felicity.apps.worksheet.tasks import populate_worksheet_plate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


def felicity_halt_workforce():
    scheduler.shutdown()
    logging.info(f'Felicity workforce has been shutdown')


def felicity_pause_workforce():
    scheduler.pause()
    logging.info(f'Felicity workforce has been paused.')


def felicity_resume_workforce():
    scheduler.resume()
    logging.info(f'Felicity workforce has been resumed.')


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
            logging.error(f'job_id {job_id} error!')
        else:
            logging.info(f'job_id {job_id} success')

            run_job_now(job_id, {})
    except AttributeError:
        pass


"""Plug in all job types here: 
This where all the magic happens"""


async def run_jobs_if_exists():
    jobs = await job_models.Job.get_all(status__exact=job_conf.states.PENDING)

    logging.info(f'There are {len(jobs)} Jobs pending running.')
    if len(jobs) == 0:
        felicity_pause_workforce()
    else:
        for job in jobs:
            if job.category == job_conf.categories.WORKSHEET:
                if job.action == job_conf.actions.WS_ASSIGN:
                    logging.warning(f"Running Task: {job.action}")
                    await populate_worksheet_plate(job.uid)
                else:
                    logging.warning(f"Unknown Worksheet job action: {job.action}")
            else:
                logging.warning(f"Non categorised job found: {job.uid}")


def felicity_workforce_init():
    logging.info(f'Initialising felicity workforce ...')
    scheduler.add_job(func=run_jobs_if_exists, trigger="interval", seconds=5, id="felicity_wf")
    scheduler.add_listener(jobs_execution_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR)
    scheduler.start()
