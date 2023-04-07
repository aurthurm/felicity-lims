import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def check_open_worksheets():
    """Check Open Worksheets
    @schedule: runs every morning 4:00 am
    e.g.
        23 worksheets are in open state
    """


async def check_incomplete_worksheet_assignments():
    """Check Incomplete Worksheet Assignments
    @schedule: runs every morning 4:00 am
    e.g.
        xxx you have 2 worksheets in xxxx state assigned to you
    """


async def check_empty_worksheets():
    """Check Empty Worksheets
    @schedule: runs every morning 4:00 am
    e.g.
        45 worksheets have no samples assigned consider assigning samples to these before creating new......
    """


# Management Like Notification
async def worksheets_created():
    """Worksheets Created (today, yesterday)
    @schedule: runs every morning 4:00 am
    e.g.
        2 worksheets were created today
    """


async def worksheets_verified():
    """Worksheets Verified (today, yesterday)
    @schedule: runs every morning 4:00 am
    e.g.
        2 worksheets were verified today
    """


async def worksheets_resulted():
    """Worksheets resulted (today, yesterday)
    @schedule: runs every morning 4:00 am
    e.g.
        2 worksheets were created today
    """


async def worksheets_pending_verification():
    """Worksheets Verified (today, yesterday)
    @schedule: runs every morning 4:00 am
    e.g.
        4 worksheet await verification
    """


# abnormal activity monitoring
# sample cancellations
# analysis retests
# set threshnold parameters e.g there must be no more than 10 cancellations within week
# there must be no more that 2 rejection per day/week etc
# these must be no more than x retests /retractions/ invalidations

# is these thresholds are exceeded then a system management notification must be generated
