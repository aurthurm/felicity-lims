from functools import lru_cache

import pandas as pd

from felicity.core.config import settings
from felicity.utils.loader import json_from_file


@lru_cache
def load_seed_files() -> dict:
    data = dict()
    for _f in [
        "analyses",
        "clients",
        "organization",
        "country",
        "inventory",
        "instrument",
        "person",
    ]:
        data[_f] = json_from_file(f"{settings.SEEDS_DIR}/{_f}")
    return data


def get_seeds(name: str) -> dict | None:
    return load_seed_files().get(name)


# AMR
@lru_cache
def load_whonet_dataframes() -> dict:
    data = dict()
    for _f in [
        "Antibiotics",
        "Breakpoints",
        "ExpectedResistancePhenotypes",
        "ExpertInterpretationRules",
        "Organisms",
        "QCRanges",
        "Serotype",
    ]:
        data[_f] = pd.read_csv(f"{settings.SEEDS_DIR}/whonet/{_f}.txt", delimiter="\t", low_memory=False)
    return data


def get_whonet_dataframes(name: str) -> dict | None:
    return load_whonet_dataframes().get(name)
