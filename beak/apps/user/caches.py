import time
from typing import Optional

from beak.apps.user.entities import UserPreference
from beak.apps.user.services import UserPreferenceService
from beak.core.tenant_context import get_current_user_uid

_PREFERENCE_TTL_SECONDS = 300
_PREFERENCES_CACHE: dict[str, tuple[float, UserPreference]] = {}


def invalidate_user_preferences_cache(user_uid: Optional[str]) -> None:
    if not user_uid:
        user_uid = get_current_user_uid()
    if not user_uid:
        return
    _PREFERENCES_CACHE.pop(user_uid, None)


async def get_current_user_preferences(
        user_uid: Optional[str] = None,
) -> Optional[UserPreference]:
    if not user_uid:
        user_uid = get_current_user_uid()
    if not user_uid:
        return None

    now = time.monotonic()
    cached = _PREFERENCES_CACHE.get(user_uid)
    if cached and now - cached[0] < _PREFERENCE_TTL_SECONDS:
        return cached[1]

    preference = await UserPreferenceService().get(
        user_uid=user_uid, related=["departments"]
    )
    if preference:
        _PREFERENCES_CACHE[user_uid] = (now, preference)
    else:
        _PREFERENCES_CACHE.pop(user_uid, None)

    return preference
