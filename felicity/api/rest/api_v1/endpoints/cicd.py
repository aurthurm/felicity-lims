import logging
import subprocess

from fastapi import APIRouter
from fastapi import Request, BackgroundTasks, HTTPException

cicd = APIRouter(tags=["cicd"], prefix="/cicd")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_deployment(repo_name: str):
    # This would be your deployment script
    subprocess.run(["./deploy.sh", repo_name])


@cicd.post("/webhook/github")
async def github_webhook(request: Request, background_tasks: BackgroundTasks):
    payload = await request.json()
    repo_name = payload.get("repository", {}).get("name")

    if not repo_name:
        raise HTTPException(status_code=400, detail="Repository name not found")

    # Run deployment in background so webhook returns quickly
    background_tasks.add_task(run_deployment, repo_name)

    return {"message": f"Deployment for {repo_name} started"}
