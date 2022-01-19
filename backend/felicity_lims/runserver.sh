#! /usr/bin/env bash

# Start the App Server
# uvicorn felicity.main:flims --reload --host=0.0.0.0 --port=8000  --workers 4
gunicorn --workers 20 --bind 0.0.0.0:8000 -k uvicorn.workers.UvicornWorker --reload felicity.main:flims
