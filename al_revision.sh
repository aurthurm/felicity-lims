#! /usr/bin/env bash

echo "CREATING A NEW REVISION ... ... ${1}"
alembic revision --autogenerate -m "${1}"
echo "DONE ... ..."