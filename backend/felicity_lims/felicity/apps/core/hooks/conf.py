class Hook(object):
    class Event:
        CREATE = 1
        UPDATE = 2
        DELETE = 3

    def __init__(self):
        self.events = self.Event()
        self.PLEASE_AUDIT = [self.Event.UPDATE]


hooks = Hook()
