from datetime import datetime
from enum import Enum


# from felicity.core.dtz import format_datetime


def marshaller(
        obj, path=None, memoize=None, exclude: list[str] = None, depth=2
) -> dict | str:
    """
    Custom marshaller function to convert objects to dictionaries or strings with proper handling for
    StrEnum, datetime, and other custom objects.
    """
    if memoize is None:
        memoize = {}

    if path is None:
        path = []

    if exclude is None:
        exclude = []

    if id(obj) in memoize:
        return memoize[id(obj)]

    # Handling non-dict objects a.k.a values
    if not (hasattr(obj, "__dict__") or isinstance(obj, dict)):
        if obj is None:
            return ""
        elif isinstance(obj, datetime):
            return obj.isoformat()  # format_datetime(obj, human_format=False, with_time=True)
        elif hasattr(obj, "__str__"):
            return obj.__str__()  # Convert other objects to their string representation
        else:
            return obj

    # Handling dict and objects with __dict__
    if isinstance(obj, Enum):  # enums are dicts
        return obj.value  # Convert StrEnum to its value

    if depth <= 0:
        return {}

    items = obj.__dict__.items() if hasattr(obj, "__dict__") else obj.items()
    result = {}

    for key, val in items:
        if (key.startswith("_") or key in exclude) or (path and path[-1] == key):
            continue

        # Process lists and other values
        if isinstance(val, list):
            result[key] = [
                marshaller(item, path + [key], memoize, exclude, depth - 1) for item in val
            ]
        else:
            result[key] = marshaller(val, path + [key], memoize, exclude, depth - 1)

    memoize[id(obj)] = result
    return result
