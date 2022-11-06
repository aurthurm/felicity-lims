"""Analysis Configs
This file is part of Felicity LIMS Software
"""


class States:
    class Sample:
        SCHEDULED = "scheduled"  # scheduled for collection
        EXPECTED = "expected"  # not yet received in the laboratory
        RECEIVED = "received"  # received in the laboratory and ready for processing
        AWAITING = "awaiting"  # pending approval
        APPROVED = "approved"  # authorised for release
        PUBLISHED = "published"  # printed samples, ready for dispatch
        INVALIDATED = "invalidated"  # approval condemnation
        CANCELLED = "cancelled"  # no longer required <in other words deleted>
        REJECTED = "rejected"  # declined for non conformance reasons

    class Result:
        PENDING = "pending"  # analytes that are pending results
        RESULTED = (
            "resulted"
        )  # analytes that have results but not approved yet. 'to_be_verified' / 'un-authorised'
        RETRACTED = "retracted"  # analytes with erroneous results for correction
        CANCELLED = (
            "cancelled"
        )  # analytes that are no longer required <in other words deleted>
        APPROVED = "approved"  # analytes that are authorised/approved

    def __init__(self):
        self.sample = self.Sample()
        self.result = self.Result()


states = States()


class Priorities(object):
    class Sample:
        NORMAL = 0
        MEDIUM = 1
        HIGH = 2

    def __init__(self):
        self.sample = self.Sample()


priorities = Priorities()
