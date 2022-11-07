#! /usr/bin/env bash

# Let the DB start
python /felicity_lims/felicity/backend_pre_start.py

# Run migrations
alembic upgrade head

# Create initial data in DB
python /felicity_lims/felicity/initial_data.py
