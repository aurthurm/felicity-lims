import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from apps.analysis.tasks import submit_results, verify_results
from apps.analytics.tasks import generate_report
from apps.impress.tasks import impress_results, prepare_for_impress
from apps.job import conf as job_conf
from apps.job import models as job_models
from apps.shipment.tasks import (
    populate_shipment_manually,
    dispatch_shipment,
    shipment_receive,
    return_shipped_report,
    process_shipped_report,
)
from apps.worksheet.tasks import (
    populate_worksheet_plate,
    populate_worksheet_plate_manually,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# apscheduler
log = logging.getLogger("apscheduler.executors.default")
log.setLevel(logging.WARNING)

scheduler = AsyncIOScheduler()


async def run_jobs_if_exists():
    async def unknown_action(action):
        logging.warning(f"Unknown job action: {action}")

    jobs: list[job_models.Job] = await job_models.Job.fetch_sorted()

    # logging.info(f"There are {len(jobs)} Jobs pending running.")

    if len(jobs) == 0:
        # felicity_pause_workforce()\
        pass
    else:
        job_dispatch_table = {
            job_conf.categories.WORKSHEET: {
                job_conf.actions.WS_ASSIGN: populate_worksheet_plate,
                job_conf.actions.WS_MANUAL_ASSIGN: populate_worksheet_plate_manually,
            },
            job_conf.categories.REPORT: {
                job_conf.actions.GENERATE_REPORT: generate_report,
            },
            job_conf.categories.IMPRESS: {
                job_conf.actions.IMPRESS_REPORT: impress_results,
            },
            job_conf.categories.RESULT: {
                job_conf.actions.RESULT_SUBMIT: submit_results,
                job_conf.actions.RESULT_VERIFY: verify_results,
            },
            job_conf.categories.SHIPMENT: {
                job_conf.actions.SH_MANUAL_ASSIGN: populate_shipment_manually,
                job_conf.actions.SH_DISPATCH: dispatch_shipment,
                job_conf.actions.SH_RECEIVE: shipment_receive,
                job_conf.actions.SHIPPED_REPORT: return_shipped_report,
                job_conf.actions.DIAGNOSTIC_REPORT: process_shipped_report,
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
        func=run_jobs_if_exists, trigger=IntervalTrigger(seconds=10), id="felicity_wf"
    )
    scheduler.add_job(
        func=prepare_for_impress,
        trigger=IntervalTrigger(seconds=60 * 60),
        id="felicity_impress",
    )
    scheduler.start()
