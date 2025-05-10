# -*- coding: utf-8 -*-

class SmsApiException(Exception):

    def __init__(self, message, code=None, *args):
        super(SmsApiException, self).__init__(message, code, *args)

        self.message = message
        self.code = code

    @classmethod
    def from_dict(cls, data):
        message = data.get('message')
        error = data.get('error')

        return cls(message, error)

    def __eq__(self, other):
        return other and self.__dict__ == other.__dict__

    def __hash__(self):
        return hash((self.message, self.code))

    def __repr__(self):
        return "<%s %s>" % (self.__class__.__name__, self.__dict__)

    def __str__(self):
        return "<%s %s>" % (self.__class__.__name__, self.__dict__)


class ClientException(SmsApiException):
    pass


class EndpointException(SmsApiException):

    def __init__(self, message, code=None, *args, **kwargs):
        super(EndpointException, self).__init__(message, code, *args)

        self.url = kwargs.get('url')
        self.http_method = kwargs.get('http_method')
