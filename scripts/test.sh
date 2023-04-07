#!/usr/bin/env bash

set -e
set -x

export TESTING=True
pytest felicity/tests --asyncio-mode=strict "${@}"
export TESTING=False