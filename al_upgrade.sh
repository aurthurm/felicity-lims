#! /usr/bin/env bash

echo "MIGRATING THE DB ... ..."
alembic upgrade head
echo "DONE ... ..."