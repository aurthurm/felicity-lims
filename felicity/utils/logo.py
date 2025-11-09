from functools import lru_cache
from pathlib import Path

from felicity.core.config import settings


@lru_cache(maxsize=1)
def get_logo_path() -> str:
    user_logo = Path(settings.BASE_DIR) / "assets" / "custom" / "logo.png"
    if user_logo.exists():
        return str(user_logo)
    return str(Path(settings.BASE_DIR) / "assets" / "logo.png")
