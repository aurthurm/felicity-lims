#! /usr/bin/env bash

# Let the DB start
python backend_pre_start.py

# Run hippaa
alembic upgrade head

# Create initial data in DB
python initial_data.py
