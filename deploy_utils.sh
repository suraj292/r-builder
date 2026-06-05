#!/bin/bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Resolve directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Default paths - can be overridden by environment variables
TARGET_DIR="${FRONTEND_WEB_ROOT:-/var/www/r-builder/dist}"
BACKEND_DIR="$SCRIPT_DIR/backend"
SERVICE_NAME="fastapi.service"

update_backend() {
    log_info "Starting backend deployment update..."
    
    # Only pull if we are in a git repo and not running from post-receive (which does the checkout)
    if [ -d ".git" ]; then
        log_info "1. Pulling latest code from Git..."
        git pull
    else
        log_info "1. Skipping git pull (not a git repo or handled by hook)..."
    fi
    
    log_info "2. Installing Python dependencies..."
    if [ ! -d "backend/venv" ]; then
        log_warning "Virtual environment (backend/venv) not found. Creating it..."
        python3 -m venv backend/venv
    fi
    backend/venv/bin/pip install -r backend/requirements.txt
    
    log_info "3. Running database migrations (Alembic)..."
    cd backend
    if [ -f "alembic.ini" ]; then
        venv/bin/alembic upgrade head
    else
        log_warning "alembic.ini not found. Skipping migrations."
    fi
    cd "$SCRIPT_DIR"
    
    log_info "4. Restarting $SERVICE_NAME..."
    if command -v systemctl >/dev/null 2>&1; then
        if systemctl is-active --quiet "$SERVICE_NAME"; then
            sudo systemctl restart "$SERVICE_NAME"
            log_success "$SERVICE_NAME restarted successfully."
        else
            log_warning "$SERVICE_NAME is not active. Attempting to start..."
            sudo systemctl enable "$SERVICE_NAME" || true
            sudo systemctl start "$SERVICE_NAME" || true
        fi
    else
        log_warning "systemctl command not found. Please restart $SERVICE_NAME manually."
    fi
    
    log_success "Backend deployment update completed successfully!"
}

rebuild_frontend() {
    log_info "Starting frontend rebuild and sync..."
    
    if [ -d ".git" ]; then
        log_info "1. Pulling latest code from Git..."
        git pull
    fi
    
    log_info "2. Installing npm packages..."
    npm install
    
    log_info "3. Building production frontend assets..."
    npm run build
    
    log_info "4. Syncing built files to Nginx web root ($TARGET_DIR)..."
    
    # Ensure target directory exists
    sudo mkdir -p "$TARGET_DIR"
    sudo chown -R $USER:$USER "$TARGET_DIR"
    
    if command -v rsync >/dev/null 2>&1; then
        rsync -av --delete dist/ "$TARGET_DIR"
        log_success "Assets successfully synced via rsync."
    else
        log_warning "rsync not found. Falling back to cp..."
        rm -rf "${TARGET_DIR:?}"/*
        cp -r dist/* "$TARGET_DIR"
        log_success "Assets successfully copied via cp."
    fi
    
    log_success "Frontend deployment update completed successfully!"
}

full_deploy() {
    log_info "🚀 Starting FULL deployment (Backend + Frontend)..."
    update_backend
    rebuild_frontend
    log_success "🚀 Full deployment completed!"
}

show_usage() {
    echo "Usage: $0 {update-backend|rebuild-frontend|deploy}"
    echo "  update-backend   - Pulls latest git code, installs dependencies, runs migrations, and restarts fastapi.service"
    echo "  rebuild-frontend - Pulls latest git code, installs node packages, builds assets, and syncs to web root"
    echo "  deploy           - Runs both update-backend and rebuild-frontend"
    exit 1
}

# Check command line arguments
if [ $# -lt 1 ]; then
    show_usage
fi

case "$1" in
    update-backend)
        update_backend
        ;;
    rebuild-frontend)
        rebuild_frontend
        ;;
    deploy)
        full_deploy
        ;;
    *)
        show_usage
        ;;
esac
