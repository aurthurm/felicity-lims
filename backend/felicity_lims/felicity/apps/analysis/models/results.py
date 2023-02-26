import logging
from datetime import datetime
from typing import List

from felicity.apps import Auditable, BaseAuditDBModel, DBModel
from felicity.apps.analysis import conf, schemas
from felicity.apps.common import BaseMPTT
from felicity.database.session import async_session_factory
from sqlalchemy import (Boolean, Column, DateTime, ForeignKey, Integer, String,
                        Table)
from felicity.apps.notification.utils import FelicityStreamer
from sqlalchemy.orm import relationship

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

streamer = FelicityStreamer()

"""
 Many to Many Link between AnalysisResult and User
"""
result_verification = Table(
    "result_verification",
    DBModel.metadata,
    Column("result_uid", ForeignKey("analysisresult.uid"), primary_key=True),
    Column("user_uid", ForeignKey("user.uid"), primary_key=True),
)


class AnalysisResult(Auditable, BaseMPTT):
    """Test/Analysis Result
    Number of analysis results per sample will be directly proportional to
    the number of linked sample_analyses at minimum :)
    """

    sample_uid = Column(Integer, ForeignKey("sample.uid"), nullable=False)
    sample = relationship("Sample", back_populates="analysis_results", lazy="selectin")
    analysis_uid = Column(Integer, ForeignKey("analysis.uid"), nullable=False)
    analysis = relationship("Analysis", backref="analysis_results", lazy="selectin")
    instrument_uid = Column(Integer, ForeignKey("instrument.uid"), nullable=True)
    instrument = relationship("Instrument", lazy="selectin")
    method_uid = Column(Integer, ForeignKey("method.uid"), nullable=True)
    method = relationship("Method", lazy="selectin")
    result = Column(String, nullable=True)
    analyst_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    analyst = relationship("User", foreign_keys=[analyst_uid], lazy="selectin")
    submitted_by_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    submitted_by = relationship(
        "User", foreign_keys=[submitted_by_uid], lazy="selectin"
    )
    date_submitted = Column(DateTime, nullable=True)
    verified_by = relationship("User", secondary=result_verification, lazy="selectin")
    date_verified = Column(DateTime, nullable=True)
    invalidated_by_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    invalidated_by = relationship(
        "User", foreign_keys=[invalidated_by_uid], lazy="selectin"
    )
    date_invalidated = Column(DateTime, nullable=True)
    cancelled_by_uid = Column(Integer, ForeignKey("user.uid"), nullable=True)
    cancelled_by = relationship(
        "User", foreign_keys=[cancelled_by_uid], lazy="selectin"
    )
    date_cancelled = Column(DateTime, nullable=True)
    retest = Column(Boolean(), default=False)
    reportable = Column(Boolean(), default=True)  # for retests or reflex
    status = Column(String, nullable=False)
    due_date = Column(DateTime, nullable=True)
    # reflex level
    reflex_level = Column(Integer, nullable=True)
    # worksheet
    worksheet_uid = Column(Integer, ForeignKey("worksheet.uid"), nullable=True)
    worksheet = relationship(
        "WorkSheet", back_populates="analysis_results", lazy="selectin"
    )
    worksheet_position = Column(Integer, nullable=True)
    assigned = Column(Boolean(), default=False)

    async def verifications(self):
        if self.analysis.required_verifications:
            required = self.analysis.required_verifications
        else:
            required = 1
        current = len(self.verified_by)
        return required, current

    async def retest_result(self, retested_by, next_action="verify"):
        retest = None
        if self.status in [conf.states.result.RESULTED]:
            a_result_in = {
                "sample_uid": self.sample.uid,
                "analysis_uid": self.analysis_uid,
                "status": conf.states.result.PENDING,
                "instrument_uid": self.instrument_uid,
                "method_uid": self.method_uid,
                "parent_id": self.uid,
                "retest": True,
            }
            a_result_schema = schemas.AnalysisResultCreate(**a_result_in)
            retest = await AnalysisResult.create(a_result_schema)

            await self.hide_report()
            if next_action == "verify":
                _, final = await self.verify(verifier=retested_by)
            elif next_action == "retract":
                final = await self.retract(retracted_by=retested_by)
            else:
                final = self

            # transition sample back to received state
            await self.sample.un_submit()
            return retest, final
        return retest, self

    async def assign(self, ws_uid, position, instrument_uid):
        self.worksheet_uid = ws_uid
        self.assigned = True
        self.worksheet_position = position
        self.instrument_uid = instrument_uid if instrument_uid else None
        return await self.save()

    async def un_assign(self):
        self.worksheet_uid = None
        self.assigned = False
        self.worksheet_position = None
        self.instrument_uid = None
        return await self.save()

    async def verify(self, verifier):
        is_verified = False
        required, current = await self.verifications()
        await AnalysisResult.table_insert(
            table=result_verification,
            mappings={"result_uid": self.uid, "user_uid": verifier.uid},
        )
        # self.verified_by.append(verifier)
        self.updated_by_uid = verifier.uid  # noqa
        if current < required and current + 1 == required:
            self.status = conf.states.result.APPROVED
            self.date_verified = datetime.now()
            is_verified = True
        final = await self.save()
        if final.status == conf.states.result.APPROVED:
            await streamer.stream(final, verifier, "approved", "result")
        return is_verified, final

    async def retract(self, retracted_by):
        await AnalysisResult.table_insert(
            table=result_verification,
            mappings={"result_uid": self.uid, "user_uid": retracted_by.uid},
        )
        self.status = conf.states.result.RETRACTED
        self.date_verified = datetime.now()
        self.updated_by_uid = retracted_by.uid  # noqa
        final = await self.save()
        if final.status == conf.states.result.RETRACTED:
            await streamer.stream(final, retracted_by, "retracted", "result")
        return final

    async def cancel(self, cancelled_by):
        if self.status in [conf.states.result.PENDING]:
            self.status = conf.states.result.CANCELLED
            self.cancelled_by_uid = cancelled_by.uid
            self.date_cancelled = datetime.now()
            self.updated_by_uid = cancelled_by.uid  # noqa
        final = await self.save()
        if final.status == conf.states.result.CANCELLED:
            await streamer.stream(final, cancelled_by, "cancelled", "result")
        return final

    async def re_instate(self, sample, re_instated_by):
        if sample.status not in [
            conf.states.sample.RECEIVED,
            conf.states.sample.EXPECTED,
        ]:
            raise Exception(
                "You can only reinstate analytes of due and received samples"
            )

        if self.status in [conf.states.result.CANCELLED]:
            self.status = conf.states.result.PENDING
            self.cancelled_by_uid = None
            self.date_cancelled = None
            self.updated_by_uid = re_instated_by.uid  # noqa
        final = await self.save()
        if final.status == conf.states.result.PENDING:
            await streamer.stream(final, re_instated_by, "reinstated", "result")
        return final

    async def change_status(self, status):
        self.status = status
        return await self.save()

    async def hide_report(self):
        self.reportable = False
        return await self.save()

    @classmethod
    async def filter_for_worksheet(
        cls,
        analyses_status: str,
        analysis_uid: int,
        sample_type_uid: List[int],
        limit: int,
    ) -> List[schemas.AnalysisResult]:

        filters = {
            "status__exact": analyses_status,
            "assigned__exact": False,
            "analysis_uid__exact": analysis_uid,
            "sample___sample_type_uid__exact": sample_type_uid,
            "sample___status": conf.states.sample.RECEIVED,
        }
        sort_attrs = ["-sample___priority", "sample___sample_id", "-created_at"]

        analytes_stmt = cls.smart_query(filters=filters, sort_attrs=sort_attrs)
        stmt = analytes_stmt.limit(limit)

        # available: int = await cls.count_where(filters=filters)

        async with async_session_factory() as session:
            analyses_results = (await session.execute(stmt)).scalars().all()

        return analyses_results

    @classmethod
    async def create(
        cls, obj_in: schemas.AnalysisResultCreate
    ) -> schemas.AnalysisResult:
        data = cls._import(obj_in)
        return await super().create(**data)

    async def update(
        self, obj_in: schemas.AnalysisResultUpdate
    ) -> schemas.AnalysisResult:
        data = self._import(obj_in)
        return await super().update(**data)


class ResultMutation(BaseAuditDBModel):
    """Result Mutations tracker
    """

    result_uid = Column(Integer, ForeignKey("analysisresult.uid"), nullable=False)
    before = Column(String, nullable=False)
    after = Column(String, nullable=False)
    mutation = Column(String, nullable=False)
    date = Column(DateTime, nullable=True)

    @classmethod
    async def create(cls, obj_in: dict):
        data = cls._import(obj_in)
        await super().create(**data)
