from datetime import datetime

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


def make_tz_aware(unaware: str | datetime):
    if isinstance(unaware, datetime):
        return unaware.replace(tzinfo=settings.TIMEZONE)
    return datetime.strptime(unaware, settings.DATETIME_STR_FORMAT).replace(tzinfo=settings.TIMEZONE)
