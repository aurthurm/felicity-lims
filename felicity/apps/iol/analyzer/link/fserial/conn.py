import logging
import time
import typing

import serial
from serial.serialutil import to_bytes  # noqa

from felicity.apps.iol.analyzer.conf import EventType
from felicity.apps.iol.analyzer.link.base import AbstractLink
from felicity.apps.iol.analyzer.link.conf import ProtocolType
from felicity.apps.iol.analyzer.link.schema import InstrumentConfig
from felicity.core.events import post_event

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#: Message start token.
STX = '\x02'
#: Message end token.
ETX = '\x03'
#: ASTM session termination token.
EOT = '\x04'
#: ASTM session initialization token.
ENQ = '\x05'
#: Command accepted token.
ACK = '\x06'
#: Command rejected token.
NAK = '\x15'
#: Message chunk end token.
ETB = '\x17'
LF = '\x0A'
CR = '\x0D'
#: CR + LF shortcut.
CRLF = CR + LF

MAPPINGS = {
    STX: "<STX>",
    ETX: "<ETX>",
    EOT: "<EOT>",
    ENQ: "<ENQ>",
    ACK: "<ACK>",
    NAK: "<NAK>",
    ETB: "<ETB>",
    LF: "<LF>",
    CR: "<CR>",
    CRLF: "<CR><LF>"
}


class Message(object):
    """A collection of related information on a single topic, used here to mean
    all the identity, tests, and comments sent at one time. When used with
    Specification E 1394, this term means a record as defined by Specification
    E 1394
    """

    frames = None

    def __init__(self):
        self.frames = []

    def add_frame(self, frame):
        if self.can_add_frame(frame):
            self.frames.append(frame)

    def can_add_frame(self, frame):
        """A frame should be rejected because:
        (1) Any character errors are detected (parity error, framing
            error, etc.),
        (2) The frame checksum does not match the checksum computed on the
            received frame,
        (3) The frame number is not the same as the last accepted frame or one
            number higher (modulo 8).
        """
        if not frame.is_valid():
            return False
        if frame.fn != (len(self.frames) + 1) % 8:
            logger.log("info", "SerialLink: No valid frame: FN is not consecutive")
            return False
        if self.is_complete():
            logger.log("info", "SerialLink: No valid frame: Message is complete")
            return True
        return not self.is_complete()

    def is_complete(self):
        if self.is_empty():
            return False
        return self.frames[-1].is_final

    def is_empty(self):
        return not self.frames

    def is_incomplete(self):
        if self.is_empty():
            return False
        return not self.frames[-1].is_final

    def text(self):
        texts = list(map(lambda frame: frame.text, self.frames))
        return CRLF.join(texts)


