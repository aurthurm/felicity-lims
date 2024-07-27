from enum import IntEnum, StrEnum, auto


class SampleState(StrEnum):
    SCHEDULED = auto()  # scheduled for collection
    EXPECTED = auto()  # not yet received in the laboratory
    RECEIVED = auto()  # received in the laboratory and ready for processing
    AWAITING = auto()  # pending approval
    APPROVED = auto()  # authorised for release
    PUBLISHING = auto()  # printed samples, ready for dispatch
    PUBLISHED = auto()  # printed samples, ready for dispatch
    INVALIDATED = auto()  # approval condemnation
    CANCELLED = auto()  # no longer required <in other words deleted>
    REJECTED = auto()  # declined for non conformance reasons
    STORED = auto()  # samples in storage
    REFERRED = auto()  # sample with all analyses referred
    PAIRED = auto()  # samples with some (not all) analysis referred


class ResultState(StrEnum):
    PENDING = auto()  # analytes that are pending results
    SUBMITTING = auto()
    RESULTED = (
        auto()
    )  # analytes that have results but not approved yet. 'to_be_verified' / 'un-authorised'
    RETRACTED = auto()  # analytes with erroneous results for correction
    CANCELLED = auto()  # analytes that are no longer required <in other words deleted>
    APPROVING = auto()
    APPROVED = auto()  # analytes that are authorised/approved
    REFERRED = auto()  # analytes that are referred


class SamplePriority(IntEnum):
    NORMAL = 0
    MEDIUM = 1
    HIGH = 2


class ResultType(StrEnum):
    NUMERIC = auto()  # strict numeric
    SHORT_TEXT = auto()  # short text and numeric
    LONG_TEXT = auto()  # strictly long text
