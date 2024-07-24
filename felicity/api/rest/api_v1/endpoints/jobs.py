import logging
from typing import Any

from fastapi import APIRouter, Depends

from apps.job.services import JobService

jobs = APIRouter(tags=["job"], prefix="/jobs")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@jobs.get("", response_model=None)
async def all_jobs(job_service: JobService = Depends(JobService)) -> Any:
    """
    Retrieve all jobs
    """
    return await job_service.all()
