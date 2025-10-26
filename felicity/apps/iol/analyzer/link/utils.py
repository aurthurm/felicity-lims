# -*- coding: utf-8 -*-

import os
import platform
import socket
import time
from datetime import datetime
from itertools import zip_longest
from pathlib import Path

from felicity.apps.iol.analyzer.link.conf import ASTMConstants


def has_special_char(order_id):
    special_chars = list("~`!@#$%^&*()+=[]{}\\|;:'\",.<>/?")
    for char in order_id:
        if char in special_chars and char != "-":
            return True
    return False


def set_keepalive_linux(sock, after_idle_sec, interval_sec, max_fails):
    """Set TCP keepalive on an open socket.

    It activates after 1 second (after_idle_sec) of idleness,
    then sends a keepalive ping once every 3 seconds (interval_sec),
    and closes the connection after 5 failed ping (max_fails), or 15 seconds
    """
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
    sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_KEEPIDLE, after_idle_sec)
    sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_KEEPINTVL, interval_sec)
    sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_KEEPCNT, max_fails)


def set_keepalive_osx(sock, after_idle_sec, interval_sec, max_fails):
    """Set TCP keepalive on an open socket.

    sends a keepalive ping once every 3 seconds (interval_sec)
    """
    # scraped from /usr/include, not exported by python's socket module
    TCP_KEEPALIVE = 0x10
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
    sock.setsockopt(socket.IPPROTO_TCP, TCP_KEEPALIVE, interval_sec)


def set_keepalive_win(sock, after_idle_sec, interval_sec, max_fails):
    sock.ioctl(socket.SIO_KEEPALIVE_VALS, (1, after_idle_sec * 1000, interval_sec * 1000))


def set_keep_alive(sock, after_idle_sec=60, interval_sec=60, max_fails=5):
    plat = platform.system()
    if plat == 'Linux':
        return set_keepalive_linux(sock, after_idle_sec, interval_sec, max_fails)
    if plat == 'Darwin':
        return set_keepalive_osx(sock, after_idle_sec, interval_sec, max_fails)
    if plat == 'Windows':
        return set_keepalive_win(sock, after_idle_sec, interval_sec, max_fails)
    raise RuntimeError('Unsupport platform {}'.format(plat))


def u(s):
    if isinstance(s, bytes):
        return s.decode("utf-8")
    return s


def f(s, e="utf-8", **kw):
    return u(s).format(STX=u(ASTMConstants.STX),
                       ETX=u(ASTMConstants.ETX),
                       ETB=u(ASTMConstants.ETB),
                       CR=u(ASTMConstants.CR),
                       LF=u(ASTMConstants.LF),
                       CRLF=u(ASTMConstants.CRLF), **kw).encode(e)


def write_message(message, path, dateformat="%Y-%m-%d_%H:%M:%S", ext=".txt"):
    """Write ASTM Message to file
    """
    path = Path(path)
    if not path.exists():
        # ensure the directory exists
        path.mkdir(parents=True, exist_ok=True)
    now = datetime.now()
    timestamp = now.strftime(dateformat)
    filename = "{}{}".format(timestamp, ext)
    # ensure we have a bytes type message
    if isinstance(message, str):
        message = bytes(message, "utf-8")
    with open(os.path.join(path, filename), "wb") as f:
        f.write(message)


def is_chunked_message(message):
    """Checks plain message for chunked byte with enhanced validation.
    """
    if not isinstance(message, bytes):
        return False

    length = len(message)
    if length < 5:
        return False

    # Check for proper ASTM frame structure (STX at start)
    if not message.startswith(ASTMConstants.STX):
        return False

    # Check for ETB (chunked) vs ETX (final)
    if ASTMConstants.ETB not in message:
        return False

    # ETB should be at position length - 5 (before checksum and CRLF)
    if message.index(ASTMConstants.ETB) != length - 5:
        return False

    # Validate frame number (should be digit 0-7)
    if length < 3 or not message[1:2].isdigit():
        return False

    frame_num = int(message[1:2])
    if frame_num < 0 or frame_num > 7:
        return False

    return True


def make_checksum(message):
    """Calculates checksum for specified message.

    :param message: ASTM message.
    :type message: bytes

    :returns: Checksum value that is actually byte sized integer in hex base
    :rtype: bytes
    """
    if not isinstance(message[0], int):
        message = map(ord, message)
    return hex(sum(message) & 0xFF)[2:].upper().zfill(2).encode()


def validate_checksum(message):
    """Validate the checksum of the message with enhanced validation

    :param message: The received message (line) of the instrument
                    containing the STX at the beginning and the checksum at
                    the end.
    :returns: True if the received message is valid, False otherwise.
    """
    try:
        if not isinstance(message, bytes):
            return False

        # Basic structure validation
        if len(message) < 5:  # Minimum: STX + frame + ETX/ETB + checksum + CRLF
            return False

        # Check for proper ASTM frame structure
        if not message.startswith(ASTMConstants.STX):
            return False

        # Check for proper ending (should end with CRLF)
        if not message.endswith(ASTMConstants.CRLF):
            return False

        # Remove any trailing newlines at the end of the message
        message = message.rstrip(ASTMConstants.CRLF)

        # Validate minimum length after stripping
        if len(message) < 3:
            return False

        # Get the frame w/o STX and checksum
        frame = message[1:-2]

        # Validate frame has content
        if len(frame) < 1:
            return False

        # Check if the checksum matches
        # NOTE: hex numbers are not case sensitive, i.e. B0 is equal to b0.
        cs = message[-2:].upper()

        # Validate checksum format (should be 2 hex digits)
        if len(cs) != 2:
            return False

        try:
            int(cs, 16)  # Validate it's valid hex
        except ValueError:
            return False

        # Generate the checksum for the frame
        ccs = make_checksum(frame)

        if cs != ccs:
            print("Expected checksum '%s', got '%s'" % (cs, ccs))
            return False

        return True

    except Exception as e:
        print(f"Checksum validation error: {e}")
        return False


