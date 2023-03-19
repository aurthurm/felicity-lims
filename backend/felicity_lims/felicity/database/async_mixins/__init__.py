# low-level, tiny mixins. you will rarely want to use them in real world
# high-level mixins
from .activerecord import ActiveRecordMixin, ModelNotFoundError
from .eagerload import JOINED, SUBQUERY, EagerLoadMixin
from .inspection import InspectionMixin
from .repr import ReprMixin
from .serialize import SerializeMixin
from .session import SessionMixin
from .smartquery import SmartQueryMixin, smart_query
from .timestamp import TimestampsMixin


# all features combined to one mixin
class AllFeaturesMixin(ActiveRecordMixin, SmartQueryMixin, ReprMixin, SerializeMixin):
    __abstract__ = True
    __repr__ = ReprMixin.__repr__
