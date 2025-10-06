# EduMaster Telegram Bot

This is a Python-based Telegram bot for EduMaster platform authentication.

## Features

- User authentication through Telegram
- Channel membership verification
- Session management
- Activity and login logging
- REST API for integration with the frontend

## Requirements

- Python 3.7+
- Telegram Bot Token (obtain from @BotFather)

## Installation

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set environment variables:
   ```bash
   export BOT_TOKEN="your_telegram_bot_token"
   export PORT=8000  # Optional, defaults to 8000
   ```

3. Run the bot:
   ```bash
   python api.py
   ```

## API Endpoints

- `POST /generate_login_url` - Generate a login URL for Telegram
- `GET /check_login_status` - Check the status of a login session
- `GET /health` - Health check endpoint
- `GET /logs/activity` - Get activity logs
- `GET /logs/login` - Get login logs

## Environment Variables

- `BOT_TOKEN` - Telegram bot token (required)
- `PORT` - Port to run the API server on (optional, defaults to 8000)

## Configuration

The bot can be configured by modifying the constants in `bot.py`:

- `MANDATORY_CHANNELS` - List of channels users must join
- `SESSION_EXPIRATION` - Session expiration time in seconds

## Deployment

The bot is designed to be deployed alongside the EduMaster frontend in a single Docker container using supervisord to manage both services.