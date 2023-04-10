#!/usr/bin/env bash

set -x

mypy felicity
black felicity --check
isort --recursive --check-only felicity
flake8 felicity
