import logging

from felicity.apps.instrument.entities import LaboratoryInstrument
from felicity.apps.instrument.services import LaboratoryInstrumentService
from felicity.apps.iol.analyzer.link.base import AbstractLink
from felicity.apps.iol.analyzer.link.fserial.conn import SerialLink
from felicity.apps.iol.analyzer.link.fsocket.conn import SocketLink
from felicity.apps.iol.analyzer.link.schema import InstrumentConfig

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ConnectionService:
    def __init__(self):
        self.instrument_service = LaboratoryInstrumentService()

    async def get_link_for(self, uid: int):
        instrument = await self.instrument_service.get(uid=uid)
        return self._get_link(instrument)

    async def get_links(self):
        instruments = await self.instrument_service.all()
        return [self._get_link(inst) for inst in instruments if inst.is_interfacing]

    def connect(self, link: AbstractLink):
        """Start the server for the given link (runs forever)"""
        logger.info(f"Starting server for {link}")
        # This blocks forever, but APScheduler handles it
        link.start_server()

    def _get_link(self, instrument: LaboratoryInstrument):
        if instrument.connection_type == "tcpip":
            return self._get_tcp_link(instrument)
        elif instrument.connection_type == "serial":
            return self._get_serial_link(instrument)
        else:
            raise ValueError("Invalid connection type")

    def _get_tcp_link(self, instrument: LaboratoryInstrument):
        _config = InstrumentConfig(**{
            'uid': instrument.uid,
            'code': instrument.code,
            'name': instrument.name,
            'host': instrument.host,
            'port': instrument.port,
            'socket_type': instrument.socket_type,
            'protocol_type': instrument.protocol_type,
            'is_active': instrument.is_active,
        })
        return SocketLink(_config)

    def _get_serial_link(self, instrument: LaboratoryInstrument):
        _config = InstrumentConfig(**{
            'uid': instrument.uid,
            'code': instrument.code,
            'name': instrument.name,
            'path': instrument.path,
            'baud_rate': instrument.baud_rate,
            'protocol_type': instrument.protocol_type,
            'is_active': instrument.is_active,
        })
        return SerialLink(_config)
