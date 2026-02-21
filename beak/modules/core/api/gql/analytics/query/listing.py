import logging

import strawberry  # noqa
from strawberry.permission import PermissionExtension

from beak.modules.core.api.gql.analytics import types
from beak.modules.shared.api.gql.permissions import IsAuthenticated, HasPermission
from beak.modules.core.analysis.entities.analysis import Sample
from beak.modules.core.analytics import EntityAnalyticsInit
from beak.modules.core.guard import FAction, FObject
from beak.modules.core.instrument.services import InstrumentService
from beak.modules.core.identity.services import UserService
from beak.utils import has_value_or_is_truthy

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
    extensions=[
        PermissionExtension(
            permissions=[
                IsAuthenticated(),
                HasPermission(FAction.READ, FObject.ANALYTICS),
            ]
        )
    ]
)
async def count_sample_group_by_status(info) -> types.GroupedCounts:
    analytics = EntityAnalyticsInit(Sample)
    results = await analytics.get_counts_group_by("status")

    stats = []
    for row in results:
        stats.append(types.GroupCount(group=group_exists(row[0]), count=row[1]))

    return types.GroupedCounts(data=stats)
