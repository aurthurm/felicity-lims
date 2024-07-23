import logging

import strawberry  # noqa

from felicity.api.gql.analytics import types
from felicity.apps.analysis.entities.analysis import Sample
from felicity.apps.analytics import SampleAnalyticsInit
from felicity.apps.instrument.entities import Instrument
from felicity.apps.user.entities import User
from felicity.utils import has_value_or_is_truthy

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def group_exists(val):
    if has_value_or_is_truthy(val):
        return str(val)
    return "unknown"


async def get_username(val):
    if val == "unknown":
        return val
    user = await User.get(uid=val)
    return user.auth.user_name


async def get_instrument(val):
    if val == "unknown":
        return val
    instrument = await Instrument.get(uid=val)
    return instrument.name


@strawberry.field
async def count_sample_group_by_status(info) -> types.GroupedCounts:
    analytics = SampleAnalyticsInit(Sample)
    results = await analytics.get_counts_group_by("status")

    stats = []
    for row in results:
        stats.append(types.GroupCount(group=group_exists(row[0]), count=row[1]))

    return types.GroupedCounts(data=stats)
