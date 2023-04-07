#! /usr/bin/env bash
# use bash for child process and source for same bash process
__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# create revisions
# source "${__dir}"/al_revision.sh "ini felicity $(date)"

# run upgrade
source "${__dir}"/al_upgrade.sh

# then start server
source "${__dir}"/runserver.sh