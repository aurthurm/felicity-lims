#!/usr/bin/env bash
set -x
# trap read debug

# echo "deb [trusted=yes] https://apt.fury.io/caddy/ /" | sudo tee -a /etc/apt/sources.list.d/caddy-fury.list
sudo apt update
sudo apt install -y caddy

sudo cp ./Caddyfile /etc/caddy/

sudo systemctl restart caddy