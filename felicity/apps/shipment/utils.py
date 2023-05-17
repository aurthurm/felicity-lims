import logging
import asyncio

from apps.analysis.models.analysis import Sample
from apps.analysis.models.results import AnalysisResult
from apps.analysis import conf as analysis_conf
from apps.shipment.models import Shipment, ShipedSample
from apps.shipment.manifest import ManifetReport
from apps.shipment import conf

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# shipments
async def shipment_assign(shipment_uid: str, samples_data: list[dict]):
    shipment: Shipment = await Shipment.get(uid=shipment_uid)

    async def process_sample(sample_data):
        sample: Sample = await Sample.get(sample_data.get("sample_uid", None))
        if not sample:
            logger.info(f"Failed to retrieve sample {sample_data} .... skipping")
            return

        analytes: list[AnalysisResult] = AnalysisResult.get_by_uids(uids=sample_data.get("analyses_uids", []))
        await asyncio.gather(*(analyte.change_status(analysis_conf.states.Result.REFERRED) for analyte in analytes))

        fully_referred = await sample.has_fully_referred_analyses()
        if fully_referred:
            await sample.change_status(analysis_conf.states.sample.REFERRED, "user goes here")
        else:
            await sample.change_status(analysis_conf.states.sample.PAIRED, "user goes here")

        await ShipedSample.create({
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
    await asyncio.gather(*(worker(sample_data) for sample_data in samples_data))

    return await shipment_reset_assigned_count(shipment.uid)


async def shipment_unassign(shipment_uid: str, samples_data: list[dict]):
    shipment: Shipment = await Shipment.get(uid=shipment_uid)

    async def process_sample(sample_data):
        sample: Sample = await Sample.get(sample_data.get("sample_uid", None))
        if not sample:
            logger.info(f"Failed to retrieve sample {sample_data} .... skipping")
            return

        analytes: list[AnalysisResult] = AnalysisResult.get_by_uids(uids=sample_data.get("analyses_uids", []))
        await asyncio.gather(*(analyte.change_status(analysis_conf.states.Result.PENDING) for analyte in analytes))

        no_referred = await sample.has_no_referred_analyses()
        if no_referred:
            await sample.change_status(analysis_conf.states.sample.RECEIVED, "user goes here")
        else:
            await sample.change_status(analysis_conf.states.sample.PAIRED, "user goes here")

        shipped_sample = await ShipedSample.get(uid=sample_data.shipped_sample_uid)
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


async def shipment_reset_assigned_count(shipment_uid: str):
    shipment:Shipment = await Shipment.get(uid=shipment_uid)
    shiped_samples = await ShipedSample.get_all(shipment_uid=shipment.uid)

    count = len(shiped_samples)
    if count == 0:
        shipment.state = conf.shipment_states.EMPTY

    if count > 0 and shipment.state == conf.shipment_states.EMPTY:
        shipment.state = conf.shipment_states.PREPERATION

    shipment.assigned_count = count
    return await shipment.save()


async def shipment_cancel(shipment_uid: str, samples_data: list[dict]):
    shipment:Shipment = await Shipment.get(uid=shipment_uid)

    async def process_sample(sample_data):
        sample: Sample = await Sample.get(sample_data.get("sample_uid", None))
        if not sample:
            logger.info(f"Failed to retrieve sample {sample_data} .... skipping")
            return

        analytes: list[AnalysisResult] = await sample.get_referred_analyses()
        await asyncio.gather(*(analyte.change_status(analysis_conf.states.Result.PENDING) for analyte in analytes))

        await sample.change_status(analysis_conf.states.sample.RECEIVED, "user goes here")

    # process multiple samples using a queue to also limit max samples per given time
    
    async def worker(queue: asyncio.Queue):
        while True:
            sample_data = await queue.get()
            await process_sample(sample_data)
            queue.task_done()

    # Create a queue and populate it with samples_data
    queue = asyncio.Queue()
    for sample_data in samples_data:
        queue.put_nowait(sample_data)

    # Spawn worker coroutines
    num_workers = 10  # Adjust this value based on your system's capacity
    workers = [asyncio.create_task(worker(queue)) for _ in range(num_workers)]

    # Wait for the queue to be empty
    await queue.join()

    # Cancel the worker coroutines
    for w in workers:
        w.cancel()

    return await shipment_reset_assigned_count(shipment.uid)


async def shipment_finalise(shipment_uid: str, finaliser):
    shipment:Shipment = await Shipment.get(uid=shipment_uid)
    
    if not shipment.state == conf.shipment_states.PREPERATION:
        return

    # generate manifest
    shiped_samples:ShipedSample = await ShipedSample.get_all(shipment_uid=shipment.uid)
    samples: list[Sample] = list(map(lambda ss: ss.sample, shiped_samples))

    manifest_data = [{
        "sample_id": sample.sample_id,
        "client_sample_id": sample.analysis_request.client_request_id,
        "date_sampled": sample.date_collected,
        "sample_type": sample.sample_type.name,
        "services": [analyte.analysis.name for analyte in await sample.get_referred_analyses()]
    } for sample in samples]
    
    manifest_pdf = await ManifetReport().generate(manifest_data)

    update_in = {
        "json_content": manifest_data,
        "pdf_content": manifest_pdf,
    }
    await Shipment.update(update_in)

    return shipment.finalise(finaliser)
