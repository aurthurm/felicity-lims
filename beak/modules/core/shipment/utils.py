import asyncio
import logging
import random
import string
from datetime import timedelta

from beak.modules.core.analysis.entities.analysis import Sample, sample_analysis
from beak.modules.core.analysis.enum import ResultState, SampleState
from beak.modules.core.analysis.schemas import (
    AnalysisRequestCreate,
    AnalysisResultCreate,
    SampleCreate,
)
from beak.modules.core.analysis.services.analysis import (
    AnalysisRequestService,
    AnalysisService,
    SampleService,
    SampleTypeService,
)
from beak.modules.core.analysis.services.result import AnalysisResultService
from beak.modules.core.client.services import ClientService
from beak.modules.core.common.utils.serializer import marshaller
from beak.modules.core.impress.shipment.utils import gen_pdf_manifest
from beak.modules.core.iol.fhir.utils import get_shipment_bundle_resource
from beak.modules.shared.infrastructure.redis import task_guard
from beak.modules.shared.infrastructure.redis.enum import TrackableObject
from beak.modules.core.iol.relay import post_data
from beak.modules.core.job import schemas as job_schemas
from beak.modules.core.job.enum import JobAction, JobCategory, JobPriority, JobState
from beak.modules.core.job.services import JobService
from beak.modules.core.patient_gateway import get_patient_gateway
from beak.modules.core.reflex.services import ReflexEngineService
from beak.modules.core.shipment.enum import ShipmentState
from beak.modules.core.shipment.services import ShipmentService, ShippedSampleService
from beak.modules.core.identity.entities import User
from beak.core.dtz import timenow_dt

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# shipments
async def shipment_assign(shipment_uid: str, samples_data: list[dict], actor_uid):
    shipment_service = ShipmentService()
    sample_service = SampleService()
    analysis_result_service = AnalysisResultService()
    shipped_sample_service = ShippedSampleService()

    shipment = await shipment_service.get(uid=shipment_uid)

    async def process_sample(_sample_data):
        sample = await sample_service.get(uid=_sample_data.get("sample_uid", None))
        if not sample:
            logger.info(f"Failed to retrieve sample {_sample_data} .... skipping")
            return

        analytes = await analysis_result_service.get_by_uids(
            uids=_sample_data.get("analyses", [])
        )
        # await asyncio.gather(*(analyte.change_status(ResultState.REFERRED) for analyte in analytes))
        for analyte in analytes:
            await analysis_result_service.change_status(
                analyte.uid, ResultState.REFERRED
            )

        fully_referred = await sample_service.has_fully_referred_analyses(sample.uid)
        if fully_referred:
            await sample_service.change_status(
                sample.uid, SampleState.REFERRED, actor_uid
            )
        else:
            await sample_service.change_status(
                sample.uid, SampleState.PAIRED, actor_uid
            )

        await shipped_sample_service.create(
            {"sample_uid": sample.uid, "shipment_uid": shipment.uid}
        )

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


