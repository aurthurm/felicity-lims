from sqlalchemy import String
import strawberry
from typing import NewType
from felicity.core.uid_gen.snow_flake import Snowflake
from felicity.core.uid_gen.sony_flake import SonyFlake

# For sqlalchemy tables
FelicitySAID = String

# For Graphql
FelicityID = strawberry.scalar(
    NewType("FelicityID", strawberry.ID),
    serialize=lambda v: str(v),
    parse_value=lambda v: str(v),
)

# For Pydantic
FelicityIDType = str


#######################################################
USE_SNOW_FLAKE = True

snow = Snowflake()
sony = SonyFlake()


def get_flake_uid() -> str:
    uid = next(snow).snowflake if USE_SNOW_FLAKE else next(sony).sonyflake
    return str(uid)
