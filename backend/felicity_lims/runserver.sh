#! /usr/bin/env bash

# export LOAD_SETUP_DATA=False
# Start the App Server
gunicorn felicity.main:flims --workers 1 --worker-class uvicorn.workers.UvicornH11Worker --bind 0.0.0.0:8000 --name felicity --reload --access-logfile - --error-logfile - --log-level info --timeout 600
