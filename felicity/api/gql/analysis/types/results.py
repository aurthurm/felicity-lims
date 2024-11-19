from datetime import datetime
from typing import Optional

import strawberry  # noqa

from felicity.api.gql.analysis.types.analysis import AnalysisInterimType, AnalysisType, QCSetType, ResultOptionType, SampleType
from felicity.api.gql.instrument.types import InstrumentType, LaboratoryInstrumentType, MethodType
from felicity.api.gql.setup.types import UnitType
from felicity.api.gql.types import PageInfo, JSONScalar
from felicity.api.gql.types.generic import StrawberryMapper
from felicity.api.gql.user.types import UserType
from felicity.apps.worksheet.services import WorkSheetService


@strawberry.type
class AnalysisResultType:
    uid: str
    sample_uid: str
    sample: SampleType
    worksheet_uid: str | None = None
    worksheet_position: int | None = None
    assigned: bool
    analysis_uid: str | None = None
    laboratory_instrument_uid: str | None = None
    method_uid: str | None = None
    result: str | None = None
    analyst_uid: str | None = None
    analyst: UserType | None = None
    submitted_by_uid: str | None = None
    submitted_by: UserType | None = None
    date_submitted: datetime | None = None
    verified_by: list[UserType] | None = None
    date_verified: datetime | None = None
    invalidated_by: UserType | None = None
    invalidated_by_uid: str | None = None
    date_invalidated: datetime | None = None
    due_date: str | None = None
    date_cancelled: datetime | None = None
    cancelled_by_uid: str | None = None
    cancelled_by: UserType | None = None
    retest: bool
    parent_id: str | None = None
    parent: Optional["AnalysisResultType"] = None
    reportable: bool
    status: str | None = None
    reflex_level: int | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None
    metadata_snapshot: JSONScalar | None = None

    @strawberry.field
    async def worksheet_id(self, info) -> str | None:
        ws = await WorkSheetService().get(uid=self.worksheet_uid)
        return ws.worksheet_id if ws else None

    @strawberry.field
    async def laboratory_instrument(self, info) -> Optional[LaboratoryInstrumentType]:
        instruments = self.metadata_snapshot.get("instruments")
        if not instruments or len(instruments) < 1: return None
        lab_inst = filter(lambda inst: inst.get(), instruments)
        for instrument in instruments:
            lab_instruments = instrument.get("laboratory_instruments", [])
            lab_inst = list(filter(lambda inst: inst.get("uid") == self.laboratory_instrument_uid, lab_instruments))
            if lab_inst:
                return StrawberryMapper[LaboratoryInstrumentType]().map(**lab_inst[0])
        return None

    @strawberry.field
    async def analysis(self, info) -> AnalysisType | None:
        _analysis = self.metadata_snapshot.get("analysis", None)
        _instruments = self.metadata_snapshot.get("instruments",[])
        _methods = self.metadata_snapshot.get("methods",[])
        _result_options = self.metadata_snapshot.get("result_options",[])
        _interims = self.metadata_snapshot.get("interims",[])
        analyss = StrawberryMapper[AnalysisType]().map(**_analysis)
        if not _analysis: return None
        _unit = self.metadata_snapshot.get("unit", None)
        if _unit:
            _unit = StrawberryMapper[UnitType]().map(**_unit)
        _analysis["unit"] = _unit
        instruments = [
            StrawberryMapper[InstrumentType]().map(**instrument)
            for instrument in _instruments
        ]
        for instrument in _instruments:
            instrument.laboratory_instruments = [
                StrawberryMapper[LaboratoryInstrumentType]().map(**lab_inst)
                for lab_inst in instrument.get("laboratory_instruments", [])
            ]
        analyss.instruments = instruments
        analyss.methods = [
            StrawberryMapper[MethodType]().map(**method)
            for method in _methods
        ]
        analyss.result_options = [
            StrawberryMapper[ResultOptionType]().map(**result_option)
            for result_option in _result_options
        ]
        analyss.interims = [
            StrawberryMapper[AnalysisInterimType]().map(**interim)
            for interim in _interims
        ]
        return analyss

    @strawberry.field
    async def method(self, info) -> MethodType | None:
        _method = self.metadata_snapshot.get("method")
        if not _method: return None
        return StrawberryMapper[MethodType]().map(**_method)


@strawberry.type
class SamplesWithResults(SampleType):
    analysis_results: list[AnalysisResultType] | None = None


@strawberry.type
class SampleEdge:
    cursor: str
    node: SamplesWithResults


@strawberry.type
class SampleCursorPage:
    page_info: PageInfo
    edges: list[SampleEdge] | None = None
    items: list[SamplesWithResults] | None = None
    total_count: int


@strawberry.type
class AnalysisResultEdge:
    cursor: str
    node: AnalysisResultType


@strawberry.type
class AnalysisResultCursorPage:
    page_info: PageInfo
    edges: list[AnalysisResultEdge] | None = None
    items: list[AnalysisResultType] | None = None
    total_count: int


@strawberry.type
class QCSetWithSamples(QCSetType):
    # samples: list[SampleEdge] | None = None
    samples: list[SamplesWithResults] | None = None


@strawberry.type
class QCSetEdge:
    cursor: str
    node: QCSetWithSamples


@strawberry.type
class QCSetCursorPage:
    page_info: PageInfo
    edges: list[QCSetEdge] | None = None
    items: list[QCSetWithSamples] | None = None
    total_count: int


@strawberry.type
class ResultMutationType:
    uid: str
    result_uid: str
    before: str
    after: str
    mutation: str
    date: str | None = None
    created_by_uid: str | None = None
    created_by: UserType | None = None
    created_at: str | None = None
    updated_by_uid: str | None = None
    updated_by: UserType | None = None
    updated_at: str | None = None
