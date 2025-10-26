from enum import StrEnum


class NotConnectedException(Exception):
    pass


class ConnectionType(StrEnum):
    SERIAL = 'serial'
    TCPIP = 'tcpip'


class SocketType(StrEnum):
    CLIENT = 'client'
    SERVER = 'server'


class ProtocolType(StrEnum):
    HL7 = 'hl7'
    ASTM = 'astm'


class ConnectionStatus(StrEnum):
    OPEN = 'open'
    CONNECTED = 'connected'
    DISCONNECTED = 'disconnected'
    CONNECTING = 'connecting'
    DISCONNECTING = 'disconnecting'


class TransmissionStatus(StrEnum):
    STARTED = 'started'
    ENDED = 'ended'


class ASTMConstants:
    #: ASTM specification base encoding.
    ENCODING = "latin-1"

    #: Message start token.
    STX = b"\x02"
    #: Message end token.
    ETX = b"\x03"
    #: ASTM session termination token.
    EOT = b"\x04"
    #: ASTM session initialization token.
    ENQ = b"\x05"
    #: Command accepted token.
    ACK = b"\x06"
    #: Command rejected token.
    NAK = b"\x15"
    #: Message chunk end token.
    ETB = b"\x17"
    LF = b"\x0A"
    CR = b"\x0D"
    #: CR + LF shortcut.
    CRLF = CR + LF

    #: Message records delimiter.
    RECORD_SEP = b"\x0D"  # \r #
    #: Record fields delimiter.
    FIELD_SEP = b"\x7C"  # |  #
    #: Delimeter for repeated fields.
    REPEAT_SEP = b"\x5C"  # \  #
    #: Field components delimiter.
    COMPONENT_SEP = b"\x5E"  # ^  #
    #: Date escape token.
    ESCAPE_SEP = b"\x26"  # &  #


class HL7Constants:
    SB = b"\x0b"
    EB = b"\x1c"
    CR = b"\x0d"
    FF = b"\x0c"
