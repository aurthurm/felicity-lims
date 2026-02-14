import os
from typing import Any


def getenv_boolean(var_name: Any, default_value: bool = False) -> bool:
    result = default_value
    env_value = os.getenv(var_name)
    if env_value is not None:
        result = env_value.upper() in ("TRUE", "1")
    return result


def getenv_value(value: Any, default_value: Any = None) -> Any:
    env_value = os.getenv(value)
    if env_value is None:
        env_value = default_value
    return env_value
