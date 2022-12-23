#! /usr/bin/env bash

# export LOAD_SETUP_DATA=False
# Start the App Server
uvicorn felicity.main:flims --reload --host=0.0.0.0 --port=8000  --workers 4
