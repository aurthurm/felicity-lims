__version__ = "0.1.0"


class FelicityVersion:
    _version = __version__

    @classmethod
    def version(cls):
        return cls._version

    @staticmethod
    def get_updates():
        """get latest release"""
        return {}

    @staticmethod
    def upgrade():
        """get latest changes from github and upgrade"""
        return {}
