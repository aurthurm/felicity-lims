import logging
from dataclasses import field
from datetime import datetime
from typing import List, Optional

import strawberry  # noqa

from felicity.api.gql.instrument.types import (CalibrationCertificateType,
                                               InstrumentCalibrationType,
                                               InstrumentCompetenceType,
                                               InstrumentType,
                                               InstrumentTypeType,
                                               LaboratoryInstrumentType,
                                               MethodType)
from felicity.api.gql.permissions import IsAuthenticated
from felicity.api.gql.types import OperationError
from felicity.apps.analysis.models import analysis as analysis_models
from felicity.apps.instrument import models, schemas

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

InstrumentTypeResponse = strawberry.union(
    "InstrumentTypeResponse",
    (InstrumentTypeType, OperationError),
    description="",  # noqa
)
InstrumentResponse = strawberry.union(
    "InstrumentResponse", (InstrumentType, OperationError), description=""  # noqa
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
    "MethodResponse", (MethodType, OperationError), description=""  # noqa
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
    instruments: Optional[List[str]] = field(default_factory=list)
    analyses: Optional[List[str]] = field(default_factory=list)
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


@strawberry.type
class InstrumentMutations:
    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_instrument_type(
        self, info, payload: InstrumentTypeInputType
    ) -> InstrumentTypeResponse:  # noqa

        if not payload.name:
            return OperationError(error="Please a name for your instrument type")

        exists = await models.InstrumentType.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"A InstrumentType named {payload.name} already exists"
            )

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.InstrumentTypeCreate(**incoming)
        inst_type: models.InstrumentType = await models.InstrumentType.create(obj_in)
        return InstrumentTypeType(**inst_type.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_instrument_type(
        self, info, uid: str, payload: InstrumentTypeInputType
    ) -> InstrumentTypeResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity instrument")

        inst_type = await models.InstrumentType.get(uid=uid)
        if not inst_type:
            return OperationError(
                error=f"manufacturer with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = inst_type.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(inst_type, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentTypeUpdate(**inst_type.to_dict())
        inst_type = await inst_type.update(obj_in)
        return InstrumentTypeType(**inst_type.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_instrument(
        self, info, payload: InstrumentInputType
    ) -> InstrumentResponse:  # noqa

        if not payload.name or not payload.keyword:
            return OperationError(
                error="Provide a name and a unique keyword for your instrument"
            )

        taken = await models.Instrument.get(keyword=payload.keyword)
        if taken:
            return OperationError(
                error=f"Provided keyword already assigned to instrument {taken.name}"
            )

        exists = await models.Instrument.get(name=payload.name)
        if exists:
            return OperationError(
                error=f"An Instrument named {payload.name} already exists"
            )

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.InstrumentCreate(**incoming)
        instrument: models.Instrument = await models.Instrument.create(obj_in)
        return InstrumentType(**instrument.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_instrument(
        self, info, uid: str, payload: InstrumentInputType
    ) -> InstrumentResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity instrument")

        if "keyword" in payload.__dict__:
            taken = await models.Instrument.get(keyword=payload.keyword)
            if taken and (str(uid) != str(taken.uid)):
                return OperationError(
                    error=f"Provided keyword already assigned to instrument {taken.name}"
                )

        instrument = await models.Instrument.get(uid=uid)
        if not instrument:
            return OperationError(
                error=f"instrument with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = instrument.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(instrument, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentUpdate(**instrument.to_dict())
        instrument = await instrument.update(obj_in)
        return InstrumentType(**instrument.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_instrument_competence(
        self, info, payload: InstrumentCompetenceInput
    ) -> InstrumentCompetenceResponse:  # noqa

        instrument = await models.Instrument.get(keyword=payload.instrument_uid)
        if not instrument:
            return OperationError(error=f"Provided instrument does not exist")

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.InstrumentCompetenceCreate(**incoming)
        instrument_competence: models.InstrumentCompetence = (
            await models.InstrumentCompetence.create(obj_in)
        )
        return InstrumentCompetenceType(**instrument_competence.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_instrument_competence(
        self, info, uid: str, payload: InstrumentInputType
    ) -> InstrumentCompetenceResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identify instrument")

        competence = await models.InstrumentCompetence.get(uid=uid)
        if not competence:
            return OperationError(
                error=f"instrument competence with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = competence.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(competence, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentCompetenceUpdate(**competence.to_dict())
        competence = await competence.update(obj_in)
        return InstrumentCompetenceType(**competence.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_laboratory_instrument(
        self, info, payload: LaboratoryInstrumentInputType
    ) -> LaboratoryInstrumentResponse:  # noqa
        instrument = await models.Instrument.get(uid=payload.instrument_uid)
        if not instrument:
            return OperationError(
                error=f"Choice instrument not found: {payload.instrument_uid}"
            )

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.LaboratoryInstrumentCreate(**incoming)
        laboratory_instrument: models.LaboratoryInstrument = (
            await models.LaboratoryInstrument.create(obj_in)
        )
        return LaboratoryInstrumentType(**laboratory_instrument.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_laboratory_instrument(
        self, info, uid: str, payload: LaboratoryInstrumentInputType
    ) -> LaboratoryInstrumentResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity instrument")

        taken = await models.LaboratoryInstrument.get(lab_name=payload.lab_name)
        if taken and taken.uid != uid:
            return OperationError(
                error=f"Provided lab_name already assigned to another instrument"
            )

        instrument = await models.LaboratoryInstrument.get(uid=uid)
        if not instrument:
            return OperationError(
                error=f"instrument with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = instrument.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(instrument, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.LaboratoryInstrumentUpdate(**instrument.to_dict())
        instrument = await instrument.update(obj_in)
        return LaboratoryInstrumentType(**instrument.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_instrument_caliberation(
        self, info, payload: InstrumentCalibrationInput
    ) -> InstrumentCalibrationResponse:  # noqa

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.InstrumentCalibrationCreate(**incoming)
        calib: models.InstrumentCalibration = await models.InstrumentCalibration.create(
            obj_in
        )
        return InstrumentCalibrationType(**calib.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_instrument_caliberation(
        self, info, uid: str, payload: InstrumentInputType
    ) -> InstrumentCalibrationResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        caliberation = await models.InstrumentCalibration.get(uid=uid)
        if not caliberation:
            return OperationError(
                error=f"caliberation with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = caliberation.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(caliberation, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.InstrumentCalibrationUpdate(**caliberation.to_dict())
        caliberation = await caliberation.update(obj_in)
        return InstrumentCalibrationType(**caliberation.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_caliberation_certificate(
        self, info, payload: CalibrationCertificateInput
    ) -> CalibrationCertificateResponse:  # noqa

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = schemas.CalibrationCertificateCreate(**incoming)
        certificate: models.CalibrationCertificate = (
            await models.CalibrationCertificate.create(obj_in)
        )
        return CalibrationCertificateType(**certificate.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_caliberation_certificate(
        self, info, uid: str, payload: CalibrationCertificateInput
    ) -> CalibrationCertificateResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        certificate = await models.CalibrationCertificate.get(uid=uid)
        if not certificate:
            return OperationError(
                error=f"caliberation certificate with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = certificate.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(certificate, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.CalibrationCertificateUpdate(**certificate.to_dict())
        certificate = await certificate.update(obj_in)
        return CalibrationCertificateType(**certificate.marshal_simple())

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def create_method(
        self, info, payload: MethodInputType
    ) -> MethodResponse:  # noqa

        if not payload.name:
            return OperationError(error="Provide a name for your method")

        if "keyword" in payload.__dict__:
            taken = await models.Method.get(keyword=payload.keyword)
            if taken:
                return OperationError(
                    error=f"Provided keyword already assigned to Method {taken.name}"
                )

        exists = await models.Method.get(name=payload.name)
        if exists:
            return OperationError(error=f"A Method named {payload.name} already exists")

        incoming = {}
        for k, v in payload.__dict__.items():
            if k not in ["instruments", "analyses"]:
                incoming[k] = v

        obj_in = schemas.MethodCreate(**incoming)
        method: models.Method = await models.Method.create(obj_in)

        _instruments = set()
        for i_uid in payload.instruments:
            instrument = await models.Instrument.get(uid=i_uid)
            if not instrument:
                return OperationError(
                    error=f"An instrument with uid {i_uid} does not exist"
                )
            if instrument not in _instruments:
                _instruments.add(instrument)
                await models.Method.table_insert(
                    table=models.method_instrument,
                    mappings={
                        "method_uid": method.uid,
                        "instrument_uid": instrument.uid,
                    },
                )

        for a_uid in payload.analyses:
            analysis = await analysis_models.Analysis.get(uid=a_uid)
            meth_uids = [meth.uid for meth in analysis.methods]
            if method.uid not in meth_uids:
                await analysis_models.Analysis.table_insert(
                    table=analysis_models.analysis_method,
                    mappings={"method_uid": method.uid, "analysis_uid": analysis.uid},
                )

            for inst in method.instruments:
                inst_uids = [inst.uid for inst in analysis.instruments]
                if inst.uid not in inst_uids:
                    analysis.instruments.append(inst)
                    await analysis_models.Analysis.table_insert(
                        table=analysis_models.analysis_instrument,
                        mappings={
                            "instrument_uid": inst.uid,
                            "analysis_uid": analysis.uid,
                        },
                    )

        return MethodType(**method.marshal_simple(exclude=["instruments", "analyses"]))

    @strawberry.mutation(permission_classes=[IsAuthenticated])
    async def update_method(
        self, info, uid: str, payload: MethodInputType
    ) -> MethodResponse:  # noqa

        if not uid:
            return OperationError(error="No uid provided to identity update obj")

        if "keyword" in payload.__dict__:
            taken = await models.Method.get(keyword=payload.keyword)
            if taken and not (str(uid) == str(taken.uid)):
                return OperationError(
                    error=f"Provided keyword already assigned to method {taken.name}"
                )

        method = await models.Method.get(uid=uid)
        if not method:
            return OperationError(
                error=f"method with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = method.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(method, field, payload.__dict__[field])
                except Exception as e:
                    logger.warning(e)

        obj_in = schemas.MethodUpdate(**method.to_dict())
        method = await method.update(obj_in)

        # instrument management
        inst_uids = [inst.uid for inst in method.instruments]
        for _inst in inst_uids:
            if _inst not in payload.instruments:
                instruments = filter(lambda i: i.uid == _inst, method.instruments)
                instrument = list(instruments)[0]
                method.instruments.remove(instrument)
        for _inst in payload.instruments:
            if _inst not in inst_uids:
                instrument = await models.Instrument.get(uid=_inst)
                method.instruments.append(instrument)
        method = await method.save_async()

        # manage analyses
        all_analyses = await analysis_models.Analysis.all_async()
        analyses = set()
        for analysis in all_analyses:
            for _meth in analysis.methods:
                if _meth.uid == method.uid:
                    analyses.add(analysis)

        an_uids = [an.uid for an in analyses]
        for _anal in an_uids:
            if _anal not in payload.analyses:
                analysis = filter(lambda a: a.uid == _anal, analyses)
                analysis = list(analysis)[0]
                for _method in analysis.methods:
                    if _method.uid == method.uid:
                        analysis.methods.remove(_method)
                        await analysis.save_async()

        for _anal in payload.analyses:
            if _anal not in an_uids:
                analysis = await analysis_models.Analysis.get(uid=_anal)
                await analysis_models.Analysis.table_insert(
                    table=analysis_models.analysis_method,
                    mappings={"method_uid": method.uid, "analysis_uid": analysis.uid},
                )

        return MethodType(**method.marshal_simple())
