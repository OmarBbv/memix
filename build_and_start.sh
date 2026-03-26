set -e

PROJECT_DIR="/root/memix"
cd $PROJECT_DIR

echo "🛠️ Building API..."
cd api
pnpm install --frozen-lockfile
pnpm run build
if [ ! -f .env ]; then
  cat > .env <<EOF
PORT=4444
JWT_SECRET=memix_super_secret_key_2026
APP_URL=http://93.180.133.166/api
FRONTEND_URL=http://93.180.133.166
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=memix5342@gmail.com
MAIL_PASSWORD=xyxf mzfg bykh nkos
MAIL_FROM=Memix <memix5342@gmail.com>
SYNC_API_KEY=memix_1c_integration_key_2026
EOF
fi
docker-compose up -d
cd ..

echo "🛠️ Building Client..."
cd client
pnpm install --frozen-lockfile
if [ ! -f .env ]; then
  echo "NEXT_PUBLIC_API_URL=http://93.180.133.166/api" > .env
fi
pnpm run build
cd ..

echo "🛠️ Building Admin Panel..."
cd admin-panel
pnpm install --frozen-lockfile
pnpm run build
mkdir -p /var/www/memix/admin-panel
cp -r dist/* /var/www/memix/admin-panel/
cd ..

echo "🚀 Starting applications with PM2..."
pm2 delete all || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -n 1 | bash 

echo "✅ All apps are up and running!"
