# Detailed Koyeb Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. Nginx Configuration Problems

#### Issue: Nginx fails to start with "exit status 1"
**Root Causes:**
- Missing configuration files (mime.types, conf.d/*.conf)
- Syntax errors in nginx.conf
- Incorrect supervisord command (not using daemon off)

**Solutions Applied:**
- Embedded MIME types directly in nginx.conf instead of including external files
- Ensured supervisord runs nginx with `nginx -g 'daemon off;'`
- Removed problematic include directives

### 2. Health Check Failures on Port 8000

#### Issue: "TCP health check failed on port 8000"
**Root Causes:**
- Telegram bot not starting correctly
- Port 8000 not exposed in koyeb.yaml
- Environment variables not properly set

**Solutions Applied:**
- Added port 8000 to koyeb.yaml
- Simplified supervisord environment configuration
- Ensured Telegram bot runs on the correct port

### 3. Supervisord Configuration Issues

#### Issue: Programs constantly restarting
**Root Causes:**
- Programs running in daemon mode instead of foreground
- Incorrect user permissions
- Missing error handling

**Solutions Applied:**
- Configured nginx to run in foreground mode
- Added redirect_stderr and stopwaitsecs for better error handling
- Verified user permissions

## Debugging Steps

### 1. Check Container Logs
```bash
# View supervisord logs
cat /var/log/supervisor/supervisord.log

# View nginx logs
cat /var/log/supervisor/nginx.log

# View Telegram bot logs
cat /var/log/supervisor/telegram-bot.log
```

### 2. Test Configuration Locally
```bash
# Build the Docker image
docker build -t edumaster-test .

# Run with environment variables
docker run -p 80:80 -p 8000:8000 -e BOT_TOKEN=your_token_here edumaster-test

# Check logs
docker logs <container_id>
```

### 3. Validate Configurations
```bash
# Test nginx configuration
nginx -t -c nginx.conf

# Test supervisord configuration
echo_supervisord_conf > /dev/null
```

## Additional Fixes to Try

### 1. Add Error Logging to Nginx
Add these directives to the http block in nginx.conf:
```
error_log /var/log/nginx/error.log;
```

### 2. Add Health Check Endpoint
Add this location block to nginx.conf:
```
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}
```

### 3. Improve Telegram Bot Startup
Modify the telegram-bot program in supervisord.conf:
```
[program:telegram-bot]
command=python /app/bot/api.py
directory=/app/bot
user=nobody
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/telegram-bot.log
stderr_logfile=/var/log/supervisor/telegram-bot.log
environment=PORT="8000",BOT_TOKEN="%(ENV_BOT_TOKEN)s"
priority=20
redirect_stderr=true
stopwaitsecs=10
startretries=3
```

## Environment Variables

Make sure these environment variables are set in Koyeb:
- BOT_TOKEN: Your Telegram bot token
- PORT: Should be 8000 for the Telegram bot

## Deployment Verification

After deployment, verify that:
1. Both ports 80 and 8000 are accessible
2. The health check endpoints return 200 OK
3. Static files are served correctly on port 80
4. API requests to /api/ are proxied to port 8000

## If Issues Persist

1. Check Koyeb application logs for specific error messages
2. Verify that the BOT_TOKEN environment variable is correctly set
3. Ensure the Docker image builds without errors locally
4. Test the container locally before deploying to Koyeb