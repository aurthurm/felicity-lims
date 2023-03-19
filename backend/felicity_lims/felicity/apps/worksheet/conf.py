"""Worksheet Configs
This file is part of Felicity LIMS Software
"""


class WSTypes(object):
    """Worksheet Types

    FLAT: Single Column, can be displayed as Multi Column when needed
    GRID: Multi Column: Specific Rows and Columns
    """

    FLAT = 0
    GRID = 1


worksheet_types = WSTypes()


class WSStates(object):
    """Worksheet Workflow States
    empty -> pending -> submitting -> awaiting -> approving -> approved
    """

    EMPTY = "empty"  # worksheets without samples
    PENDING = "pending"  # worksheets containing at least a single 'pending' analyte
    SUBMITTING = "submitting"
    AWAITING = "awaiting"  # worksheets whose analytes are results but not all approved/verified
    APPROVING = "approving"
    APPROVED = "approved"  # worksheets where all analytes are approved/verified


worksheet_states = WSStates()
