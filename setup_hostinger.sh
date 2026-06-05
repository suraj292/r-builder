#!/bin/bash
set -euo pipefail

# Hostinger Ubuntu 24.04 Deployment Setup Script
# This script prepares the server for "Push to Deploy" workflow.

# Configuration - Change these as needed
APP_NAME="r-builder"
DEPLOY_DIR="/var/www/$APP_NAME"
GIT_DIR="/srv/git/$APP_NAME.git"
USER_NAME="deploy" # It's better not to use root for everything

echo "🚀 Starting Hostinger Server Setup for $APP_NAME..."

# 1. Update system and install base dependencies
echo "📦 Updating system and installing dependencies..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget build-essential python3-venv python3-pip python3-dev \
    nginx mysql-server redis-server rsync lsof

# 2. Add Swap File (Crucial for KVM 1 with 1GB/2GB RAM)
if [ ! -f /swapfile ]; then
    echo "💾 Creating 2GB swap file for build stability..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# 3. Install Node.js (Latest LTS)
echo "🟢 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Create Deploy User and Directories
if ! id "$USER_NAME" &>/dev/null; then
    echo "👤 Creating deploy user..."
    sudo useradd -m -s /bin/bash "$USER_NAME"
    sudo usermod -aG sudo "$USER_NAME"
    echo "$USER_NAME ALL=(ALL) NOPASSWD:ALL" | sudo tee "/etc/sudoers.d/$USER_NAME"
fi

sudo mkdir -p "$DEPLOY_DIR" "$GIT_DIR"
sudo chown -R "$USER_NAME:$USER_NAME" "$DEPLOY_DIR" "$GIT_DIR"

# 5. Initialize Bare Git Repository
echo "📂 Setting up Bare Git Repository at $GIT_DIR..."
sudo -u "$USER_NAME" git init --bare "$GIT_DIR"

# 6. Create Post-Receive Hook
echo "🪝 Creating post-receive hook..."
CAT_HOOK_PATH="$GIT_DIR/hooks/post-receive"
sudo -u "$USER_NAME" tee "$CAT_HOOK_PATH" <<EOF
#!/bin/bash
TARGET="$DEPLOY_DIR"
GIT_DIR="$GIT_DIR"

echo "🚀 Push received! Starting deployment to \$TARGET..."

# Checkout the code
git --work-tree=\$TARGET --git-dir=\$GIT_DIR checkout -f main

cd \$TARGET

# Handle SSL Certificates (Cloudflare)
if [ -f "deployment/resumebp.com.pem" ]; then
    echo "🔑 Updating SSL certificates..."
    sudo cp deployment/resumebp.com.pem /etc/ssl/certs/resumebp.com.pem
    sudo cp deployment/resumebp.com.key /etc/ssl/private/resumebp.com.key
    sudo chmod 600 /etc/ssl/private/resumebp.com.key
fi

# Fix permissions
chmod +x deploy_utils.sh

# Run deployment
echo "🛠️  Running deploy_utils.sh..."
./deploy_utils.sh update-backend
./deploy_utils.sh rebuild-frontend

echo "✅ Deployment finished successfully!"
EOF

sudo chmod +x "$CAT_HOOK_PATH"

# 7. Initial Directory Setup
echo "🏗️  Pre-creating backend venv and directory structure..."
sudo -u "$USER_NAME" mkdir -p "$DEPLOY_DIR/backend"
sudo -u "$USER_NAME" python3 -m venv "$DEPLOY_DIR/backend/venv"

echo "-------------------------------------------------------"
echo "🎉 Server setup complete!"
echo "-------------------------------------------------------"
echo "Next Steps:"
echo "1. On your LOCAL machine, add the production remote (ensure DNS is pointed to 89.116.229.28):"
echo "   git remote add production $USER_NAME@resumebp.com:$GIT_DIR"
echo ""
echo "2. Push your code:"
echo "   git push production main"
echo ""
echo "3. Remember to:"
echo "   - Configure MySQL database and user."
echo "   - Setup your .env file in $DEPLOY_DIR/backend/.env"
echo "   - Configure Nginx: sudo cp $DEPLOY_DIR/deployment/nginx.conf /etc/nginx/sites-available/$APP_NAME"
echo "   - Setup systemd: sudo cp $DEPLOY_DIR/deployment/fastapi.service /etc/systemd/system/fastapi.service"
echo "-------------------------------------------------------"
