#!/bin/sh -e
set -x

ruff check ./beak --fix . --exclude __init__.py
ruff format ./beak