async def shipment_receive(job_uid: str):
    job_service = JobService()
    shipment_service = ShipmentService()
    sample_service = SampleService()
    analysis_result_service = AnalysisResultService()
    shipped_sample_service = ShippedSampleService()
    client_service = ClientService()
    analysis_request_service = AnalysisRequestService()
    sample_type_service = SampleTypeService()
    analysis_service = AnalysisService()

    job = await job_service.get(uid=job_uid)
    if not job:
        return

    if not job.status == JobState.PENDING:
        return None

    await job_service.change_status(job.uid, new_status=JobState.RUNNING)
    shipment_uid = job.job_id
    shipment = await shipment_service.get(uid=shipment_uid)
    beak_user = await User.get(uid=job.creator_uid)

    entries = (shipment.data or {}).get("entry", [])

    def _resolve_contained(resource: dict, reference: str) -> dict | None:
        if not resource or not reference:
            return None
        ref_id = reference[1:] if reference.startswith("#") else reference
        for contained in resource.get("contained", []) or []:
            if contained.get("id") == ref_id:
                return contained
        return None

    def _resolve_entry_resource(ref_type: str, ref_id: str) -> dict | None:
        for item in entries:
            res = item.get("resource")
            if res and res.get("resourceType") == ref_type and res.get("id") == ref_id:
                return res
        return None

    def _resolve_reference(resource: dict, reference: str, resource_type: str) -> dict | None:
        if not reference:
            return None
        if reference.startswith("#"):
            return _resolve_contained(resource, reference)
        if "/" in reference:
            ref_type, ref_id = reference.split("/", 1)
            if ref_type == resource_type:
                return _resolve_entry_resource(ref_type, ref_id)
        return None

    # skip aready rceived sampled if any
    shipped_samples = await shipped_sample_service.get(shipment_uid=shipment_uid)
    already_received = []
    if shipped_samples:
        for ss in shipped_samples:
            _ar = await analysis_result_service.get(uid=ss.sample.analysis_request_uid)
            already_received.append(_ar.client_request_id)

    for _entry in entries:
        _diff_ = "".join(
            random.SystemRandom().choice(string.ascii_letters + string.digits)
            for _ in range(4)
        )

        entry = _entry.get("resource", {})
        if entry.get("resourceType") != "ServiceRequest":
            continue

        sample_data = None
        specimen_refs = entry.get("specimen") or []
        if specimen_refs:
            first_specimen = specimen_refs[0]
            if first_specimen.get("resourceType") == "Specimen":
                sample_data = first_specimen
            elif first_specimen.get("reference"):
                sample_data = _resolve_reference(
                    entry, first_specimen.get("reference"), "Specimen"
                )

        if not sample_data:
            continue
        if sample_data["subject"]["display"] in already_received:
            continue

        # get_patient
        patient_data = None
        subject = entry.get("subject") or {}
        if subject.get("resourceType") == "Patient":
            patient_data = subject
        elif subject.get("reference"):
            patient_data = _resolve_reference(
                entry, subject.get("reference"), "Patient"
            )
        if not patient_data:
            continue

        # TODO: what if it doesnt exist ? create it
        managing_org = patient_data.get("managingOrganization") or {}
        managing_identifier = managing_org.get("identifier") or {}
        client = await client_service.get(code=managing_identifier.get("value"))
        if not client:
            continue
        patient_identifier = patient_data.get("identifier", [{}])[0].get("value")
        if not patient_identifier:
            continue

        patient_in: dict = {
            "created_by_uid": beak_user.uid,
            "updated_by_uid": beak_user.uid,
            "client_patient_id": patient_identifier + _diff_,
            "client_uid": client.uid,
            "first_name": patient_data.get("name", [{}])[0].get("given", [None])[0],
            "last_name": patient_data.get("name", [{}])[0].get("family"),
            "gender": patient_data.get("gender"),
            # "age": 0,
            "date_of_birth": patient_data.get("birthDate"),
            # "age_dob_estimated": False
            "phone_mobile": (
                patient_data.get("telecom", [{}])[0].get("value")
                if patient_data.get("telecom")
                else None
            ),
            "consent_sms": False,
            # "district_uid": str| None = None
            # "province_uid": str| None = None
            # "country_uid": str| None = None
        }
        patient = await get_patient_gateway().create_patient(patient_in)
        if not patient:
            continue

        # get sample data
        sample_type_data = (sample_data.get("type") or {}).get("coding", [{}])[0]
        if not sample_type_data:
            continue

        requisition = entry.get("requisition") or {}
        request_id = requisition.get("value") or sample_data.get("subject", {}).get(
            "display"
        )
        if not request_id:
            continue
        ar_in = {
            "patient_uid": patient.uid,
            "client_uid": patient.client_uid,
            "client_request_id": f"{request_id}{_diff_}",
            "created_by_uid": beak_user.uid,
            "updated_by_uid": beak_user.uid,
        }
        ar_sch = AnalysisRequestCreate(**ar_in)
        analysis_request = await analysis_request_service.create(ar_sch)

        sample_type_name = sample_type_data.get("display") or sample_type_data.get(
            "code"
        )
        if not sample_type_name:
            continue
        sample_type = await sample_type_service.get(name=sample_type_name)
        sam_in = {
            "analysis_request_uid": analysis_request.uid,
            "sample_type_uid": sample_type.uid,
            "priority": 0,
            "status": SampleState.EXPECTED,
            "created_by_uid": beak_user.uid,
            "updated_by_uid": beak_user.uid,
        }

        # get analysis tests
        analyses = []
        service_data = (entry.get("code") or {}).get("coding") or []

        for coding in service_data:
            analysis = await analysis_service.get(keyword=coding["code"])
            analyses.append(analysis)

        tat_lengths = []
        for anal in analyses:
            if anal.tat_length_minutes:
                tat_lengths.append(anal.tat_length_minutes)
        if tat_lengths:
            minutes = max(tat_lengths)
            sam_in["due_date"] = timenow_dt() + timedelta(minutes=minutes)

        sa_sch = SampleCreate(**sam_in)
        sample = await sample_service.create(sa_sch)

        # auto receive samples
        await sample.receive(received_by=beak_user)

        # link sample to provided services
        for _anal in analyses:
            await sample_service.repository.table_insert(
                table=sample_analysis,
                mappings=[{"sample_uid": sample.uid, "analysis_uid": _anal.uid}],
            )

        # create and attach result objects for each Analyses
        logger.info(
            f"Adding {len(analyses)} service results to the sample {sample.sample_id}"
        )
        a_result_schema = AnalysisResultCreate(
            sample_uid=sample.uid,
            status=ResultState.PENDING,
            analysis_uid=None,
            due_date=None,
            created_by_uid=beak_user.uid,
            updated_by_uid=beak_user.uid,
        )

        result_schemas = []
        for _service in analyses:
            result_schemas.append(
                a_result_schema.model_copy(
                    update={
                        "analysis_uid": _service.uid,
                        "due_date": (
                            timenow_dt()
                            + timedelta(minutes=_service.tat_length_minutes)
                            if _service.tat_length_minutes
                            else None
                        ),
                    }
                )
            )
        created = await analysis_result_service.bulk_create(result_schemas)

        # initialise reflex trigger if exist
        logger.info("ReflexUtil .... set_reflex_triggers ...")
        await ReflexEngineService().set_reflex_triggers(created)

        # ! paramount !
        await asyncio.sleep(1)

        # Add sample to shipment
        await shipped_sample_service.create(
            {
                "sample_uid": sample.uid,
                "shipment_uid": shipment.uid,
                "ext_sample_uid": sample_data.get("identifier", [{}])[0].get("value"),
                "ext_sample_id": (sample_data.get("accessionIdentifier") or {}).get(
                    "value"
                ),
            }
        )

    await shipment_service.change_state(
        shipment.uid, ShipmentState.RECEIVED, beak_user.uid
    )
    await job_service.change_status(job.uid, new_status=JobState.FINISHED)


