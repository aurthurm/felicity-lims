# -*- coding: utf-8 -*-
"""
Socket Link - Non-blocking instrument communication

Uses asyncio for non-blocking TCP/IP communication with laboratory instruments.
Supports both ASTM and HL7 protocols with automatic detection.

Architecture:
- SocketLink: Main connection handler
- ASTMProtocolHandler: ASTM protocol logic
- HL7ProtocolHandler: HL7 protocol logic
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Optional, Literal, Union

from felicity.apps.iol.analyzer.conf import EventType, CONNECTED_DISABLE_TIMEOUT
from felicity.apps.iol.analyzer.link.base import AbstractLink
from felicity.apps.iol.analyzer.link.conf import (
    SocketType, ProtocolType, ConnectionStatus, TransmissionStatus
)
from felicity.apps.iol.analyzer.link.schema import InstrumentConfig
from felicity.apps.iol.analyzer.link.utils import set_keep_alive
from felicity.apps.iol.analyzer.link.fsocket.astm import ASTMProtocolHandler
from felicity.apps.iol.analyzer.link.fsocket.hl7 import HL7ProtocolHandler
from felicity.core.events import post_event

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Connection parameters
RECV_BUFFER = 1024
CONNECT_TIMEOUT = 10
RECONNECT_DELAY = 5
MAX_RECONNECT_ATTEMPTS = 5
KEEP_ALIVE_INTERVAL = 10

# Message safety limits
MAX_MESSAGE_SIZE = 10 * 1024 * 1024  # 10 MB
MESSAGE_TIMEOUT_SECONDS = 60  # 60 seconds


class SocketLink(AbstractLink):
    """
    TCP/IP socket connection handler for laboratory instruments.

    Async implementation using asyncio for non-blocking I/O.

    Supports:
    - Client and server modes
    - ASTM and HL7 protocols
    - Automatic protocol detection
    - Non-blocking I/O
    - Graceful shutdown
    - Multiple concurrent connections (server mode)
    """

    def __init__(self, instrument_config: InstrumentConfig, emit_events=True):
        self.emit_events = emit_events

        # Instrument configuration
        self.uid = instrument_config.uid
        self.name = instrument_config.name
        self.host = instrument_config.host
        self.port = instrument_config.port
        self.socket_type: Optional[SocketType] = instrument_config.socket_type
        self.protocol_type: Optional[ProtocolType] = instrument_config.protocol_type
        self.auto_reconnect: bool = instrument_config.auto_reconnect
        self.is_active: bool = instrument_config.is_active

        # Socket state
        self.server: Optional[asyncio.Server] = None
        self.socket_timeout = 10
        self.keep_alive_interval = KEEP_ALIVE_INTERVAL

        # Message tracking
        self._session_start_time: Optional[datetime] = None
        self._total_message_size = 0

        # Protocol handlers
        self.astm_handler = ASTMProtocolHandler(self.uid, self.name, emit_events)
        self.hl7_handler = HL7ProtocolHandler(self.uid, self.name, emit_events)

        # Protocol detection
        self._protocol_detected = False
        self._detected_protocol: Optional[ProtocolType] = None

    async def start_server(self, trials: int = 1):
        """
        Start async server for receiving instrument data.

        Supports both client and server modes:
        - Server: Listens on host:port for incoming connections
        - Client: Connects to host:port and listens for data

        Args:
            trials: Number of reconnection attempts (not used in async, for compatibility)
        """
        if not self.is_active:
            logger.info(f"SocketLink {self.name}: Instrument deactivated, cannot start server")
            return

        try:
            if self.socket_type == SocketType.SERVER:
                await self._start_server_mode()
            else:
                await self._start_client_mode()

        except Exception as e:
            logger.error(f"SocketLink {self.name}: Error starting server: {e}")
            if self.emit_events:
                post_event(EventType.INSTRUMENT_STREAM,
                          id=self.uid,
                          connection=ConnectionStatus.DISCONNECTED)

    async def _start_server_mode(self):
        """
        Start server mode - listen for incoming instrument connections.

        Creates async server that handles multiple concurrent client connections.
        """
        logger.info(f"SocketLink {self.name}: Starting server mode on {self.host}:{self.port}")

        try:
            # Create async server
            self.server = await asyncio.start_server(
                self._handle_client,
                self.host or '0.0.0.0',
                self.port
            )

            # Get server socket for keepalive
            for sock in self.server.sockets:
                set_keep_alive(sock, self.keep_alive_interval)

            if self.emit_events:
                post_event(EventType.INSTRUMENT_STREAM,
                          id=self.uid,
                          connection=ConnectionStatus.CONNECTED)

            logger.info(f"SocketLink {self.name}: Server listening on {self.host}:{self.port}")

            # Serve forever
            async with self.server:
                await self.server.serve_forever()

        except OSError as e:
            if e.errno in (98, 13):  # Address in use or Permission denied
                logger.error(f"SocketLink {self.name}: Port error ({e.errno}): {e}")
            else:
                raise
        except asyncio.CancelledError:
            logger.info(f"SocketLink {self.name}: Server shutdown")
        except Exception as e:
            logger.error(f"SocketLink {self.name}: Server error: {e}")

    async def _handle_client(self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter):
        """
        Handle individual client connection (server mode).

        Args:
            reader: Async stream reader
            writer: Async stream writer
        """
        addr = writer.get_extra_info('peername')
        logger.info(f"SocketLink {self.name}: Client connected from {addr}")

        # Set keepalive on client socket
        sock = writer.get_extra_info('socket')
        if sock:
            set_keep_alive(sock, self.keep_alive_interval)

        if self.emit_events:
            post_event(EventType.INSTRUMENT_STREAM,
                      id=self.uid,
                      connection=ConnectionStatus.CONNECTED,
                      transmission=TransmissionStatus.STARTED)

        try:
            self._open_session()

            while True:
                try:
                    # Read data with timeout
                    data = await asyncio.wait_for(
                        reader.read(RECV_BUFFER),
                        timeout=self.socket_timeout
                    )

                except asyncio.TimeoutError:
                    logger.warning(f"SocketLink {self.name}: Read timeout from {addr}")
                    break

                if not data:
                    logger.info(f"SocketLink {self.name}: Connection closed by {addr}")
                    break

                # Check message timeout
                if self._check_message_timeout():
                    logger.error(f"SocketLink {self.name}: Message timeout detected")
                    response = self._encode_response("NACK")
                    writer.write(response)
                    await writer.drain()
                    self._close_session()
                    break

                # Check message size
                if self._check_message_size(len(data)):
                    logger.error(f"SocketLink {self.name}: Message exceeds size limit")
                    response = self._encode_response("NACK")
                    writer.write(response)
                    await writer.drain()
                    self._close_session()
                    break

                # Track message size
                self._total_message_size += len(data)

                # Process data
                response = await self.process(data)

                # Send response if any
                if response:
                    if isinstance(response, tuple):
                        # (response_str, message_bytes) from HL7
                        resp_str, msg_bytes = response
                        if msg_bytes:
                            writer.write(msg_bytes)
                        else:
                            writer.write(self._encode_response(resp_str))
                    else:
                        writer.write(self._encode_response(response))

                    await writer.drain()

        except asyncio.CancelledError:
            logger.info(f"SocketLink {self.name}: Client handler cancelled")

        except Exception as e:
            logger.error(f"SocketLink {self.name}: Client error: {e}")

        finally:
            writer.close()
            await writer.wait_closed()
            self._close_session()

            if self.emit_events:
                post_event(EventType.INSTRUMENT_STREAM,
                          id=self.uid,
                          connection=ConnectionStatus.DISCONNECTED)

    async def _start_client_mode(self):
        """
        Start client mode - connect to remote instrument server.

        Maintains persistent connection and processes incoming data.
        """
        logger.info(f"SocketLink {self.name}: Starting client mode, connecting to {self.host}:{self.port}")

        reconnect_count = 0

        while reconnect_count < MAX_RECONNECT_ATTEMPTS:
            try:
                # Connect to server
                reader, writer = await asyncio.wait_for(
                    asyncio.open_connection(self.host, self.port),
                    timeout=CONNECT_TIMEOUT
                )

                logger.info(f"SocketLink {self.name}: Connected to {self.host}:{self.port}")

                if self.emit_events:
                    post_event(EventType.INSTRUMENT_STREAM,
                              id=self.uid,
                              connection=ConnectionStatus.CONNECTED)

                reconnect_count = 0  # Reset on successful connection
                self._open_session()

                try:
                    # Set keepalive
                    sock = writer.get_extra_info('socket')
                    if sock:
                        set_keep_alive(sock, self.keep_alive_interval)

                    # Read loop
                    while True:
                        try:
                            data = await asyncio.wait_for(
                                reader.read(RECV_BUFFER),
                                timeout=self.socket_timeout
                            )

                        except asyncio.TimeoutError:
                            logger.warning(f"SocketLink {self.name}: Read timeout")
                            break

                        if not data:
                            logger.info(f"SocketLink {self.name}: Server closed connection")
                            break

                        # Check timeout
                        if self._check_message_timeout():
                            logger.error(f"SocketLink {self.name}: Message timeout")
                            response = self._encode_response("NACK")
                            writer.write(response)
                            await writer.drain()
                            self._close_session()
                            break

                        # Check size
                        if self._check_message_size(len(data)):
                            logger.error(f"SocketLink {self.name}: Message size limit exceeded")
                            response = self._encode_response("NACK")
                            writer.write(response)
                            await writer.drain()
                            self._close_session()
                            break

                        self._total_message_size += len(data)

                        # Process data
                        response = await self.process(data)

                        if response:
                            if isinstance(response, tuple):
                                resp_str, msg_bytes = response
                                if msg_bytes:
                                    writer.write(msg_bytes)
                                else:
                                    writer.write(self._encode_response(resp_str))
                            else:
                                writer.write(self._encode_response(response))

                            await writer.drain()

                finally:
                    writer.close()
                    await writer.wait_closed()
                    self._close_session()

            except asyncio.TimeoutError:
                logger.error(f"SocketLink {self.name}: Connection timeout")
                reconnect_count += 1

            except ConnectionRefusedError:
                logger.error(f"SocketLink {self.name}: Connection refused")
                reconnect_count += 1

            except Exception as e:
                logger.error(f"SocketLink {self.name}: Connection error: {e}")
                reconnect_count += 1

            if reconnect_count < MAX_RECONNECT_ATTEMPTS and self.auto_reconnect:
                logger.info(f"SocketLink {self.name}: Reconnecting... (attempt {reconnect_count}/{MAX_RECONNECT_ATTEMPTS})")
                await asyncio.sleep(RECONNECT_DELAY)

        if self.emit_events:
            post_event(EventType.INSTRUMENT_STREAM,
                      id=self.uid,
                      connection=ConnectionStatus.DISCONNECTED)

    def _open_session(self):
        """Initialize session state"""
        self._session_start_time = datetime.now()
        self._total_message_size = 0
        self.astm_handler.reset_session()
        self.hl7_handler.reset_session()
        self._protocol_detected = False
        self._detected_protocol = None

    def _close_session(self):
        """Clean up session state"""
        self._session_start_time = None
        self._total_message_size = 0

    def _check_message_timeout(self) -> bool:
        """Check if message has timed out"""
        if not self._session_start_time:
            return False

        elapsed = (datetime.now() - self._session_start_time).total_seconds()
        if elapsed > MESSAGE_TIMEOUT_SECONDS:
            logger.warning(f"SocketLink {self.name}: Message timeout after {elapsed:.1f}s")
            return True
        return False

    def _check_message_size(self, new_size: int) -> bool:
        """Check if message size exceeds limit"""
        if self._total_message_size + new_size > MAX_MESSAGE_SIZE:
            logger.error(f"SocketLink {self.name}: Message size limit exceeded "
                      f"(current: {self._total_message_size}, new: {new_size}, limit: {MAX_MESSAGE_SIZE})")
            return True
        return False

    async def process(self, data: bytes) -> Optional[Union[str, bytes, tuple]]:
        """
        Process incoming data with automatic protocol detection.

        Args:
            data: Raw bytes received

        Returns: Response ("ACK", "NACK") or (response, message) tuple
        """
        if data is None:
            return None

        logger.info(f"SocketLink {self.name}: Received {len(data)} bytes")

        # Auto-detect protocol if not specified
        if self.protocol_type is None and not self._protocol_detected:
            self._detected_protocol = self._detect_protocol(data)
            self._protocol_detected = True
            logger.info(f"SocketLink {self.name}: Detected protocol: {self._detected_protocol}")

        # Route to appropriate handler
        protocol = self.protocol_type or self._detected_protocol

        if protocol == ProtocolType.ASTM:
            return await self.astm_handler.process_data(data)
        elif protocol == ProtocolType.HL7:
            return await self.hl7_handler.process_data(data)
        else:
            logger.warning(f"SocketLink {self.name}: Unknown protocol, defaulting to ASTM")
            return await self.astm_handler.process_data(data)

    def _detect_protocol(self, data: bytes) -> ProtocolType:
        """
        Auto-detect protocol from first data bytes.

        Args:
            data: Initial data received

        Returns: Detected ProtocolType
        """
        if data.startswith(b'\x0B'):  # HL7_SB
            return ProtocolType.HL7
        elif data.startswith(b'\x05'):  # ENQ
            return ProtocolType.ASTM
        elif data.startswith(b'\x02'):  # STX
            return ProtocolType.ASTM
        else:
            return ProtocolType.ASTM  # Default

    def _encode_response(self, response: str) -> bytes:
        """
        Encode response string to bytes.

        Args:
            response: "ACK" or "NACK"

        Returns: Encoded response bytes
        """
        if response == "ACK":
            return b'\x06'  # ACK character
        elif response == "NACK":
            return b'\x15'  # NAK character
        else:
            return b''

    def __repr__(self):
        return (f"SocketLink(uid={self.uid}, name={self.name}, "
                f"host={self.host}, port={self.port}, type={self.socket_type})")
