import logging
from abc import ABC, abstractmethod
from typing import Optional, Union

from felicity.apps.instrument.schemas import InstrumentRawDataCreate
from felicity.apps.instrument.services import InstrumentRawDataService
from felicity.apps.iol.analyzer.conf import EventType
from felicity.core.events import post_event

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AbstractLink(ABC):
    """
    Abstract base class for instrument communication links.

    All implementations must be async-first to support non-blocking I/O
    and concurrent instrument connections.
    """

    @abstractmethod
    async def start_server(self, **kwargs) -> None:
        """
        Start the async server/connection handler.

        Args:
            **kwargs: Implementation-specific parameters
        """
        raise NotImplementedError("start_server is not implemented")

    @abstractmethod
    async def process(self, data: bytes) -> Optional[Union[str, bytes, tuple]]:
        """
        Process incoming data from instrument.

        Args:
            data: Raw bytes received from instrument

        Returns:
            Response to send back or None
        """
        raise NotImplementedError("process is not implemented")

    async def eot_offload(self, instrument_uid: str, messages: Union[str, list]) -> None:
        """
        End of Transmission - offload processed messages to storage.

        Args:
            instrument_uid: Unique identifier for the instrument
            messages: Message(s) to persist
        """
        logger.info("Link: Offloading to storage...")
        await self._save_data(instrument_uid, messages)

    async def _save_data(self, instrument_uid: str, messages: Union[str, list]) -> None:
        """
        Persist raw messages to database.

        Args:
            instrument_uid: Unique identifier for the instrument
            messages: Message(s) to persist
        """
        if isinstance(messages, str):
            messages = [messages]

        raw_message_service = InstrumentRawDataService()

        for msg in messages:
            rd_in = InstrumentRawDataCreate(
                laboratory_instrument_uid=instrument_uid,
                content=msg,
            )
            await raw_message_service.create(rd_in)

    async def show_message(self, message: Union[str, bytes]) -> None:
        """
        Display and log instrument message.

        Args:
            message: Message to display (str or bytes)
        """
        if not message:
            logger.info("-" * 80)
            logger.info("Link: ------> NO MESSAGE")
            logger.info("-" * 80)
            return

        if not isinstance(message, str):
            if isinstance(message, bytes):
                message = self.decode_message(message)
            else:
                message = str(message)

        logger.info("-" * 80)
        logger.info(f"Link: {message}")
        logger.info("-" * 80)

        post_event(EventType.INSTRUMENT_LOG, **{
            'id': getattr(self, 'uid', 'unknown'),
            'message': message,
        })

    @staticmethod
    def decode_message(message: bytes, encoding: str = "utf-8") -> str:
        """
        Decode LIS messages (HL7, ASTM, etc.) with a best-effort approach.

        Tries multiple encodings and falls back gracefully:
        1. Specified encoding (default UTF-8)
        2. Latin-1 (for extended characters)
        3. UTF-8 with replacement

        Args:
            message: Raw bytes to decode
            encoding: Default encoding to try first (default: UTF-8)

        Returns:
            Decoded message string
        """
        # Try specified encoding if not UTF-16 BOM
        try:
            if b'\x00' not in message[:4]:
                return message.decode(encoding)
        except (AttributeError, UnicodeDecodeError):
            pass

        # Try Latin-1 (often used by LIS systems with extended chars)
        try:
            decoded = message.replace(b"\x00", b"").decode("latin-1")
            logger.info("Decoded using Latin-1")
            return decoded
        except UnicodeDecodeError:
            pass

        # Fallback: UTF-8 with replacement
        decoded = message.decode("utf-8", errors="replace")
        logger.warning("Decoded with UTF-8 replacement mode")
        return decoded
