import asyncio
import logging

from felicity.apps.instrument.entities import LaboratoryInstrument
from felicity.apps.instrument.services import LaboratoryInstrumentService
from felicity.apps.iol.analyzer.link.base import AbstractLink
from felicity.apps.iol.analyzer.link.fsocket.conn import SocketLink
from felicity.apps.iol.analyzer.link.schema import InstrumentConfig

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
        self.instrument_service = LaboratoryInstrumentService()

    def get_links_sync(self):
        """
        Get all connection links for active interfacing instruments (sync version).

        For APScheduler initialization in sync context (felicity_workforce_init).
        Uses asyncio.run() to execute async operation in sync code.

        Returns: List of SocketLink instances for all active interfacing instruments
        """
        return asyncio.run(self.get_links())

    async def get_links(self):
        """
        Get all connection links for active interfacing instruments (async version).

        For use in async contexts where event loop is already running.

        Returns: List of SocketLink instances for all active interfacing instruments
        """
        instruments = await self.instrument_service.all()
        return [self._get_link(inst) for inst in instruments if inst.is_interfacing]

    async def get_link_for(self, uid: int):
        """
        Get connection link for specific instrument (async version).

        Args:
            uid: Unique identifier of the instrument

        Returns: SocketLink instance for the instrument
        """
        instrument = await self.instrument_service.get(uid=uid)
        return self._get_link(instrument)

    def connect(self, link: AbstractLink):
        """
        Start the server for the given link (blocking, for APScheduler compatibility).

        For APScheduler integration: Creates an asyncio task and runs it.
        """
        logger.info(f"Starting server for {link}")

        try:
            asyncio.create_task(link.start_server())
        except RuntimeError:
            # If no event loop, run it with asyncio.run (for testing)
            logger.warning("No event loop found, creating new one")
            asyncio.run(link.start_server())

    async def connect_async(self, link: AbstractLink):
        """
        Start async server for the given link (async version).

        Use this when you have control of the event loop for proper async handling.
        """
        logger.info(f"Starting async server for {link}")
        await link.start_server()

    def _get_link(self, instrument: LaboratoryInstrument) -> AbstractLink:
        """
        Create socket link for instrument.

        Args:
            instrument: LaboratoryInstrument entity

        Returns: SocketLink with async implementation

        Raises:
            ValueError: If connection type is not TCP/IP
        """
        if instrument.connection_type != "tcpip":
            raise ValueError(
                f"Invalid or unsupported connection type: {instrument.connection_type}. "
                "Only TCP/IP connections are supported."
            )

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
