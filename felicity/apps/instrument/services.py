from datetime import datetime

from domain.exceptions import AlreadyExistsError
from domain.idsequence.ports.service import IIdSequenceService
from domain.instrument.ports.repository import (
    ICalibrationCertificateRepository,
    IMethodRepository,
    IInstrumentTypeRepository,
    IInstrumentCalibrationRepository,
)
from domain.instrument.ports.service import (
    ICalibrationCertificateService,
    IMethodService,
    IInstrumentTypeService,
    IInstrumentService,
    IInstrumentCalibrationService,
)
from domain.instrument.schemas import (
    CalibrationCertificate,
    # InstrumentCompetence,
    Method,
    InstrumentType,
    Instrument,
    InstrumentCalibration,
    CalibrationCertificateCreate,
    CalibrationCertificateUpdate,
    MethodCreate,
    MethodUpdate,
    InstrumentTypeCreate,
    InstrumentTypeUpdate,
    InstrumentCreate,
    InstrumentUpdate,
    InstrumentCalibrationCreate,
    InstrumentCalibrationUpdate,
)
from domain.shared.services import BaseService
from domain.shared.utils.serialisers import marshal
from infrastructure.database.instrument.entities import method_instrument


class CalibrationCertificateService(
    BaseService[CalibrationCertificate], ICalibrationCertificateService
):
    def __init__(self, repository: ICalibrationCertificateRepository):
        self.repository = repository

    async def create(
        self,
        instrument_uid: str,
        date_issued: datetime | None,
        valid_from_date: datetime | None,
        valid_to_date: datetime | None,
        certificate_code: str | None,
        issuer: str | None,
        performed_by: str | None,
        approved_by: str | None,
        remarks: str | None,
        internal: bool,
    ) -> CalibrationCertificate:
        payload = locals()

        incoming = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = CalibrationCertificateCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        instrument_uid: str,
        date_issued: datetime | None,
        valid_from_date: datetime | None,
        valid_to_date: datetime | None,
        certificate_code: str | None,
        issuer: str | None,
        performed_by: str | None,
        approved_by: str | None,
        remarks: str | None,
        internal: bool,
    ) -> CalibrationCertificate:
        payload = locals()

        certificate = await self.get(uid=uid)

        obj_data = marshal(certificate)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(certificate, field, payload.__dict__[field])
                except Exception as e:
                    ...

        obj_in = CalibrationCertificateUpdate(**marshal(certificate))
        return await super().update(certificate, **marshal(obj_in))


class MethodService(BaseService[Method], IMethodService):
    def __init__(
        self,
        repository: IMethodRepository,
        instrument_service: IInstrumentService,
    ):
        self.repository = repository
        self.instrument_service = instrument_service

    async def create(
        self,
        name: str,
        instruments: list[str] | None,
        # analyses: list[str] | None,
        keyword: str | None,
        description: str | None,
    ) -> Method:
        payload = locals()

        if keyword:
            taken = await self.get(keyword=keyword)
            if taken:
                raise AlreadyExistsError(
                    f"Provided keyword already assigned to Method {taken.name}"
                )

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"A Method named {name} already exists")

        incoming = {}
        for k, v in payload.__dict__.items():
            if k not in ["instruments", "analyses"]:
                incoming[k] = v

        obj_in = MethodCreate(**incoming)
        method = await super().create(**marshal(obj_in))

        _instruments = set()
        for i_uid in instruments:
            instrument = await self.instrument_service.get(uid=i_uid)
            if instrument not in _instruments:
                _instruments.add(instrument)
                await self.repository.table_insert(
                    table=method_instrument,
                    mappings={
                        "method_uid": method.uid,
                        "instrument_uid": instrument.uid,
                    },
                )

        # for a_uid in analyses:
        #     analysis = await self.analysis_service.get(uid=a_uid)
        #     meth_uids = [meth.uid for meth in analysis.methods]
        #     if method.uid not in meth_uids:
        #         await self.repository.table_insert(
        #             table=analysis_method,
        #             mappings={"method_uid": method.uid, "analysis_uid": analysis.uid},
        #         )
        #
        #     for inst in method.instruments:
        #         inst_uids = [inst.uid for inst in analysis.instruments]
        #         if inst.uid not in inst_uids:
        #             analysis.instruments.append(inst)
        #             await self.repository.table_insert(
        #                 table=analysis_instrument,
        #                 mappings={
        #                     "instrument_uid": inst.uid,
        #                     "analysis_uid": analysis.uid,
        #                 },
        #             )

        return method

    async def update(
        self,
        uid: str,
        name: str,
        instruments: list[str] | None,
        # analyses: list[str] | None,
        keyword: str | None,
        description: str | None,
    ) -> Method:  # noqa
        payload = locals()

        if keyword:
            taken = await self.get(keyword=keyword)
            if taken and not (str(uid) == str(taken.uid)):
                raise AlreadyExistsError(
                    f"Provided keyword already assigned to method {taken.name}"
                )

        method = await self.get(uid=uid)
        obj_data = method.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(method, field, payload.__dict__[field])
                except Exception as e:
                    pass

        obj_in = MethodUpdate(**marshal(method))
        method = await super().update(method, **marshal(obj_in))

        # instrument management
        inst_uids = [inst.uid for inst in method.instruments]
        for _inst in inst_uids:
            if _inst not in instruments:
                instruments = filter(lambda i: i.uid == _inst, method.instruments)
                instrument = list(instruments)[0]
                method.instruments.remove(instrument)
        for _inst in instruments:
            if _inst not in inst_uids:
                instrument = await self.instrument_service.get(uid=_inst)
                method.instruments.append(instrument)
        method = await super().update(method, **marshal(method))

        # manage analyses
        # all_analyses = await self.all()
        # analyses = set()
        # for analysis in all_analyses:
        #     for _meth in analysis.methods:
        #         if _meth.uid == method.uid:
        #             analyses.add(analysis)
        #
        # an_uids = [an.uid for an in analyses]
        # for _anal in an_uids:
        #     if _anal not in analyses:
        #         analysis = filter(lambda a: a.uid == _anal, analyses)
        #         analysis = list(analysis)[0]
        #         for _method in analysis.methods:
        #             if _method.uid == method.uid:
        #                 analysis.methods.remove(_method)
        #                 await super().update(analysis, **marshal(analysis))
        #
        # for _anal in analyses:
        #     if _anal not in an_uids:
        #         analysis = await self.analysis_service.get(uid=_anal)
        #         await self.repostory.table_insert(
        #             table=analysis_method,
        #             mappings={"method_uid": method.uid, "analysis_uid": analysis.uid},
        #         )

        return method