async def shipment_recover(shipment_uid: str, samples_data: list[dict], actor_uid):
    shipment_service = ShipmentService()
    sample_service = SampleService()
    analysis_result_service = AnalysisResultService()
    shipped_sample_service = ShippedSampleService()

    shipment = await shipment_service.get(uid=shipment_uid)

    async def process_sample(sample_data):
        sample = await sample_service.get(uid=sample_data.get("sample_uid", None))
        if not sample:
            logger.info(f"Failed to retrieve sample {sample_data} .... skipping")
            return

        _, analytes = await sample_service.get_referred_analyses(sample.uid)
        for analyte in analytes:
            await analysis_result_service.change_status(analyte, ResultState.PENDING)

        no_referred = await sample_service.has_no_referred_analyses(sample.uid)
        if no_referred:
            await sample_service.change_status(
                sample.uid, SampleState.RECEIVED, actor_uid
            )
        else:
            await sample_service.change_status(
                sample.uid, SampleState.PAIRED, actor_uid
            )

        shipped_sample = await shipped_sample_service.get(
            sample_uid=sample_data.get("sample_uid", None)
        )
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
    shipment_service = ShipmentService()
    sample_service = SampleService()

    shipment = await shipment_service.get(uid=shipment_uid)

    async def process_sample(sample_data):
        sample = await sample_service.get(uid=sample_data.get("sample_uid", None))
        if not sample:
            logger.info(f"Failed to retrieve sample {sample_data} .... skipping")
            return

        await sample_service.change_status(sample.uid, SampleState.PAIRED, actor_uid)

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
    shipment_service = ShipmentService()
    shipped_sample_service = ShippedSampleService()

    shipment = await shipment_service.get(uid=shipment_uid)
    shiped_samples = await shipped_sample_service.get_all(shipment_uid=shipment.uid)

    count = len(shiped_samples)
    if count == 0:
        shipment.state = ShipmentState.EMPTY

    if count > 0 and shipment.state == ShipmentState.EMPTY:
        shipment.state = ShipmentState.PREPERATION

    shipment.assigned_count = count
    return await shipment_service.update(shipment.uid, marshaller(shipment))


async def action_shipment(shipment_uid: str, action: str, actor):
    shipment_service = ShipmentService()

    if action == "finalise":
        await shipment_finalise(shipment_uid, actor)
    elif action == "cancel":
        await shipment_cancel(shipment_uid, actor.uid)
    elif action == "dispatch-now":
        await shipment_send(shipment_uid, actor.uid)
    elif action == "reject":
        await shipment_reject(shipment_uid, actor.uid)
    elif action == "receive":
        await add_sh_receive_task(shipment_uid, actor.uid)
    else:
        pass

    return await shipment_service.get(uid=shipment_uid)


async def shipment_reject(shipment_uid: str, actor_uid):
    shipment_service = ShipmentService()
    shipment = await shipment_service.get(uid=shipment_uid)
    return await shipment_service.change_state(
        shipment.uid, ShipmentState.REJECTED, actor_uid
    )


