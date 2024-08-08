#!/bin/bash

# Update package lists
sudo apt-get update

# Install required packages
sudo apt-get install -y git libcairo2-dev pkg-config python3-dev gcc g++

# Create user 'felicity' with password 'felicity'
sudo adduser --disabled-password --gecos "" felicity
echo "felicity:felicity" | sudo chpasswd

# Switch to the 'felicity' user
sudo -u felicity

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create PostgreSQL user 'felicity' with password 'felicity'
sudo -u postgres psql -c "CREATE USER felicity WITH PASSWORD 'felicity';"

# Create a database for 'felicity'
sudo -u postgres psql -c "CREATE DATABASE felicity_lims OWNER felicity;"

# Grant all privileges on the 'public' schema to the 'felicity' user
sudo -u postgres psql -d felicity_lims -c "GRANT ALL PRIVILEGES ON SCHEMA public TO felicity;"

# Download and install Miniconda
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh -b

# Initialize Miniconda
export PATH="/home/felicity/miniconda3/bin:\$PATH"
source /home/felicity/miniconda3/bin/activate

# Create and activate the 'felicity' environment with Python 3.12
conda create -n felicity python=3.12 -y
conda activate felicity

# Install Node.js 18 and PNPM
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm

# Clone the repository
# shellcheck disable=SC2164
cd /home/felicity
git clone https://github.com/beak-insights/felicity-lims.git

# Change directory to the cloned repository
# shellcheck disable=SC2164
cd /home/felicity/felicity-lims

# install requirements
pip install -r requirements.txt

# Set up PostgreSQL
pnpm db:al:upgrade

# Install webapp dependencies
pnpm i

# Build webapp and set up Felicity to serve static files
pnpm standalone:build

# Install Supervisor
sudo apt-get install -y supervisor

# Create Supervisor configuration file
cat <<EOF | sudo tee /etc/supervisor/conf.d/felicity_lims.conf
[program:felicity_lims]
command=/home/felicity/miniconda3/envs/felicity/bin/python /home/felicity/felicity-lims
autostart=true
autorestart=true
stderr_logfile=/var/log/felicity_lims.err.log
stdout_logfile=/var/log/felicity_lims.out.log
EOF

# Update Supervisor
sudo supervisorctl reread
sudo supervisorctl update

# Check Supervisor status
sudo systemctl status supervisor

# Check program status
sudo supervisorctl status
