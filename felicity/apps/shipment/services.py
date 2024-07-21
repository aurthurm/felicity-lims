import asyncio
import random
import string
from datetime import datetime, timedelta

from domain.analysis.conf import ResultStates, SampleStates
from domain.analysis.ports.service.analysis import (
    ISampleService,
    IAnalysisRequestService,
    IAnalysisService,
    ISampleTypeService,
)
from domain.analysis.ports.service.result import IAnalysisResultService
from domain.analysis.schemas import (
    AnalysisRequestCreate,
    SampleCreate,
    AnalysisResultCreate,
    Sample,
)
from domain.client.ports.service import IClientService
from domain.exceptions import *
from domain.idsequence.ports.service import IIdSequenceService
from domain.job.conf import JobActions, JobPriorities, JobCategories, JobStates
from domain.job.ports.service import IJobService
from domain.job.schemas import JobCreate
from domain.notification.ports.service import IActivityStreamService
from domain.patient.ports.service import IPatientService
from domain.patient.schemas import PatientCreate
from domain.reflex.ports.service import IReflexEngineService
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from domain.shipment.conf import ShipmentStates
from domain.shipment.manifest import ManifetReport
from domain.shipment.ports import ReferenceSampleIn
from domain.shipment.ports.repository import (
    IReferralLaboratoryRepository,
    IShippedSampleRepository,
    IShipmentRepository,
)
from domain.shipment.ports.service import (
    IReferralLaboratoryService,
    IShippedSampleService,
    IShipmentService,
)
from domain.shipment.schemas import (
    ReferralLaboratory,
    ShippedSample,
    Shipment,
    ShipmentCreate,
    ShipmentUpdate,
    ReferralLaboratoryCreate,
    ReferralLaboratoryUpdate,
)
from domain.user.ports.service import IUserService
from domain.user.schemas import User
from infrastructure.database.analysis.entities.analysis import sample_analysis


class ReferralLaboratoryService(
    BaseService[ReferralLaboratory], IReferralLaboratoryService
):
    def __init__(self, repository: IReferralLaboratoryRepository):
        self.repository = repository

    async def create(
        self,
        name: str,
        code: str,
        url: str,
        username: str,
        password: str,
        is_reference: bool,
        is_referral: bool,
        user: User,
    ) -> ReferralLaboratory:

        exists = await self.repository.filter(
            filters={"name__exact": name, "code__exact": code}, sort=None, either=True
        )
        if exists:
            raise AlreadyExistsError(
                f"ReferralLaboratory: {name}, {code} already exists"
            )

        incoming = {
            "name": name,
            "code": code,
            "url": url,
            "username": username,
            "password": password,
            "is_reference": is_reference,
            "is_referral": is_referral,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }

        obj_in = ReferralLaboratoryCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        name: str,
        code: str,
        url: str,
        username: str,
        password: str,
        is_reference: bool,
        is_referral: bool,
        user: User,
    ) -> ReferralLaboratory:
        payload = locals()

        referral_laboratory = await self.get(uid=uid)

        st_data = marshal(referral_laboratory)
        for field in st_data:
            if field in payload.__dict__:
                try:
                    setattr(referral_laboratory, field, payload.__dict__[field])
                except Exception as e:
                    pass

        referral_laboratory_in = ReferralLaboratoryUpdate(
            **marshal(referral_laboratory)
        )
        return await super().update(
            referral_laboratory, **marshal(referral_laboratory_in)
        )


class ShippedSampleService(BaseService[ShippedSample], IShippedSampleService):
    def __init__(self, repository: IShippedSampleRepository):
        self.repository = repository


