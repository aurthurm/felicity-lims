class NotFoundError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class AlreadyExistsError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class NotAllowedError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class GenericError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class MissingDataError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class ValidationError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)
