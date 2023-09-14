import logging
from typing import Any

from sanic import Blueprint, json

from apps.job import models

jobs = Blueprint("job", url_prefix="/jobs")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@jobs.get("")
async def all_jobs(request) -> Any:
    """
    Retrieve all jobs
    """
    return json({
        "data": [job.marshal_simple() for job in (await models.Job.all())]
    })
