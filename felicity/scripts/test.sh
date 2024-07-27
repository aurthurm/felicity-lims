#!/usr/bin/env bash

set -e
set -x

export TESTING=True
pytest felicity --asyncio-mode=strict "${@}"
export TESTING=False


# manual
# export TESTING=True && pytest felicity/tests/unit  --asyncio-mode=strict -x
