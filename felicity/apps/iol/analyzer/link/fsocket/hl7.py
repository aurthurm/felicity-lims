# -*- coding: utf-8 -*-
"""
HL7 Protocol Handler

Handles HL7 (Health Level 7) protocol for laboratory instruments.
Features:
- MLLP (Minimal Lower Layer Protocol) framing
- Dynamic separator detection (MSH parsing)
- Message ACK/NACK generation
- Standard HL7 v2.x message handling
"""

import logging
from datetime import datetime
from typing import Optional, List, Tuple

from felicity.apps.iol.analyzer.link.conf import HL7Constants

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# HL7 Constants (MLLP framing)
HL7_SB = HL7Constants.SB  # 0x0B - Start Block
HL7_EB = HL7Constants.EB  # 0x1C - End Block
HL7_CR = HL7Constants.CR  # 0x0D - Carriage Return
HL7_FF = HL7Constants.FF  # 0x0C - Form Feed


class HL7ProtocolHandler:
    """
    Handles HL7 protocol communication with MLLP framing.

    Maintains protocol state and handles:
    - MLLP frame assembly and parsing
    - Dynamic separator detection from MSH segment
    - Message ACK/NACK generation
    - Multi-message sessions
    """

    def __init__(self, instrument_uid: int, instrument_name: str, emit_events=True):
        self.instrument_uid = instrument_uid
        self.instrument_name = instrument_name
        self.emit_events = emit_events

        # Protocol state
        self.in_transfer_state = False
        self.establishment = False

        # Message assembly
        self._buffer = b''
        self._received_messages: List[bytes] = []

        # Response tracking
        self.response: Optional[str] = None
        self.msg_id: Optional[str] = None

    def reset_session(self):
        """Reset protocol state for new session"""
        self.in_transfer_state = False
        self.establishment = False
        self._buffer = b''
        self._received_messages = []
        self.response = None
        self.msg_id = None

    def _get_separators(self, message: bytes) -> dict:
        """
        Detect HL7 message separators from MSH segment.

        HL7 Message Format:
            MSH|^~\\&|SendingApp|SendingFacility|...
            ^^^
            Field separator and encoding characters

        Args:
            message: Raw HL7 message bytes

        Returns: Dictionary with separator characters
        """
        try:
            message_str = message.decode('latin-1', errors='replace')

            if message_str.startswith("MSH"):
                if len(message_str) >= 4:
                    field_sep = message_str[3]
                    if len(message_str) >= 8:
                        enc = message_str[4:8]
                        return {
                            "field": field_sep,
                            "component": enc[0] if len(enc) > 0 else "^",
                            "repeat": enc[1] if len(enc) > 1 else "~",
                            "escape": enc[2] if len(enc) > 2 else "\\",
                            "subcomponent": enc[3] if len(enc) > 3 else "&",
                        }

            # Defaults
            return {
                "field": "|",
                "component": "^",
                "repeat": "~",
                "escape": "\\",
                "subcomponent": "&",
            }

        except Exception as e:
            logger.error(f"HL7 {self.instrument_name}: Error detecting separators: {e}")
            # Return defaults on error
            return {
                "field": "|",
                "component": "^",
                "repeat": "~",
                "escape": "\\",
                "subcomponent": "&",
            }

    def _extract_message_id(self, message: bytes) -> Optional[str]:
        """
        Extract message ID from HL7 MSH segment.

        MSH segment contains message control ID in field [9].

        Args:
            message: HL7 message bytes

        Returns: Message ID string or None
        """
        try:
            message_str = message.decode('latin-1', errors='replace')

            if not message_str.startswith("MSH"):
                return None

            separators = self._get_separators(message)
            fields = message_str.split(separators["field"])

            if len(fields) > 9:
                msg_id = fields[9]
                logger.info(f"HL7 {self.instrument_name}: Extracted message ID: {msg_id}")
                return msg_id

            return None

        except Exception as e:
            logger.error(f"HL7 {self.instrument_name}: Error extracting message ID: {e}")
            return None

    def _generate_ack(self, message: bytes) -> bytes:
        """
        Generate HL7 ACK (acknowledgment) message.

        Minimal ACK format:
            MSH|^~\\&|RECEIVER|FACILITY|SENDER|FACILITY|timestamp|MSG_CONTROL_ID|ACK|VERSION|
            MSA|AA|MSG_ID

        Args:
            message: Original message to acknowledge

        Returns: ACK message bytes with MLLP framing
        """
        try:
            msg_id = self._extract_message_id(message)
            if not msg_id:
                msg_id = "000"

            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

            ack_message = (
                f"MSH|^~\\&|{self.instrument_name}|LAB|INSTRUMENT|LAB|"
                f"{timestamp}|{msg_id}|ACK|2.4|\r"
                f"MSA|AA|{msg_id}\r"
            )

            # Wrap in MLLP framing
            framed = HL7_SB + ack_message.encode('latin-1') + HL7_EB + HL7_CR

            logger.info(f"HL7 {self.instrument_name}: Generated ACK for message {msg_id}")

            return framed

        except Exception as e:
            logger.error(f"HL7 {self.instrument_name}: Error generating ACK: {e}")
            return b""

    async def handle_message_start(self) -> str:
        """
        Handle start of message reception (establishment phase).

        Returns: "ACK" if ready
        """
        logger.debug(f"HL7 {self.instrument_name}: Initiating Establishment Phase")

        self.in_transfer_state = True
        self.establishment = True

        logger.info(f"HL7 {self.instrument_name}: Ready for Transfer Phase")

        return "ACK"

    async def process_message(self, message: bytes) -> Tuple[str, bytes]:
        """
        Process received HL7 message.

        Args:
            message: HL7 message bytes (without MLLP framing)

        Returns: Tuple of (response_string, ack_message_bytes)
        """
        try:
            # Clean up message
            clean_message = message.strip()

            if not clean_message:
                logger.warning(f"HL7 {self.instrument_name}: Received empty message")
                return "NACK", b""

            # Extract and log message ID
            self.msg_id = self._extract_message_id(clean_message)

            logger.info(f"HL7 {self.instrument_name}: Received message "
                       f"(ID: {self.msg_id}, size: {len(clean_message)} bytes)")

            # Store message
            self._received_messages.append(clean_message)

            # Generate ACK
            ack = self._generate_ack(clean_message)

            return "ACK", ack

        except Exception as e:
            logger.error(f"HL7 {self.instrument_name}: Error processing message: {e}")
            return "NACK", b""

    async def process_data(self, data: bytes) -> Tuple[Optional[str], Optional[bytes]]:
        """
        Process incoming HL7 data.

        Handles MLLP framing and message extraction.

        Args:
            data: Raw bytes received

        Returns: Tuple of (response, ack_message) or (None, None) if incomplete
        """
        if data is None:
            return None, None

        logger.info(f"HL7 {self.instrument_name}: Processing data...")

        # Check for message start (MLLP Start Block)
        if HL7_SB in data:
            await self.handle_message_start()
            self._buffer = b''
            # Don't return yet - may have more data

        # If we're in transfer state, look for complete messages
        if self.in_transfer_state:
            # Add incoming data to buffer
            combined = self._buffer + data

            # Split by end block or form feed
            separator = HL7_EB if HL7_FF not in combined else HL7_FF
            messages = combined.split(separator)

            # Last chunk is incomplete message - put back in buffer
            self._buffer = messages.pop(-1)

            # Process all complete messages
            for m in messages:
                # Clean message
                m = m.strip(bytes([HL7_SB]))  # Remove start block if present

                if m:
                    response, ack = await self.process_message(m)
                    # Return first response (usually all should be ACK)
                    if response:
                        return response, ack

        return None, None

    def get_accumulated_messages(self) -> List[bytes]:
        """Get all accumulated messages"""
        return self._received_messages

    def clear_accumulated_messages(self):
        """Clear accumulated messages"""
        self._received_messages = []

    def get_current_buffer(self) -> bytes:
        """Get current incomplete message buffer"""
        return self._buffer

    def clear_buffer(self):
        """Clear the buffer"""
        self._buffer = b''
