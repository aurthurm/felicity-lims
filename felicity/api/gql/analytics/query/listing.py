import logging

import strawberry  # noqa
from strawberry.permission import PermissionExtension

from felicity.api.gql.analytics import types
from felicity.api.gql.permissions import IsAuthenticated, HasPermission
from felicity.apps.analysis.entities.analysis import Sample
from felicity.apps.analytics import EntityAnalyticsInit
from felicity.apps.guard import FAction, FObject
from felicity.apps.instrument.services import InstrumentService
from felicity.apps.user.services import UserService
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
    user = await UserService().get(uid=val)
    return user.auth.user_name


async def get_instrument(val):
    if val == "unknown":
        return val
    instrument = await InstrumentService().get(uid=val)
    return instrument.name


@strawberry.field(
    extensions=[PermissionExtension(
        permissions=[IsAuthenticated(), HasPermission(FAction.READ, FObject.ANALYTICS)]
    )]
)
async def count_sample_group_by_status(info) -> types.GroupedCounts:
    analytics = EntityAnalyticsInit(Sample)
    results = await analytics.get_counts_group_by("status")

    stats = []
    for row in results:
        stats.append(types.GroupCount(group=group_exists(row[0]), count=row[1]))

    return types.GroupedCounts(data=stats)
