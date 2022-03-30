#! /usr/bin/env bash
set -e

python /felicity_lims/felicity/tests_pre_start.py

bash ./scripts/test.sh "$@"
