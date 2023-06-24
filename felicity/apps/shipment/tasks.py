import logging

from apps.job import models as job_models
from apps.job.conf import states as job_states
from apps.shipment import conf, models
from apps.shipment.utils import shipment_assign, shipment_reset_assigned_count
from apps.iol.relay import post_data
from apps.iol.fhir.utils import get_shipment_bundle_resource


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def populate_shipment_manually(job_uid: str):
    logger.info(f"starting job {job_uid} ....")
    job: job_models.Job = await job_models.Job.get(uid=job_uid)
    if not job:
        return

    if not job.status == job_states.PENDING:
        return

    await job.change_status(new_status=job_states.RUNNING)
    shipment_uid = job.job_id

    shipment: models.Shipment = await models.Shipment.get(uid=shipment_uid)
    if not shipment:
        await job.change_status(
            new_status=job_states.FAILED,
            change_reason=f"Failed to acquire Shipment {shipment_uid}",
        )
        logger.warning(f"Failed to acquire Shipment {shipment_uid}")
        return

    await shipment_reset_assigned_count(shipment.uid)

    # handle Empty and preperation
    if shipment.state not in [conf.shipment_states.EMPTY, conf.shipment_states.PREPERATION]:
        await job.change_status(
            new_status=job_states.FAILED,
            change_reason=f"Shipment {shipment_uid} - is already processed",
        )
        logger.warning(f"Shipment {shipment_uid} - is already processed")
        return

    await shipment_assign(shipment.uid, job.data, job.creator_uid)

    await job.change_status(new_status=job_states.FINISHED)
    logger.info(f"Done !! Job {job_uid} was executed successfully :)")


async def dispatch_shipment(job_uid: str, by_uid=None):
    logger.info(f"running shipment dispatch job: {job_uid} ....")
    job: job_models.Job = await job_models.Job.get(uid=job_uid)
    if not job:
        return

    if not job.status == job_states.PENDING:
        return None

    await job.change_status(new_status=job_states.RUNNING)
    shipment_uid = job.job_id
    shipment:models.Shipment = await models.Shipment.get(uid=shipment_uid)
    
    if not shipment.state == conf.shipment_states.AWAITING:
        await job.change_status(new_status=job_states.FAILED)
        return None
    
    resource = await get_shipment_bundle_resource(shipment_uid)
    success = await post_data(
        f"{shipment.laboratory.url}Bundle", 
        resource.json(exclude_none=True), 
        shipment.laboratory.username, 
        shipment.laboratory.password
    )
    
    await job.change_status(new_status=job_states.PENDING if not success else job_states.FINISHED)
    await shipment.change_state(
        state=conf.shipment_states.FAILED if not success else conf.shipment_states.SHIPPED, 
        updated_by_uid=by_uid if by_uid else job.creator_uid
    )
    if not success:
        await job.backoff(1, 10)
    
    return await models.Shipment.get(uid=shipment_uid)
