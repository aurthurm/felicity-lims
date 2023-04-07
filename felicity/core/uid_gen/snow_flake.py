import time
from datetime import datetime, timezone


class Snowflake:
    """
    Snowflake.

    Attributes
    ----------
    snowflake : int
        an existing snowflake to parse
    process_id : int
        the process_id ( for multi-processing ), max value is 63
    """

    # Saturday, 1 January 2011 12:00:00 GMT+01:00
    initial_epoch = int(
        datetime(2023, 1, 1, 0, 0, 0, tzinfo=timezone.utc).timestamp() * 1000
    )  # 1672531200000

    def mask(x):
        return -1 ^ (-1 << x)

    def sleep(x):
        return time.sleep(x / 1000)

    def get_timestamp(x):
        return int(time.time() * 1000)

    sequence_bits = 10
    sequence_mask = mask(sequence_bits)

    # Instance are used to avoid conflict if you call this class multiple times in your application
    instance_bits = 6
    instance_mask = mask(instance_bits)
    instance_shift = sequence_bits
    instance_id = 0

    process_bits = 6  # how much a process takes space
    process_mask = mask(process_bits)  # the max value that a process_id can reach
    process_shift = sequence_bits + instance_bits  # how much to shift the bits
    process_id = 0  # should be incremented if you are using multiprocessing

    timestamp_bits = 42
    timestamp_mask = mask(timestamp_bits)
    timestamp_shift = process_bits + sequence_bits + instance_bits
    timestamp = -1

    def __new__(cls, *args, **kwds):
        cls.instance_id = (cls.instance_id + 1) & cls.instance_mask
        return super(Snowflake, cls).__new__(cls)

    def __init__(self, snowflake: int = 0, process_id: int = 0):
        self.instance_id = self.instance_id
        self.sequence = 0
        self.last_timestamp = 0

        self.process_id = process_id
        self.snowflake = snowflake

        if snowflake == 0:
            next(self)

    def __int__(self):
        return self.snowflake

    def __str__(self):
        return f"{self.snowflake}"

    def __repr__(self):
        return f"{self.__class__.__name__}({str(self)})"

    def __next__(self):
        self.snowflake = next(iter(self))
        return self

    def __iter__(self):
        while True:
            timestamp = self.get_timestamp()

            if self.last_timestamp == timestamp:
                timestamp = self.get_timestamp()
                self.sequence = (self.sequence + 1) & self.sequence_mask
            else:
                self.sequence = 0

            self.last_timestamp = timestamp

            b_timestamp = (timestamp - self.initial_epoch) << self.timestamp_shift
            b_process = (self.process_id & self.process_mask) << self.process_shift
            b_instance = (self.instance_id & self.instance_mask) << self.instance_shift
            b_sequence = self.sequence & self.sequence_mask

            yield b_timestamp | b_process | b_instance | b_sequence

    @property
    def timestamp(self):
        """
        Get the timestamp of the current snowflake.
        """
        return float((int(self) >> 22) + self.initial_epoch) / 1000

    @property
    def to_date(self, format="%d-%m-%Y | %H:%M:%S"):
        """
        Get the date of the current snowflake.
        """
        return datetime.fromtimestamp(self.timestamp).strftime(format)

    @property
    def to_binary(self):
        """
        Converts the current snowflake to binary.
        """
        return format(int(self), "08b")

    @property
    def to_hex(self):
        """
        Converts the current snowflake to hexdecimal of 16 chars wide.
        """
        return "%16x" % int(self)


# Usage
# sf = Snowflake()
# flake = next(sf)
# id = flake.snowflake
