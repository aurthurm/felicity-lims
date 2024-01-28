from functools import lru_cache
from typing import Any

from felicity.utils.loader import json_from_file


@lru_cache
def load_seed_files() -> dict[str, dict | list]:
    data = dict()
    for _f in ["analysis", "clients", "laboratory", "country"]:
        data[_f] = json_from_file(_f)
    return data


def get_seeds(name: str) -> dict[str, Any] | list:
    return load_seed_files().get(name, None)
