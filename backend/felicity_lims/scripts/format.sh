#!/bin/sh -e
set -x

autoflake --remove-all-unused-imports --recursive --remove-unused-variables --in-place felicity --exclude=__init__.py
black felicity
isort --recursive --apply felicity
