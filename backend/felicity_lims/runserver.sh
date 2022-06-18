#! /usr/bin/env bash

# export LOAD_SETUP_DATA=False
# Start the App Server
# uvicorn felicity.main:flims --reload --host=0.0.0.0 --port=8000  --workers 4
gunicorn --workers 4 --bind 0.0.0.0:8000 -k uvicorn.workers.UvicornWorker --reload --access-logfile - --error-logfile - --log-level debug felicity.main:flims
