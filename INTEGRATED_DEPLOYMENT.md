# EduMaster with Integrated Telegram Bot Deployment

## Overview

This document describes how to deploy EduMaster with an integrated Telegram bot in a single Docker container. The deployment uses supervisord to manage both the frontend (React application) and backend (Telegram bot) services.

## Architecture

The deployment consists of:

1. **Frontend Service**:
   - React application built with Vite
   - Served by Nginx
   - Accessible on port 80

2. **Backend Service**:
   - Python Telegram bot with Flask API
   - Accessible on port 8000
   - Proxied through Nginx at `/api/`

3. **Process Management**:
   - Supervisord manages both services
   - Automatic restart on failure
   - Logging for both services

## Docker Deployment

### Building the Image

```bash
docker build -t edumaster-with-bot .
```

### Running the Container

```bash
docker run -d \
  --name edumaster \
  -p 80:80 \
  -p 8000:8000 \
  -e BOT_TOKEN="your_telegram_bot_token" \
  edumaster-with-bot
```

### Environment Variables

- `BOT_TOKEN` - Telegram bot token (required)
- `PORT` - Port for the bot API (defaults to 8000)

## File Structure

```
.
├── Dockerfile                 # Multi-stage Dockerfile
├── supervisord.conf          # Process manager configuration
├── nginx.conf               # Nginx configuration
├── package.json             # Node.js dependencies and scripts
├── telegram_bot/            # Python bot directory
│   ├── bot.py              # Telegram bot logic
│   ├── api.py              # Flask API server
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Bot documentation
└── src/                     # React frontend source
```

## Services

### Frontend (Nginx)

- Serves the React application
- Handles React Router routes
- Proxies API requests to the bot

### Backend (Python Bot)

- Telegram bot using python-telegram-bot library
- Flask API for frontend integration
- Session and user management
- Channel verification logic

## API Endpoints

The bot API is accessible at `/api/` relative to the main domain:

- `POST /api/generate_login_url` - Generate a login URL for Telegram
- `GET /api/check_login_status` - Check the status of a login session
- `GET /api/health` - Health check endpoint
- `GET /api/logs/activity` - Get activity logs
- `GET /api/logs/login` - Get login logs

## Configuration

### Mandatory Channels

Update the `MANDATORY_CHANNELS` list in `telegram_bot/bot.py` to match your required channels:

```python
MANDATORY_CHANNELS = [
    '@Team_Masters_TM',
    'https://t.me/+uMpwtK3Bu8w0MzU1',
    'https://t.me/+rs2CiB7YDbJlM2M1',
    '@EduMaster2008',
    '@masters_chat_official'
]
```

### Session Expiration

Adjust the session expiration time in `telegram_bot/bot.py`:

```python
SESSION_EXPIRATION = 3600  # 1 hour in seconds
```

## Troubleshooting

### Common Issues

1. **Bot not responding**: Check that `BOT_TOKEN` is correctly set
2. **Channel verification failing**: Ensure the bot has permission to check membership
3. **API endpoints not accessible**: Verify nginx proxy configuration
4. **Services not starting**: Check supervisord logs in `/var/log/supervisor/`

### Log Files

- Nginx logs: `/var/log/nginx/`
- Supervisord logs: `/var/log/supervisor/`
- Bot logs: `/var/log/supervisor/telegram-bot.log`

## Development

### Running Locally

1. Start the frontend:
   ```bash
   npm run dev
   ```

2. Start the bot:
   ```bash
   npm run bot:dev
   ```

### Testing the Bot

1. Create a Telegram bot with @BotFather
2. Set the `BOT_TOKEN` environment variable
3. Run the bot locally
4. Test with Telegram commands:
   - `/start` - Initialize the bot
   - Click "Verify Membership" button to test channel verification

## Deployment to Koyeb

To deploy to Koyeb:

1. Push the code to a Git repository
2. Create a new Koyeb service
3. Set the `BOT_TOKEN` environment variable
4. Configure the service to use the Dockerfile
5. Set the health check endpoint to `/api/health`

## Security Considerations

- Keep `BOT_TOKEN` secret and never commit it to version control
- Use HTTPS in production
- Validate all API inputs
- Limit API rate if necessary
- Regularly update dependencies