import logging
import socket
import time
from datetime import datetime, timedelta
from typing import Literal
from typing import Union, List

from hl7apy.core import Message as HL7Message

from felicity.apps.iol.analyzer.conf import EventType, CONNECTED_DISABLE_TIMEOUT
from felicity.apps.iol.analyzer.link.base import AbstractLink
from felicity.apps.iol.analyzer.link.conf import ASTMConstants, HL7Constants, SocketType, ProtocolType, \
    ConnectionStatus, TransmissionStatus
from felicity.apps.iol.analyzer.link.schema import InstrumentConfig
from felicity.apps.iol.analyzer.link.utils import set_keep_alive
from felicity.core.events import post_event

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RECV_BUFFER = 1024
# Message size and timeout limits
MAX_MESSAGE_SIZE = 10 * 1024 * 1024  # 10 MB max message size
MESSAGE_TIMEOUT_SECONDS = 60  # 60 second timeout for incomplete messages

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

# HL7 Constants
HL7_SB = HL7Constants.SB
HL7_EB = HL7Constants.EB
HL7_CR = HL7Constants.CR
HL7_FF = HL7Constants.FF


class SocketLink(AbstractLink):
    def __init__(self, instrument_config: InstrumentConfig, emit_events=True):
        self.emit_events = emit_events
        # Instrument configuration
        self.uid = instrument_config.uid
        self.name = instrument_config.name
        self.host = instrument_config.host
        self.port = instrument_config.port
        self.socket_type: SocketType | None = instrument_config.socket_type
        self.protocol_type: ProtocolType | None = instrument_config.protocol_type
        self.auto_reconnect: bool = instrument_config.auto_reconnect
        self.is_active: bool = instrument_config.is_active
        self.encoding = "utf-8"
        # socket
        self.socket = None
        self.timeout = 10
        self.keep_alive_interval = 10
        self.keep_alive_running = False
        # base
        self._received_messages: List[bytes] = list()
        self._chunks: List[bytes] = list()  # For ASTM chunked messages
        self.establishment = False
        self.response: Literal['ACK', 'NACK'] | None = None
        self._buffer = b''
        # ACK | NACK
        self.msg_id = None
        self.expect_ack = False

        # ASTM specific
        self._astm_session_active = False
        self._astm_frame_number = 0
        self._astm_last_frame_number = 0  # Start expecting any frame (first frame logic will handle it)
        self.in_transfer_state = False
        self._astm_message_fragments = []  # Store message fragments until complete message
        self._session_start_time = None  # Track when session started for timeout detection
        self._total_message_size = 0  # Track accumulated message size for limits

    def start_server(self, trials=1):
        """Start serial server"""
        if not self.is_active:
            logger.info(f"SocketLink: Instrument {self.name} is deactivated. Cannot start server.")
            time.sleep(60)
            return
        logger.info("SocketLink: Starting socket server ...")

        if self.emit_events:
            post_event(EventType.INSTRUMENT_STREAM, id=self.uid, connection=ConnectionStatus.CONNECTING,
                       transmission="")

        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(self.timeout)
                if self.socket_type == SocketType.CLIENT:
                    self._start_client(s)
                elif self.socket_type == SocketType.SERVER:
                    self._start_server(s)
        except OSError as e:
            if e.errno == 98:  # Address already in use
                logger.error(f"SocketLink: Port {self.port} is already in use. Check if another instance is running or wait for the port to be released.")
                logger.error(f"SocketLink: You can check for processes using: lsof -i :{self.port} or ss -tulpn | grep :{self.port}")
            elif e.errno == 13:  # Permission denied
                logger.error(f"SocketLink: Permission denied binding to port {self.port}. Try running with elevated privileges or use a port > 1024.")
            else:
                logger.error(f"SocketLink: OS error: {e}")
        except Exception as e:
            logger.error(f"SocketLink: An unexpected error occurred: {e}")
        finally:
            self._cleanup(trials)

    def _cleanup(self, trials):
        self.socket = None
        if self.emit_events:
            post_event(EventType.INSTRUMENT_STREAM, id=self.uid, connection=ConnectionStatus.DISCONNECTED,
                       transmission="")

        if self.auto_reconnect and trials <= 5:
            logger.info(f"SocketLink: Reconnecting ... trial: {trials}")
            trials += 1
            time.sleep(5)
            self.start_server(trials)

    def _start_client(self, s):
        """Start client socket"""
        logger.info("SocketLink: Attempting client connection ...")
        s.connect((self.host, self.port))
        set_keep_alive(s, after_idle_sec=60, interval_sec=60, max_fails=5)

        if self.emit_events:
            post_event(EventType.INSTRUMENT_STREAM, id=self.uid, connection=ConnectionStatus.CONNECTED, transmission="")

        if CONNECTED_DISABLE_TIMEOUT:
            s.settimeout(None)

        self._handle_connection(s)

    def _start_server(self, s):
        """Start server socket"""
        logger.info("SocketLink: Attempting Server connection...")
        # Set socket options for better port reuse handling
        socket_options = [
            (socket.SOL_SOCKET, socket.SO_REUSEADDR, 1),
            (socket.SOL_SOCKET, socket.SO_REUSEPORT, 1),
        ]

        for level, option, value in socket_options:
            try:
                s.setsockopt(level, option, value)
            except OSError:
                # Some options might not be available on all systems
                pass

        s.bind((self.host, self.port))
        s.listen(1)
        set_keep_alive(s, after_idle_sec=60, interval_sec=60, max_fails=5)

        if CONNECTED_DISABLE_TIMEOUT:
            s.settimeout(None)

        if self.emit_events:
            post_event(EventType.INSTRUMENT_STREAM, id=self.uid, connection=ConnectionStatus.OPEN, transmission="")

        logger.info("SocketLink: Server listening for connections ...")
        while True:
            try:
                sckt, address = s.accept()
                if self.emit_events:
                    post_event(EventType.INSTRUMENT_STREAM, id=self.uid, connection=ConnectionStatus.CONNECTED,
                               transmission="")

                logger.info(f"SocketLink: [{self.name}] Accepted connection from {address}")
                self._handle_connection(sckt)
            except socket.timeout:
                logger.info(f"SocketLink: [{self.name}] Accept timeout, continuing to listen...")
                continue  # Keep the server running
            except Exception as e:
                logger.info(f"SocketLink: Server error: {e}")
                break  # Exit the server loop on serious errors

    def _handle_connection(self, sckt):
        self.socket = sckt

        try:
            while True:
                data = self._read_data(sckt)
                if data == b'':
                    raise Exception("SocketLink: Closing connection -> Received empty bytes!!")

                # Is this a new session ?
                if not self.is_open():
                    self.open()

                # Process data based on protocol type
                self.process(data)

                # Does the receiver have to send something back?
                response = self.get_response()
                if response == "ACK":
                    self.ack()
                elif response == "NACK":
                    self.nack()
        except Exception as e:
            logger.error(f"SocketLink: Error during connection handling: {e}")
            post_event(EventType.INSTRUMENT_STREAM, id=self.uid, connection=ConnectionStatus.DISCONNECTING,
                       transmission="")
        finally:
            sckt.close()
            logger.info("SocketLink: Connection closed")
            self.response = None
            self.close()
            post_event(EventType.INSTRUMENT_STREAM, id=self.uid, connection=ConnectionStatus.DISCONNECTED,
                       transmission="")

    def _read_data(self, sckt):
        try:
            # read a frame
            return sckt.recv(RECV_BUFFER)
        except socket.timeout as e:
            logger.error(f"SocketLink: Socket timeout: {e}")
        except socket.error as e:
            logger.error(f"SocketLink: Socket error: {e}")
        except Exception as e:
            logger.error(f"SocketLink: Error reading data: {e}")

    def is_open(self):
        return self._buffer is not None

    def is_busy(self):
        return self.response is not None

    def _check_message_timeout(self) -> bool:
        """Check if current message has exceeded timeout threshold.

        Returns:
            True if message has timed out, False otherwise
        """
        if not self.in_transfer_state or not self._session_start_time:
            return False

        elapsed = datetime.now() - self._session_start_time
        if elapsed.total_seconds() > MESSAGE_TIMEOUT_SECONDS:
            logger.warning(f"SocketLink: Message timeout after {elapsed.total_seconds():.1f}s")
            return True
        return False

    def _check_message_size(self, new_data_size: int) -> bool:
        """Check if adding new data would exceed message size limit.

        Args:
            new_data_size: Size of new data being added

        Returns:
            True if adding data would exceed limit, False otherwise
        """
        if self._total_message_size + new_data_size > MAX_MESSAGE_SIZE:
            logger.error(f"SocketLink: Message size limit exceeded. "
                      f"Current: {self._total_message_size}, "
                      f"New: {new_data_size}, "
                      f"Limit: {MAX_MESSAGE_SIZE}")
            return True
        return False

    def open(self):
        logger.info("SocketLink: Opening session")
        self._buffer = b''
        self.response = None
        self.establishment = False
        self._astm_session_active = False
        self._astm_frame_number = 0
        self._astm_last_frame_number = 0  # Start expecting any frame (first frame logic will handle it)
        self.in_transfer_state = False
        self._session_start_time = datetime.now()  # Track session start for timeout detection
        self._total_message_size = 0  # Reset message size tracking
        if self.emit_events:
            post_event(EventType.INSTRUMENT_STREAM, id=self.uid, connection=ConnectionStatus.CONNECTED,
                       transmission=TransmissionStatus.STARTED)

    def close(self):
        logger.info("SocketLink: Closing session: neutral state")
        self._buffer = b''  # Changed from None to b'' to match async implementation
        self.establishment = False
        self._astm_session_active = False
        self.in_transfer_state = False
        self._received_messages = list()
        self._chunks = list()
        # Reset frame tracking for next session
        self._astm_frame_number = 0
        self._astm_last_frame_number = 0  # Start expecting any frame (first frame logic will handle it)
        # Reset size and timeout tracking
        self._session_start_time = None
        self._total_message_size = 0
        if self.emit_events:
            post_event(EventType.INSTRUMENT_STREAM, id=self.uid, connection=ConnectionStatus.CONNECTED,
                       transmission=TransmissionStatus.ENDED)

    def process(self, data: bytes) -> None:
        """Router method with auto-detection - directs to appropriate protocol handler"""
        logger.info(f"SocketLink: Received data: {str(data)}")

        # Auto-detect protocol if not explicitly set
        if not self.protocol_type:
            if data.startswith((ENQ, STX, EOT)):
                logger.info("SocketLink: Auto-detected ASTM protocol")
                self.protocol_type = ProtocolType.ASTM
            elif data.startswith(HL7_SB) or data.lstrip().startswith(b"MSH"):
                logger.info("SocketLink: Auto-detected HL7 protocol")
                self.protocol_type = ProtocolType.HL7
            else:
                logger.warning("SocketLink: Unknown protocol, defaulting to HL7")
                self.protocol_type = ProtocolType.HL7

        if self.protocol_type == ProtocolType.ASTM:
            self.process_astm(data)
        else:
            self.process_hl7(data)

    def process_astm(self, data: bytes) -> None:
        """Process ASTM messages with enhanced frame validation"""
        if data is None:
            return

        logger.info(f"SocketLink: Processing ASTM data ...")

        # Check for timeouts on incomplete messages
        if self._check_message_timeout():
            logger.error("SocketLink: Message timeout detected, closing session")
            self.response = "NACK"
            self.close()
            return

        # Handle standard ASTM control characters
        if data.startswith(ENQ):
            self.handle_astm_enq()
            self.response = "ACK"
            return

        elif data.startswith(ACK):
            logger.info("SocketLink: Received ASTM ACK from sender")
            return

        elif data.startswith(NAK):
            logger.warning("SocketLink: Received ASTM NAK from sender")
            return

        elif data.startswith(EOT):
            self.handle_astm_eot()
            return

        # Handle ASTM data frames
        elif data.startswith(STX):
            # Check message size limit before processing
            if self._check_message_size(len(data)):
                logger.error("SocketLink: Message exceeds size limit, rejecting")
                self.response = "NACK"
                self.close()
                return

            # If no session is active, start a session
            if not self._astm_session_active:
                logger.info("SocketLink: Auto-starting ASTM session on data receipt")
                self._astm_session_active = True
                self._astm_last_frame_number = 0  # Reset for first frame acceptance
                self.in_transfer_state = True

            # Track accumulated message size
            self._total_message_size += len(data)

            # Add data to buffer
            self._buffer += data

            # Look for complete frames
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

                # Find the end of the frame (including checksum and CRLF)
                frame_end = end_pos + 1
                # Look for checksum + CRLF (2 bytes checksum + 2 bytes CRLF)
                if frame_end + 4 <= len(self._buffer):
                    frame_end += 4
                elif frame_end + 3 <= len(self._buffer):
                    frame_end += 3  # Sometimes just CR or LF
                elif frame_end + 2 <= len(self._buffer):
                    frame_end += 2  # Just checksum

                # Extract the frame
                frame = self._buffer[:frame_end]
                self._buffer = self._buffer[frame_end:]

                # Process the frame
                if self._process_astm_frame(frame):
                    self.response = "ACK"
                else:
                    self.response = "NACK"
                    break
            return

        # Handle custom messages (H| to L|1|N\r) for devices that don't use standard ASTM markers
        else:
            self._process_custom_astm_message(data)
            return

    def _process_astm_frame(self, frame: bytes) -> bool:
        """Process a single ASTM frame with simplified sequence tracking"""
        try:
            # Frame format: STX FN message ETX/ETB checksum CR LF
            if len(frame) < 5:  # Minimum frame size
                logger.error("SocketLink: ASTM frame too short")
                return False

            # Extract frame number from second byte
            frame_number = int(chr(frame[1]))

            # For the very first frame, accept any frame number and reset sequence
            if len(self._received_messages) == 0:
                logger.info(f"SocketLink: First ASTM frame, accepting frame {frame_number}")
                expected_frame = frame_number
            else:
                expected_frame = (self._astm_last_frame_number + 1) % 8

            logger.info(f"SocketLink: ASTM frame number: {frame_number}, expected: {expected_frame}, last: {self._astm_last_frame_number}")

            if frame_number != expected_frame:
                logger.error(f"SocketLink: ASTM frame sequence error. Expected {expected_frame}, got {frame_number}")
                return False

            # Extract message content (remove STX, frame number, ETX/ETB, checksum, CR, LF)
            # Find the position of ETX or ETB to properly extract message content
            etx_pos = frame.find(ETX)
            etb_pos = frame.find(ETB)

            if etx_pos != -1:
                # Final frame with ETX
                message_fragment = frame[2:etx_pos]
            elif etb_pos != -1:
                # Intermediate frame with ETB
                message_fragment = frame[2:etb_pos]
            else:
                # Fallback to old method if no ETX/ETB found
                message_fragment = frame[2:-4]

            # Validate checksum if needed (optional implementation)
            checksum_received = frame[-4:-2].decode('ascii', errors='ignore')
            logger.info(f"SocketLink: ASTM checksum received: {checksum_received}")

            # Log frame content with robust encoding handling
            frame_content = self.decode_message(message_fragment)
            logger.info(f"SocketLink: ASTM frame content: {frame_content}")

            # Accumulate message fragments
            self._received_messages.append(message_fragment)

            # Just accumulate all frames - don't process until EOT
            # Update frame sequence for all frames
            self._astm_last_frame_number = frame_number
            logger.info(f"SocketLink: ASTM frame {frame_number} accumulated, waiting for EOT")
            return True

        except Exception as e:
            logger.error(f"SocketLink: Error processing ASTM frame: {e}")
            return False

    def _process_custom_astm_message(self, data: bytes) -> None:
        """Process custom ASTM messages with validation"""
        self._buffer += data

        # Check for start of custom message
        if b"H|" in self._buffer and not self.in_transfer_state:
            logger.info("SocketLink: ASTM custom message start detected (H|)")
            # For custom messages, initialize session but don't clear buffer
            # as these messages don't use standard ASTM framing
            self.handle_astm_enq(clear_buffer=False)
            self.response = "ACK"
            return

        # Check for end of custom message
        if self.in_transfer_state and b"L|1|N\r" in self._buffer:
            logger.info("SocketLink: ASTM custom message end detected (L|1|N\\r)")
            full_message = self._buffer
            self._buffer = b""
            self.in_transfer_state = False

            # Validate custom message format
            if not self._validate_custom_message(full_message):
                logger.error("SocketLink: ASTM custom message validation failed")
                self.response = "NACK"
                return

            # Decode bytes to string for processing, similar to standard ASTM processing
            decoded_message = self.decode_message(full_message)

            self._received_messages.append(decoded_message)
            self.response = "ACK"
            self.show_message(decoded_message)
            self.eot_offload(self.uid, [decoded_message])
            self.handle_astm_eot()
            return

        logger.info("SocketLink: ASTM custom message incomplete, waiting for more data")

    def _validate_custom_message(self, message: bytes) -> bool:
        """Validate custom ASTM message format"""
        try:
            # Basic validation for custom messages
            if not message.startswith(b"H|"):
                logger.error("SocketLink: Custom message doesn't start with H|")
                logger.error(f"Custom message start with {message[:20]}")
                return False

            if not message.endswith(b"L|1|N\r"):
                logger.error("SocketLink: Custom message doesn't end with L|1|N\\r")
                return False

            # Check for minimum message length
            if len(message) < 10:
                logger.error("SocketLink: Custom message too short")
                return False

            logger.info("SocketLink: Custom ASTM message validation passed")
            return True

        except Exception as e:
            logger.error(f"SocketLink: Custom message validation error: {e}")
            return False

    def process_hl7(self, data: bytes) -> None:
        """Process HL7 messages with MLLP framing"""
        if data is None: return None

        logger.info(f"SocketLink: Processing HL7 data: {str(data)}")

        # Check for timeouts on incomplete messages
        if self._check_message_timeout():
            logger.error("SocketLink: HL7 message timeout detected, closing session")
            self.response = "NACK"
            self.close()
            return

        # Check message size limit before processing
        if self._check_message_size(len(data)):
            logger.error("SocketLink: HL7 message exceeds size limit, rejecting")
            self.response = "NACK"
            self.close()
            return

        # Track accumulated message size
        self._total_message_size += len(data)

        if HL7_SB in data:
            self.handle_enq()
            self._buffer = b''
            self._get_message_id(self.decode_message(data.strip(HL7_SB)))

        if self.in_transfer_state:
            # Establishment phase has been initiated already and we are now in Transfer phase

            # try to find a complete message(s) in the combined the buffer and data
            # usually should be broken up by EB, but I have seen FF separating messages
            messages = (self._buffer + data).split(HL7_EB if HL7_FF not in data else HL7_FF)
            # whatever is in the last chunk is an uncompleted message, so put back
            # into the buffer
            self._buffer = messages.pop(-1)

            for m in messages:
                # strip the rest of the MLLP shell from the HL7 message
                m = m.strip(HL7_SB)

                # only handle messages with data
                if len(m) > 0:
                    self._received_messages.append(m)

            if HL7_EB in data:
                # Received an End Of Transmission. Resume and enter to neutral
                self.handle_eot()

            self.response = "ACK"
            return
        else:
            logger.info("SocketLink: HL7 establishment phase not initiated")
            self.response = "NACK"

        self.response = None
        return

    def handle_astm_enq(self, clear_buffer=True):
        """Handle ASTM ENQ (session initialization)"""
        logger.info("SocketLink: Received ASTM ENQ")

        if self.is_busy():
            logger.info("SocketLink: Receiver is busy, sending NAK")
            self.response = "NACK"
        else:
            logger.info("SocketLink: Ready for ASTM transfer, sending ACK")
            self._astm_session_active = True
            self.in_transfer_state = True
            self._astm_frame_number = 0
            self._astm_last_frame_number = 0  # Start expecting any frame (first frame logic will handle it)
            if clear_buffer:
                self._buffer = b''  # Clear buffer
            self.response = "ACK"

    def handle_astm_eot(self):
        """Handle ASTM EOT (end of transmission)"""
        logger.info("SocketLink: Received ASTM EOT")
        self._astm_session_active = False
        self.in_transfer_state = False

        if self._received_messages:
            # Combine all frame fragments into single complete message
            complete_message = b''.join(self._received_messages)
            decoded_message = self.decode_message(complete_message)

            logger.info(f"SocketLink: Complete ASTM message assembled ({len(complete_message)} bytes)")

            # Process the single complete message
            self.show_message(decoded_message)
            self.eot_offload(self.uid, [decoded_message])

        # Reset and close
        self._received_messages = []

        self.response = None
        self.close()

    def handle_enq(self):
        """Handle HL7 ENQ (establishment)"""
        logger.debug("SocketLink: Initiating HL7 Establishment Phase")
        if self.is_busy():
            logger.info("SocketLink: Receiver is busy")
            self.response = "NAK"
        else:
            logger.info("SocketLink: Ready for HL7 Transfer Phase")
            self.establishment = True
            self.in_transfer_state = True
            self.response = "ACK"

    def handle_eot(self):
        """Handles HL7 End Of Transmission message"""
        logger.info("SocketLink: HL7 transfer phase completed")

        # Decode messages with proper encoding handling for special characters
        msgs = []
        for m in self._received_messages:
            if isinstance(m, bytes):
                msgs.append(self.decode_message(m))
            else:
                msgs.append(m)

        logger.info(f"SocketLink: -----------------------------------------------------------------------")
        logger.info(f"SocketLink: HL7 un-decoded messages: msgs={self._received_messages}")
        logger.info(f"SocketLink: -----------------------------------------------------------------------")
        logger.info(f"SocketLink: HL7 decoded messages: msgs={msgs}")
        logger.info(f"SocketLink: -----------------------------------------------------------------------")

        # Show each message individually
        for msg in msgs:
            self.show_message(msg)
        self.eot_offload(self.uid, msgs)
        self.response = None
        self.close()

    def nack(self):
        """Send NACK response"""
        if self.protocol_type == ProtocolType.ASTM:
            logger.info("SocketLink: <- ASTM NACK")
            self.socket.send(NAK)
        else:
            logger.info(f"SocketLink: <- HL7 NACK : {self.msg_id}")
            nack = self._nack_msg(self.msg_id)
            self.send_message(nack)

    def ack(self):
        """Send ACK response"""
        if self.protocol_type == ProtocolType.ASTM:
            logger.info("SocketLink: <- ASTM ACK")
            self.socket.send(ACK)
        else:
            logger.info(f"SocketLink: <- HL7 ACK : {self.msg_id}")
            ack = self._ack_msg(self.msg_id)
            self.send_message(ack)

    def send_message(self, message: Union[bytes, str, HL7Message]):
        if isinstance(message, bytes):
            # Assume we have the correct encoding
            binary = message
        else:
            # Encode the unicode message into a bytestring
            if isinstance(message, HL7Message):
                message = str(message)
            binary = message.encode(self.encoding)

        if self.protocol_type == ProtocolType.ASTM:
            # For ASTM, messages are sent as-is (they should already be framed)
            data = binary
        else:
            # wrap in MLLP message container for HL7
            data = HL7_SB + binary + HL7_EB + HL7_CR

        return self._send(data)

    def _send(self, data):
        """Low-level, direct access to the socket.send"""
        # upload the data
        self.socket.send(data)

        # wait for the ACK/NACK if expected
        if self.expect_ack:
            response = self.socket.recv(RECV_BUFFER)
            if self.protocol_type == ProtocolType.ASTM:
                return response.decode() if len(response) == 1 else response.decode()
            else:
                # HL7 MLLP
                response = response.replace(HL7_SB, b"").replace(HL7_EB, b"").decode()
                return response

    def _get_message_id(self, message):
        """Extract message ID from HL7 message"""
        # Split the HL7 message into segments
        segments = message.split('\r')

        # Find the MSH segment
        msh_segment = None
        for segment in segments:
            if segment.startswith('MSH'):
                msh_segment = segment
                break

        if msh_segment:
            # Split the MSH segment into fields
            fields = msh_segment.split('|')

            # Return the 10th field (Message Control ID)
            self.msg_id = fields[9] if len(fields) > 9 else None
        else:
            self.msg_id = None

    def _ack_msg(self, original_control_id, ack_code='AA', text_message='', error_code=''):
        """Create HL7 ACK message"""
        ack = [
            f"MSH|^~\&|FELICIY|FELICIY|FELICIY|FELICIY|{datetime.now().strftime('%Y%m%d%H%M%S')}||ACK|{original_control_id}|P|2.5.1",
            f"MSA|{ack_code}|{original_control_id}|{text_message}|{error_code}"
        ]
        return '\r'.join(ack)

    def _nack_msg(self, original_control_id, text_message='', error_code=''):
        """Create HL7 NACK message"""
        nack = [
            f"MSH|^~\&|FELICIY|FELICIY|FELICIY|FELICIY|{datetime.now().strftime('%Y%m%d%H%M%S')}||NACK|{original_control_id}|P|2.5.1",
            f"MSA|AR|{original_control_id}|{text_message}|{error_code}"
        ]
        return '\r'.join(nack)

    def get_response(self):
        if self.response:
            logger.debug("SocketLink: Response <- {}".format(self.response))
        resp = self.response
        self.response = None
        return resp
