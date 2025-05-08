import os
import subprocess
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Header
from pydantic import BaseModel

app = FastAPI(title="Infrastructure Deployment API")


class DeploymentRequest(BaseModel):
    service_name: str
    version: str
    environment: str
    config_overrides: Optional[dict] = None


class DeploymentResponse(BaseModel):
    job_id: str
    status: str
    message: str


# Storage for tracking deployments
deployment_jobs = {}


def get_current_user(api_key: str = Header(...)):
    if api_key != os.environ.get("API_KEY"):
        raise HTTPException(status_code=401, detail="Invalid API key")
    return "authorized_user"


def run_deployment(job_id: str, request: DeploymentRequest):
    try:
        # This is where your actual deployment logic would go
        deployment_jobs[job_id]["status"] = "running"

        # Simulation of deployment process
        cmd = [
            "echo",
            f"Deploying {request.service_name} version {request.version} to {request.environment}"
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)

        if result.returncode == 0:
            deployment_jobs[job_id]["status"] = "completed"
            deployment_jobs[job_id]["message"] = "Deployment successful"
        else:
            deployment_jobs[job_id]["status"] = "failed"
            deployment_jobs[job_id]["message"] = result.stderr
    except Exception as e:
        deployment_jobs[job_id]["status"] = "failed"
        deployment_jobs[job_id]["message"] = str(e)


@app.post("/deploy", response_model=DeploymentResponse)
async def create_deployment(
        request: DeploymentRequest,
        background_tasks: BackgroundTasks,
        user: str = Depends(get_current_user)
):
    job_id = f"deploy-{request.service_name}-{request.environment}-{request.version}"

    deployment_jobs[job_id] = {
        "status": "queued",
        "message": "Deployment queued"
    }

    background_tasks.add_task(run_deployment, job_id, request)

    return {
        "job_id": job_id,
        "status": "queued",
        "message": "Deployment has been queued"
    }


@app.get("/deploy/{job_id}", response_model=DeploymentResponse)
async def get_deployment_status(
        job_id: str,
        user: str = Depends(get_current_user)
):
    if job_id not in deployment_jobs:
        raise HTTPException(status_code=404, detail="Deployment job not found")

    return {
        "job_id": job_id,
        "status": deployment_jobs[job_id]["status"],
        "message": deployment_jobs[job_id]["message"]
    }


@app.get("/deployments", response_model=List[DeploymentResponse])
async def list_deployments(
        user: str = Depends(get_current_user)
):
    return [
        {
            "job_id": job_id,
            "status": details["status"],
            "message": details["message"]
        }
        for job_id, details in deployment_jobs.items()
    ]
