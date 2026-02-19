import logging

from beak.modules.core.analysis.utils import get_last_verificator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _get_user_meta(user: "User") -> dict:
    if not user:
        return {}
    return {
        "username": user.user_name,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }


async def get_report_user(
        sample: "Sample", user_field: str = "submitted_by", results: list["AnalysisResult"] | None = None
) -> "User":
    user = getattr(sample, user_field)
    if user:
        return user
    # last resort get from results
    if not user and results:
        if user_field == "verified_by":
            return await get_last_verificator(results[0].uid)
        else:
            return getattr(results[0], user_field)
    raise Exception("Failed to acquire report user")