def split_message(message):
    """Split the message into sequence, message and checksum with enhanced validation

    :param message: ASTM message
    :returns: Tuple of sequence, message and checksum
    :raises: ValueError if message format is invalid
    """
    if not isinstance(message, bytes):
        raise ValueError("Message must be bytes")

    # Basic structure validation
    if len(message) < 5:
        raise ValueError("Message too short")

    # Check for proper ASTM frame structure
    if not message.startswith(ASTMConstants.STX):
        raise ValueError("Message doesn't start with STX")

    # Remove any trailing newlines at the end of the message
    message = message.rstrip(ASTMConstants.CRLF)

    # Validate minimum length after stripping
    if len(message) < 3:
        raise ValueError("Message too short after stripping CRLF")

    # Remove the STX at the beginning and the checksum at the end
    frame = message[1:-2]

    # Validate frame has content
    if len(frame) < 1:
        raise ValueError("Frame has no content")

    # Get the checksum
    cs = message[-2:]

    # Validate checksum format
    if len(cs) != 2:
        raise ValueError("Invalid checksum length")

    try:
        int(cs, 16)  # Validate it's valid hex
    except ValueError:
        raise ValueError("Invalid checksum format - not hex")

    # Get the sequence
    seq = frame[:1]
    if not seq.isdigit():
        raise ValueError("Invalid frame sequence: {}".format(repr(seq)))

    seq_num = int(seq)
    if seq_num < 0 or seq_num > 7:
        raise ValueError("Frame sequence out of range (0-7): {}".format(seq_num))

    msg = frame[1:]
    return seq_num, msg, cs


def join(chunks):
    """Merges ASTM message `chunks` into single message with enhanced validation.

    :param chunks: List of chunks as `bytes`.
    :type chunks: iterable
    :raises: ValueError if chunks are invalid
    """
    if not chunks:
        raise ValueError("No chunks provided")

    if not isinstance(chunks, (list, tuple)):
        raise ValueError("Chunks must be a list or tuple")

    # Validate all chunks are bytes and have proper structure
    for i, chunk in enumerate(chunks):
        if not isinstance(chunk, bytes):
            raise ValueError(f"Chunk {i} is not bytes")

        if len(chunk) < 5:
            raise ValueError(f"Chunk {i} too short")

        if not chunk.startswith(ASTMConstants.STX):
            raise ValueError(f"Chunk {i} doesn't start with STX")

        # Validate chunk checksum
        if not validate_checksum(chunk):
            raise ValueError(f"Chunk {i} has invalid checksum")

    # Extract message content from each chunk (remove STX, frame#, ETX/ETB, checksum, CRLF)
    try:
        msg = b"1" + b"".join(c[2:-5] for c in chunks) + ASTMConstants.ETX
        return b"".join([ASTMConstants.STX, msg, make_checksum(msg), ASTMConstants.CRLF])
    except Exception as e:
        raise ValueError(f"Error joining chunks: {e}")


def split(msg, size):
    """Split `msg` into chunks with specified `size`.

    Chunk `size` value couldn't be less then 7 since each chunk goes with at
    least 7 special characters: STX, frame number, ETX or ETB, checksum and
    message terminator.

    :param msg: ASTM message.
    :type msg: bytes

    :param size: Chunk size in bytes.
    :type size: int

    :yield: `bytes`
    """
    stx, frame, msg, tail = msg[:1], msg[1:2], msg[2:-6], msg[-6:]
    assert stx == ASTMConstants.STX
    assert frame.isdigit()
    assert tail.endswith(ASTMConstants.CRLF)
    assert size is not None and size >= 7
    frame = int(frame)
    chunks = make_chunks(msg, size - 7)
    chunks, last = chunks[:-1], chunks[-1]
    idx = 0
    for idx, chunk in enumerate(chunks):
        item = b"".join([str((idx + frame) % 8).encode(), chunk, ASTMConstants.ETB])
        yield b"".join([ASTMConstants.STX, item, make_checksum(item), ASTMConstants.CRLF])
    item = b"".join([str((idx + frame + 1) % 8).encode(), last, ASTMConstants.CR, ASTMConstants.ETX])
    yield b"".join([ASTMConstants.STX, item, make_checksum(item), ASTMConstants.CRLF])


def make_chunks(s, n):
    iter_bytes = (s[i:i + 1] for i in range(len(s)))
    return [b''.join(item)
            for item in zip_longest(*[iter_bytes] * n, fillvalue=b'')]


class CleanupDict(dict):
    """A dict that automatically cleans up items that haven't been
    accessed in a given timespan on *set*.
    """

    cleanup_period = 60 * 5  # 5 minutes

    def __init__(self, cleanup_period=None):
        super(CleanupDict, self).__init__()
        self._last_access = {}
        if cleanup_period is not None:
            self.cleanup_period = cleanup_period

    def __getitem__(self, key):
        value = super(CleanupDict, self).__getitem__(key)
        self._last_access[key] = time.time()
        return value

    def __setitem__(self, key, value):
        super(CleanupDict, self).__setitem__(key, value)
        self._last_access[key] = time.time()
        self._cleanup()

    def _cleanup(self):
        now = time.time()
        okay = now - self.cleanup_period
        for key, timestamp in list(self._last_access.items()):
            if timestamp < okay:
                del self._last_access[key]
                super(CleanupDict, self).__delitem__(key)