class InstrumentTypeService(BaseService[InstrumentType], IInstrumentTypeService):
    def __init__(self, repository: IInstrumentTypeRepository):
        self.repository = repository

    async def create(
        self, name: str, description: str | None
    ) -> InstrumentType:  # noqa

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"A InstrumentType named {name} already exists")

        incoming = {"name": name, "description": description}

        obj_in = InstrumentTypeCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self, uid: str, name: str, description: str | None
    ) -> InstrumentType:  # noqa
        payload = locals()

        inst_type = await self.get(uid=uid)

        obj_data = inst_type.to_dict()
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(inst_type, field, payload.__dict__[field])
                except Exception as e:
                    pass

        obj_in = InstrumentTypeUpdate(**marshal(inst_type))
        return await super().update(inst_type, **marshal(obj_in))


class InstrumentService(BaseService[Instrument], IInstrumentService):
    async def create(
        self,
        name: str,
        keyword: str,
        description: str | None,
        instrument_type_uid: str | None,
        supplier_uid: str | None,
        manufacturer_uid: str | None,
    ) -> Instrument:  # noqa
        payload = locals()

        taken = await self.get(keyword=keyword)
        if taken:
            raise AlreadyExistsError(
                f"Provided keyword already assigned to instrument {name}"
            )

        exists = await self.get(name=name)
        if exists:
            raise AlreadyExistsError(f"An Instrument named {name} already exists")

        incoming: dict = dict()
        for k, v in payload.__dict__.items():
            incoming[k] = v

        obj_in = InstrumentCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        name: str,
        keyword: str,
        description: str | None,
        instrument_type_uid: str | None,
        supplier_uid: str | None,
        manufacturer_uid: str | None,
    ) -> Instrument:  # noqa
        payload = locals()

        if keyword:
            taken = await self.get(keyword=keyword)
            if taken and not (str(uid) == str(taken.uid)):
                raise AlreadyExistsError(
                    f"Provided keyword already assigned to instrument {taken.name}"
                )

        instrument = await self.get(uid=uid)
        if not instrument:
            raise AlreadyExistsError(
                f"instrument with uid {uid} not found. Cannot update obj ..."
            )

        obj_data = marshal(instrument)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(instrument, field, payload.__dict__[field])
                except Exception as e:
                    pass

        obj_in = InstrumentUpdate(**marshal(instrument))
        return await super().update(instrument, **marshal(obj_in))


class InstrumentCalibrationService(
    BaseService[InstrumentCalibration], IInstrumentCalibrationService
):
    def __int__(
        self,
        repository: IInstrumentCalibrationRepository,
        idsequence_service: IIdSequenceService,
    ):
        self.repository = repository
        self.idsequence_service = idsequence_service

    async def create(
        self,
        instrument_uid: str,
        date_reported: datetime | None,
        start_date: datetime | None,
        end_date: datetime | None,
        calibration_id: str | None,
        report_id: str | None,
        performed_by: str | None,
        notes_before: str | None,
        work_done: str | None,
        remarks: str | None,
    ) -> InstrumentCalibration:  # noqa
        payload = locals()

        incoming = dict()

        for k, v in payload.__dict__.items():
            incoming[k] = v

        incoming["calibration_id"] = (
            await self.idsequence_service.get_next_number("ICAL")
        )[1]

        obj_in = InstrumentCalibrationCreate(**incoming)
        return await super().create(**marshal(obj_in))

    async def update(
        self,
        uid: str,
        instrument_uid: str,
        date_reported: datetime | None,
        start_date: datetime | None,
        end_date: datetime | None,
        calibration_id: str | None,
        report_id: str | None,
        performed_by: str | None,
        notes_before: str | None,
        work_done: str | None,
        remarks: str | None,
    ) -> InstrumentCalibration:  # noqa
        payload = locals()

        caliberation = await self.get(uid=uid)

        obj_data = marshal(caliberation)
        for field in obj_data:
            if field in payload.__dict__:
                try:
                    setattr(caliberation, field, payload.__dict__[field])
                except Exception as e:
                    pass

        obj_in = InstrumentCalibrationUpdate(**marshal(caliberation))
        return await super().update(caliberation, **marshal(obj_in))
