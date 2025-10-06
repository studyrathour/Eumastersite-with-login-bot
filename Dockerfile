# Multi-stage Dockerfile for EduMaster with integrated Telegram bot

# Stage 1: Build the React application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Setup Python bot environment
FROM python:3.9-alpine AS bot-builder

# Set working directory
WORKDIR /bot

# Copy bot requirements
COPY telegram_bot/requirements.txt .

# Install Python dependencies
RUN apk add --no-cache gcc musl-dev libffi-dev openssl-dev && \
    pip install --no-cache-dir -r requirements.txt

# Copy bot code
COPY telegram_bot/ .

# Stage 3: Final stage with both frontend and backend
FROM node:20-alpine

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor

# Create directories
RUN mkdir -p /var/www/html /var/log/supervisor

# Copy the built application from the builder stage
COPY --from=builder /app/dist /var/www/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy bot files
COPY --from=bot-builder /bot /app/bot

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 80 8000

# Start supervisor to manage both nginx and the bot
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]