from core.uid_gen.snow_flake import Snowflake
from core.uid_gen.sony_flake import SonyFlake


USE_SNOW_FLAKE = True

snow = Snowflake()
sony = SonyFlake()


def get_flake_uid() -> str:
    uid = next(snow).snowflake if USE_SNOW_FLAKE else next(sony).sonyflake
    return str(uid)
