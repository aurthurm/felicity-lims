"""Core REST routers."""

from .jobs import jobs
from .reports import reports
from .setup import setup

__all__ = ["jobs", "reports", "setup"]
