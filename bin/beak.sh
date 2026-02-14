#!/bin/bash

# Update package lists
sudo apt-get update

# Install required packages
sudo apt-get install -y git libcairo2-dev pkg-config python3-dev gcc g++

# Create user 'beak' with password 'beak'
sudo adduser --disabled-password --gecos "" beak
echo "beak:beak" | sudo chpasswd

# Switch to the 'beak' user
sudo -u beak

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create PostgreSQL user 'beak' with password 'beak'
sudo -u postgres psql -c "CREATE USER beak WITH PASSWORD 'beak';"

# Create a database for 'beak'
sudo -u postgres psql -c "CREATE DATABASE beak_lims OWNER beak;"

# Grant all privileges on the 'public' schema to the 'beak' user
sudo -u postgres psql -d beak_lims -c "GRANT ALL PRIVILEGES ON SCHEMA public TO beak;"

# Download and install Miniconda
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh -b

# Initialize Miniconda
export PATH="/home/beak/miniconda3/bin:\$PATH"
source /home/beak/miniconda3/bin/activate

# Create and activate the 'beak' environment with Python 3.12
conda create -n beak python=3.12 -y
conda activate beak

# Install Node.js 18 and PNPM
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm

# Clone the repository
# shellcheck disable=SC2164
cd /home/beak
git clone https://github.com/beak-insights/beak-lims.git

# Change directory to the cloned repository
# shellcheck disable=SC2164
cd /home/beak/beak-lims

# install requirements
pip install -r requirements.txt

# Set up PostgreSQL
pnpm db:al:upgrade

# Install webapp dependencies
pnpm i

# Build webapp and set up Beak LIMS to serve static files
pnpm standalone:build

# Install Supervisor
sudo apt-get install -y supervisor

# Create Supervisor configuration file
cat <<EOF | sudo tee /etc/supervisor/conf.d/beak_lims.conf
[program:beak_lims]
command=/home/beak/miniconda3/envs/beak/bin/python /home/beak/beak-lims
autostart=true
autorestart=true
stderr_logfile=/var/log/beak_lims.err.log
stdout_logfile=/var/log/beak_lims.out.log
EOF

# Update Supervisor
sudo supervisorctl reread
sudo supervisorctl update

# Check Supervisor status
sudo systemctl status supervisor

# Check program status
sudo supervisorctl status
