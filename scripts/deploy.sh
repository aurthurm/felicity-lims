#! /usr/bin/env sh

# Exit in case of error
set -e

DOMAIN=felicity.com
TRAEFIK_TAG=felicity.com
STACK_NAME=felicity
TAG=production
docker-compose \
-f docker-compose.yml \
up -d