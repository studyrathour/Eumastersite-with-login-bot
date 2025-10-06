# EduMaster Deployment Fix Guide

This document explains the fixes applied to resolve the nginx startup issues and deployment problems on Koyeb.

## Problem Summary

The deployment was failing with the following errors:
- nginx repeatedly starting and exiting with status 1
- "TCP health check failed on port 8000"
- Supervisord showing nginx as constantly restarting

## Root Causes and Fixes

### 1. Nginx Supervisord Configuration Issue

**Problem**: The nginx command in supervisord.conf was just `nginx`, which starts nginx in daemon mode. Supervisord expects programs to run in foreground mode.

**Fix**: Changed the command to `nginx -g 'daemon off;'` to run nginx in foreground mode.

**File**: `supervisord.conf`
```ini
[program:nginx]
command=nginx -g 'daemon off;'
```

### 2. Missing Port Configuration in Koyeb

**Problem**: The koyeb.yaml file only exposed port 80 but not port 8000 for the Telegram bot API.

**Fix**: Added port 8000 to the ports configuration.

**File**: `koyeb.yaml`
```yaml
ports:
  - port: 80
    protocol: http
  - port: 8000
    protocol: http
```

### 3. Nginx Configuration Include Issue

**Problem**: The nginx.conf included `/etc/nginx/conf.d/*.conf` which may not exist in the container, causing nginx to fail.

**Fix**: Removed the include directive.

**File**: `nginx.conf`
```nginx
# Removed this line:
# include /etc/nginx/conf.d/*.conf;
```

### 4. Enhanced Telegram Bot Configuration

**Problem**: The Telegram bot configuration in supervisord could be improved for better error handling.

**Fix**: Added better error handling and graceful shutdown settings.

**File**: `supervisord.conf`
```ini
[program:telegram-bot]
# ... existing configuration ...
redirect_stderr=true
stopwaitsecs=10
```

## Deployment Instructions

1. **Set Environment Variables**:
   - `BOT_TOKEN`: Your Telegram bot token
   - `PORT`: Should be set to 8000

2. **Build and Deploy**:
   ```bash
   # Build the Docker image
   docker build -t edumaster .
   
   # Run locally for testing
   docker run -p 80:80 -p 8000:8000 -e BOT_TOKEN=your_token_here edumaster
   
   # Deploy to Koyeb
   koyeb deploy edumaster --dockerfile Dockerfile
   ```

## Verification Steps

1. Check that nginx starts properly:
   ```bash
   # Check nginx status
   docker exec <container_id> supervisorctl status nginx
   ```

2. Check that the Telegram bot starts properly:
   ```bash
   # Check bot status
   docker exec <container_id> supervisorctl status telegram-bot
   ```

3. Test the endpoints:
   - Frontend: `http://localhost:80`
   - Bot API: `http://localhost:8000/health`

## Expected Outcome

With these fixes, the deployment should succeed with:
- nginx running properly on port 80
- Telegram bot API running properly on port 8000
- Both health checks passing
- Stable supervisord process management

## Additional Notes

- Make sure to replace `YOUR_BOT_TOKEN_HERE` with your actual Telegram bot token
- The Docker image uses multi-stage build for smaller size
- The application uses supervisord to manage both nginx and the Telegram bot
- Static files are served by nginx for better performance
- API requests are proxied to the Python Flask application