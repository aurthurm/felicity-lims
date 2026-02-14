import multiprocessing
import os

from dotenv import load_dotenv

from beak.utils.dirs import get_log_dir

load_dotenv()

name = "gunicorn config for Beak LiMS systemd daemon"
accesslog = os.path.join(get_log_dir(), "beak-gunicorn-access.log")
errorlog = os.path.join(get_log_dir(), "beak-gunicorn-error.log")

bind = "0.0.0.0:8000"

worker_class = "uvicorn.workers.UvicornWorker"
workers = multiprocessing.cpu_count() * 2 + 1
worker_connections = 1024
backlog = 2048
max_requests = 5120
timeout = 120
keepalive = 2

debug = os.environ.get("DEBUG", "false") == "true"
reload = debug
preload_app = False
daemon = False
