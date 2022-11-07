#! /usr/bin/env bash
set -e

# celery worker -A felicity.worker -l info -Q main-queue -c 1
celery -A felicity.worker worker -l info -Q main-queue -c 1