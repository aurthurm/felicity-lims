#!/usr/bin/env bash
set -x
# trap read debug

sudo adduser --quiet --disabled-password --shell /bin/bash --home /home/felicity --gecos "User" felicity
echo "felicity:felicity" | sudo chpasswd

pip install supervisor

sudo mkdir /etc/supervisor
sudo mkdir /var/log/supervisor
sudo mkdir /var/run/supervisor
sudo rm /etc/supervisor/supervisord.conf
sudo cp ./*.conf /etc/supervisor/supervisord.conf
sudo cp ./supervisord /etc/init.d/
sudo chmod +x /etc/init.d/supervisord
sudo update-rc.d supervisord defaults