import asyncio
import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from felicity.apps.analysis.tasks import submit_results, verify_results
from felicity.apps.analytics.tasks import generate_report
from felicity.apps.impress.sample.tasks import (
    impress_results,
    prepare_for_impress,
    cleanup_jobs,
)
from felicity.apps.iol.analyzer.services.connection import ConnectionService
from felicity.apps.job.enum import JobAction, JobCategory
from felicity.apps.job.services import JobService
from felicity.apps.shipment.tasks import (
    dispatch_shipment,
    populate_shipment_manually,
    process_shipped_report,
    return_shipped_report,
    shipment_receive,
)
from felicity.apps.worksheet.tasks import (
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

    jobs = await JobService().fetch_sorted()

    # logging.info(f"There are {len(jobs)} Jobs pending running.")

    if len(jobs) == 0:
        # felicity_pause_workforce()\
        pass
    else:
        job_dispatch_table = {
            JobCategory.WORKSHEET: {
                JobAction.WORKSHEET_ASSIGN: populate_worksheet_plate,
                JobAction.WORKSHEET_MANUAL_ASSIGN: populate_worksheet_plate_manually,
            },
            JobCategory.REPORT: {
                JobAction.GENERATE_REPORT: generate_report,
            },
            JobCategory.IMPRESS: {
                JobAction.IMPRESS_REPORT: impress_results,
            },
            JobCategory.RESULT: {
                JobAction.RESULT_SUBMIT: submit_results,
                JobAction.RESULT_APPROVE: verify_results,
            },
            JobCategory.SHIPMENT: {
                JobAction.SHIPMENT_MANUAL_ASSIGN: populate_shipment_manually,
                JobAction.SHIPMENT_DISPATCH: dispatch_shipment,
                JobAction.SHIPMENT_RECEIVE: shipment_receive,
                JobAction.SHIPPED_REPORT: return_shipped_report,
                JobAction.DIAGNOSTIC_REPORT: process_shipped_report,
            },
        }

        for job in jobs:
            action_function = job_dispatch_table.get(job.category, {}).get(
                job.action, unknown_action
            )
            logging.warning(f"Running Task: {job.action}")
            await action_function(job.uid)


def felicity_workforce_init():
    logging.info("Initialising felicity workforce ...")
    scheduler.add_job(
        func=run_jobs_if_exists, trigger=IntervalTrigger(seconds=10), id="felicity_wf"
    )
    scheduler.add_job(
        func=prepare_for_impress,
        trigger=IntervalTrigger(seconds=60 * 60),
        id="felicity_impress",
    )
    scheduler.add_job(
        func=cleanup_jobs,
        trigger=IntervalTrigger(seconds=60 * 60 * 24),
        id="felicity_jobs_clean",
    )

    # Instrument connections
    conn_service = ConnectionService()
    connections = asyncio.run(conn_service.get_links())
    for _conn in connections:
        # Each instrument gets its own persistent job that runs forever
        scheduler.add_job(
            _conn.connect,
            args=[_conn],
            id=f"instrument_{_conn.uid}",
            replace_existing=True
        )

    # Start scheduler
    scheduler.start()
