import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def check_open_worksheets():
    """Check Open Worksheets
    @schedule: runs every morning 4:00 am
    e.g.
        ---
    """


async def check_incomplete_worksheet_assignments():
    """Check Incomplete Worksheet Assignments
    @schedule: runs every morning 4:00 am
    e.g.
        xxx you have 2 worksheets assigned to you
    """


async def check_empty_worksheets():
    """Check Empty Worksheets
    @schedule: runs every morning 4:00 am
    e.g.
        there are 45 empty worksheets ......
    """


async def check_over_due_analyses():
    """Check Over-Due Analyses
    @schedule: runs every morning 4:00 am
    e.g.
        there are 3456 analyses that are not overdue
    """


# Management Like Notification
async def worksheets_created():
    """Worksheets Created (today, yesterday)
    @schedule: runs every morning 4:00 am
    e.g.
        there are 2 worksheets created today
    """


async def worksheets_verified():
    """Worksheets Verified (today, yesterday)
    @schedule: runs every morning 4:00 am
    e.g.
        there are 2 worksheets verified today
    """


async def worksheets_resulted():
    """Worksheets resulted (today, yesterday)
    @schedule: runs every morning 4:00 am
    e.g.
        there are 2 worksheets created today
    """


async def worksheets_pending_verification():
    """Worksheets Verified (today, yesterday)
    @schedule: runs every morning 4:00 am
    e.g.
        4 worksheet await verification
    """
