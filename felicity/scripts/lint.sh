#!/usr/bin/env bash

set -x

mypy ./felivity
black ./felicity --check
isort --recursive --check-only ./felicity
flake8 ./felicity
