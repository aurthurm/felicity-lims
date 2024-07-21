import logging
import time

from domain.analysis.conf import ResultStates, SampleStates
from domain.analysis.ports.service.analysis import ISampleTypeService, ISampleService
from domain.analysis.ports.service.quality_control import (
    IQCTemplateService,
    IQCLevelService,
    IQCSetService,
)
from domain.analysis.ports.service.result import IAnalysisResultService
from domain.analysis.schemas import AnalysisResult
from domain.analysis.schemas import QCSetCreate, AnalysisResultCreate, SampleCreate
from domain.exceptions import *
from domain.idsequence.ports.service import IIdSequenceService
from domain.job.conf import JobActions, JobCategories, JobPriorities, JobStates
from domain.job.ports.service import IJobService
from domain.job.schemas import JobCreate
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from domain.user.schemas import User
from domain.worksheet.conf import WSStates
from domain.worksheet.ports import ReservedIn
from domain.worksheet.ports.repository import (
    IWorkSheetRepository,
    IWorkSheetTemplateRepository,
)
from domain.worksheet.ports.service import IWorkSheetService, IWorkSheetTemplateService
from domain.worksheet.schemas import (
    WorkSheet,
    WSTemplate,
    WorkSheetCreate,
    WorkSheetUpdate,
    WSTemplateCreate,
    WSTemplateUpdate,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WorkSheetService(BaseService[WorkSheet], IWorkSheetService):
    def __init__(
        self,
        repository: IWorkSheetRepository,
        analysis_result_service: IAnalysisResultService,
        sample_service: ISampleService,
        template_service: IWorkSheetTemplateService,
        id_service: IIdSequenceService,
        job_service: IJobService,
        qc_set_service: IQCSetService,
        qc_template_service: IQCTemplateService,
    ):
        self.repository = repository
        self.analysis_result_service = analysis_result_service
        self.sample_service = sample_service
        self.template_service = template_service
        self.id_service = id_service
        self.job_service = job_service
        self.qc_set_service = qc_set_service
        self.qc_template_service = qc_template_service
        super().__init__(repository)

    async def get_analysis_results(self, worksheet_uid: str):
        results: list[AnalysisResult] = []
        qc_results: list[AnalysisResult] = []

        all_results = await self.analysis_result_service.get_all(
            worksheet_uid=worksheet_uid
        )
        for result in all_results:
            if result.sample.sample_type.name == "QC Sample":
                qc_results.append(result)
            else:
                results.append(result)

        return results, qc_results

    async def reset_assigned_count(self, worksheet_uid: str) -> None:
        # TODO: DO NOT COUNT QC SAMPLES
        worksheet = await self.repository.get(uid=worksheet_uid)
        analysis_results, _ = await worksheet.get_analysis_results()
        count = len(analysis_results)
        worksheet.assigned_count = count
        if count == 0:
            worksheet.state = WSStates.EMPTY

        if count > 0 and worksheet.state == WSStates.EMPTY:
            worksheet.state = WSStates.PENDING

        await self.repository.update(worksheet, **marshal(worksheet))

    async def change_state(
        self, worksheet: WorkSheet, state: str, updated_by_uid: str
    ) -> None:
        worksheet.state = state
        worksheet.updated_by_uid = updated_by_uid  # noqa
        await self.repository.update(worksheet, **marshal(worksheet))

    async def has_processed_samples(self, worksheet: WorkSheet):
        states = [
            ResultStates.RESULTED,
            ResultStates.APPROVED,
        ]

        results, qc_results = await self.get_analysis_results(worksheet.uid)
        analysis_results = results + qc_results
        processed = any([res.status in states for res in analysis_results])
        return processed

    async def submit(self, worksheet: WorkSheet, submitter):
        if worksheet.state != WSStates.AWAITING:
            states = [
                ResultStates.RESULTED,
                ResultStates.APPROVED,
            ]

            results, qc_results = await self.get_analysis_results(worksheet.uid)
            analysis_results = results + qc_results
            if all([res.status in states for res in analysis_results]):
                worksheet.state = WSStates.AWAITING
                worksheet.updated_by_uid = submitter.uid  # noqa
                worksheet.submitted_by_uid = submitter.uid
                worksheet = await self.repository.update(
                    worksheet, **marshal(worksheet)
                )
                # await streamer.stream(worksheet, submitter, "submitted", "worksheet")
                return worksheet
        return worksheet

    async def verify(self, worksheet: WorkSheet, verified_by):
        if worksheet.state != WSStates.APPROVED:
            states = [
                ResultStates.APPROVED,
                ResultStates.RETRACTED,
            ]

            results, qc_results = await self.get_analysis_results(worksheet.uid)
            analysis_results = results + qc_results
            if all([res.status in states for res in analysis_results]):
                worksheet.state = WSStates.APPROVED
                worksheet.updated_by_uid = verified_by.uid  # noqa
                worksheet.verified_by_uid = verified_by.uid
                worksheet = await self.repository.update(
                    worksheet, **marshal(worksheet)
                )
                # await streamer.stream(worksheet, verified_by, "verified", "worksheet")
                return worksheet
        return worksheet

    async def create(
        self,
        template_uid: str,
        analyst_uid: str,
        count: int | None,
        user: User,
    ) -> list[WorkSheet]:
        if not count:
            count = 1

        if not template_uid or not analyst_uid:
            raise ValidationError("Analyst and Template are mandatory")

        ws_temp = await self.template_service.get(uid=template_uid)
        if not ws_temp:
            raise NotFoundError(f"WorkSheet Template {template_uid} does not exist")

        incoming = {
            "template_uid": template_uid,
            "analyst_uid": analyst_uid,
            "instrument_uid": ws_temp.instrument_uid,
            "sample_type_uid": ws_temp.sample_type_uid,
            "worksheet_id": None,
            "reserved": ws_temp.reserved,
            "number_of_samples": ws_temp.number_of_samples,
            "rows": ws_temp.rows,
            "cols": ws_temp.cols,
            "row_wise": ws_temp.row_wise,
            "state": WSStates.EMPTY,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }

        ws_schema = WorkSheetCreate(**incoming)
        ws_schema.analysis_uid = ws_temp.analysis_uid
        # ws_schema.qc_levels = ws_temp.qc_levels

        worksheet_schemas = [
            ws_schema.model_copy(
                update={
                    "worksheet_id": (await self.id_service.get_next_number("WS"))[1]
                }
            )
            for i in list(range(count))
        ]

        worksheets = await self.repository.bulk_create(
            [{**marshal(ws)} for ws in worksheet_schemas]
        )

        job_schema = JobCreate(
            action=JobActions.WS_ASSIGN,
            category=JobCategories.WORKSHEET,
            priority=JobPriorities.MEDIUM,
            job_id=None,
            creator_uid=user.uid,
            status=JobStates.PENDING,
        )
        j_schemas = []
        for ws in worksheets:
            j_schemas.append(job_schema.model_copy(update={"job_id": ws.uid}))

        await self.job_service.bulk_create([{**marshal(js)} for js in j_schemas])

        return [(await self.get(uid=ws.uid)) for ws in worksheets]

    async def update(
        self,
        worksheet_uid: str,
        analyst_uid: str | None = None,
        instrument_uid: str | None = None,
        method_uid: str | None = None,
        action: str | None = None,
        samples: list[str] | None = None,
    ) -> WorkSheet:  # noqa

        if not worksheet_uid:
            raise NotFoundError("Worksheet uid required")

        worksheet = await self.repository.get(uid=worksheet_uid)
        if not worksheet:
            raise NotFoundError(f"WorkSheet Template {worksheet_uid} does not exist")

        incoming = {}
        result_update = {}
        incoming["analyst_uid"] = analyst_uid
        incoming["instrument_uid"] = instrument_uid
        result_update["instrument_uid"] = instrument_uid
        result_update["method_uid"] = method_uid

        if incoming:
            ws_schema = WorkSheetUpdate(**incoming)
            worksheet = await self.repository.update(worksheet, **marshal(ws_schema))

        if result_update:
            # update analysis results with updated instrument and methods
            for result in await self.get_analysis_results(worksheet.uid):
                await result.update(result_update)

        if action and samples:
            if action == JobActions.WS_UN_ASSIGN:
                for res_uid in samples:
                    result: AnalysisResult = await AnalysisResult.get(uids=res_uid)
                    if not result:
                        continue
                    # skip un assign of quality control samples
                    if not result.sample.qc_level_uid:
                        result.un_assign()
                await worksheet.reset_assigned_count()

        return worksheet

    async def update_worksheet_apply_template(
        self, template_uid: str, worksheet_uid: str, user: User
    ) -> WorkSheet:

        if not template_uid or not worksheet_uid:
            raise ValidationError("Template and Worksheet are required")

        ws = await self.get(uid=worksheet_uid)
        ws_temp = await self.template_service.get(uid=template_uid)

        # If WS already contains at least a sample from a different template do nothing: No confusion here
        if ws.assigned_count > 0 and ws.template_uid != template_uid:
            raise GenericError(
                f"Worksheet has {ws.assigned_count} assigned samples. You can not apply a different template: \
                Un-assign contained samples first and you will be able to apply any template of your "
                "choosing ",
            )

        incoming = {
            "template_uid": template_uid,
            "analysis_uid": ws_temp.analysis_uid,
            "instrument_uid": ws_temp.instrument_uid,
            "sample_type_uid": ws_temp.sample_type_uid,
            "reserved": ws_temp.reserved,
            "number_of_samples": ws_temp.number_of_samples,
            "rows": ws_temp.rows,
            "cols": ws_temp.cols,
            "row_wise": ws_temp.row_wise,
            "state": WSStates.EMPTY,
        }

        ws_schema = WorkSheetUpdate(**incoming)
        ws = await self.repository.update(ws, **marshal(ws_schema))

        # Add a job
        job_schema = JobCreate(
            action=JobActions.WS_ASSIGN,
            category=JobCategories.WORKSHEET,
            priority=JobPriorities.MEDIUM,
            creator_uid=user.uid,
            job_id=ws.uid,
            status=JobStates.PENDING,
        )
        await self.job_service.create(**marshal(job_schema))

        return ws

    async def update_worksheet_manual_assign(
        self,
        uid: str,
        analyses_uids: list[str],
        qc_template_uid: str | None,
        user: User,
    ) -> WorkSheet:

        if not len(analyses_uids) > 0:
            raise ValidationError("Analyses for assignment are required")

        ws = await self.get(uid=uid)

        # Add a job
        job_schema = JobCreate(
            action=JobActions.WS_MANUAL_ASSIGN,
            category=JobCategories.WORKSHEET,
            priority=JobPriorities.MEDIUM,
            creator_uid=user.uid,
            job_id=ws.uid,
            status=JobStates.PENDING,
            data={"qc_template_uid": qc_template_uid, "analyses_uids": analyses_uids},
        )
        await self.job_service.create(**marshal(job_schema))

        return ws

    async def populate_worksheet_plate(self, job_uid: str) -> None:
        logger.info(f"starting job {job_uid} ....")
        job = await self.job_service.get(uid=job_uid)
        if not job:
            return

        if not job.status == JobStates.PENDING:
            return

        await self.job_service.change_status(job, new_status=JobStates.RUNNING)
        ws_uid = job.job_id

        ws = await self.get(uid=ws_uid)
        if not ws:
            await self.job_servicejob.change_status(
                job,
                new_status=JobStates.FAILED,
                change_reason=f"Failed to acquire WorkSheet {ws_uid}",
            )
            logger.warning(f"Failed to acquire WorkSheet {ws_uid}")
            return

        await ws.reset_assigned_count()

        # Don't handle processed worksheets
        if ws.state in [WSStates.AWAITING, WSStates.APPROVED]:
            await self.job_service.change_status(
                job,
                new_status=JobStates.FAILED,
                change_reason=f"WorkSheet {ws_uid} - is already processed",
            )
            logger.warning(f"WorkSheet {ws_uid} - is already processed")
            return

        # Enforce WS with at least a processed sample
        has_processed_samples = await ws.has_processed_samples()
        if has_processed_samples:
            await self.job_service.change_status(
                job,
                new_status=JobStates.FAILED,
                change_reason=f"WorkSheet {ws_uid} - contains at least a "
                f"processed sample",
            )
            logger.warning(f"WorkSheet {ws_uid} - contains at least a processed sample")
            return

        # Enforce WS sample size limit
        if not ws.assigned_count < ws.number_of_samples:
            await self.job_service.change_status(
                job,
                new_status=JobStates.FAILED,
                change_reason=f"WorkSheet {ws_uid} already has "
                f"{ws.assigned_count} assigned samples",
            )
            logger.warning(
                f"WorkSheet {ws_uid} already has {ws.assigned_count} assigned samples"
            )
            return

        logger.info(f"Filtering samples by template criteria ...")
        # get sample, filtered by analysis_service and Sample Type
        samples = await self.analysis_result_service.filter_for_worksheet(
            analyses_status=ResultStates.PENDING,
            analysis_uid=ws.analysis_uid,
            sample_type_uid=ws.sample_type_uid,
            limit=ws.number_of_samples,
        )

        obtained_count = len(samples)
        logger.info(f"Done filtering: Got {obtained_count} for assignment ...")
        if obtained_count == 0:
            await self.job_service.change_status(
                job,
                new_status=JobStates.FAILED,
                change_reason=f"There are no samples to assign to "
                f"WorkSheet {ws_uid}",
            )
            logger.warning(f"There are no samples to assign to WorkSheet {ws_uid}")
            return

        reserved = [int(r) for r in list(ws.reserved.keys())]

        if ws.assigned_count == 0:

            position = 1
            for key, sample in enumerate(
                sorted(samples, key=lambda s: s.uid, reverse=True)
            ):

                while position in reserved:
                    # skip reserved ?qc positions
                    position += 1

                await self.sample_service.assign(
                    sample, ws.uid, position, ws.instrument_uid
                )
                position += 1

        else:  # populate worksheet using an empty position filling strategy if not empty
            assigned_positions = [
                assigned_anal.worksheet_position
                for assigned_anal in ws.analysis_results
            ]
            empty_positions = [
                pos
                for pos in range(1, ws.number_of_samples + 1)
                if pos not in reserved and pos not in assigned_positions
            ]

            samples = sorted(samples, key=lambda s: s.uid, reverse=True)
            # balance sample count to avoid a key error
            samples = samples[: len(empty_positions)]

            for key in list(range(len(samples))):
                await self.sample_service.assign(
                    samples[key], ws.uid, empty_positions[key], ws.instrument_uid
                )

        time.sleep(1)

        await self.reset_assigned_count(ws)
        if ws.assigned_count > 0 and not ws.state == WSStates.PENDING:
            await self.change_state(
                ws, state=WSStates.PENDING, updated_by_uid=job.creator_uid
            )

        if True:  # ?? maybe allow user to choose whether to add qc samples or not
            await self.setup_quality_control(ws)

        await self.job_service.change_status(job, new_status=JobStates.FINISHED)
        logger.info(f"Done !! Job {job_uid} was executed successfully :)")

    @staticmethod
    def get_sample_position(reserved, level_uid) -> int:
        if not reserved:
            return 0

        matching_keys = [
            k for k, v in reserved.items() if v.get("level_uid", 0) == level_uid
        ]

        return matching_keys[0] if matching_keys else 0

    async def setup_quality_control(self, ws: WorkSheet):
        reserved_pos = ws.reserved
        if ws.template.qc_levels:  # noqa
            # if ws has qc set, then retrieve
            _a_res = await self.analysis_result_service.get_all(worksheet_uid=ws.uid)
            _qc_sets = []

            for _a_r in _a_res:
                if _a_r.sample.qc_set:
                    _qc_sets.append(_a_r.sample.qc_set)

            try:
                qc_set = _qc_sets[0]
            except Exception:  # noqa
                # If ws has no qc_set then create
                qc_set_schema = QCSetCreate(name="Set", note="Auto Generated")
                qc_set = await self.qc_set_service.create(**marshal(qc_set_schema))

            for level in ws.template.qc_levels:  # noqa
                # if ws has qc_set with this level, skip
                add_qc_sample = True
                samples = await self.sample_service.get_all(qc_set_uid=qc_set.uid)
                if samples:
                    for _sample in samples:
                        if _sample.qc_level.uid == level.uid:
                            add_qc_sample = False

                if add_qc_sample:
                    sample_type = await self.sample_service.get_qc_sample_type()

                    # create qc_sample
                    s_in = SampleCreate(
                        sample_type_uid=sample_type.uid,
                        internal_use=True,
                        status=SampleStates.RECEIVED,
                    )
                    # TODO create a special method to handle this inside sample service
                    sample = await self.sample_service.create(**marshal(s_in))
                    sample.qc_set_uid = qc_set.uid
                    sample.qc_level_uid = level.uid
                    sample.analyses.append(ws.analysis)
                    await self.sample_service.update(sample, **marshal(sample))
                    logger.warning(f"Sample {sample.sample_id}, level {level.level}")

                    # create results linkages
                    a_result_in = {
                        "sample_uid": sample.uid,
                        "analysis_uid": ws.analysis_uid,
                        "status": ResultStates.PENDING,
                    }
                    a_result_schema = AnalysisResultCreate(**a_result_in)
                    ar = await self.analysis_result_service.create(
                        **marshal(a_result_schema)
                    )
                    position = self.get_sample_position(reserved_pos, level.uid)
                    await self.analysis_result_service.assign(
                        ar, ws.uid, position, ws.instrument_uid
                    )

    async def setup_quality_control_manually(self, ws: WorkSheet, qc_template_uid: str):
        qc_template = None
        reserved_pos = None
        qc_levels = None

        if qc_template_uid:
            qc_template = await self.qc_template_service.get(uid=qc_template_uid)
            reserved_pos = list(range(1, len(qc_template.qc_levels) + 1))

        if ws.reserved:
            reserved_pos = ws.reserved

        if ws.template.qc_levels:  # noqa
            qc_levels = ws.template.qc_levels  # noqa
        else:
            if qc_template:
                qc_levels = qc_template.qc_levels

        if qc_levels:
            # if ws has qc set, then retrieve
            _a_res = await self.analysis_result_service.get_all(worksheet_uid=ws.uid)
            _qc_sets = []

            for _a_r in _a_res:
                if _a_r.sample.qc_set:
                    _qc_sets.append(_a_r.sample.qc_set)

            try:
                qc_set = _qc_sets[0]
            except Exception:  # noqa
                # If ws has no qc_set then create
                qc_set_schema = QCSetCreate(name="Set", note="Auto Generated")
                qc_set = await self.qc_set_service.create(**marshal(qc_set_schema))

            for level in qc_levels:
                # if ws has qc_set with this level, skip
                add_qc_sample = True
                samples = await self.sample_service.get_all(qc_set_uid=qc_set.uid)
                if samples:
                    for _sample in samples:
                        if _sample.qc_level.uid == level.uid:
                            add_qc_sample = False

                if add_qc_sample:
                    sample_type = await self.sample_service.get_qc_sample_type()

                    # create qc_sample
                    s_in = SampleCreate(
                        sample_type_uid=sample_type.uid,
                        internal_use=True,
                        status=SampleStates.RECEIVED,
                    )
                    sample = await self.sample_service.create(**marshal(s_in))
                    sample.qc_set_uid = qc_set.uid
                    sample.qc_level_uid = level.uid
                    sample.analyses.append(ws.analysis)
                    await self.sample_service.update(sample, **marshal(sample))
                    logger.warning(f"Sample {sample.sample_id}, level {level.level}")

                    # create results linkages
                    a_result_in = {
                        "sample_uid": sample.uid,
                        "analysis_uid": ws.analysis_uid,
                        "status": ResultStates.PENDING,
                    }
                    a_result_schema = AnalysisResultCreate(**a_result_in)
                    ar = await self.analysis_result_service.create(
                        **marshal(a_result_schema)
                    )
                    position = self.get_sample_position(reserved_pos, level.uid)
                    await self.analysis_result_service.assign(
                        ar, ws.uid, position, ws.instrument_uid
                    )

    async def populate_worksheet_plate_manually(self, job_uid: str):
        logger.info(f"starting job {job_uid} ....")
        job = await self.job_service.get(uid=job_uid)
        if not job:
            return

        if not job.status == JobStates.PENDING:
            return

        await self.job_service.change_status(job, new_status=JobStates.RUNNING)
        ws_uid = job.job_id

        ws = await self.get(uid=ws_uid)
        if not ws:
            await job.change_status(
                new_status=JobStates.FAILED,
                change_reason=f"Failed to acquire WorkSheet {ws_uid}",
            )
            logger.warning(f"Failed to acquire WorkSheet {ws_uid}")
            return

        await ws.reset_assigned_count()

        # Don't handle processed worksheets
        if ws.state in [WSStates.AWAITING, WSStates.APPROVED]:
            await self.job_service.change_status(
                job,
                new_status=JobStates.FAILED,
                change_reason=f"WorkSheet {ws_uid} - is already processed",
            )
            logger.warning(f"WorkSheet {ws_uid} - is already processed")
            return

        # Enforce WS with at least a processed sample
        has_processed_samples = await self.has_processed_samples(ws)
        if has_processed_samples:
            await self.job_service.change_status(
                job,
                new_status=JobStates.FAILED,
                change_reason=f"WorkSheet {ws_uid} - contains at least a "
                f"processed sample",
            )
            logger.warning(f"WorkSheet {ws_uid} - contains at least a processed sample")
            return

        data = job.data

        logger.info(f"Fetching samples with uids ... {data['analyses_uids']}")
        # get sample, filtered by analysis_service and Sample Type
        samples = await self.analysis_result_service.get_by_uids(
            uids=data["analyses_uids"]
        )

        obtained_count = len(samples)
        logger.info(f"Acquired {obtained_count} samples for assignment ...")

        reserved = [int(r) for r in list(ws.reserved.keys())]
        if not reserved:
            if data["qc_template_uid"]:
                qc_template = await self.qc_template_service.get(
                    uid=data["qc_template_uid"]
                )
                reserved = list(range(1, len(qc_template.qc_levels) + 1))

        if ws.assigned_count == 0:

            position = 1
            for key, sample in enumerate(
                sorted(samples, key=lambda s: s.uid, reverse=True)
            ):

                while position in reserved:
                    # skip reserved ?qc positions
                    position += 1

                await self.sample_service.assign(
                    sample, ws.uid, position, ws.instrument_uid
                )
                position += 1

        else:  # populate worksheet using an empty position filling strategy if not empty
            total_count = len(ws.analysis_results) + len(samples)

            assigned_positions = []
            empty_positions = []
            for assigned_anal in ws.analysis_results:
                assigned_positions.append(assigned_anal.worksheet_position)

            logger.info(f"reserved : {reserved}")
            logger.info(f"pos array : {list(range(1, total_count + 1))}")
            for pos in list(range(1, total_count + 1)):
                # skip reserved positions
                if pos in reserved:
                    continue

                # track empty positions
                if pos not in assigned_positions:
                    empty_positions.append(pos)

            # fill in empty positions
            empty_positions = sorted(empty_positions)
            samples = sorted(samples, key=lambda s: s.uid, reverse=True)

            logger.info(f"samples: {samples}")
            logger.info(f"assigned_positions: {assigned_positions}")
            logger.info(f"empty_positions: {empty_positions}")

            # balance sample count to avoid a key error
            samples = samples[: len(empty_positions)]

            for key in list(range(len(samples))):
                await self.sample_service.assign(
                    samples[key], ws.uid, empty_positions[key], ws.instrument_uid
                )

        time.sleep(1)

        await self.reset_assigned_count(ws)
        if ws.assigned_count > 0:
            if not ws.state == WSStates.PENDING:
                await ws.change_state(
                    state=WSStates.PENDING, updated_by_uid=job.creator_uid
                )

        if True:  # ?? maybe allow user to choose whether to add qc samples or not
            await self.setup_quality_control_manually(ws, data["qc_template_uid"])

        await self.job_service.change_status(job, new_status=JobStates.FINISHED)
        logger.info(f"Done !! Job {job_uid} was executed successfully :)")


class WorkSheetTemplateService(BaseService[WSTemplate], IWorkSheetTemplateService):
    def __init__(
        self,
        repository: IWorkSheetTemplateRepository,
        sample_type_service: ISampleTypeService,
        qc_template_service: IQCTemplateService,
        qc_level_service: IQCLevelService,
    ):
        self.repository = repository
        self.sample_type_service = sample_type_service
        self.qc_template_service = qc_template_service
        self.qc_level_service = qc_level_service
        super().__init__(repository)

    async def create(
        self,
        user: User,
        name: str,
        sample_type_uid: str,
        reserved: list[ReservedIn],
        analysis_uid: str | None = None,
        number_of_samples: int | None = None,
        instrument_uid: str | None = None,
        worksheet_type: str | None = None,
        rows: int | None = None,
        cols: int | None = None,
        row_wise: bool | None = True,
        description: str | None = None,
        qc_template_uid: str | None = None,
        profiles: list[str] | None = None,
    ) -> WSTemplate:

        taken = await self.get(name=name)
        if taken:
            raise AlreadyExistsError(
                f"WorkSheet Template with name {taken.name} already exist"
            )

        incoming = {
            "name": name,
            "sample_type_uid": sample_type_uid,
            "reserved": reserved,
            "analysis_uid": analysis_uid,
            "number_of_samples": number_of_samples,
            "instrument_uid": instrument_uid,
            "worksheet_type": worksheet_type,
            "rows": rows,
            "cols": cols,
            "row_wise": row_wise,
            "description": description,
            "qc_template_uid": qc_template_uid,
            "created_by_uid": user.uid,
            "updated_by_uid": user.uid,
        }

        _qc_levels = []
        qc_template = await self.qc_template_service.get(uid=qc_template_uid)
        _qc_levels = qc_template.qc_levels

        incoming["reserved"] = []
        if reserved:
            positions = dict()
            for item in reserved:
                positions[item["position"]] = {
                    "position": item["position"],
                    "level_uid": item["level_uid"],
                }
                l_uids = [lvl.uid for lvl in _qc_levels]
                if item["level_uid"] not in l_uids:
                    qc_level = await self.qc_level_service.get(uid=item["level_uid"])
                    _qc_levels.append(qc_level)

            incoming["reserved"] = positions

        wst_schema = WSTemplateCreate(**incoming)
        wst_schema.qc_levels = _qc_levels
        return await self.create(**marshal(wst_schema))

    async def update(
        self,
        uid: str,
        user: User,
        name: str,
        sample_type_uid: str,
        reserved: list[ReservedIn],
        analysis_uid: str | None = None,
        number_of_samples: int | None = None,
        instrument_uid: str | None = None,
        worksheet_type: str | None = None,
        rows: int | None = None,
        cols: int | None = None,
        row_wise: bool | None = True,
        description: str | None = None,
        qc_template_uid: str | None = None,
        profiles: list[str] | None = None,
    ) -> WSTemplate:
        payload = locals()

        ws_template = await self.get(uid=uid)

        wst_data = ws_template.to_dict()
        for field in wst_data:
            if field in payload.__dict__ and field not in ["reserved"]:
                try:
                    setattr(ws_template, field, payload.__dict__[field])
                except AttributeError as e:
                    pass

        _qc_levels = []
        if qc_template_uid:
            ws_template.qc_levels.clear()
            ws_template = await ws_template.save()
            qc_template = await self.qc_template_service.get(uid=qc_template_uid)
            _qc_levels = qc_template.qc_levels
            ws_template.qc_levels = qc_template.qc_levels
            ws_template = await ws_template.save()

        if reserved:
            positions = dict()
            for item in reserved:
                positions[item["position"]] = item.__dict__
                qc_level = await self.qc_level_service.get(uid=item["level_uid"])
                if qc_level not in _qc_levels:
                    _qc_levels.append(qc_level)
            setattr(ws_template, "reserved", positions)

        wst_schema = WSTemplateUpdate(**ws_template.to_dict())
        return await self.repository.update(ws_template, **marshal(wst_schema))
