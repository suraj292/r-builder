# Hostinger Ubuntu 24.04 "Push to Deploy" Guide

This guide explains how to set up a professional "Push to Deploy" workflow on your Hostinger KVM 1 server.

---

## 1. Automated Server Setup

We have provided a script `setup_hostinger.sh` that automates the installation of Node.js, Python, Nginx, MySQL, and Redis, and sets up a Git "Push to Deploy" hook.

### Step 1.1: Upload and Run Setup Script
1. Connect to your Hostinger server via SSH as `root`.
2. Copy `setup_hostinger.sh` to your server or create it manually:
   ```bash
   nano setup_hostinger.sh
   # Paste the content of setup_hostinger.sh
   chmod +x setup_hostinger.sh
   ./setup_hostinger.sh
   ```
3. The script will:
   - Install all necessary software.
   - Create a `deploy` user.
   - Setup a 2GB swap file (essential for KVM 1 stability).
   - Create a bare Git repository at `/srv/git/r-builder.git`.
   - Setup a `post-receive` hook to trigger deployment on push.

---

## 2. Local Machine Configuration

Now, connect your local development environment to your server.

### Step 2.1: Add Production Remote
In your local project folder:
```bash
# Using the domain name (Ensure DNS is pointed to 89.116.229.28)
git remote add production deploy@resumebp.com:/srv/git/r-builder.git
```

### Step 2.2: Push to Deploy
To deploy your code, simply push to the production remote:
```bash
git push production main
```
The server will automatically:
1. Checkout the code to `/var/www/r-builder`.
2. Install Python dependencies.
3. Run database migrations.
4. Build the React frontend.
5. Restart the FastAPI service.

---

## 3. One-Time Production Configuration

After your first push, you need to configure the database and services.

### Step 3.1: Configure Backend Environment
On the server, switch to the `deploy` user and create the `.env` file:
```bash
sudo su - deploy
cd /var/www/r-builder/backend
cp .env.example .env
nano .env
```
Update `DATABASE_URL`, `SECRET_KEY`, and any other required keys.

### Step 3.2: Configure MySQL
Create the database and user:
```bash
sudo mysql
```
```sql
CREATE DATABASE resumeai;
CREATE USER 'deploy'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON resumeai.* TO 'deploy'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3.3: Enable Systemd Service
```bash
sudo cp /var/www/r-builder/deployment/fastapi.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable fastapi.service
sudo systemctl start fastapi.service
```

### Step 3.4: Configure Nginx
```bash
sudo cp /var/www/r-builder/deployment/nginx.conf /etc/nginx/sites-available/r-builder
sudo ln -s /etc/nginx/sites-available/r-builder /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default # Optional
sudo nginx -t
sudo systemctl restart nginx
```

---

## 4. Monitoring & Troubleshooting

Logs are located at:
- **FastAPI**: `journalctl -u fastapi.service -f`
- **Nginx**: `/var/log/nginx/error.log`
- **Deployment**: The output of your `git push production main` command will show the deployment progress.

### Build Failures (Out of Memory)
If `npm run build` fails on your KVM 1 server, the 2GB swap file created by `setup_hostinger.sh` should resolve it. If it still fails, consider building locally and syncing the `dist` folder, although "Push to Deploy" with server-side build is preferred for simplicity.
