#!/usr/bin/env bash

set -e
set -x

export TESTING=True
if [[ "$1" == "unit" ]]; then
    pytest beak/tests/unit --asyncio-mode=strict -x
elif [[ "$1" == "integration" ]]; then
    pytest beak/tests/integration --asyncio-mode=strict -x
else
    pytest beak/tests/unit --asyncio-mode=strict -x
    pytest beak/tests/integration --asyncio-mode=strict -x
fi
export TESTING=False


# manual with stop on first failure
# export TESTING=True && pytest beak/tests/unit  --asyncio-mode=strict -x
# export TESTING=True && pytest beak/tests/integration  --asyncio-mode=strict -x
