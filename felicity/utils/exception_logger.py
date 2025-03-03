# Python imports
import logging
import traceback

# Third party imports
from sentry_sdk import capture_exception

from felicity.core.config import settings


def log_exception(e):
    # Log the error
    logger = logging.getLogger("felicity-lims")
    logger.error(e)

    if settings.DEBUG:
        # Print the traceback if in debug mode
        print(traceback.format_exc())

    # Capture in sentry if configured
    capture_exception(e)
    return
