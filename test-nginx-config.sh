#!/bin/bash

# Test nginx configuration
echo "Testing nginx configuration..."

# Create temporary directory structure
mkdir -p /tmp/nginx-test/logs

# Test the configuration
nginx -t -c $(pwd)/nginx.conf

if [ $? -eq 0 ]; then
    echo "Nginx configuration is valid"
else
    echo "Nginx configuration has errors"
    exit 1
fi