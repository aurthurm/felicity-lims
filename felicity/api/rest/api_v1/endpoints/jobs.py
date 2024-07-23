import logging
from typing import Any

from fastapi import APIRouter

from felicity.apps.job import entities

jobs = APIRouter(tags=["job"], prefix="/jobs")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@jobs.get("", response_model=None)
async def all_jobs() -> Any:
    """
    Retrieve all jobs
    """
    return await entities.Job.all_async()
