#! /usr/bin/env sh

# Exit in case of error
set -e

DOMAIN=felicity.com
TRAEFIK_TAG=felicity.com
STACK_NAME=felicity
TAG=production
docker-compose \
-f docker-compose.yml \
config > docker-stack.yml

docker-auto-labels docker-stack.yml

docker stack deploy -c docker-stack.yml --with-registry-auth "${STACK_NAME?Variable not set}"