import logging
import time
from typing import List

import felicity.api.gql.analysis.types
from felicity.apps.analysis.entities.qc import QCTemplate
from felicity.apps.analysis.enum import ResultState, SampleState
from felicity.apps.analysis.schemas import (AnalysisResultCreate, QCSetCreate,
                                            SampleCreate)
from felicity.apps.analysis.services.analysis import SampleService
from felicity.apps.analysis.services.quality_control import (QCSetService,
                                                             QCTemplateService)
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.analysis.utils import get_qc_sample_type
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.job.enum import JobState
from felicity.apps.job.services import JobService
from felicity.apps.worksheet.entities import WorkSheet
from felicity.apps.worksheet.enum import WorkSheetState
from felicity.apps.worksheet.services import WorkSheetService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def populate_worksheet_plate(job_uid: str):
    logger.info(f"starting job {job_uid} ....")
    job_service = JobService()
    worksheet_service = WorkSheetService()
    analysis_result_service = AnalysisResultService()

    job = await job_service.get(uid=job_uid)
    if not job:
        return

    if not job.status == JobState.PENDING:
        return

    await job_service.change_status(job.uid, new_status=JobState.RUNNING)
    ws_uid = job.job_id

    ws = await worksheet_service.get(uid=ws_uid)
    if not ws:
        await job_service.change_status(
            job.uid,
            new_status=JobState.FAILED,
            change_reason=f"Failed to acquire WorkSheet {ws_uid}",
        )
        logger.warning(f"Failed to acquire WorkSheet {ws_uid}")
        return

    await worksheet_service.reset_assigned_count(ws.uid)

    # Don't handle processed worksheets
    if ws.state in [WorkSheetState.AWAITING, WorkSheetState.APPROVED]:
        await job_service.change_status(
            job.uid,
            new_status=JobState.FAILED,
            change_reason=f"WorkSheet {ws_uid} - is already processed",
        )
        logger.warning(f"WorkSheet {ws_uid} - is already processed")
        return

    # Enforce WS with at least a processed sample
    has_processed_samples = await worksheet_service.has_processed_samples(ws.uid)
    if has_processed_samples:
        await job_service.change_status(
            job.uid,
            new_status=JobState.FAILED,
            change_reason=f"WorkSheet {ws_uid} - contains at least a "
            f"processed sample",
        )
        logger.warning(f"WorkSheet {ws_uid} - contains at least a processed sample")
        return

    # Enforce WS sample size limit
    if not ws.assigned_count < ws.number_of_samples:
        await job_service.change_status(
            job.uid,
            new_status=JobState.FAILED,
            change_reason=f"WorkSheet {ws_uid} already has "
            f"{ws.assigned_count} assigned samples",
        )
        logger.warning(
            f"WorkSheet {ws_uid} already has {ws.assigned_count} assigned samples"
        )
        return

    logger.info("Filtering samples by template criteria ...")
    # get sample, filtered by analysis_service and Sample Type
    samples = await analysis_result_service.filter_for_worksheet(
        analyses_status=ResultState.PENDING,
        analysis_uid=ws.analysis_uid,
        sample_type_uid=ws.sample_type_uid,
        limit=ws.number_of_samples,
    )

    obtained_count = len(samples)
    logger.info(f"Done filtering: Got {obtained_count} for assignment ...")
    if obtained_count == 0:
        await job_service.change_status(
            job.uid,
            new_status=JobState.FAILED,
            change_reason=f"There are no samples to assign to " f"WorkSheet {ws_uid}",
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

            await analysis_result_service.assign(sample.uid, ws.uid, position, None)
            position += 1

    else:  # populate worksheet using an empty position filling strategy if not empty
        assigned_positions = [
            assigned_anal.worksheet_position for assigned_anal in ws.analysis_results
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
            await analysis_result_service.assign(
                samples[key].uid, ws.uid, empty_positions[key], None
            )

    time.sleep(1)

    await worksheet_service.reset_assigned_count(ws.uid)
    if ws.assigned_count > 0 and not ws.state == WorkSheetState.PENDING:
        await worksheet_service.change_state(
            ws.uid, state=WorkSheetState.PENDING, updated_by_uid=job.creator_uid
        )

    if True:  # ?? maybe allow user to choose whether to add qc samples or not
        await setup_ws_quality_control(ws)

    await job_service.change_status(job.uid, new_status=JobState.FINISHED)
    logger.info(f"Done !! Job {job_uid} was executed successfully :)")


def get_sample_position(reserved, level_uid) -> int:
    if not reserved:
        return 0

    matching_keys = [
        k for k, v in reserved.items() if v.get("level_uid", 0) == level_uid
    ]

    return int(matching_keys[0]) if matching_keys else 0


async def setup_ws_quality_control(ws: WorkSheet):
    analysis_result_service = AnalysisResultService()
    qc_set_service = QCSetService()
    sample_service = SampleService()

    reserved_pos = ws.reserved
    if ws.template.qc_levels:
        # if ws has qc set, then retrieve
        _a_res = await analysis_result_service.get_all(worksheet_uid=ws.uid)
        _qc_sets = []

        for _a_r in _a_res:
            if _a_r.sample.qc_set:
                _qc_sets.append(_a_r.sample.qc_set)

        try:
            qc_set = _qc_sets[0]
        except Exception:  # noqa
            # If ws has no qc_set then create
            qc_set_schema = QCSetCreate(name="Set", note="Auto Generated")
            qc_set = await qc_set_service.create(qc_set_schema)

        for level in ws.template.qc_levels:
            # if ws has qc_set with this level, skip
            add_qc_sample = True
            samples = await sample_service.get_all(qc_set_uid=qc_set.uid)
            if samples:
                for _sample in samples:
                    if _sample.qc_level.uid == level.uid:
                        add_qc_sample = False

            if add_qc_sample:
                sample_type = await get_qc_sample_type()

                # create qc_sample
                s_in = SampleCreate(
                    sample_type_uid=sample_type.uid,
                    internal_use=True,
                    status=SampleState.RECEIVED,
                )
                sample = await sample_service.create(s_in)
                sample.qc_set_uid = qc_set.uid
                sample.qc_level_uid = level.uid
                sample.analyses.append(ws.analysis)
                await sample_service.update(sample.uid, marshaller(sample))
                logger.warning(f"Sample {sample.sample_id}, level {level.level}")

                # create results linkages
                a_result_in = {
                    "sample_uid": sample.uid,
                    "analysis_uid": ws.analysis_uid,
                    "status": ResultState.PENDING,
                }
                a_result_schema = AnalysisResultCreate(**a_result_in)
                ar = await analysis_result_service.create(a_result_schema)
                position = get_sample_position(reserved_pos, level.uid)
                await analysis_result_service.assign(ar.uid, ws.uid, position, None)


async def setup_ws_quality_control_manually(ws: WorkSheet, qc_template_uid):
    qc_template_service = QCTemplateService()
    analysis_result_service = AnalysisResultService()
    qc_set_service = QCSetService()
    sample_service = SampleService()

    qc_template = None
    reserved_pos = None
    qc_levels = None

    if qc_template_uid:
        qc_template = await qc_template_service.get(uid=qc_template_uid)
        reserved_pos = list(range(1, len(qc_template.qc_levels) + 1))

    if ws.reserved:
        reserved_pos = ws.reserved

    if ws.template.qc_levels:
        qc_levels = ws.template.qc_levels
    else:
        if qc_template:
            qc_levels = qc_template.qc_levels

    if qc_levels:
        # if ws has qc set, then retrieve
        _a_res = await analysis_result_service.get_all(worksheet_uid=ws.uid)
        _qc_sets = []

        for _a_r in _a_res:
            if _a_r.sample.qc_set:
                _qc_sets.append(_a_r.sample.qc_set)

        try:
            qc_set = _qc_sets[0]
        except Exception:  # noqa
            # If ws has no qc_set then create
            qc_set_schema = QCSetCreate(name="Set", note="Auto Generated")
            qc_set = await qc_set_service.create(qc_set_schema)

        for level in qc_levels:
            # if ws has qc_set with this level, skip
            add_qc_sample = True
            samples = await sample_service.get_all(qc_set_uid=qc_set.uid)
            if samples:
                for _sample in samples:
                    if _sample.qc_level.uid == level.uid:
                        add_qc_sample = False

            if add_qc_sample:
                sample_type = await get_qc_sample_type()

                # create qc_sample
                s_in = SampleCreate(
                    sample_type_uid=sample_type.uid,
                    internal_use=True,
                    status=SampleState.RECEIVED,
                )
                sample = await sample_service.create(s_in)
                sample.qc_set_uid = qc_set.uid
                sample.qc_level_uid = level.uid
                sample.analyses.append(ws.analysis)
                await sample_service.update(sample.uid, marshaller(sample))
                logger.warning(f"Sample {sample.sample_id}, level {level.level}")

                # create results linkages
                a_result_in = {
                    "sample_uid": sample.uid,
                    "analysis_uid": ws.analysis_uid,
                    "status": ResultState.PENDING,
                }
                a_result_schema = AnalysisResultCreate(**a_result_in)
                ar = await analysis_result_service.create(a_result_schema)
                position = get_sample_position(reserved_pos, level.uid)
                await analysis_result_service.assign(ar.uid, ws.uid, position, None)


async def populate_worksheet_plate_manually(job_uid: str):
    logger.info(f"starting job {job_uid} ....")
    job_service = JobService()
    worksheet_service = WorkSheetService()
    analysis_result_service = AnalysisResultService()
    qc_template_service = QCTemplateService()
    sample_service = SampleService()

    job = await job_service.get(uid=job_uid)
    if not job:
        return

    if not job.status == JobState.PENDING:
        return

    await job_service.change_status(job.uid, new_status=JobState.RUNNING)
    ws_uid = job.job_id

    ws = await worksheet_service.get(uid=ws_uid)
    if not ws:
        await job_service.change_status(
            job.uid,
            new_status=JobState.FAILED,
            change_reason=f"Failed to acquire WorkSheet {ws_uid}",
        )
        logger.warning(f"Failed to acquire WorkSheet {ws_uid}")
        return

    await worksheet_service.reset_assigned_count(ws.uid)

    # Don't handle processed worksheets
    if ws.state in [WorkSheetState.AWAITING, WorkSheetState.APPROVED]:
        await job_service.change_status(
            job.uid,
            new_status=JobState.FAILED,
            change_reason=f"WorkSheet {ws_uid} - is already processed",
        )
        logger.warning(f"WorkSheet {ws_uid} - is already processed")
        return

    # Enforce WS with at least a processed sample
    has_processed_samples = await worksheet_service.has_processed_samples(ws.uid)
    if has_processed_samples:
        await job_service.change_status(
            job.uid,
            new_status=JobState.FAILED,
            change_reason=f"WorkSheet {ws_uid} - contains at least a "
            f"processed sample",
        )
        logger.warning(f"WorkSheet {ws_uid} - contains at least a processed sample")
        return

    data = job.data

    logger.info(f"Fetching samples with uids ... {data['analyses_uids']}")
    # get sample, filtered by analysis_service and Sample Type
    samples = await analysis_result_service.get_by_uids(uids=data["analyses_uids"])

    obtained_count = len(samples)
    logger.info(f"Acquired {obtained_count} samples for assignment ...")

    reserved = [int(r) for r in list(ws.reserved.keys())]
    if not reserved:
        if data["qc_template_uid"]:
            qc_template = await qc_template_service.get(uid=data["qc_template_uid"])
            reserved = list(range(1, len(qc_template.qc_levels) + 1))

    if ws.assigned_count == 0:

        position = 1
        for key, sample in enumerate(
            sorted(samples, key=lambda s: s.uid, reverse=True)
        ):

            while position in reserved:
                # skip reserved ?qc positions
                position += 1

            await sample_service.assign(sample.uid, ws.uid, position, None)
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
            await sample_service.assign(
                samples[key].uid, ws.uid, empty_positions[key], None
            )

    time.sleep(1)

    await worksheet_service.reset_assigned_count(ws.uid)
    if ws.assigned_count > 0:
        if not ws.state == WorkSheetState.PENDING:
            await worksheet_service.change_state(
                ws.uid, state=WorkSheetState.PENDING, updated_by_uid=job.creator_uid
            )

    if True:  # ?? maybe allow user to choose whether to add qc samples or not

        await setup_ws_quality_control_manually(ws, data["qc_template_uid"])

    await job_service.change_status(job.uid, new_status=JobState.FINISHED)
    logger.info(f"Done !! Job {job_uid} was executed successfully :)")
