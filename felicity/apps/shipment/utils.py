import logging
import asyncio

from apps.analysis.models.analysis import Sample
from apps.analysis.models.results import AnalysisResult
from apps.analysis import conf as analysis_conf
from apps.shipment.models import Shipment, ShippedSample
from apps.shipment.schemas import ShipmentUpdate
from apps.shipment.manifest import ManifetReport
from apps.shipment import conf
from apps.iol.relay import post_data
from apps.iol.fhir.utils import get_shipment_bundle_resource

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# shipments
async def shipment_assign(shipment_uid: str, samples_data: list[dict], actor_uid):
    shipment: Shipment = await Shipment.get(uid=shipment_uid)

    async def process_sample(sample_data):
        sample: Sample = await Sample.get(uid=sample_data.get("sample_uid", None))
        if not sample:
            logger.info(f"Failed to retrieve sample {sample_data} .... skipping")
            return

        analytes: list[AnalysisResult] = await AnalysisResult.get_by_uids(uids=sample_data.get("analyses", []))
        # await asyncio.gather(*(analyte.change_status(analysis_conf.states.Result.REFERRED) for analyte in analytes))
        for analyte in analytes:
            await analyte.change_status(analysis_conf.states.Result.REFERRED)

        fully_referred = await sample.has_fully_referred_analyses()
        if fully_referred:
            await sample.change_status(analysis_conf.states.sample.REFERRED, actor_uid)
        else:
            await sample.change_status(analysis_conf.states.sample.PAIRED, actor_uid)

        await ShippedSample.create({
            "sample_uid": sample.uid,
            "shipment_uid": shipment.uid
        })

    async def worker(sample_data):
        async with semaphore:
            await process_sample(sample_data)

    # Create a semaphore with a limit of concurrent tasks
    num_workers = 10  # Adjust this value based on your system's capacity
    semaphore = asyncio.Semaphore(num_workers)

    # Process samples concurrently using the semaphore
    # await asyncio.gather(*(worker(sample_data) for sample_data in samples_data))
    for sample_data in samples_data:
        await worker(sample_data)

    return await shipment_reset_assigned_count(shipment.uid)


async def shipment_recover(shipment_uid: str, samples_data: list[dict], actor_uid):
    shipment: Shipment = await Shipment.get(uid=shipment_uid)

    async def process_sample(sample_data):
        sample: Sample = await Sample.get(uid=sample_data.get("sample_uid", None))
        if not sample:
            logger.info(f"Failed to retrieve sample {sample_data} .... skipping")
            return

        _, analytes = await sample.get_referred_analyses()
        for analyte in analytes:
            await analyte.change_status(analysis_conf.states.Result.PENDING)

        no_referred = await sample.has_no_referred_analyses()
        if no_referred:
            await sample.change_status(analysis_conf.states.sample.RECEIVED, actor_uid)
        else:
            await sample.change_status(analysis_conf.states.sample.PAIRED, actor_uid)

        shipped_sample: ShippedSample = await ShippedSample.get(sample_uid=sample_data.get("sample_uid", None))
        if shipped_sample and no_referred:
            await shipped_sample.delete()

    async def worker(sample_data):
        async with semaphore:
            await process_sample(sample_data)

    # Create a semaphore with a limit of concurrent tasks
    num_workers = 10  # Adjust this value based on your system's capacity
    semaphore = asyncio.Semaphore(num_workers)

    # Process samples concurrently using the semaphore
    await asyncio.gather(*(worker(sample_data) for sample_data in samples_data))

    return await shipment_reset_assigned_count(shipment.uid)


