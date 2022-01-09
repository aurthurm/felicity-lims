from .utils import classproperty


class NoSessionError(RuntimeError):
    pass


class NoConnectionError(RuntimeError):
    pass


class SessionMixin:
    _session = None
    _connection = None

    @classmethod
    def set_session(cls, session):
        """
        :type session: scoped_session | Session
        """
        cls._session = session

    @classproperty
    def session(cls):
        """
        :rtype: scoped_session | Session
        """
        if cls._session is not None:
            return cls._session
        else:
            raise NoSessionError(
                "Cant get session." "Please, call SaActiveRecord.set_session()"
            )

    @classmethod
    def set_conn_object(cls, connection):
        cls._connection = connection

    @classmethod
    def session_connector(cls):
        if cls._connection is not None:
            return cls._connection
        else:
            raise NoConnectionError(
                "Cant get db connection object."
                "Please, call SaActiveRecord.set_conn_object()"
            )
