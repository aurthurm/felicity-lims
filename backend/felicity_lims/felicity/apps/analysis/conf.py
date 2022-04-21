"""Analysis Configs
This file is part of Felicity LIMS Software
"""


class States:
    class Sample:
        DUE = "due"  # registered but not yet received in the laboratory for processing
        RECEIVED = (
            "received"
        )  # samples received in the laboratory and ready for processing
        TO_BE_VERIFIED = "to_be_verified"  # 'un-authorised'
        VERIFIED = "verified"  # samples that are authorised for release
        PUBLISHED = "published"  # printed samples
        INVALIDATED = "invalidated"  # once verified samples with erroneous results
        CANCELLED = (
            "cancelled"
        )  # samples that are no longer required <in other words deleted>
        REJECTED = "rejected"  # samples rejected for no conformance reasons
        PROCESSING = "processing"

    class Result:
        PENDING = "pending"  # analytes that are pending results
        RESULTED = (
            "resulted"
        )  # analytes that have results but not approved yet. 'to_be_verified' / 'un-authorised'
        RETRACTED = "retracted"  # analytes with erroneous results for correction
        CANCELLED = (
            "cancelled"
        )  # analytes that are no longer required <in other words deleted>
        VERIFIED = "verified"  # analytes that are authorised/approved

    def __init__(self):
        self.sample = self.Sample()
        self.result = self.Result()


states = States()


class Priorities(object):
    class Sample:
        NORMAL = 0
        HIGH = 1

    def __init__(self):
        self.sample = self.Sample()


priorities = Priorities()
