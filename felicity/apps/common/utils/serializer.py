from datetime import datetime
from felicity.core.dtz import format_datetime


def marshaller(obj, path=None, memoize=None, exclude: list[str] = None) -> dict | str:
    """Notes:
    1. We use memoization To prevent marshalling the same object again hence speed things up
    2. We use path tracking To stop marshalling when a path starts to repeat itself or meets a certain path restriction
    """
    if memoize is None:
        memoize = {}

    if path is None:
        path = []

    if id(obj) in memoize:
        return memoize[id(obj)]

    if not hasattr(obj, "__dict__"):
        if obj is None:
            return ""
        if isinstance(obj, datetime):
            return format_datetime(obj, human_format=False, with_time=True)
        if hasattr(obj, "__str__"):
            return obj.__str__()
        return obj

    result = {}
    for key, val in obj.__dict__.items():
        if (key.startswith("_") or key in exclude) or (path and path[-1] == key):
            continue

        element = []
        if isinstance(val, list):
            for item in val:
                element.append(marshaller(item, path + [key], memoize, exclude))
        else:
            element = marshaller(val, path + [key], memoize, exclude)
        result[key] = element

        memoize[id(obj)] = result
    return result