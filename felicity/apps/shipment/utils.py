import asyncio
import logging
import random
import string
from datetime import datetime, timedelta

from felicity.apps.analysis import conf as analysis_conf
from felicity.apps.analysis.models.analysis import (
    Sample,
    AnalysisRequest,
    SampleType,
    Analysis,
    sample_analysis,
)
from felicity.apps.analysis.models.results import AnalysisResult
from felicity.apps.analysis.schemas import (
    AnalysisRequestCreate,
    SampleCreate,
    AnalysisResultCreate,
)
from felicity.apps.impress.shipment.utils import gen_pdf_manifest
from felicity.apps.iol.fhir.utils import get_shipment_bundle_resource
from felicity.apps.iol.relay import post_data
from felicity.apps.job import models as job_models
from felicity.apps.job import schemas as job_schemas
from felicity.apps.job.conf import actions, categories, priorities, states
from felicity.apps.patient.models import Patient, Client
from felicity.apps.patient.schemas import PatientCreate
from felicity.apps.reflex.utils import ReflexUtil
from felicity.apps.shipment import conf
from felicity.apps.shipment.models import Shipment, ShippedSample
from felicity.apps.user.models import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# shipments
async def shipment_assign(shipment_uid: str, samples_data: list[dict], actor_uid):
    shipment: Shipment = await Shipment.get(uid=shipment_uid)

    async def process_sample(_sample_data):
        sample: Sample = await Sample.get(uid=_sample_data.get("sample_uid", None))
        if not sample:
            logger.info(f"Failed to retrieve sample {_sample_data} .... skipping")
            return

        analytes: list[AnalysisResult] = await AnalysisResult.get_by_uids(
            uids=_sample_data.get("analyses", [])
        )
        # await asyncio.gather(*(analyte.change_status(analysis_conf.states.Result.REFERRED) for analyte in analytes))
        for analyte in analytes:
            await analyte.change_status(analysis_conf.states.Result.REFERRED)

        fully_referred = await sample.has_fully_referred_analyses()
        if fully_referred:
            await sample.change_status(analysis_conf.states.sample.REFERRED, actor_uid)
        else:
            await sample.change_status(analysis_conf.states.sample.PAIRED, actor_uid)

        await ShippedSample.create(
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
    job: job_models.Job = await job_models.Job.get(uid=job_uid)
    if not job:
        return

    if not job.status == states.PENDING:
        return None

    await job.change_status(new_status=states.RUNNING)
    shipment_uid = job.job_id
    shipment: Shipment = await Shipment.get(uid=shipment_uid)
    felicity_user = await User.get(uid=job.creator_uid)

    entries = shipment.data["entry"]

    # skip aready rceived sampled if any
    shipped_samples = await ShippedSample.get(shipment_uid=shipment_uid)
    already_received = []
    if shipped_samples:
        for ss in shipped_samples:
            _ar = await AnalysisRequest.get(uid=ss.sample.analysis_request_uid)
            already_received.append(_ar.client_request_id)

    for _entry in entries:
        _diff_ = "".join(
            random.SystemRandom().choice(string.ascii_letters + string.digits)
            for _ in range(4)
        )

        entry = _entry["resource"]
        #
        sample_data = entry["specimen"][0]
        if sample_data["subject"]["display"] in already_received:
            continue

        # get_patient
        patient_data = entry["subject"]

        # TODO: what if it doesnt exist ? create it
        client = await Client.get(
            code=patient_data["managingOrganization"]["identifier"]["value"]
        )
        patient_in: dict = {
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
            "client_patient_id": patient_data["identifier"][0]["value"] + _diff_,
            "client_uid": client.uid,
            "first_name": patient_data["name"][0]["given"][0],
            "last_name": patient_data["name"][0]["family"],
            "gender": patient_data["gender"],
            # "age": 0,
            "date_of_birth": patient_data["birthDate"],
            # "age_dob_estimated": False
            "phone_mobile": patient_data["telecom"][0]["value"]
            if patient_data["telecom"]
            else None,
            "consent_sms": False,
            # "district_uid": str| None = None
            # "province_uid": str| None = None
            # "country_uid": str| None = None
        }
        pt_sch = PatientCreate(**patient_in)
        patient = await Patient.create(pt_sch)

        # get sample data
        sample_type_data = sample_data["type"]["coding"][0]

        ar_in = {
            "patient_uid": patient.uid,
            "client_uid": patient.client_uid,
            "client_request_id": sample_data["subject"]["display"] + _diff_,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }
        ar_sch = AnalysisRequestCreate(**ar_in)
        analysis_request = await AnalysisRequest.create(ar_sch)

        sample_type = await SampleType.get(name=sample_type_data["display"])
        sam_in = {
            "analysis_request_uid": analysis_request.uid,
            "sample_type_uid": sample_type.uid,
            "priority": 0,
            "status": analysis_conf.states.sample.EXPECTED,
            "created_by_uid": felicity_user.uid,
            "updated_by_uid": felicity_user.uid,
        }

        # get analysis tests
        analyses = []
        service_data = entry["code"]["coding"]

        for coding in service_data:
            analysis = await Analysis.get(keyword=coding["code"])
            analyses.append(analysis)

        tat_lengths = []
        for anal in analyses:
            if anal.tat_length_minutes:
                tat_lengths.append(anal.tat_length_minutes)
        if tat_lengths:
            minutes = max(tat_lengths)
            sam_in["due_date"] = datetime.now() + timedelta(minutes=minutes)

        sa_sch = SampleCreate(**sam_in)
        sample = await Sample.create(sa_sch)

        # auto receive samples
        await sample.receive(received_by=felicity_user)

        # link sample to provided services
        for _anal in analyses:
            await Sample.table_insert(
                table=sample_analysis,
                mappings={"sample_uid": sample.uid, "analysis_uid": _anal.uid},
            )

        # create and attach result objects for each Analyses
        logger.info(
            f"Adding {len(analyses)} service results to the sample {sample.sample_id}"
        )
        a_result_schema = AnalysisResultCreate(
            sample_uid=sample.uid,
            status=analysis_conf.states.result.PENDING,
            analysis_uid=None,
            due_date=None,
            created_by_uid=felicity_user.uid,
            updated_by_uid=felicity_user.uid,
        )

        result_schemas = []
        for _service in analyses:
            result_schemas.append(
                a_result_schema.model_copy(
                    update={
                        "analysis_uid": _service.uid,
                        "due_date": datetime.now()
                                    + timedelta(minutes=_service.tat_length_minutes)
                        if _service.tat_length_minutes
                        else None,
                    }
                )
            )
        created = await AnalysisResult.bulk_create(result_schemas)

        # initialise reflex action if exist
        logger.debug(f"ReflexUtil .... set_reflex_actions ...")
        await ReflexUtil.set_reflex_actions(created)

        # ! paramount !
        await asyncio.sleep(1)

        # Add sample to shipment
        await ShippedSample.create(
            {
                "sample_uid": sample.uid,
                "shipment_uid": shipment.uid,
                "ext_sample_uid": sample_data["identifier"][0]["value"],
                "ext_sample_id": sample_data["accessionIdentifier"]["value"],
            }
        )

    await shipment.change_state(conf.shipment_states.RECEIVED, felicity_user.uid)
    await job.change_status(new_status=states.FINISHED)


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

        shipped_sample: ShippedSample = await ShippedSample.get(
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
    shipment: Shipment = await Shipment.get(uid=shipment_uid)
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
    elif action == "reject":
        await shipment_reject(shipment_uid, actor.uid)
    elif action == "receive":
        await add_sh_receive_task(shipment_uid, actor.uid)
    else:
        pass

    return await Shipment.get(uid=shipment_uid)


async def shipment_reject(shipment_uid: str, actor_uid):
    shipment: Shipment = await Shipment.get(uid=shipment_uid)
    return await shipment.change_state(conf.shipment_states.REJECTED, actor_uid)


async def add_sh_receive_task(shipment_uid: str, actor_uid):
    shipment: Shipment = await Shipment.get(uid=shipment_uid)
    job_schema = job_schemas.JobCreate(
        action=actions.SH_RECEIVE,
        category=categories.SHIPMENT,
        priority=priorities.MEDIUM,
        creator_uid=actor_uid,
        job_id=shipment.uid,
        status=states.PENDING,
        data=None,
    )
    await job_models.Job.create(job_schema)

    return await shipment.change_state(conf.shipment_states.RECEIVING, actor_uid)


async def shipment_cancel(shipment_uid: str, actor_uid):
    shipment: Shipment = await Shipment.get(uid=shipment_uid)
    shiped_samples: list[ShippedSample] = await ShippedSample.get_all(
        shipment_uid=shipment.uid
    )
    samples: list[Sample] = list(map(lambda ss: ss.sample, shiped_samples))

    async def process_sample(sample: Sample):
        _, analytes = await sample.get_referred_analyses()
        await asyncio.gather(
            *(
                analyte.change_status(analysis_conf.states.Result.PENDING)
                for analyte in analytes
            )
        )
        await sample.change_status(analysis_conf.states.sample.RECEIVED, actor_uid)

    for sample in samples:
        await process_sample(sample)

    return await shipment.change_state(conf.shipment_states.CANCELLED, actor_uid)


async def shipment_finalise(shipment_uid: str, finaliser):
    shipment: Shipment = await Shipment.get(uid=shipment_uid)

    if not shipment.state == conf.shipment_states.PREPERATION:
        return

    # generate manifest
    shiped_samples: list[ShippedSample] = await ShippedSample.get_all(
        shipment_uid=shipment.uid
    )
    samples: list[Sample] = list(map(lambda ss: ss.sample, shiped_samples))

    manifest_data = []
    for sample in samples:
        services = []
        _, analytes = await sample.get_referred_analyses()
        for analyte in analytes:
            services.append(analyte.analysis.name)

        manifest_data.append(
            {
                "sample_id": sample.sample_id,
                "client_sample_id": sample.analysis_request.client_request_id,
                "date_collected": sample.date_collected
                if sample.date_collected
                else "",
                "sample_type": sample.sample_type.name,
                "services": services,
            }
        )

    await gen_pdf_manifest(manifest_data, shipment)

    return await shipment.finalise(finaliser)


async def shipment_send(uid: str, by_uid=None):
    shipment: Shipment = await Shipment.get(uid=uid)
    resource = await get_shipment_bundle_resource(uid)
    success = await post_data(
        f"{shipment.laboratory.url}Bundle",
        resource.model_dump(exclude_none=True),
        shipment.laboratory.username,
        shipment.laboratory.password,
    )
    return await shipment.change_state(
        state=conf.shipment_states.FAILED
        if not success
        else conf.shipment_states.SHIPPED,
        updated_by_uid=by_uid,
    )


async def shipment_result_update(diagnostic_report: dict, user: User):
    # get basedOn-uid
    based_on = diagnostic_report.get("basedOn", None)
    if not based_on:
        return

    # based = list(filter(lambda bo: bo["identifier"]["system"] == "felicity/sample/uid", based_on))
    based = list(
        filter(lambda bo: bo["identifier"]["type"]["text"] == "Sample UID", based_on)
    )
    sample_uid = based[0]["identifier"]["value"]

    sample: Sample = await Sample.get(uid=sample_uid)
    if not sample:
        return

    for result in diagnostic_report.get("result", []):
        assert result.get("type", None) == "Observation"
        identity = result.get("identifier", None)
        keyword = identity["type"]["text"]
        value = identity["value"]

        results: list[AnalysisResult] = await sample.get_analysis_results()
        allowed_states = [
            analysis_conf.states.result.REFERRED,
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
            "status": analysis_conf.states.result.APPROVED,
        }
        await target.update(update_in)
        await sample.verify(user)
