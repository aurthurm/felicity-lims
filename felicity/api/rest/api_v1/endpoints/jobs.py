import logging
from typing import Any

from fastapi import APIRouter, Depends

from felicity.apps.job.services import JobService

jobs = APIRouter(tags=["job"], prefix="/jobs")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@jobs.get("", response_model=None)
async def all_jobs(job_service: JobService = Depends(JobService)) -> Any:
    """
    Retrieve all jobs
    """
    return await job_service.all()


@jobs.get("/pending", response_model=None)
async def pending_jobs(job_service: JobService = Depends(JobService)) -> Any:
    """
    Retrieve all pending jobs
    """
    return await job_service.fetch_sorted()