async def add_sh_receive_task(shipment_uid: str, actor_uid):
    shipment_service = ShipmentService()
    job_service = JobService()

    shipment = await shipment_service.get(uid=shipment_uid)
    job_schema = job_schemas.JobCreate(
        action=JobAction.SHIPMENT_RECEIVE,
        category=JobCategory.SHIPMENT,
        priority=JobPriority.MEDIUM,
        creator_uid=actor_uid,
        job_id=shipment.uid,
        status=JobState.PENDING,
        data=None,
    )
    await job_service.create(job_schema)
    await task_guard.process(uid=shipment.uid, object_type=TrackableObject.SHIPMENT)
    return shipment


async def shipment_cancel(shipment_uid: str, actor_uid):
    shipment_service = ShipmentService()
    shipped_sample_service = ShippedSampleService()
    sample_service = SampleService()
    analysis_result_service = AnalysisResultService()

    shipment = await shipment_service.get(uid=shipment_uid)
    shiped_samples = await shipped_sample_service.get_all(shipment_uid=shipment.uid)
    samples = list(map(lambda ss: ss.sample, shiped_samples))

    async def process_sample(sample: Sample):
        _, analytes = await sample_service.get_referred_analyses(sample.uid)
        await asyncio.gather(
            *(
                analysis_result_service.change_status(analyte.uid, ResultState.PENDING)
                for analyte in analytes
            )
        )
        await sample_service.change_status(sample.uid, SampleState.RECEIVED, actor_uid)

    for sample in samples:
        await process_sample(sample)

    return await shipment_service.change_state(
        shipment.uid, ShipmentState.CANCELLED, actor_uid
    )


async def shipment_finalise(shipment_uid: str, finaliser):
    shipment_service = ShipmentService()
    shipped_sample_service = ShippedSampleService()
    sample_service = SampleService()

    shipment = await shipment_service.get(uid=shipment_uid)

    if not shipment.state == ShipmentState.PREPERATION:
        return

    # generate manifest
    shiped_samples = await shipped_sample_service.get_all(shipment_uid=shipment.uid)
    samples: list[Sample] = list(map(lambda ss: ss.sample, shiped_samples))

    manifest_data = []
    for sample in samples:
        services = []
        _, analytes = await sample_service.get_referred_analyses(sample.uid)
        for analyte in analytes:
            services.append(analyte.analysis.name)

        manifest_data.append(
            {
                "sample_id": sample.sample_id,
                "client_sample_id": sample.analysis_request.client_request_id,
                "date_collected": (
                    sample.date_collected if sample.date_collected else ""
                ),
                "sample_type": sample.sample_type.name,
                "services": services,
            }
        )

    await gen_pdf_manifest(manifest_data, shipment)

    return await shipment_service.finalise(shipment.uid, finaliser)


async def shipment_send(uid: str, by_uid=None):
    shipment_service = ShipmentService()

    shipment = await shipment_service.get(uid=uid)
    resource = await get_shipment_bundle_resource(uid)
    if not resource:
        raise Exception("Failed to get shipment bundle resource")

    success = await post_data(
        f"{shipment.laboratory.url}Bundle",
        resource.model_dump(exclude_none=True),
        shipment.laboratory.username,
        shipment.laboratory.password,
    )
    return await shipment_service.change_state(
        shipment.uid,
        state=ShipmentState.FAILED if not success else ShipmentState.SHIPPED,
        updated_by_uid=by_uid,
    )


async def shipment_result_update(diagnostic_report: dict, user: User):
    sample_service = SampleService()
    analysis_result_service = AnalysisResultService()

    # get basedOn-uid
    based_on = diagnostic_report.get("basedOn", None)
    if not based_on:
        return

    # based = list(filter(lambda bo: bo["identifier"]["system"] == "beak/sample/uid", based_on))
    based = list(
        filter(lambda bo: bo["identifier"]["type"]["text"] == "Sample UID", based_on)
    )
    sample_uid = based[0]["identifier"]["value"]

    sample: Sample = await sample_service.get(uid=sample_uid)
    if not sample:
        return

    for result in diagnostic_report.get("result", []):
        assert result.get("type", None) == "Observation"
        identity = result.get("identifier", None)
        keyword = identity["type"]["text"]
        value = identity["value"]

        results = await sample_service.get_analysis_results(sample.uid)
        allowed_states = [
            ResultState.REFERRED,
        ]
        results = list(
            filter(
                lambda r: r.keyword == keyword and r.status in allowed_states, results
            )
        )

        assert len(results) == 1
        target = results[0]

        update_in = {
            "result": value,
            "submitted_by_name": "",
            "verified_by_name": "",
            "status": ResultState.APPROVED,
        }
        await analysis_result_service.update(target.uid, update_in)
        await sample_service.verify(sample.uid, user)