class ShipmentService(BaseService[Shipment], IShipmentService):
    def __init__(
        self,
        repository: IShipmentRepository,
        shipped_sample_service: IShippedSampleService,
        stream_service: IActivityStreamService,
        id_sequence_service: IIdSequenceService,
        job_service: IJobService,
        sample_service: ISampleService,
        analysis_result_service: IAnalysisResultService,
        user_service: IUserService,
        analysis_request_service: IAnalysisRequestService,
        client_service: IClientService,
        patient_service: IPatientService,
        sample_type_service: ISampleTypeService,
        analysis_service: IAnalysisService,
        reflex_engine_service: IReflexEngineService,
    ):
        self.repository = repository
        self.shipped_sample_service = shipped_sample_service
        self.activity_stream_service = stream_service
        self.id_sequence_service = id_sequence_service
        self.job_service = job_service
        self.sample_service = sample_service
        self.analysis_result_service = analysis_result_service
        self.user_service = user_service
        self.analysis_request_service = analysis_request_service
        self.client_service = client_service
        self.patient_service = patient_service
        self.sample_type_service = sample_type_service
        self.analysis_service = analysis_service
        self.reflex_engine_service = reflex_engine_service

    async def set_flow(self, shipment: Shipment, flow: bool = False):
        """Set whether the flow is incoming or outgoing"""
        shipment.incoming = flow
        await super().update(shipment, **marshal(shipment))

    async def get_samples(self, shipment: Shipment):
        return list(
            map(
                lambda ss: ss.sample,
                await self.shipped_sample_service.get_all(shipment_uid=shipment.uid),
            )
        )

    async def change_state(self, shipment: Shipment, state: str, updated_by: User):
        shipment.state = state
        shipment.updated_by_uid = updated_by.uid  # noqa
        return await super().update(shipment, **marshal(shipment))

    async def create(
        self,
        laboratory_uid: str | None,
        courier: str,
        comment: str | None,
        count: int | None,
        user: User,
    ) -> list[Shipment]:

        incoming = {
            "incoming": False,
            "comment": comment,
            "courier": courier,
            "laboratory_uid": laboratory_uid,
            "shipment_id": None,
            "state": ShipmentStates.EMPTY,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }

        sh_schema = ShipmentCreate(**incoming)

        shipment_schemas = [
            sh_schema.model_copy(
                update={
                    "shipment_id": (
                        await self.id_sequence_service.get_next_number("SH")
                    )[1]
                }
            )
            for _ in list(range(count))
        ]

        shipments = await self.repository.bulk_create(
            [marshal(sh) for sh in shipment_schemas]
        )

        # to get lazy loads working otherwise return WorksheetListingType(shipments)
        return [(await self.get(uid=sh.uid)) for sh in shipments]

    async def update(
        self, uid: str, laboratory_uid: str | None, courier: str, comment: str | None
    ) -> Shipment:  # noqa
        payload = locals()

        shipment = await self.get(uid=uid)

        shipment_data = shipment.to_dict()
        for field in shipment_data:
            if field in payload.__dict__:
                try:
                    setattr(shipment, field, payload.__dict__[field])
                except Exception as e:
                    pass

        shipment_in = ShipmentUpdate(**marshal(shipment))
        return await super().update(shipment, **marshal(shipment_in))

    async def action(self, uid: str, action: str, user: User) -> Shipment:  # noqa

        shipment = await self.get(uid=uid)

        if action == "dispatch":
            shipment = await self.change_state(shipment, ShipmentStates.AWAITING, user)

            job_schema = JobCreate(
                action=JobActions.SH_DISPATCH,
                category=JobCategories.SHIPMENT,
                priority=JobPriorities.MEDIUM,
                creator_uid=user.uid,
                job_id=shipment.uid,
                status=JobStates.PENDING,
                data=None,
            )
            await self.job_service.create(**marshal(job_schema))

        elif action == "finalise":
            await self.finalise(shipment, user)
        elif action == "cancel":
            await self.cancel(shipment, user)
        elif action == "dispatch-now":
            await self.send(shipment, user)
        elif action == "reject":
            await self.reject(shipment, user)
        elif action == "receive":
            await self.add_receive_task(shipment, user)
        else:
            pass

        return await self.get(uid=uid)

    async def manage_samples(
        self, uid: str, samples: list[ReferenceSampleIn], action: str, user: User
    ) -> Shipment:

        if not len(samples) > 0:
            raise NotAllowedError("Samples for assignment are required")

        shipment = await self.get(uid=uid)

        data = list(map(lambda s: s.__dict__, samples))
        if action == "assign":
            # Add a job
            job_schema = JobCreate(
                action=JobActions.SH_MANUAL_ASSIGN,
                category=JobCategories.SHIPMENT,
                priority=JobPriorities.MEDIUM,
                creator_uid=user.uid,
                job_id=shipment.uid,
                status=JobStates.PENDING,
                data=data,
            )
            await self.job_service.create(**marshal(job_schema))
        elif action == "recover":
            await self.recover(shipment, data, user)
        elif action == "recall":
            await self.recall(shipment, data, user)
        else:
            pass

        return await self.get(uid=uid)

    async def assign(self, shipment: Shipment, samples_data: list[dict], user: User):
        async def process_sample(sample_da):
            sample = await self.sample_service.get(
                uid=sample_da.get("sample_uid", None)
            )

            analytes = await self.analysis_result_service.get_by_uids(
                uids=sample_da.get("analyses", [])
            )
            for analyte in analytes:
                await self.analysis_result_service.change_status(
                    analyte, ResultStates.REFERRED
                )

            fully_referred = await self.sample_service.has_fully_referred_analyses(
                sample
            )
            if fully_referred:
                await self.sample_service.change_status(
                    sample, SampleStates.REFERRED, user.uid
                )
            else:
                await self.sample_service.change_status(
                    sample, SampleStates.PAIRED, user.uid
                )

            await self.shipped_sample_service.create(
                **{"sample_uid": sample.uid, "shipment_uid": shipment.uid}
            )

        async def worker(sample_d):
            async with semaphore:
                await process_sample(sample_d)

        # Create a semaphore with a limit of concurrent tasks
        num_workers = 10  # Adjust this value based on your system's capacity
        semaphore = asyncio.Semaphore(num_workers)

        # Process samples concurrently using the semaphore
        for sample_data in samples_data:
            await worker(sample_data)

        return await self.reset_assigned_count(shipment)

    async def receive(self, job_uid: str):
        job = await self.job_service.get(uid=job_uid)
        if not job:
            return

        if not job.status == JobStates.PENDING:
            return None

        await self.job_service.change_status(job, new_status=JobStates.RUNNING)
        shipment_uid = job.job_id
        shipment = await self.get(uid=shipment_uid)
        creator = await self.user_service.get(uid=job.creator_uid)

        entries = shipment.data["entry"]

        # skip already received sampled if any
        shipped_samples = await self.shipped_sample_service.get_all(
            shipment_uid=shipment_uid
        )
        already_received = []
        if shipped_samples:
            for ss in shipped_samples:
                _ar = await self.analysis_request_service.get(
                    uid=ss.sample.analysis_request_uid
                )
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
            client = await self.client_service.get(
                code=patient_data["managingOrganization"]["identifier"]["value"]
            )
            patient_in: dict = {
                "created_by_uid": creator.uid,
                "updated_by_uid": creator.uid,
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
            patient = await self.patient_service.create(**marshal(pt_sch))

            # get sample data
            sample_type_data = sample_data["type"]["coding"][0]

            ar_in = {
                "patient_uid": patient.uid,
                "client_uid": patient.client_uid,
                "client_request_id": sample_data["subject"]["display"] + _diff_,
                "created_by_uid": creator.uid,
                "updated_by_uid": creator.uid,
            }
            ar_sch = AnalysisRequestCreate(**ar_in)
            analysis_request = await self.analysis_request_service.create(
                **marshal(ar_sch)
            )

            sample_type = await self.sample_type_service.get(
                name=sample_type_data["display"]
            )
            sam_in = {
                "analysis_request_uid": analysis_request.uid,
                "sample_type_uid": sample_type.uid,
                "priority": 0,
                "status": SampleStates.EXPECTED,
                "created_by_uid": creator.uid,
                "updated_by_uid": creator.uid,
            }

            # get analysis tests
            analyses = []
            service_data = entry["code"]["coding"]

            for coding in service_data:
                analysis = await self.analysis_service.get(keyword=coding["code"])
                analyses.append(analysis)

            tat_lengths = []
            for anal in analyses:
                if anal.tat_length_minutes:
                    tat_lengths.append(anal.tat_length_minutes)
            if tat_lengths:
                minutes = max(tat_lengths)
                sam_in["due_date"] = datetime.now() + timedelta(minutes=minutes)

            sa_sch = SampleCreate(**sam_in)
            sample = await self.sample_service.create(**marshal(sa_sch))

            # auto receive samples
            await self.sample_service.receive(received_by=creator)

            # link sample to provided services
            for _anal in analyses:
                await self.repository.table_insert(
                    table=sample_analysis,
                    mappings={"sample_uid": sample.uid, "analysis_uid": _anal.uid},
                )

            # create and attach result objects for each Analyses
            # logger.info(
            #     f"Adding {len(analyses)} service results to the sample {sample.sample_id}"
            # )
            a_result_schema = AnalysisResultCreate(
                sample_uid=sample.uid,
                status=ResultStates.PENDING,
                analysis_uid=None,
                due_date=None,
                created_by_uid=creator.uid,
                updated_by_uid=creator.uid,
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
            created = await self.analysis_result_service.bulk_create(
                [marshal(rs) for rs in result_schemas]
            )

            # initialise reflex action if exist
            # logger.debug(f"ReflexUtil .... set_reflex_actions ...")
            await self.reflex_engine_service.set_reflex_actions(created)

            # ! paramount !
            await asyncio.sleep(2)

            # Add sample to shipment
            await self.shipped_sample_service.create(
                **{
                    "sample_uid": sample.uid,
                    "shipment_uid": shipment.uid,
                    "ext_sample_uid": sample_data["identifier"][0]["value"],
                    "ext_sample_id": sample_data["accessionIdentifier"]["value"],
                }
            )

        await self.change_state(shipment, ShipmentStates.RECEIVED, creator)
        await self.job_service.change_status(job, new_status=JobStates.FINISHED)

    async def shipment_recover(
        self, shipment: Shipment, samples_data: list[dict], actor
    ):
        async def process_sample(sample_data):
            sample = await self.sample_service.get(
                uid=sample_data.get("sample_uid", None)
            )
            if not sample:
                # logger.info(f"Failed to retrieve sample {sample_data} .... skipping")
                return

            _, analytes = await self.sample_service.get_referred_analyses(sample)
            for analyte in analytes:
                await self.analysis_result_service.change_status(
                    analyte, ResultStates.PENDING
                )

            no_referred = await self.sample_service.has_no_referred_analyses(sample)
            if no_referred:
                await self.sample_service.change_status(
                    sample, SampleStates.RECEIVED, actor
                )
            else:
                await self.sample_service.change_status(
                    sample, SampleStates.PAIRED, actor
                )

            shipped_sample = await self.shipped_sample_service.get(
                sample_uid=sample_data.get("sample_uid", None)
            )
            if shipped_sample and no_referred:
                await self.repository.delete(shipped_sample)

        async def worker(sample_d):
            async with semaphore:
                await process_sample(sample_d)

        # Create a semaphore with a limit of concurrent tasks
        num_workers = 10  # Adjust this value based on your system's capacity
        semaphore = asyncio.Semaphore(num_workers)

        # Process samples concurrently using the semaphore
        await asyncio.gather(*(worker(sample_data) for sample_data in samples_data))

        return await self.reset_assigned_count(shipment)

    async def recall(self, shipment: Shipment, samples_data: list[dict], actor: User):
        async def process_sample(sample_data):
            sample = await self.sample_service.get(
                uid=sample_data.get("sample_uid", None)
            )
            if not sample:
                # logger.info(f"Failed to retrieve sample {sample_data} .... skipping")
                return

            await self.sample_service.change_status(sample, SampleStates.PAIRED, actor)

        async def worker(sample_d):
            async with semaphore:
                await process_sample(sample_d)

        # Create a semaphore with a limit of concurrent tasks
        num_workers = 10  # Adjust this value based on your system's capacity
        semaphore = asyncio.Semaphore(num_workers)

        # Process samples concurrently using the semaphore
        await asyncio.gather(*(worker(sample_data) for sample_data in samples_data))

        return shipment

    async def reset_assigned_count(self, shipment: Shipment):
        shipped_samples = await self.shipped_sample_service.get_all(
            shipment_uid=shipment.uid
        )

        count = len(shipped_samples)
        if count == 0:
            shipment.state = ShipmentStates.EMPTY

        if count > 0 and shipment.state == ShipmentStates.EMPTY:
            shipment.state = ShipmentStates.PREPARATION

        shipment.assigned_count = count
        return await super().update(shipment, **marshal(shipment))

    async def reject(self, shipment: Shipment, actor):
        return await self.change_state(shipment, ShipmentStates.REJECTED, actor)

    async def add_receive_task(self, shipment: Shipment, actor):
        job_schema = JobCreate(
            action=JobActions.SH_RECEIVE,
            category=JobCategories.SHIPMENT,
            priority=JobPriorities.MEDIUM,
            creator_uid=actor.uid,
            job_id=shipment.uid,
            status=JobStates.PENDING,
            data=None,
        )
        await self.job_service.create(**marshal(job_schema))

        return await self.change_state(shipment, ShipmentStates.RECEIVING, actor)

    async def cancel(self, shipment: Shipment, actor: User):
        shipped_samples = await self.shipped_sample_service.get_all(
            shipment_uid=shipment.uid
        )
        samples = list(map(lambda ss: ss.sample, shipped_samples))

        async def process_sample(smpl: Sample):
            _, analytes = await self.sample_service.get_referred_analyses(smpl)
            await asyncio.gather(
                *(
                    self.analysis_result_service.change_status(
                        analyte, ResultStates.PENDING
                    )
                    for analyte in analytes
                )
            )
            await self.sample_service.change_status(smpl, SampleStates.RECEIVED, actor)

        for sample in samples:
            await process_sample(sample)

        return await self.change_state(shipment, ShipmentStates.CANCELLED, actor)

    async def finalise(self, shipment: Shipment, user: User):

        if not shipment.state == ShipmentStates.PREPARATION:
            return

        # generate manifest
        shipped_samples = await self.shipped_sample_service.get_all(
            shipment_uid=shipment.uid
        )
        samples: list[Sample] = list(map(lambda ss: ss.sample, shipped_samples))

        manifest_data = []
        for sample in samples:
            services = []
            _, analytes = await self.sample_service.get_referred_analyses(sample)
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

        await self.generate_manifest(manifest_data, shipment)

        if shipment.state == ShipmentStates.PREPARATION:
            shipment.state = ShipmentStates.READY
            shipment.finalised_by_uid = user.uid
            saved = await super().update(shipment, **marshal(shipment))
            await self.activity_stream_service.stream(
                saved, user, "finalised", "shipment"
            )
            return saved
        return shipment

    async def generate_manifest(self, data: list[dict], shipment: Shipment):
        manifest_pdf = await ManifetReport().generate(data)
        update_in = ShipmentUpdate(
            **{
                "json_content": {"data": data},
                "pdf_content": manifest_pdf,
            }
        )
        await super().update(shipment, **marshal(update_in))

    async def result_update(self, diagnostic_report: dict, user: User):
        # get basedOn-uid
        based_on = diagnostic_report.get("basedOn", None)
        if not based_on:
            return

        # based = list(filter(lambda bo: bo["identifier"]["system"] == "felicity/sample/uid", based_on))
        based = list(
            filter(
                lambda bo: bo["identifier"]["type"]["text"] == "Sample UID", based_on
            )
        )
        sample_uid = based[0]["identifier"]["value"]

        sample: Sample = await self.sample_service.get(uid=sample_uid)
        if not sample:
            return

        for result in diagnostic_report.get("result", []):
            assert result.get("type", None) == "Observation"
            identity = result.get("identifier", None)
            keyword = identity["type"]["text"]
            value = identity["value"]

            results = await self.sample_service.get_analysis_results(sample)
            allowed_states = [
                ResultStates.REFERRED,
            ]
            results = list(
                filter(
                    lambda r: r.keyword == keyword and r.status in allowed_states,
                    results,
                )
            )

            assert len(results) == 1
            target = results[0]

            update_in = {
                "result": value,
                "submitted_by_name": "",
                "verified_by_name": "",
                "status": ResultStates.APPROVED,
            }
            await self.analysis_result_service.update(target, **marshal(update_in))
            await self.sample_service.verify(sample, user)

    async def populate_manually(self, job_uid: str):
        # logger.info(f"starting job {job_uid} ....")
        job = await self.job_service.get(uid=job_uid)
        if not job:
            return

        if not job.status == JobStates.PENDING:
            return

        await job.change_status(new_status=JobStates.RUNNING)
        shipment_uid = job.job_id

        shipment = await self.get(uid=shipment_uid)
        if not shipment:
            await self.job_service.change_status(
                job,
                new_status=JobStates.FAILED,
                change_reason=f"Failed to acquire Shipment {shipment_uid}",
            )
            # logger.warning(f"Failed to acquire Shipment {shipment_uid}")
            return

        await self.reset_assigned_count(shipment)

        # handle Empty and preparation
        if shipment.state not in [
            ShipmentStates.EMPTY,
            ShipmentStates.PREPARATION,
        ]:
            await self.job_service.change_status(
                job,
                new_status=JobStates.FAILED,
                change_reason=f"Shipment {shipment_uid} - is already processed",
            )
            # logger.warning(f"Shipment {shipment_uid} - is already processed")
            return

        user = await self.user_service.get(uid=job.creator_uid)
        await self.assign(shipment, job.data, user)

        await self.job_service.change_status(job, new_status=JobStates.FINISHED)
        # logger.info(f"Done !! Job {job_uid} was executed successfully :)")

    async def process_shipped_report(self, job_uid: str):
        # logger.info(f"starting job return shipped report: {job_uid} ....")
        job = await self.job_service.get(uid=job_uid)
        if not job:
            return

        if not job.status == JobStates.PENDING:
            return

        await self.job_service.change_status(job, new_status=JobStates.RUNNING)
        data = job.data.get("data", None)

        assert data["resourceType"] == "DiagnosticReport"

        actor = await self.user_service.get(uid=job.creator_uid)
        await self.result_update(data, actor)

        await self.job_service.change_status(job, new_status=JobStates.FINISHED)
