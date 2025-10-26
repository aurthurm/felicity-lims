import asyncio
import logging
from abc import ABC, abstractmethod

from felicity.apps.instrument.schemas import InstrumentRawDataCreate
from felicity.apps.instrument.services import InstrumentRawDataService
from felicity.apps.iol.analyzer.conf import EventType
from felicity.core.events import post_event

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AbstractLink(ABC):

    @abstractmethod
    def is_open(self):
        raise NotImplementedError("is_open is not implemented")

    @abstractmethod
    def start_server(self, **kwargs):
        raise NotImplementedError("start_server is not implemented")

    @abstractmethod
    def is_busy(self):
        raise NotImplementedError("is_busy is not implemented")

    @abstractmethod
    def open(self):
        raise NotImplementedError("open is not implemented")

    @abstractmethod
    def close(self):
        raise NotImplementedError("close is not implemented")

    @abstractmethod
    def process(self, command):
        raise NotImplementedError("process is not implemented")

    @abstractmethod
    def get_response(self):
        raise NotImplementedError("get_response is not implemented")

    def eot_offload(self, instrument_uid, messages):
        """End of Transmission -> offload processed messages to storage"""
        logger.info("Link: Offloading to storage...")
        # Save raw messages immediately (no threading to avoid message loss)
        self._save_data(instrument_uid, messages)

    def _save_data(self, instrument_uid, messages):
        if isinstance(messages, str):
            messages = [messages]

        raw_message_service = InstrumentRawDataService()
        loop = asyncio.get_event_loop()

        while len(messages) > 0:
            msg = messages.pop()

            rd_in = InstrumentRawDataCreate(
                laboratory_instrument_uid=instrument_uid,
                content=msg,
            )
            loop.create_task(raw_message_service.create(rd_in))

    def show_message(self, message):
        """Prints the messaged in stdout
        """

        if not message:
            logger.info("-" * 80)
            logger.info(f"Link: ------> NO MESSAGE")
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
            'id': self.uid,
            'message': message,
        })

    def decode_message(self, message: bytes) -> str:
        """
        Decode LIS messages (HL7, ASTM, etc.) with a best-effort approach.
        Tries known encodings in order and falls back gracefully.
        """

        def contains_hl7_patterns(text: str) -> bool:
            patterns = ['MSH|', 'PID|', 'OBR|', 'OBX|', '|^~\\&|']
            return any(p in text for p in patterns)

        # Default encoding if provided
        try:
            # hack to handle latin-1 encodings
            if '\\x00M\\x00S\\x00H' not in str(message):
                return message.decode(self.encoding)
        except (AttributeError, UnicodeDecodeError):
            pass

        #  Latin-1 (often used by LIS systems with extended chars)
        try:
            decoded = message.replace(b"\x00", b"").decode("latin-1")
            logger.info("Decoded using Latin-1")
            return decoded
        except UnicodeDecodeError:
            pass

        # Fallback UTF-8 with replacement
        decoded = message.decode("utf-8", errors="replace")
        logger.warning("Fallback to UTF-8 with replacement")
        return decoded
