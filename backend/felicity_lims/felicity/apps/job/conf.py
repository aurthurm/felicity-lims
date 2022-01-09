"""Job Configs
This file is part of Felicity LIMS Software
"""


class States:
    PENDING = "pending"
    RUNNING = "running"
    FAILED = "failed"
    FINISHED = "finished"


states = States()


class Priorities(object):
    NORMAL = 0
    MEDIUM = 1
    HIGH = 2


priorities = Priorities()


class Actions(object):
    WS_ASSIGN = "worksheet_assign"
    WS_VERIFY = "worksheet_verify"
    WS_SUBMIT = "worksheet_submit"
    WS_UN_ASSIGN = "worksheet_un_assign"


actions = Actions()


class Categories(object):
    WORKSHEET = "worksheet"


categories = Categories()
