from enum import StrEnum, auto


class WorkSheetLayout(StrEnum):
    """Worksheet Types

    FLAT: Single Column, can be displayed as Multi Column when needed
    GRID: Multi Column: Specific Rows and Columns
    """

    FLAT = auto()
    GRID = auto()


class WorkSheetState(StrEnum):
    """Worksheet Workflow States
    empty -> pending -> submitting -> awaiting -> approving -> approved
    """

    EMPTY = auto()  # worksheets without samples
    PENDING = auto()  # worksheets containing at least a single 'pending' analyte
    SUBMITTING = auto()
    AWAITING = (
        auto()
    )  # worksheets whose analytes are results but not all approved/verified
    APPROVING = auto()
    APPROVED = auto()  # worksheets where all analytes are approved/verified
