__version__ = "0.1.4"


class FelicityVersion:
    _version = __version__

    @classmethod
    def version(cls) -> str:
        return cls._version

    @staticmethod
    def get_updates() -> dict:
        """get latest release"""
        return {}

    @staticmethod
    def upgrade() -> dict:
        """get latest changes from github and upgrade"""
        return {}
