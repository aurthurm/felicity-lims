"""Note:
    - The felicity app must be creaed first before importing other modules.
    - This is important to register felicity in sanic registry
"""
from fastapi import FastAPI

from lims import register_felicity

description = """
Felicity LIMS API helps you do awesome stuff. 🚀

You will be able to:
...
"""

felicity = FastAPI(
    title="Felicity LIMS",
    description=description,
    # root_path="api/v1",
    # version="1.0.0",
    # openapi_url="/openapi.json"
)

register_felicity(felicity)
