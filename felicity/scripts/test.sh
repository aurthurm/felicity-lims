#!/usr/bin/env bash

set -e
set -x

export TESTING=True
if [[ "$1" == "unit" ]]; then
    pytest felicity/tests/unit --asyncio-mode=strict -x
elif [[ "$1" == "integration" ]]; then
    pytest felicity/tests/integration --asyncio-mode=strict -x
else
    pytest felicity/tests/unit --asyncio-mode=strict -x
    pytest felicity/tests/integration --asyncio-mode=strict -x
fi
export TESTING=False


# manual with stop on first failure
# export TESTING=True && pytest felicity/tests/unit  --asyncio-mode=strict -x
# export TESTING=True && pytest felicity/tests/integration  --asyncio-mode=strict -x
