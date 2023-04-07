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
    WS_MANUAL_ASSIGN = "worksheet_manual_assign"
    WS_UN_ASSIGN = "worksheet_un_assign"
    RESULT_VERIFY = "result_verify"
    RESULT_SUBMIT = "result_submit"
    GENERATE_REPORT = "generate_report"
    IMPRESS_REPORT = "impress_report"


actions = Actions()


class Categories(object):
    WORKSHEET = "worksheet"
    RESULT = "result"
    REPORT = "report"
    IMPRESS = "impress"


categories = Categories()
