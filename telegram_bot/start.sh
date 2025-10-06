#!/bin/sh

# Install Python dependencies
pip install -r requirements.txt

# Set environment variables (replace with your actual values)
export BOT_TOKEN="YOUR_BOT_TOKEN_HERE"
export PORT=8000

# Start the bot API server
python api.py