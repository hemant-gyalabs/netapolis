#!/bin/bash

# Start script for Neopolis Infra Dashboard

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js version 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if .env file exists, create if it doesn't
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOL
PORT=8002
NODE_ENV=development
DB_URI=mongodb://localhost:27017/neopolis-dashboard
JWT_SECRET=neopolis-super-secret-key-change-in-production
JWT_EXPIRES_IN=1d
JWT_COOKIE_EXPIRES_IN=1
CORS_ORIGIN=http://localhost:5173
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=5242880
EOL
    echo ".env file created successfully."
fi

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    mkdir -p uploads
    echo "Created uploads directory."
fi

# Create public directory if it doesn't exist
if [ ! -d "public" ]; then
    mkdir -p public
    echo "Created public directory."
fi

# Build the frontend
echo "Building frontend..."
npm run build

# Start the server
echo "Starting server..."
npm start