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
    SH_MANUAL_ASSIGN = "shipment_manual_assign"
    SH_DISPATCH = "shipment_dispatch"
    SH_RECEIVE = "shipment_receive"
    SHIPPED_REPORT = "shipped_report"
    DIAGNOSTIC_REPORT = "diagnostic_report"


actions = Actions()


class Categories(object):
    SHIPMENT = "shipment"
    WORKSHEET = "worksheet"
    RESULT = "result"
    REPORT = "report"
    IMPRESS = "impress"


categories = Categories()
