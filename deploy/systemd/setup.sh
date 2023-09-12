#!/usr/bin/env bash
set -x
# trap read debug

sudo adduser --quiet --disabled-password --shell /bin/bash --home /home/felicity --gecos "User" felicity
echo "felicity:felicity" | sudo chpasswd

sudo cp ./felicity* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable felicitylims
sudo systemctl start felicitylims
sudo systemctl restart felicity-tasks.target

# sudo systemctl start felicity-tasks@{1..4}
# sudo systemctl status felicity-tasks@{1..4}
# sudo systemctl restart felicity-tasks@3
# sudo systemctl enable felicity-tasks@5
# sudo systemctl start felicity-tasks.target
# sudo systemctl stop felicity-tasks@{4..5}
# sudo systemctl disable felicity-tasks@{4..5}

#  journalctl -f -u felicitylims