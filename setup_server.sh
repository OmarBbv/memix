#!/bin/bash
set -e

# --- Configuration ---
DB_PASSWORD="metroboomin2425"
DB_NAME="memix"
PROJECT_DIR="/root/memix"
SERVER_IP="93.180.133.166"

echo "🚀 Starting server setup..."

# 1. Update and install dependencies
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y curl gnupg git build-essential postgresql postgresql-contrib nginx docker.io docker-compose

# 2. Install Node.js 22
echo "Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# 3. Install pnpm and pm2
echo "Installing pnpm and pm2..."
npm install -g pnpm pm2

# 4. Setup PostgreSQL
echo "Configuring PostgreSQL..."
# Change postgres password
sudo -u postgres psql -c "ALTER USER postgres PASSWORD '$DB_PASSWORD';"
# Create database
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" || echo "DB already exists"

# 5. Start Docker and Elasticsearch
echo "Starting Elasticsearch via Docker..."
# Assuming we use the existing api/docker-compose.yml 
# We'll pull it later when files are transferred.
systemctl enable docker
systemctl start docker

# 6. Setup Firewall (Optional but recommended)
# ufw allow 'Nginx Full'
# ufw allow ssh

# 7. Configure Nginx
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/memix <<EOF
server {
    listen 80;
    server_name $SERVER_IP;

    # Admin Panel
    location /admin {
        alias /var/www/memix/admin-panel;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:4444/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Increased timeouts for slow responses
        client_max_body_size 50M;
    }

    # Client (Next.js) Proxy
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/memix /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx

echo "✅ Server dependencies installed and Nginx configured!"
echo "Note: You still need to transfer files and start the apps."
