from functools import lru_cache

from felicity.core.config import settings
from felicity.utils.loader import json_from_file


@lru_cache
def load_seed_files() -> dict:
    data = dict()
    for _f in [
        "analyses",
        "clients",
        "laboratory",
        "country",
        "inventory",
        "instrument",
        "person",
    ]:
        data[_f] = json_from_file(f"{settings.SEEDS_DIR}/{_f}")
    return data


def get_seeds(name: str) -> dict | None:
    return load_seed_files().get(name)