class Frame(object):
    """A subdivision of a message, used to allow periodic communication
    housekeeping such as error checks and acknowledgements
    """
    frame = None

    def __init__(self, frame):
        """
        The frame structure is illustrated as follows:
            <STX> FN text <ETB> C1 C2 <CR> <LF>  intermediate frame
            <STX> FN text <ETX> C1 C2 <CR> <LF>  end frame
        where:
            <STX> Start of Text transmission control character
            FN    single digit Frame Number 0 to 7
            text  Data Content of Message
            <ETB> End of Transmission Block transmission control character
            <ETX> 5 End of Text transmission control character
            C1    5 most significant character of checksum 0 to 9 and A to F
            C2    5 least significant character of checksum 0 to 9 and A to F
            <CR> 5 Carriage Return ASCII character
            <LF> 5 Line Feed ASCII character

        Any characters occurring before the <STX> or after the end of the
        block character (the <ETB> or <ETX>) are ignored by the receiver when
        checking the frame.
        """
        if STX in frame:
            self.frame = frame[frame.index(STX):]

    @property
    def fn(self):
        """Frame Number: The frame number permits the receiver to distinguish
        between new and retransmitted frames. It is a single digit sent
        immediately after the <STX> character.
        The frame number is an ASCII digit ranging from 0 to 7. The frame number
        begins at 1 with the first frame of the Transfer phase. The frame number
        is incremented by one for every new frame transmitted. After 7, the
        frame number rolls over to 0, and continues in this fashion.
        """
        return int(self.frame[1])

    @property
    def text(self):
        """Data content of the frame
        """
        end = self.is_intermediate and ETB or ETX
        return self.frame[2:self.frame.index(end)]

    @property
    def is_intermediate(self):
        """A message containing more than 240 characters are sent in
        intermediate frames with the last part of the message sent in an end
        frame. Intermediate frames terminate with the characters <ETB>,
        checksum, <CR> and <LF>
        """
        return ETB in self.frame and self.frame.index(ETB) >= 2

    @property
    def is_final(self):
        """A message containing 240 characters or less is sent in a single end
        frame. End frames terminate with the characters <ETX>, checksum, <CR>
        and <LF>
        """
        return ETX in self.frame and self.frame.index(ETX) >= 2

    @property
    def checksum_characters(self):
        """
        Checksum: The checksum permits the receiver to detect a defective
        frame. The checksum is encoded as two characters which are sent after
        the <ETB> or <ETX> character.
        """
        end = self.is_intermediate and ETB or ETX
        return self.frame[self.frame.index(end) + 1:len(self.frame) - 2]

    def is_valid(self):
        """Returns false if
        (1) Any character errors are detected (parity error, framing
            error, etc.),
        (2) The frame checksum does not match the checksum computed on the
            received frame,
        :return:
        """
        if not self.frame or len(self.frame) < 7:
            logger.log("info", "SerialLink: No valid frame: len < 7")
            return False

        if self.frame[0] != STX:
            logger.log("info", "SerialLink: No valid frame: STX not found")
            return False

        if self.frame[-2:] != CRLF:
            logger.log("info", "SerialLink: No valid frame: CRLF not found")
            return False

        if not self.is_valid_fn():
            return False

        if all([self.is_intermediate, self.is_final]):
            # Both intermediate and final (ETB + ETX)
            logger.log("info", "SerialLink: No valid frame: ETB + ETX")
            return False

        if not any([self.is_intermediate, self.is_final]):
            # Neither intermediate nor final
            logger.log("info", "SerialLink: No valid frame: ETB or ETX is missing")
            return False

        # Leave the checksum check for later
        # return self.is_valid_checksum()
        return True

    def is_valid_fn(self):
        fn = -1
        try:
            fn = self.fn
        except:
            logger.log("info", "SerialLink: No valid frame: FN")
            return False
        if fn < 0:
            logger.log("info", "SerialLink: No valid frame: FN < 0")
            return False
        if fn > 7:
            logger.log("info", "SerialLink: No valid frame: FN > 7")
            return False
        return True

    def has_text(self):
        try:
            return len(self.text) > 0
        except:
            logger.log("info", "SerialLink: No valid frame: No text")
            return False

    def calculate_checksum(self):
        """Checksum: The checksum permits the receiver to detect a defective
        frame. The checksum is encoded as two characters which are sent after
        the <ETB> or <ETX> character. The checksum is computed by adding the
        binary values of the characters, keeping the least significant eight
        bits of the result.

        The checksum is initialized to zero with the <STX> character. The first
        character used in computing the checksum is the frame number. Each
        character in the message text is added to the checksum (modulo 256).
        The computation for the checksum does not include <STX>, the checksum
        characters, or the trailing <CR> and <LF>.

        The checksum is an integer represented by eight bits, it can be
        considered as two groups of four bits. The groups of four bits are
        converted to the ASCII characters of the hexadecimal representation. The
        two ASCII characters are transmitted as the checksum, with the most
        significant character first.

        For example, a checksum of 122 can be represented as 01111010 in binary
        or 7A in hexadecimal. The checksum is transmitted as the ASCII character
        7 followed by the character A.
        """
        end = self.is_intermediate and ETB or ETX
        seed = list(map(ord, self.frame[1:self.frame.index(end) + 1]))
        return hex(sum(seed) & 0xFF)[2:].upper().zfill(2).encode()

    def is_valid_checksum(self):
        try:
            expected = self.calculate_checksum()
            if expected == self.checksum_characters:
                return True
        except:
            pass
        logger.log("info", "SerialLink: No valid frame: checksum")
        return False


