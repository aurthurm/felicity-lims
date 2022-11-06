import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def notpublished():
    """"""


# abnormal activity monitoring
# sample cancellations
# analysis retests
# set threshnold parameters e.g there must be no more than 10 cancellations within week
# there must be no more that 2 rejection per day/week etc
# these must be no more than x retests /retractions/ invalidations

# is these thresholds are exceeded then a system management notification must be generated
