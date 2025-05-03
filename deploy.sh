#!/bin/bash
# Deployment script for Neopolis Dashboard

# Error handling
set -e

# Configuration
ENV=${1:-production}
BUILD_DIR="build"
DEPLOY_DIR="/var/www/neopolisinfra.com/dashboard"
BACKUP_DIR="/var/www/backups/dashboard"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# Print banner
echo "====================================================="
echo "  Neopolis Dashboard Deployment Script"
echo "  Environment: $ENV"
echo "  Timestamp: $(date)"
echo "====================================================="

# Check if running with appropriate permissions
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or with sudo"
  exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup current deployment if it exists
if [ -d "$DEPLOY_DIR" ]; then
  echo "Backing up current deployment..."
  tar -czf "$BACKUP_DIR/dashboard_backup_$TIMESTAMP.tar.gz" $DEPLOY_DIR
  echo "Backup created at $BACKUP_DIR/dashboard_backup_$TIMESTAMP.tar.gz"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application for the specified environment
echo "Building application for $ENV environment..."
if [ "$ENV" = "production" ]; then
  npm run build
elif [ "$ENV" = "staging" ]; then
  npm run build:staging
else
  npm run build:dev
fi

# Ensure build directory exists
if [ ! -d "$BUILD_DIR" ]; then
  echo "Build failed! Build directory not found."
  exit 1
fi

# Create deployment directory if it doesn't exist
mkdir -p $DEPLOY_DIR

# Deploy the application
echo "Deploying application to $DEPLOY_DIR..."
rm -rf $DEPLOY_DIR/*
cp -r $BUILD_DIR/* $DEPLOY_DIR/

# Set appropriate permissions
echo "Setting permissions..."
chown -R www-data:www-data $DEPLOY_DIR
chmod -R 755 $DEPLOY_DIR

# Restart web server
echo "Restarting web server..."
systemctl restart nginx

# Print success message
echo "====================================================="
echo "  Deployment completed successfully!"
echo "  Application deployed to $DEPLOY_DIR"
echo "  Environment: $ENV"
echo "  Timestamp: $(date)"
echo "====================================================="

# Optional: Run post-deployment tests
if [ "$2" = "--test" ]; then
  echo "Running post-deployment tests..."
  curl -s http://localhost/dashboard/ > /dev/null
  if [ $? -eq 0 ]; then
    echo "Tests passed! Application is accessible."
  else
    echo "Tests failed! Application may not be accessible."
  fi
fi