class SerialLink(AbstractLink):
    def __init__(self, instrument_config: InstrumentConfig, emit_events=True):
        self.emit_events = emit_events
        # Instrument configuration
        self.uid = instrument_config.uid
        self.name = instrument_config.name
        self.path = instrument_config.path
        self.baudrate = instrument_config.baud_rate
        self.protocol_type: ProtocolType | None = instrument_config.protocol_type
        self.auto_reconnect: bool = instrument_config.auto_reconnect
        self.is_active: bool = instrument_config.is_active
        # base
        self._received_messages: list = []
        self.establishment = False
        self.messages = None
        self.response: typing.Any = None

    def start_server(self, trials=1):
        """Start serial server"""
        if not self.is_active:
            logger.log("info", f"SerialLink: Instrument {self.name} is deactivated. Cannot start server.")
            time.sleep(60)
            return
        logger.log("info", "SerialLink: Starting serial server ...")

        if self.emit_events:
            post_event(EventType.INSTRUMENT_STREAM, **{
                'id': self.uid,
                'connection': "connecting",
                'trasmission': "",
            })

        try:
            with serial.Serial(self.path, self.baudrate, timeout=2) as ser:
                logger.log('info', f"SerialLink: Listening on path {self.path}.")

                if self.emit_events:
                    post_event(EventType.INSTRUMENT_STREAM, **{
                        'id': self.uid,
                        'connection': "connected",
                        'trasmission': "",
                    })
                while True:
                    # read until a new line is found
                    line = ser.readline().decode(encoding="utf-8")
                    if line:
                        # Is this a new session?
                        if not self.is_open():
                            self.open()

                        # Process the new message line
                        self.process(line)

                        # Does the receiver has to send something back?
                        response = self.get_response()
                        if response:
                            if isinstance(response, str):
                                # convert to bytes
                                response = response.encode()
                            socket = serial.Serial(self.path, self.baudrate, timeout=10)
                            socket.write(to_bytes(response))
        except serial.SerialException as e:
            logger.log("info", f"SerialLink: SerialException: {e}")
        except UnicodeDecodeError as e:
            logger.log("info", f"SerialLink: UnicodeDecodeError: {e}")
        except Exception as e:
            logger.log("info", f"SerialLink: An unexpected error occured: {e}")
        finally:
            if self.emit_events:
                post_event(EventType.INSTRUMENT_STREAM, **{
                    'id': self.uid,
                    'connection': "disconnected",
                    'trasmission': "",
                })
            if self.auto_reconnect and trials <= 5:
                logger.log("info", f"SerialLink: Reconnecting ... trial: {trials}")
                trials += 1
                time.sleep(5)
                self.start_server(trials)

    @property
    def current_message(self):
        return self.messages and self.messages[-1] or Message()

    def is_open(self):
        return self.messages is not None

    def is_busy(self):
        return self.response is not None

    def open(self):
        logger.log("info", "SerialLink: Opening session")
        self.messages = []
        self.response = None
        self.establishment = False
        if self.emit_events:
            post_event(EventType.INSTRUMENT_STREAM, **{
                'id': self.uid,
                'connection': "connected",
                'trasmission': "started",
            })

    def close(self):
        logger.log("info", "SerialLink: Closing session: neutral state")
        self.messages = None
        self.establishment = False
        self._received_messages = list()
        if self.emit_events:
            post_event(EventType.INSTRUMENT_STREAM, **{
                'id': self.uid,
                'connection': "connected",
                'trasmission': "ended",
            })

    def to_str(self, command):
        if not command:
            return "EMPTY"

        if len(command) > 1:
            items = list(filter(None, list(command)))
            items = "".join(list(map(self.to_str, items)))
            return items

        if command in MAPPINGS:
            return MAPPINGS[command]

        return command

    def process(self, line: str):
        logger.log("info", f"SerialLink: -> {self.to_str(line)}")
        if line == ENQ:
            # Initiate establishment phase
            self.handle_enq()
            return

        if self.establishment:
            # Establishment phase has been initiated already and we are now in
            # Transfer phase
            if STX in line:
                self.handle_frame(line)
                return

            elif EOT in line:
                # Received an End Of Transmission. Resume and enter to neutral
                # state
                self.handle_eot()
                return

            else:
                logger.log("info", "SerialLink:  No valid message. No <STX> or <EOT> received")
        else:
            logger.log("info", "SerialLink: Establishment phase not initiated")
            # Sysmex KX21N - Grab message here -
            # <STX>D1U2510220000000000051000000S011900377001010030900820202680032700299001860008400730000220001000087004920010100085201490<ETX>
            _data = self.to_str(line)
            if _data.startswith('<STX>') and _data.endswith('<ETX>'):
                logger.log("info", f"SerialLink: KX21 data obtained -> {_data}")
                self.eot_offload(self.uid, _data)

        self.response = NAK

    def handle_enq(self):
        logger.log("debug", "SerialLink: Initiating Establishment Phase ...")
        if self.is_busy():
            """
            A receiver that cannot immediately receive information, replies with
            the <NAK> transmission control character. Upon receiving <NAK>, the 
            sender must wait at least 10 s before transmitting another <ENQ>
            """
            logger.log("info", "SerialLink: Receiver is busy")
            self.response = NAK
        else:
            """
            The system with information available initiates the establishment 
            phase. After the sender determines the data link is in a neutral 
            state, it transmits the <ENQ> transmission control character to the 
            intended receiver. Sender will ignore all responses other than 
            <ACK>, <NAK>, or <ENQ>.
            """
            logger.log("info", "SerialLink: Ready for Transfer Phase ...")
            self.establishment = True
            self.response = ACK

    def handle_frame(self, frame_string):
        """
        The receiver replies to each frame. When it is ready to receive the
        next frame, it transmits one of three replies to acknowledge the last
        frame. This reply must be transmitted within the timeout period of 15s

        A reply of <NAK> signifies the last frame was not successfully received
        and the receiver is prepared to receive the frame again

        A reply of <ACK> signifies the last frame was received successfully and
        the receiver is prepared to receive another frame. The sender must
        increment the frame number and either send a new frame or terminate.

        A receiver checks every frame to guarantee it is valid. A reply of
        <NAK> is transmitted for invalid frames. Upon receiving the <NAK>, the
        sender retransmits the last frame with the same frame number. In this
        way, transmission errors are detected and automatically corrected.
        """
        # Not successfully received or wrong. Reply <NAK>
        frame = Frame(frame_string)
        if not frame.is_valid():
            self.response = NAK
            return

        message = self.current_message
        if not message.can_add_frame(frame):
            logger.log("info", "SerialLink: Cannot add frame to message")
            self.response = NAK
            return

        # Successfully received. Reply <ACK>
        logger.log("debug", "SerialLink: Frame accepted")
        message.add_frame(frame)

        self.messages.append(message)
        if message.is_complete():
            logger.log("info", "SerialLink: Message completed: show message")
            self.show_message(message)
        else:
            logger.log("info", "SerialLink: Waiting for a new frame ...")

        self.response = ACK

    def get_response(self):
        if self.response:
            logger.log("debug", f"SerialLink: <- {self.to_str(self.response)}")
        resp = self.response
        self.response = None
        return resp

    def handle_eot(self):
        """Handles an End Of Transmission message
        """
        logger.log("info", "SerialLink: Transfer phase completed : handle_eot")
        message = self.current_message
        if (message and message.is_complete()) or not self._received_messages:
            self.show_message(message)
            # else:
            self.eot_offload(self.uid, message.text())

        # Go to neutral state
        self.response = None
        self.close()

    def show_message(self, message):
        super(SerialLink, self).show_message(message.text())
        if message and message.text():
            self._received_messages.append(message.text())
