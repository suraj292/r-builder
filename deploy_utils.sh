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

update_backend() {
    log_info "Starting backend deployment update..."
    
    log_info "1. Pulling latest code from Git..."
    git pull
    
    log_info "2. Installing Python dependencies..."
    if [ ! -d "backend/venv" ]; then
        log_warning "Virtual environment (backend/venv) not found. Creating it..."
        python3 -m venv backend/venv
    fi
    backend/venv/bin/pip install -r backend/requirements.txt
    
    log_info "3. Running database migrations (Alembic)..."
    cd backend
    venv/bin/alembic upgrade head
    cd "$SCRIPT_DIR"
    
    log_info "4. Restarting fastapi.service..."
    if command -v systemctl >/dev/null 2>&1; then
        sudo systemctl restart fastapi.service
        log_success "fastapi.service restarted successfully."
    else
        log_warning "systemctl command not found. Please restart fastapi.service manually if systemd is active."
    fi
    
    log_success "Backend deployment update completed successfully!"
}

rebuild_frontend() {
    log_info "Starting frontend rebuild and sync..."
    
    log_info "1. Pulling latest code from Git..."
    git pull
    
    log_info "2. Installing npm packages..."
    npm install
    
    log_info "3. Building production frontend assets..."
    npm run build
    
    log_info "4. Syncing built files to Nginx web root (/home/resumebp/htdocs/resumebp.com/)..."
    TARGET_DIR="/home/resumebp/htdocs/resumebp.com/"
    
    if [ -d "$TARGET_DIR" ] || [ -L "$TARGET_DIR" ]; then
        if command -v rsync >/dev/null 2>&1; then
            rsync -av --delete dist/ "$TARGET_DIR"
            log_success "Assets successfully synced via rsync."
        else
            log_warning "rsync not found. Falling back to cp..."
            rm -rf "${TARGET_DIR:?}"/*
            cp -r dist/* "$TARGET_DIR"
            log_success "Assets successfully copied via cp."
        fi
    else
        log_error "Target directory $TARGET_DIR does not exist."
        log_info "Please ensure the directory exists or update TARGET_DIR in the script."
        exit 1
    fi
    
    log_success "Frontend deployment update completed successfully!"
}

show_usage() {
    echo "Usage: $0 {update-backend|rebuild-frontend}"
    echo "  update-backend   - Pulls latest git code, installs dependencies, runs migrations, and restarts fastapi.service"
    echo "  rebuild-frontend - Pulls latest git code, installs node packages, builds assets, and syncs to web root"
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
    *)
        show_usage
        ;;
esac
