import asyncio
import logging
from dataclasses import field
from datetime import datetime

import strawberry  # noqa

from felicity.api.gql.instrument.types import (
    CalibrationCertificateType,
    InstrumentCalibrationType,
    InstrumentCompetenceType,
    InstrumentType,
    InstrumentTypeType,
    LaboratoryInstrumentType,
    MethodType,
    InstrumentResultExclusionsType,
    InstrumentResultTranslationType,
)
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.analysis.entities.analysis import (
    analysis_instrument,
    analysis_method,
)
from felicity.apps.analysis.enum import SampleState
from felicity.apps.analysis.services.analysis import AnalysisService
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.instrument import schemas
from felicity.apps.instrument.entities import method_instrument
from felicity.apps.instrument.services import (
    CalibrationCertificateService,
    InstrumentCalibrationService,
    InstrumentCompetenceService,
    InstrumentService,
    InstrumentTypeService,
    LaboratoryInstrumentService,
    MethodService,
    InstrumentResultExclusionsService,
    InstrumentResultTranslationService,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

InstrumentTypeResponse = strawberry.union(
    "InstrumentTypeResponse",
    (InstrumentTypeType, OperationError),
    description="",  # noqa
)
InstrumentResponse = strawberry.union(
    "InstrumentResponse",
    (InstrumentType, OperationError),
    description="",  # noqa
)
LaboratoryInstrumentResponse = strawberry.union(
    "LaboratoryInstrumentResponse",
    (LaboratoryInstrumentType, OperationError),
    description="",  # noqa
)
InstrumentCompetenceResponse = strawberry.union(
    "InstrumentCompetenceResponse",
    (InstrumentCompetenceType, OperationError),
    description="",  # noqa
)
MethodResponse = strawberry.union(
    "MethodResponse",
    (MethodType, OperationError),
    description="",  # noqa
)

InstrumentCalibrationResponse = strawberry.union(
    "InstrumentCalibrationResponse",
    (InstrumentCalibrationType, OperationError),
    description="",  # noqa
)
CalibrationCertificateResponse = strawberry.union(
    "CalibrationCertificateResponse",
    (CalibrationCertificateType, OperationError),
    description="",  # noqa
)

InstrumentResultExclusionsResponse = strawberry.union(
    "InstrumentResultExclusionsResponse",
    (InstrumentResultExclusionsType, OperationError),
    description="",  # noqa
)

InstrumentResultTranslationResponse = strawberry.union(
    "InstrumentResultTranslationResponse",
    (InstrumentResultTranslationType, OperationError),
    description="",  # noqa
)


@strawberry.input
class InstrumentTypeInputType:
    name: str
    description: str | None = ""


@strawberry.input
class InstrumentInputType:
    name: str
    keyword: str
    description: str | None = ""
    instrument_type_uid: str | None = None
    supplier_uid: str | None = None
    manufacturer_uid: str | None = None


@strawberry.input
class LaboratoryInstrumentInputType:
    instrument_uid: str
    lab_name: str
    serial_number: str | None = None
    date_commissioned: datetime | None = None
    date_decommissioned: datetime | None = None


@strawberry.input
class MethodInputType:
    name: str
    instruments: list[str] | None = field(default_factory=list)
    analyses: list[str] | None = field(default_factory=list)
    keyword: str | None = None
    description: str | None = ""


@strawberry.input
class InstrumentCalibrationInput:
    laboratory_instrument_uid: str
    date_reported: datetime | None
    start_date: str | None
    end_date: str | None
    calibration_id: str | None = ""
    report_id: str | None = ""
    performed_by: str | None = ""
    notes_before: str | None = ""
    work_done: str | None = ""
    remarks: str | None = ""


@strawberry.input
class CalibrationCertificateInput:
    laboratory_instrument_uid: str
    date_issued: datetime | None
    valid_from_date: str | None
    valid_to_date: str | None
    certificate_code: str | None = ""
    issuer: str | None = ""
    performed_by: str | None = ""
    approved_by: str | None = ""
    remarks: str | None = ""
    internal: bool = True


@strawberry.input
class InstrumentCompetenceInput:
    instrument_uid: str
    description: str
    user_uid: str
    issue_date: datetime
    expiry_date: datetime
    internal: bool
    competence: str


@strawberry.input
class InstrumentResultExclusionsInput:
    instrument_uid: str
    instrument: InstrumentType
    result: str
    reason: str | None = None


@strawberry.input
class InstrumentResultTranslationInput:
    instrument_uid: str
    instrument: InstrumentType
    original: str
    translated: str
    keyword: str
    reason: str | None = None


@strawberry.type
class InstrumentMutations:
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_instrument_type(
            self, info, payload: InstrumentTypeInputType
    ) -> InstrumentTypeResponse:  # noqa
        exists = await InstrumentTypeService().get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A InstrumentType named {payload.name} already exists"
            )

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.InstrumentTypeCreate(**incoming)
        inst_type = await InstrumentTypeService().create(obj_in)
        return InstrumentTypeType(**inst_type.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_instrument_type(
            self, info, uid: str, payload: InstrumentTypeInputType
    ) -> InstrumentTypeResponse:  # noqa
        inst_type = await InstrumentTypeService().get(uid=uid)
        if not inst_type:
            return OperationError(
                error=f"manufacturer with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = inst_type.to_dict()
        for _field in obj_data:
            if _field in payload.__dict__:
                try:
                    setattr(inst_type, _field, payload.__dict__[_field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentTypeUpdate(**inst_type.to_dict())
        inst_type = await InstrumentTypeService().update(inst_type.uid, obj_in)
        return InstrumentTypeType(**inst_type.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_instrument(
            self, info, payload: InstrumentInputType
    ) -> InstrumentResponse:  # noqa
        if not payload.name or not payload.keyword:
            return OperationError(
                error="Provide a name and a unique keyword for your instrument"
            )

        taken = await InstrumentService().get(keyword=payload.keyword)
        if taken:
            return OperationError(
                error=f"Provided keyword already assigned to instrument {taken.name}"
            )

        exists = await InstrumentService().get(name=payload.name)
        if exists:
            return OperationError(
                error=f"An Instrument named {payload.name} already exists"
            )

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.InstrumentCreate(**incoming)
        instrument = await InstrumentService().create(obj_in)
        return InstrumentType(**instrument.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_instrument(
            self, info, uid: str, payload: InstrumentInputType
    ) -> InstrumentResponse:  # noqa
        if "keyword" in payload.__dict__:
            taken = await InstrumentService().get(keyword=payload.keyword)
            if taken and (str(uid) != str(taken.uid)):
                return OperationError(
                    error=f"Provided keyword already assigned to instrument {taken.name}"
                )

        instrument = await InstrumentService().get(uid=uid)
        if not instrument:
            return OperationError(
                error=f"instrument with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = instrument.to_dict()
        for _field in obj_data:
            if _field in payload.__dict__:
                try:
                    setattr(instrument, _field, payload.__dict__[_field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentUpdate(**instrument.to_dict())
        instrument = await InstrumentService().update(instrument.uid, obj_in)
        return InstrumentType(**instrument.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_instrument_competence(
            self, info, payload: InstrumentCompetenceInput
    ) -> InstrumentCompetenceResponse:  # noqa
        instrument = await InstrumentService().get(keyword=payload.instrument_uid)
        if not instrument:
            return OperationError(error="Provided instrument does not exist")

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.InstrumentCompetenceCreate(**incoming)
        instrument_competence = await InstrumentCompetenceService().create(obj_in)
        return InstrumentCompetenceType(**instrument_competence.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_instrument_competence(
            self, info, uid: str, payload: InstrumentInputType
    ) -> InstrumentCompetenceResponse:  # noqa
        competence = await InstrumentCompetenceService().get(uid=uid)
        if not competence:
            return OperationError(
                error=f"instrument competence with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = competence.to_dict()
        for _field in obj_data:
            if _field in payload.__dict__:
                try:
                    setattr(competence, _field, payload.__dict__[_field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentCompetenceUpdate(**competence.to_dict())
        competence = await InstrumentCompetenceService().update(competence.uid, obj_in)
        return InstrumentCompetenceType(**competence.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_laboratory_instrument(
            self, info, payload: LaboratoryInstrumentInputType
    ) -> LaboratoryInstrumentResponse:  # noqa
        instrument = await InstrumentService().get(uid=payload.instrument_uid)
        if not instrument:
            return OperationError(
                error=f"Choice instrument not found: {payload.instrument_uid}"
            )

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.LaboratoryInstrumentCreate(**incoming)
        laboratory_instrument = await LaboratoryInstrumentService().create(obj_in)
        return LaboratoryInstrumentType(**laboratory_instrument.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_laboratory_instrument(
            self, info, uid: str, payload: LaboratoryInstrumentInputType
    ) -> LaboratoryInstrumentResponse:  # noqa
        taken = await LaboratoryInstrumentService().get(lab_name=payload.lab_name)
        if taken and taken.uid != uid:
            return OperationError(
                error="Provided lab_name already assigned to another instrument"
            )

        instrument = await LaboratoryInstrumentService().get(uid=uid)
        if not instrument:
            return OperationError(
                error=f"instrument with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = instrument.to_dict()
        for _field in obj_data:
            if _field in payload.__dict__:
                try:
                    setattr(instrument, _field, payload.__dict__[_field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.LaboratoryInstrumentUpdate(**instrument.to_dict())
        instrument = await LaboratoryInstrumentService().update(instrument.uid, obj_in)
        return LaboratoryInstrumentType(**instrument.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_instrument_caliberation(
            self, info, payload: InstrumentCalibrationInput
    ) -> InstrumentCalibrationResponse:  # noqa
        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.InstrumentCalibrationCreate(**incoming)
        calib = await InstrumentCalibrationService().create(obj_in)
        return InstrumentCalibrationType(**calib.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_instrument_caliberation(
            self, info, uid: str, payload: InstrumentInputType
    ) -> InstrumentCalibrationResponse:  # noqa
        caliberation = await InstrumentCalibrationService().get(uid=uid)
        if not caliberation:
            return OperationError(
                error=f"caliberation with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = caliberation.to_dict()
        for _field in obj_data:
            if _field in payload.__dict__:
                try:
                    setattr(caliberation, _field, payload.__dict__[_field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentCalibrationUpdate(**caliberation.to_dict())
        caliberation = await InstrumentCalibrationService().update(
            caliberation.uid, obj_in
        )
        return InstrumentCalibrationType(**caliberation.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_caliberation_certificate(
            self, info, payload: CalibrationCertificateInput
    ) -> CalibrationCertificateResponse:  # noqa
        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.CalibrationCertificateCreate(**incoming)
        certificate = await CalibrationCertificateService().create(obj_in)
        return CalibrationCertificateType(**certificate.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_caliberation_certificate(
            self, info, uid: str, payload: CalibrationCertificateInput
    ) -> CalibrationCertificateResponse:  # noqa
        certificate = await CalibrationCertificateService().get(uid=uid)
        if not certificate:
            return OperationError(
                error=f"caliberation certificate with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = certificate.to_dict()
        for _field in obj_data:
            if _field in payload.__dict__:
                try:
                    setattr(certificate, _field, payload.__dict__[_field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.CalibrationCertificateUpdate(**certificate.to_dict())
        certificate = await CalibrationCertificateService().update(
            certificate.uid, obj_in
        )
        return CalibrationCertificateType(**certificate.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_method(self, info, payload: MethodInputType) -> MethodResponse:  # noqa
        if "keyword" in payload.__dict__:
            taken = await MethodService().get(keyword=payload.keyword)
            if taken:
                return OperationError(
                    error=f"Provided keyword already assigned to Method {taken.name}"
                )

        exists = await MethodService().get(name=payload.name)
        if exists:
            return OperationError(error=f"A Method named {payload.name} already exists")

        incoming = {}
        for k, v in payload.__dict__.items():
            if k not in ["instruments", "analyses"]:
                incoming[k] = v

        obj_in = schemas.MethodCreate(**incoming)
        method = await MethodService().create(obj_in, related=["instruments"])

        _instruments = set()
        for i_uid in payload.instruments:
            instrument = await InstrumentService().get(uid=i_uid)
            if not instrument:
                return OperationError(
                    error=f"An instrument with uid {i_uid} does not exist"
                )
            if instrument not in _instruments:
                _instruments.add(instrument)
                await MethodService().repository.table_insert(
                    table=method_instrument,
                    mappings=[
                        {
                            "method_uid": method.uid,
                            "instrument_uid": instrument.uid,
                        }
                    ],
                )

        for a_uid in payload.analyses:
            analysis = await AnalysisService().get(uid=a_uid, related=["methods"])
            meth_uids = [meth.uid for meth in analysis.methods]
            if method.uid not in meth_uids:
                await AnalysisService().repository.table_insert(
                    table=analysis_method,
                    mappings=[{"method_uid": method.uid, "analysis_uid": analysis.uid}],
                )

        # infer linkages between analysis and instrument based on the r/ship they share with this method
        for _instr in payload.instruments:
            for _anal in payload.analyses:
                exists = AnalysisService().repository.table_query(
                    table=analysis_instrument,
                    filters=[{"instrument_uid": _instr, "analysis_uid": _anal}],
                )
                if not exists:
                    await AnalysisService().repository.table_insert(
                        table=analysis_instrument,
                        mappings=[
                            {
                                "instrument_uid": _instr,
                                "analysis_uid": _anal,
                            }
                        ],
                    )

        # Refresh samples that are affected by the method changes
        async def process_snapshots(analyses):
            results = await AnalysisResultService().get_all(related=['sample'], analysis_uid__in=analyses)
            to_snapshot = list(filter(lambda r: r.sample.status == SampleState.RECEIVED, results))
            await AnalysisResultService().snapshot(to_snapshot)

        # Add the task to background tasks
        # info.context.background_tasks.add_task(process_snapshots, payload.analyses)
        asyncio.create_task(process_snapshots(payload.analyses))
        return MethodType(**method.marshal_simple(exclude=["instruments", "analyses"]))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_method(self, info, uid: str, payload: MethodInputType) -> MethodResponse:  # noqa
        if "keyword" in payload.__dict__:
            taken = await MethodService().get(keyword=payload.keyword)
            if taken and not (str(uid) == str(taken.uid)):
                return OperationError(
                    error=f"Provided keyword already assigned to method {taken.name}"
                )

        method = await MethodService().get(uid=uid)
        if not method:
            return OperationError(
                error=f"method with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = method.to_dict()
        for _field in obj_data:
            if _field in payload.__dict__:
                try:
                    setattr(method, _field, payload.__dict__[_field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.MethodUpdate(**method.to_dict())
        method = await MethodService().update(method.uid, obj_in)

        # instrument management
        _sacked_instruments = set()
        existing_instrument_uids = [inst.uid for inst in method.instruments]
        for _inst in existing_instrument_uids:
            if _inst not in payload.instruments:
                instruments = filter(lambda i: i.uid == _inst, method.instruments)
                instrument = list(instruments)[0]
                method.instruments.remove(instrument)
                _sacked_instruments.add(_inst)

        _added_instruments = set()
        for _inst in payload.instruments:
            if _inst not in existing_instrument_uids:
                instrument = await InstrumentService().get(uid=_inst)
                method.instruments.append(instrument)
                _added_instruments.add(_inst)

        method = await MethodService().save(method)

        # analyses management
        # Find all analyses linked already to this method
        _sacked_analyses = set()
        existing_analyses_uids = await AnalysisService().repository.table_query(
            table=analysis_method,
            columns=["analysis_uid"],
            method_uid=method.uid,
        )
        for _anal in existing_analyses_uids:
            analysis = await AnalysisService().get(uid=_anal, related=["methods"])
            if _anal not in payload.analyses:
                for _method in analysis.methods:
                    if _method.uid == method.uid:
                        analysis.methods.remove(_method)
                        _sacked_analyses.add(_anal)
                        await AnalysisService().save(analysis)

        _added_analyses = set()
        for _anal in payload.analyses:
            if _anal not in existing_analyses_uids:
                analysis = await AnalysisService().get(uid=_anal)
                await AnalysisService().repository.table_insert(
                    table=analysis_method,
                    mappings=[{"method_uid": method.uid, "analysis_uid": analysis.uid}],
                )
                _added_analyses.add(_anal)

        # infer linkage updates between analysis and instrument based on the r/ship they share with this method
        # link new additions
        for _instr in _added_instruments:
            for _anal in _added_analyses:
                exists = await AnalysisService().repository.table_query(
                    table=analysis_instrument, instrument_uid=_instr, analysis_uid=_anal,
                )
                if not exists:
                    await AnalysisService().repository.table_insert(
                        table=analysis_instrument,
                        mappings=[{"instrument_uid": _instr, "analysis_uid": _anal}],
                    )

        # handle sacked -- an instrument or analyses or both can be removed from method
        # if both analysis and instrument are removed at the same time
        for _instr in _sacked_instruments:
            for _anal in _sacked_analyses:
                exists = await AnalysisService().repository.table_query(
                    table=analysis_instrument,
                    instrument_uid=_instr,
                    analysis_uid=_anal,
                )
                if exists:
                    await AnalysisService().repository.table_delete(
                        table=analysis_instrument,
                        instrument_uid=_instr,
                        analysis_uid=_anal,
                    )

        # Remove relationships in analysis_instrument for sacked instruments only
        for _instr in _sacked_instruments:
            exists = await AnalysisService().repository.table_query(
                table=analysis_instrument,
                instrument_uid=_instr,
                columns=['analysis_uid']
            )
            for relation in exists:
                if relation not in _sacked_analyses:
                    await AnalysisService().repository.table_delete(
                        table=analysis_instrument,
                        instrument_uid=_instr,
                    )

        # Remove relationships in analysis_instrument for sacked analyses only
        for _anal in _sacked_analyses:
            exists = await AnalysisService().repository.table_query(
                table=analysis_instrument,
                analysis_uid=_anal,
                columns=['instrument_uid']
            )
            for relation in exists:
                if relation not in _sacked_instruments:
                    await AnalysisService().repository.table_delete(
                        table=analysis_instrument,
                        analysis_uid=_anal,
                    )

        # Refresh samples that are affected by the method changes
        async def process_snapshots(analyses):
            results = await AnalysisResultService().get_all(related=['sample'], analysis_uid__in=analyses)
            to_snapshot = list(filter(lambda r: r.sample.status == SampleState.RECEIVED, results))
            await AnalysisResultService().snapshot(to_snapshot)

        # Add the task to background tasks
        linked_analyses = await AnalysisService().repository.table_query(
            table=analysis_method,
            method_uid=method.uid,
            columns=["analysis_uid"],
        )
        # info.context.background_tasks.add_task(process_snapshots, list(_added_analyses) + list(_sacked_analyses))
        asyncio.create_task(process_snapshots(linked_analyses))
        return MethodType(**method.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_instrument_result_exclusions(
            self, info, payload: InstrumentResultExclusionsInput
    ) -> InstrumentResultExclusionsResponse:  # noqa
        instrument = await InstrumentService().get(uid=payload.instrument_uid)
        if not instrument:
            return OperationError(error="Provided instrument does not exist")

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.InstrumentResultExclusionsCreate(**incoming)
        exclusion = await InstrumentResultExclusionsService().create(obj_in)
        return InstrumentResultExclusionsType(**exclusion.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_instrument_result_exclusions(
            self, info, uid: str, payload: InstrumentResultExclusionsInput
    ) -> InstrumentResultExclusionsResponse:  # noqa
        exclusion = await InstrumentResultExclusionsService().get(uid=uid)
        if not exclusion:
            return OperationError(
                error=f"instrument result exclusion with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = exclusion.to_dict()
        for _field in obj_data:
            if _field in payload.__dict__:
                try:
                    setattr(exclusion, _field, payload.__dict__[_field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentResultExclusionsUpdate(**exclusion.to_dict())
        exclusion = await InstrumentResultExclusionsService().update(exclusion.uid, obj_in)
        return InstrumentResultExclusionsType(**exclusion.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_instrument_result_translation(
            self, info, payload: InstrumentResultTranslationInput
    ) -> InstrumentResultTranslationResponse:  # noqa
        instrument = await InstrumentService().get(uid=payload.instrument_uid)
        if not instrument:
            return OperationError(error="Provided instrument does not exist")

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.InstrumentResultTranslationCreate(**incoming)
        translation = await InstrumentResultTranslationService().create(obj_in)
        return InstrumentResultTranslationType(**translation.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_instrument_result_translation(
            self, info, uid: str, payload: InstrumentResultTranslationInput
    ) -> InstrumentResultTranslationResponse:  # noqa
        translation = await InstrumentResultTranslationService().get(uid=uid)
        if not translation:
            return OperationError(
                error=f"instrument result translation with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = translation.to_dict()
        for _field in obj_data:
            if _field in payload.__dict__:
                try:
                    setattr(translation, _field, payload.__dict__[_field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentResultTranslationUpdate(**translation.to_dict())
        translation = await InstrumentResultTranslationService().update(translation.uid, obj_in)
        return InstrumentResultTranslationType(**translation.marshal_simple())
