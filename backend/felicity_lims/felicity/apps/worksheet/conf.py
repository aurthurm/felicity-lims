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
    """Worksheet States
    """

    PENDING_ASSIGNMENT = "pending_assignment"  # worksheets without samples
    OPEN = "open"  # worksheets containing at least a single 'pending' analyte
    TO_BE_VERIFIED = (
        "to_be_verified"
    )  # worksheets whose analytes are results but not all approved/verified
    VERIFIED = "verified"  # worksheets where all analytes are approved/verified


worksheet_states = WSStates()
