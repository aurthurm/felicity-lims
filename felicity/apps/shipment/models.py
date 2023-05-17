import logging

from apps import Auditable, BaseAuditDBModel, DBModel
from apps.analysis import conf as analysis_conf
from apps.analysis.models import analysis as analysis_models
from apps.common.models import IdSequence
from apps.notification.utils import FelicityStreamer
from apps.user.models import User
from apps.shipment import conf, schemas

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, LargeBinary
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


streamer = FelicityStreamer()


class Shipment(Auditable):
    shipment_id = Column(String, index=True, unique=True, nullable=False)
    comment = Column(String, nullable=True)
    courier = Column(String, nullable=False)
    assigned_count = Column(Integer, nullable=False, default=0)
    data = Column(JSONB)
    samples = relationship(
        "Sample", back_populates="shipment", lazy="selectin"
    )
    state = Column(String)
    # laboratory = ''
    incoming = Column(Boolean(), default=False) # either its incoming or outgoing
    finalised_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    finalised_by = relationship(User, foreign_keys=[finalised_by_uid], lazy="selectin")
    date_finalised = Column(DateTime, nullable=True)
    dispatched_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    dispatched_by = relationship(User, foreign_keys=[dispatched_by_uid], lazy="selectin")
    date_dispatched = Column(DateTime, nullable=True)
    recalled_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    recalled_by = relationship(User, foreign_keys=[recalled_by_uid], lazy="selectin")
    date_recalled = Column(DateTime, nullable=True)
    rejected_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    rejected_by = relationship(User, foreign_keys=[rejected_by_uid], lazy="selectin")
    date_rejected = Column(DateTime, nullable=True)
    received_by_uid = Column(String, ForeignKey("user.uid"), nullable=True)
    received_by = relationship(User, foreign_keys=[received_by_uid], lazy="selectin")
    date_received = Column(DateTime, nullable=True)
    # manifest
    json_content: dict = Column(JSONB, nullable=True)
    pdf_content = Column(LargeBinary, nullable=True)

    async def set_flow(self, flow: bool = False):
        """Set whether the flow is incoming or outgoing"""
        self.incoming = flow
        await self.save()

    async def get_samples(self):
        return await analysis_models.Sample.get_all(shipment_uid=self.uid)

    async def change_state(self, state, updated_by_uid):
        self.state = state
        self.updated_by_uid = updated_by_uid  # noqa
        await self.save()

    async def finalise(self, finaliser):
        if self.state == conf.shipment_states.PREPERATION:
            self.state = conf.shipment_states.READY
            self.finalised_by_uid = finaliser.uid  # noqa
            saved = await self.save()
            await streamer.stream(saved, finaliser, "finalised", "shipment")
            return saved
        return self

    async def dispatch(self, dispatcher):
        if self.state == conf.shipment_states.READY:
            self.state = conf.shipment_states.AWAITING
            self.dispatched_by_uid = dispatcher.uid  # noqa
            saved = await self.save()
            await streamer.stream(saved, dispatcher, "dispatched", "shipment")
            return saved
        return self

    @classmethod
    async def create(cls, obj_in: schemas.ShipmentCreate) -> schemas.Shipment:
        data = cls._import(obj_in)
        data["shipment_id"] = (await IdSequence.get_next_number("SHIP"))[1]
        return await super().create(**data)

    async def update(self, obj_in: schemas.ShipmentUpdate) -> schemas.Shipment:
        data = self._import(obj_in)
        return await super().update(**data)



class ShipedSample(DBModel):
    """ShipedSample enables samples to be shipped multiple times
    A sample can be tracked through different shipments from inception to end
    """
    sample_uid = Column(String, ForeignKey("sample.uid"), nullable=True)
    sample = relationship(User, foreign_keys=[sample_uid], lazy="selectin")
    shipment_uid = Column(String, ForeignKey("shipment.uid"), nullable=True)
    sample = relationship(User, foreign_keys=[sample_uid], lazy="selectin")
    # result_notified = Column(Boolean(), default=False)
    #