async def shipment_recall(shipment_uid: str, samples_data: list[dict], actor_uid):
    shipment: Shipment = await Shipment.get(uid=shipment_uid)

    async def process_sample(sample_data):
        sample: Sample = await Sample.get(uid=sample_data.get("sample_uid", None))
        if not sample:
            logger.info(f"Failed to retrieve sample {sample_data} .... skipping")
            return

        await sample.change_status(analysis_conf.states.sample.PAIRED, actor_uid)

    async def worker(sample_data):
        async with semaphore:
            await process_sample(sample_data)

    # Create a semaphore with a limit of concurrent tasks
    num_workers = 10  # Adjust this value based on your system's capacity
    semaphore = asyncio.Semaphore(num_workers)

    # Process samples concurrently using the semaphore
    await asyncio.gather(*(worker(sample_data) for sample_data in samples_data))

    return shipment


async def shipment_reset_assigned_count(shipment_uid: str):
    shipment:Shipment = await Shipment.get(uid=shipment_uid)
    shiped_samples = await ShippedSample.get_all(shipment_uid=shipment.uid)

    count = len(shiped_samples)
    if count == 0:
        shipment.state = conf.shipment_states.EMPTY

    if count > 0 and shipment.state == conf.shipment_states.EMPTY:
        shipment.state = conf.shipment_states.PREPERATION

    shipment.assigned_count = count
    return await shipment.save()


async def action_shipment(shipment_uid: str, action: str, actor):
    if action == "finalise":
        await shipment_finalise(shipment_uid, actor)
    elif action == "cancel":
        await shipment_cancel(shipment_uid, actor.uid)
    elif action == "dispatch-now":
        await shipment_send(shipment_uid, actor.uid)
    else:
        pass
    
    return await Shipment.get(uid=shipment_uid)


async def shipment_cancel(shipment_uid: str, actor_uid):
    shipment:Shipment = await Shipment.get(uid=shipment_uid)
    shiped_samples:ShippedSample = await ShippedSample.get_all(shipment_uid=shipment.uid)
    samples: list[Sample] = list(map(lambda ss: ss.sample, shiped_samples))

    async def process_sample(sample: Sample):
        _, analytes = await sample.get_referred_analyses()
        await asyncio.gather(*(analyte.change_status(analysis_conf.states.Result.PENDING) for analyte in analytes))
        await sample.change_status(analysis_conf.states.sample.RECEIVED, actor_uid)

    for sample in samples:
        await process_sample(sample)

    return await shipment.change_state(conf.shipment_states.CANCELLED, actor_uid)


async def shipment_finalise(shipment_uid: str, finaliser):
    shipment:Shipment = await Shipment.get(uid=shipment_uid)
    
    if not shipment.state == conf.shipment_states.PREPERATION:
        return

    # generate manifest
    shiped_samples:ShippedSample = await ShippedSample.get_all(shipment_uid=shipment.uid)
    samples: list[Sample] = list(map(lambda ss: ss.sample, shiped_samples))

    manifest_data = []
    for sample in samples:
        services = []
        _, analytes = await sample.get_referred_analyses()
        for analyte in analytes:
            services.append(analyte.analysis.name)

        manifest_data.append({
        "sample_id": sample.sample_id,
        "client_sample_id": sample.analysis_request.client_request_id,
        "date_collected": sample.date_collected if sample.date_collected else "",
        "sample_type": sample.sample_type.name,
        "services": services
        })

    manifest_pdf = await ManifetReport().generate(manifest_data)

    update_in = ShipmentUpdate(**{
        "json_content": { "data": manifest_data },
        "pdf_content": manifest_pdf,
    })
    
    await shipment.update(obj_in=update_in)

    return await shipment.finalise(finaliser)


async def shipment_send(uid: str, by_uid=None):
    shipment:Shipment = await Shipment.get(uid=uid)
    resource = await get_shipment_bundle_resource(uid)
    success = await post_data(
        f"{shipment.laboratory.url}Bundle", 
        resource.json(exclude_none=True), 
        shipment.laboratory.username, 
        shipment.laboratory.password
    )
    return await shipment.change_state(
        state=conf.shipment_states.FAILED if not success else conf.shipment_states.SHIPPED, 
        updated_by_uid=by_uid
    )
    