from enum import StrEnum  # Python 3.11+


class EventType(StrEnum):
    INSTRUMENT_LOG = 'instrument-log'
    INSTRUMENT_STREAM = 'instrument-stream'


CONNECTED_DISABLE_TIMEOUT = False
