import logging

from beak.modules.core.instrument.entities import InstrumentInterface
from beak.modules.core.instrument.services import InstrumentInterfaceService
from beak.modules.core.iol.analyzer.link.base import AbstractLink
from beak.modules.core.iol.analyzer.link.fsocket.conn import SocketLink
from beak.modules.core.iol.analyzer.link.schema import InstrumentConfig

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ConnectionService:
    """
    Connection service for managing instrument links.

    Uses async socket connections for non-blocking I/O and concurrent
    connection handling.
    """

    def __init__(self):
        """Initialize connection service."""
        self.ii_service = InstrumentInterfaceService()

    async def get_links(self):
        """
        Get all connection links for active interfacing instruments (async version).

        For use in async contexts where the event loop is already running.

        Returns: List of SocketLink instances for all active interfacing instruments
        """
        insts_interfaces = await self.ii_service.all()
        return [self._get_link(inst) for inst in insts_interfaces if inst.is_active]

    async def get_link_for(self, uid: int):
        """
        Get connection link for specific instrument (async version).

        Args:
            uid: Unique identifier of the instrument

        Returns: SocketLink instance for the instrument
        """
        i_interface = await self.ii_service.get(uid=uid)
        return self._get_link(i_interface)

    async def connect(self, link: AbstractLink):
        """
        Start async server for the given link (async version).

        Use this when you have control of the event loop for proper async handling.
        """
        logger.info(f"Starting async server for {link}")
        await link.start_server()

    def _get_link(self, iinterface: InstrumentInterface) -> AbstractLink:
        """
        Create socket link for instrument.

        Args:
            instrument: LaboratoryInstrument entity

        Returns: SocketLink with async implementation

        Raises:
            ValueError: If connection type is not TCP/IP
        """
        _config = InstrumentConfig(
            **{
                "uid": iinterface.uid,
                "name": iinterface.laboratory_instrument.lab_name,
                "host": iinterface.host,
                "port": iinterface.port,
                "socket_type": iinterface.socket_type,
                "protocol_type": iinterface.protocol_type,
                "is_active": iinterface.is_active,
            }
        )

        return SocketLink(_config)
