# -*- coding: utf-8 -*-
"""
ASTM Protocol Handler

Handles ASTM (Automated Specimen Transport Management) protocol for laboratory instruments.
Supports:
- ENQ/ACK/NAK/EOT handshake
- Frame sequencing (0-7 modulo)
- Checksum validation
- Chunked message assembly (ETB/ETX)
- Custom message formats
"""

import logging
from datetime import datetime
from typing import Optional, List, Tuple

from felicity.apps.iol.analyzer.link.conf import ASTMConstants, ProtocolType
from felicity.apps.iol.analyzer.link.utils import validate_checksum, split_message

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ASTM Constants
STX = ASTMConstants.STX
ETX = ASTMConstants.ETX
EOT = ASTMConstants.EOT
ENQ = ASTMConstants.ENQ
ACK = ASTMConstants.ACK
NAK = ASTMConstants.NAK
ETB = ASTMConstants.ETB
LF = ASTMConstants.LF
CR = ASTMConstants.CR
CRLF = ASTMConstants.CRLF


class ASTMProtocolHandler:
    """
    Handles ASTM protocol communication.

    Maintains protocol state and handles:
    - Message framing and assembly
    - Checksum validation
    - Session establishment and termination
    - Frame sequencing
    """

    def __init__(self, instrument_uid: int, instrument_name: str, emit_events=True):
        self.instrument_uid = instrument_uid
        self.instrument_name = instrument_name
        self.emit_events = emit_events

        # Protocol state
        self._session_active = False
        self._frame_number = 0
        self._last_frame_number = 0
        self.in_transfer_state = False
        self.establishment = False

        # Message assembly
        self._received_messages: List[bytes] = []
        self._buffer = b''

        # Response tracking
        self.response: Optional[str] = None  # "ACK" or "NACK"

    def reset_session(self):
        """Reset protocol state for new session"""
        self._session_active = False
        self._frame_number = 0
        self._last_frame_number = 0
        self.in_transfer_state = False
        self.establishment = False
        self._received_messages = []
        self._buffer = b''
        self.response = None

    def is_enq(self, data: bytes) -> bool:
        """Check if data is ENQ (establishment request)"""
        return data.startswith(ENQ)

    def is_ack(self, data: bytes) -> bool:
        """Check if data is ACK from sender"""
        return data.startswith(ACK)

    def is_nak(self, data: bytes) -> bool:
        """Check if data is NAK from sender"""
        return data.startswith(NAK)

    def is_eot(self, data: bytes) -> bool:
        """Check if data is EOT (end of transmission)"""
        return data.startswith(EOT)

    def is_data_frame(self, data: bytes) -> bool:
        """Check if data is a message frame"""
        return data.startswith(STX)

    def is_custom_message(self, data: bytes) -> bool:
        """Check if data is a custom ASTM message (H|...|L|1|N\\r format)"""
        return b"H|" in data or (b"L|1|N\r" in data and self.in_transfer_state)

    async def handle_enq(self) -> str:
        """
        Handle ENQ (session establishment request).

        Returns: "ACK" if ready, "NACK" if busy
        """
        logger.debug(f"ASTM {self.instrument_name}: Initiating Establishment Phase")

        if self.response is not None:
            logger.info(f"ASTM {self.instrument_name}: Receiver is busy, sending NAK")
            return "NACK"

        logger.info(f"ASTM {self.instrument_name}: Ready for Transfer Phase")
        self._session_active = True
        self.in_transfer_state = True
        self.establishment = True
        self._last_frame_number = 0

        return "ACK"

    async def handle_eot(self) -> Tuple[str, Optional[bytes]]:
        """
        Handle EOT (end of transmission).

        Returns: Tuple of (response, assembled_message)
                - response: "ACK" or "NACK"
                - assembled_message: Combined message bytes or None
        """
        logger.info(f"ASTM {self.instrument_name}: Received EOT")

        self._session_active = False
        self.in_transfer_state = False

        if not self._received_messages:
            logger.info(f"ASTM {self.instrument_name}: No messages received")
            return "ACK", None

        # Combine all frame fragments into single complete message
        complete_message = b''.join(self._received_messages)
        logger.info(f"ASTM {self.instrument_name}: Complete message assembled "
                  f"({len(complete_message)} bytes)")

        # Reset for next session
        self._received_messages = []
        self.establishment = False

        return "ACK", complete_message

    async def process_frame(self, frame: bytes) -> bool:
        """
        Process a single ASTM frame.

        Args:
            frame: Raw frame bytes including STX, data, ETX/ETB, checksum, CRLF

        Returns: True if frame accepted, False if rejected
        """
        try:
            # Validate frame structure
            if len(frame) < 5:
                logger.error(f"ASTM {self.instrument_name}: Frame too short")
                return False

            if not frame.startswith(STX):
                logger.error(f"ASTM {self.instrument_name}: Frame doesn't start with STX")
                return False

            if not frame.endswith(CRLF):
                logger.error(f"ASTM {self.instrument_name}: Frame doesn't end with CRLF")
                return False

            # Validate checksum
            if not validate_checksum(frame):
                logger.error(f"ASTM {self.instrument_name}: Invalid checksum")
                return False

            # Extract frame number
            try:
                frame_number = int(chr(frame[1]))
            except (ValueError, IndexError):
                logger.error(f"ASTM {self.instrument_name}: Invalid frame number")
                return False

            # Validate frame sequence
            if len(self._received_messages) == 0:
                # First frame - accept any frame number
                logger.info(f"ASTM {self.instrument_name}: First frame accepted (#{frame_number})")
                expected_frame = frame_number
            else:
                # Subsequent frames - expect consecutive sequence (modulo 8)
                expected_frame = (self._last_frame_number + 1) % 8

            if frame_number != expected_frame:
                logger.error(f"ASTM {self.instrument_name}: Frame sequence error. "
                          f"Expected {expected_frame}, got {frame_number}")
                return False

            # Extract message content (remove STX, frame number, ETX/ETB, checksum, CRLF)
            etx_pos = frame.find(ETX)
            etb_pos = frame.find(ETB)

            if etx_pos != -1:
                # Final frame with ETX
                message_fragment = frame[2:etx_pos]
            elif etb_pos != -1:
                # Intermediate frame with ETB
                message_fragment = frame[2:etb_pos]
            else:
                # Fallback
                message_fragment = frame[2:-4]

            logger.info(f"ASTM {self.instrument_name}: Frame {frame_number} accepted "
                      f"({len(message_fragment)} bytes)")

            # Accumulate message
            self._received_messages.append(message_fragment)
            self._last_frame_number = frame_number

            return True

        except Exception as e:
            logger.error(f"ASTM {self.instrument_name}: Error processing frame: {e}")
            return False

    async def process_custom_message(self, message: bytes) -> bool:
        """
        Process custom ASTM message (H|...|L|1|N\\r format).

        Args:
            message: Raw message bytes

        Returns: True if valid, False otherwise
        """
        try:
            if not message.startswith(b"H|"):
                logger.error(f"ASTM {self.instrument_name}: Custom message doesn't start with H|")
                return False

            if not message.endswith(b"L|1|N\r"):
                logger.error(f"ASTM {self.instrument_name}: Custom message doesn't end with L|1|N\\r")
                return False

            if len(message) < 10:
                logger.error(f"ASTM {self.instrument_name}: Custom message too short")
                return False

            logger.info(f"ASTM {self.instrument_name}: Custom message validated "
                      f"({len(message)} bytes)")

            # Store custom message
            self._received_messages.append(message)
            return True

        except Exception as e:
            logger.error(f"ASTM {self.instrument_name}: Custom message validation error: {e}")
            return False

    async def process_data(self, data: bytes) -> str:
        """
        Process incoming ASTM data.

        Routes data to appropriate handler based on control characters.

        Args:
            data: Raw bytes received

        Returns: Response to send back ("ACK", "NACK", or None)
        """
        if data is None:
            return None

        logger.info(f"ASTM {self.instrument_name}: Processing data...")

        # Handle control characters
        if self.is_enq(data):
            self.response = await self.handle_enq()
            return self.response

        elif self.is_ack(data):
            logger.info(f"ASTM {self.instrument_name}: Received ACK from sender")
            return None

        elif self.is_nak(data):
            logger.warning(f"ASTM {self.instrument_name}: Received NAK from sender")
            return None

        elif self.is_eot(data):
            response, message = await self.handle_eot()
            self.response = response
            return response, message

        # Handle data frames
        elif self.is_data_frame(data):
            if not self._session_active:
                logger.info(f"ASTM {self.instrument_name}: Auto-starting session on data receipt")
                self._session_active = True
                self.in_transfer_state = True
                self._last_frame_number = 0

            # Add data to buffer and extract complete frames
            self._buffer += data

            while True:
                # Find STX
                stx_pos = self._buffer.find(STX)
                if stx_pos == -1:
                    break

                # Remove any data before STX
                self._buffer = self._buffer[stx_pos:]

                # Find ETX or ETB
                etx_pos = self._buffer.find(ETX)
                etb_pos = self._buffer.find(ETB)

                end_pos = -1
                if etx_pos != -1 and (etb_pos == -1 or etx_pos < etb_pos):
                    end_pos = etx_pos
                elif etb_pos != -1:
                    end_pos = etb_pos

                if end_pos == -1:
                    # No complete frame yet
                    break

                # Extract complete frame (including checksum and CRLF)
                frame_end = end_pos + 1
                if frame_end + 4 <= len(self._buffer):
                    frame_end += 4  # checksum (2) + CRLF (2)
                elif frame_end + 3 <= len(self._buffer):
                    frame_end += 3  # Just 1 char + CRLF or checksum
                elif frame_end + 2 <= len(self._buffer):
                    frame_end += 2  # Just checksum

                frame = self._buffer[:frame_end]
                self._buffer = self._buffer[frame_end:]

                # Process frame
                if not await self.process_frame(frame):
                    self.response = "NACK"
                    return "NACK"

            self.response = "ACK"
            return "ACK"

        # Handle custom messages
        elif self.is_custom_message(data):
            self._buffer += data

            if b"L|1|N\r" in self._buffer:
                full_message = self._buffer
                self._buffer = b""
                self.in_transfer_state = False

                if await self.process_custom_message(full_message):
                    self.response = "ACK"
                    return "ACK"
                else:
                    self.response = "NACK"
                    return "NACK"

            logger.info(f"ASTM {self.instrument_name}: Custom message incomplete, waiting")
            return None

        else:
            logger.warning(f"ASTM {self.instrument_name}: Unknown data format, defaulting to NACK")
            return "NACK"

    def get_accumulated_message(self) -> Optional[bytes]:
        """Get accumulated message fragments"""
        if self._received_messages:
            return b''.join(self._received_messages)
        return None

    def clear_accumulated_message(self):
        """Clear accumulated message fragments"""
        self._received_messages = []
