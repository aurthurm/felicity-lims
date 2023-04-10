#! /usr/bin/env bash

# export LOAD_SETUP_DATA=False
# Start the App Server
# in docker use --workers 1 and spawn many containers
uvicorn felicity.main:flims --reload --host=0.0.0.0 --port=8000  --workers 1
