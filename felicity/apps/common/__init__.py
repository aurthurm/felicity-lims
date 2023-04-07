from .sqlalchemy_mptt import BaseNestedSets


class BaseMPTT(BaseNestedSets):
    abstract = True

    @classmethod
    def get_pk_name(cls):
        """override get_pk_name to use uid instead of id"""
        return getattr(cls, "sqlalchemy_mptt_pk_name", "uid")
