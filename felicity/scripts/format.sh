#!/bin/sh -e
set -x

ruff check ./felicity --fix . --exclude __init__.py
ruff format ./felicity