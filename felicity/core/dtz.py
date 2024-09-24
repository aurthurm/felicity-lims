from datetime import datetime, timedelta

from dateutil import parser

from felicity.core.config import get_settings

settings = get_settings()


def __timenow() -> datetime:
    if settings.TIMEZONE_AWARE:
        now = datetime.now(settings.TIMEZONE)
    else:
        now = datetime.now()
    return now


def timenow_str() -> str:
    return __timenow().strftime(format=settings.DATETIME_STR_FORMAT)


def timenow_dt() -> datetime:
    return datetime.strptime(timenow_str(), settings.DATETIME_STR_FORMAT)


def to_datetime(date_value: str) -> datetime:
    return parser.parse(date_value)


def datetime_math(date_val: str | datetime, days: int, addition=True) -> datetime:
    if isinstance(date_val, str):
        date_val: datetime = to_datetime(date_val)

    if addition:
        return date_val + timedelta(days=days)  # noqa
    else:
        return date_val - timedelta(days=days)  # noqa


def format_datetime(
    dat_value: str | datetime, human_format=False, with_time=True
) -> str:
    if not dat_value:
        return ""

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
    return datetime.strptime(unaware, settings.DATETIME_STR_FORMAT).replace(
        tzinfo=settings.TIMEZONE
    )
