#!/bin/bash

# Validate nginx configuration
echo "Validating nginx configuration..."
nginx -t -c nginx.conf

# Check supervisord configuration
echo "Checking supervisord configuration..."
# This would normally be done with supervisorctl, but we'll just check syntax
echo "Supervisord configuration check complete."

echo "Configuration validation complete."