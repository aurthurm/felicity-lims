import logging

from felicity.apps.iol.fhir.utils import (get_diagnostic_report_resource,
                                          get_shipment_bundle_resource)
from felicity.apps.iol.relay import post_data
from felicity.apps.job.services import JobService
from felicity.apps.shipment.services import ShipmentService, ShippedSampleService
from felicity.apps.shipment.utils import (shipment_assign, shipment_receive,
                                          shipment_reset_assigned_count,
                                          shipment_result_update)
from felicity.apps.user.entities import User
from felicity.apps.job.enum import JobState
from felicity.apps.shipment.enum import ShipmentState

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def populate_shipment_manually(job_uid: str):
    logger.info(f"starting job {job_uid} ....")
    job_service = JobService()
    shipment_service = ShipmentService()

    job = await job_service.get(uid=job_uid)
    if not job:
        return

    if not job.status == JobState.PENDING:
        return

    await job_service.change_status(job.uid, new_status=JobState.RUNNING)
    shipment_uid = job.job_id

    shipment = await shipment_service.get(uid=shipment_uid)
    if not shipment:
        await job_service.change_status(job.uid, 
            new_status=JobState.FAILED,
            change_reason=f"Failed to acquire Shipment {shipment_uid}",
        )
        logger.warning(f"Failed to acquire Shipment {shipment_uid}")
        return

    await shipment_reset_assigned_count(shipment.uid)

    # handle Empty and preperation
    if shipment.state not in [
        ShipmentState.EMPTY,
        ShipmentState.PREPERATION,
    ]:
        await job_service.change_status(job.uid, 
            new_status=JobState.FAILED,
            change_reason=f"Shipment {shipment_uid} - is already processed",
        )
        logger.warning(f"Shipment {shipment_uid} - is already processed")
        return

    await shipment_assign(shipment.uid, job.data, job.creator_uid)

    await job_service.change_status(job.uid, new_status=JobState.FINISHED)
    logger.info(f"Done !! Job {job_uid} was executed successfully :)")


async def dispatch_shipment(job_uid: str, by_uid=None):
    logger.info(f"running shipment dispatch job: {job_uid} ....")
    job_service = JobService()
    shipment_service = ShipmentService()

    job = await job_service.get(uid=job_uid)
    if not job:
        return

    if not job.status == JobState.PENDING:
        return None

    await job_service.change_status(job.uid, new_status=JobState.RUNNING)
    shipment_uid = job.job_id
    shipment = await shipment_service.get(uid=shipment_uid)

    if not shipment.state == ShipmentState.AWAITING:
        await job_service.change_status(job.uid, new_status=JobState.FAILED)
        return None

    resource = await get_shipment_bundle_resource(shipment_uid)
    success = await post_data(
        f"{shipment.laboratory.url}/Bundle",
        resource.model_dump(exclude_none=True),
        shipment.laboratory.username,
        shipment.laboratory.password,
    )

    await job_service.change_status(job.uid, 
        new_status=JobState.PENDING if not success else JobState.FINISHED
    )
    await shipment.change_state(
        state=ShipmentState.FAILED
        if not success
        else ShipmentState.SHIPPED,
        updated_by_uid=by_uid if by_uid else job.creator_uid,
    )
    if not success:
        await job.backoff(1, 10)

    return await shipment_service.get(uid=shipment_uid)


async def receive_shipment(job_uid: str):
    logger.info(f"starting job receive shipment: {job_uid} ....")
    job_service = JobService()
    shipment_service = ShipmentService()

    job = await job_service.get(uid=job_uid)
    if not job:
        return

    if not job.status == JobState.PENDING:
        return

    await job_service.change_status(job.uid, new_status=JobState.RUNNING)
    shipment_uid = job.job_id

    shipment = await shipment_service.get(uid=shipment_uid)
    if not shipment:
        await job_service.change_status(job.uid, 
            new_status=JobState.FAILED,
            change_reason=f"Failed to acquire Shipment {shipment_uid}",
        )
        logger.warning(f"Failed to acquire Shipment {shipment_uid}")
        return

    await shipment_receive(shipment.uid, job.data, job.creator_uid)

    await job_service.change_status(job.uid, new_status=JobState.FINISHED)
    logger.info(f"Done !! Job {job_uid} was executed successfully :)")


async def return_shipped_report(job_uid: str):
    logger.info(f"starting job return shipped report: {job_uid} ....")
    job_service = JobService()
    shipment_service = ShipmentService()
    shipped_sample_service = ShippedSampleService()


    job = await job_service.get(uid=job_uid)
    if not job:
        return

    if not job.status == JobState.PENDING:
        return

    await job_service.change_status(job.uid, new_status=JobState.RUNNING)

    shipped_sample_uid = job.job_id
    shipped = await shipped_sample_service.get(
        uid=shipped_sample_uid
    )

    if not shipped:
        await job_service.change_status(job.uid, 
            new_status=JobState.FAILED,
            change_reason=f"Failed to acquire shipped sample {shipped_sample_uid}",
        )
        logger.warning(f"Failed to acquire shipped sample {shipped_sample_uid}")
        return

    shipment = await shipment_service.get(uid=shipped.shipment_uid)
    if not shipment:
        await job_service.change_status(job.uid, 
            new_status=JobState.FAILED,
            change_reason=f"Failed to acquire Shipment {shipped.shipment_uid}",
        )
        logger.warning(f"Failed to acquire Shipment {shipped.shipment_uid}")
        return

    result_uids = []
    if job.data["target"] == "result":
        result_uids.append(job.data["uid"])

    resource = await get_diagnostic_report_resource(
        shipped.sample.analysis_request_uid, result_uids, True
    )
    success = await post_data(
        f"{shipment.laboratory.url}DiagnosticReport",
        resource.model_dump(exclude_none=True),
        shipment.laboratory.username,
        shipment.laboratory.password,
    )

    if not success:
        await job_service.change_status(job.uid, new_status=JobState.FAILED)
    else:
        await job_service.change_status(job.uid, new_status=JobState.FINISHED)


async def process_shipped_report(job_uid: str):
    logger.info(f"starting job return shipped report: {job_uid} ....")
    job_service = JobService()

    job = await job_service.get(uid=job_uid)
    if not job:
        return

    if not job.status == JobState.PENDING:
        return

    await job_service.change_status(job.uid, new_status=JobState.RUNNING)
    data = job.data.get("data", None)

    assert data["resourceType"] == "DiagnosticReport"

    actor = await User.get(uid=job.creator_uid)
    await shipment_result_update(data, actor)

    await job_service.change_status(job.uid, new_status=JobState.FINISHED)
