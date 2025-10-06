# EduMaster Telegram Bot Setup Guide

## Prerequisites

1. Python 3.7 or higher
2. Node.js 20 or higher
3. Docker (for deployment)
4. Telegram Bot Token (obtain from @BotFather)

## Installation

### 1. Install Python Dependencies

Navigate to the telegram_bot directory and install the required packages:

```bash
cd telegram_bot
pip install -r requirements.txt
```

### 2. Set Environment Variables

You need to set the following environment variables:

```bash
# Telegram bot token (obtain from @BotFather)
export BOT_TOKEN="your_telegram_bot_token_here"

# Optional: Port for the API server (defaults to 8000)
export PORT=8000
```

On Windows, use:
```cmd
set BOT_TOKEN=your_telegram_bot_token_here
set PORT=8000
```

### 3. Configure Mandatory Channels

Edit the `telegram_bot/bot.py` file to update the mandatory channels:

```python
MANDATORY_CHANNELS = [
    '@Team_Masters_TM',
    'https://t.me/+uMpwtK3Bu8w0MzU1',
    'https://t.me/+rs2CiB7YDbJlM2M1',
    '@EduMaster2008',
    '@masters_chat_official'
]
```

## Running the Services

### Development Mode

1. Start the frontend:
   ```bash
   npm run dev
   ```

2. Start the bot API:
   ```bash
   npm run bot:dev
   ```

### Production Mode

Build and run the Docker container:

```bash
docker build -t edumaster-with-bot .
docker run -d --name edumaster -p 80:80 -p 8000:8000 -e BOT_TOKEN="your_token" edumaster-with-bot
```

## Testing

### Test the Bot

1. Start a conversation with your bot on Telegram
2. Send `/start` command
3. Follow the instructions to verify channel membership

### Test the API

1. Generate a login URL:
   ```bash
   curl -X POST http://localhost:8000/generate_login_url
   ```

2. Check login status:
   ```bash
   curl http://localhost:8000/check_login_status?session_id=your_session_id
   ```

## Deployment to Koyeb

1. Push your code to a Git repository
2. Create a new Koyeb service
3. Set the `BOT_TOKEN` environment variable in Koyeb
4. Configure the service to use the Dockerfile
5. Set the health check endpoint to `/api/health`

## Troubleshooting

### Common Issues

1. **Bot not responding**: Check that `BOT_TOKEN` is correctly set
2. **Channel verification failing**: Ensure the bot has permission to check membership
3. **API endpoints not accessible**: Verify nginx proxy configuration
4. **Services not starting**: Check supervisord logs

### Log Files

- Nginx logs: `/var/log/nginx/`
- Supervisord logs: `/var/log/supervisor/`
- Bot logs: `/var/log/supervisor/telegram-bot.log`

## Security Considerations

- Keep `BOT_TOKEN` secret and never commit it to version control
- Use HTTPS in production
- Validate all API inputs
- Limit API rate if necessary
- Regularly update dependencies