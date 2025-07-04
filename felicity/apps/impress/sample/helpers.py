import logging

from felicity.apps.analysis.utils import get_last_verificator
from felicity.apps.common.utils.serializer import marshaller
from felicity.utils.helpers import get_from_nested

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _to_user(user: dict) -> str:
    first_name = get_from_nested(user, "first_name")
    last_name = get_from_nested(user, "last_name")
    user_name = get_from_nested(user, "user_name")
    if first_name: return f"{first_name} {last_name}"
    return user_name


async def get_report_user(sample: dict, field: str = "submitted_by", results: list | None = None) -> str:
    user = get_from_nested(sample, field)
    if user and isinstance(user, dict): return _to_user(user)
    # last resort get from results
    if results:
        if field == "verified_by":
            result_uid = get_from_nested(results[0], "uid")
            user = await get_last_verificator(result_uid)
            user = marshaller(user, depth=1)
        else:
            user = get_from_nested(results[0], field)
        return _to_user(user)
    raise Exception(f"Failed to acquire report user")
