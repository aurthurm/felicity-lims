from datetime import datetime, timedelta

from dateutil import parser

from core.config import settings


def get_passed_args(inspection):
    """
    Retrieve user passed function arguments from the current frame from inspect

    :param inspection: current frame arguments
    :return: dict of arguments passed into function
    usage:
        import inspector
        inspector = inspect.getargvalues(inspect.currentframe())
        passed_args = get_passed_args(inspector)
    """
    _args = inspection.args
    _locals = inspection.locals

    kwargs = {}
    if "kwargs" in _locals.keys():
        kwargs = _locals.get("kwargs")
        del _locals["kwargs"]

    if "self" in _args:
        del _locals["self"]

    if "info" in _args:
        del _locals["info"]

    final = {**kwargs, **_locals}
    # [(arg,args.locals[arg]) for arg in args.args]
    return final


def has_value_or_is_truthy(val) -> bool:  # noqa
    if isinstance(val, bool):
        return True

    if not val:
        return False

    if isinstance(val, str):
        if not val.strip():
            return False
    return True


def to_text(val) -> str:  # noqa
    return str(val)


def get_time_now(str_format=True) -> str | datetime:
    if settings.TIMEZONE_AWARE:
        now = datetime.now(settings.TIMEZONE)
    else:
        now = datetime.now()
    if str_format:
        return now.strftime(settings.DATETIME_STR_FORMAT)
    return now


def to_datetime(date_value: str) -> datetime:
    return parser.parse(date_value)


def datetime_math(date_val: str | datetime, days: int, addition=True) -> datetime:
    if isinstance(date_val, str):
        date_val: datetime = to_datetime(date_val)

    if addition:
        return date_val + timedelta(days=days)  # noqa
    else:
        return date_val - timedelta(days=days)  # noqa


def format_datetime(dat_value: str | datetime, human_format=False, with_time=True) -> str:
    if human_format:
        if with_time:
            _format = settings.DATETIME_HUMAN_FORMAT
        else:
            _format = settings.DATE_HUMAN_FORMAT
    else:
        if with_time:
            _format = settings.DATETIME_STR_FORMAT
        else:
            _format = settings.DATE_STR_FORMAT

    if isinstance(dat_value, datetime):
        return dat_value.strftime(_format)

    return to_datetime(dat_value).strftime(_format)


def make_tz_aware(unaware: str | datetime):
    if isinstance(unaware, datetime):
        return unaware.replace(tzinfo=settings.TIMEZONE)
    return datetime.strptime(unaware, settings.DATETIME_STR_FORMAT).replace(tzinfo=settings.TIMEZONE)


def get_from_nested(obj: dict, path: str):
    """
    Traversed a json/dict object tree and returns the required value if exists
    :param obj: dict object to be traversed
    :param path: the paths to find the required value
    :return: Its return the required value
    """
    if not obj:
        return ""
    keys = path.split(".")
    key = keys.pop(0)
    value = obj.get(key)
    if len(keys) == 0:
        return value
    else:
        return get_from_nested(value, ".".join(keys))


def delete_from_nested(obj: dict, path: str):
    """
    Traverses a json/dict object tree and deletes the required value if exists
    :param obj: dict object to be traversed
    :param path: the paths to find the required value
    :return: None
    """
    print(f"cleaning up: {path}")

    if not obj:
        return
    if not path:
        return obj

    keys = path.split(".")
    key = keys.pop(0)
    value = obj.get(key)
    if len(keys) == 0:
        if isinstance(value, list):
            for item in value:
                delete_from_nested(item, ".".join(keys))
        else:
            del obj[key]
    else:
        if isinstance(value, list):
            for item in value:
                delete_from_nested(item, ".".join(keys))
        else:
            delete_from_nested(value, ".".join(keys))


def strtobool(val):
    """Convert a string representation of truth to true (1) or false (0).
    True values are 'y', 'yes', 't', 'true', 'on', and '1'; false values
    are 'n', 'no', 'f', 'false', 'off', and '0'.  Raises ValueError if
    'val' is anything else.
    """
    val = val.lower()
    if val in ("y", "yes", "t", "true", "on", "1"):
        return True
    elif val in ("n", "no", "f", "false", "off", "0"):
        return False
    else:
        raise ValueError("invalid truth value %r" % (val,))


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


def clean_paths(obj: dict) -> dict:
    paths = [
        "profiles.analyses.profiles",
        "analyses.profiles.analyses",
        "analysis_results.analysis.profiles",
    ]
    for _path in paths:
        obj = delete_from_nested(obj, _path)
    return obj


def remove_circular_refs(ob, _seen=None):
    if _seen is None:
        _seen = set()

    if id(ob) in _seen:
        return None
    _seen.add(id(ob))

    res = ob

    if isinstance(ob, dict):
        res = {
            remove_circular_refs(key, _seen): remove_circular_refs(value, _seen)
            for key, value in ob.items()}

    elif isinstance(ob, (list, tuple, set, frozenset)):
        res = type(ob)(remove_circular_refs(v, _seen) for v in ob)

    _seen.remove(id(ob))
    return res
