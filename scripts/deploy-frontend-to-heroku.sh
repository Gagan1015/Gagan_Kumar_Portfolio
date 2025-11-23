#!/bin/bash

# Heroku Deployment Script for React Frontend
# Usage: ./scripts/deploy-frontend-to-heroku.sh [app-name] [api-url]

APP_NAME=${1:-portfolio-frontend}
API_URL=${2:-https://portfolio-api.herokuapp.com/api}

echo "🚀 Deploying Portfolio Frontend to Heroku..."
echo "App Name: $APP_NAME"
echo "API URL: $API_URL"

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first."
    echo "Visit: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Login to Heroku (if not already logged in)
echo "📝 Checking Heroku authentication..."
heroku auth:whoami || heroku login

# Login to Heroku Container Registry
echo "🔐 Logging into Heroku Container Registry..."
heroku container:login

# Create Heroku app if it doesn't exist
if ! heroku apps:info --app $APP_NAME &> /dev/null; then
    echo "📦 Creating Heroku app: $APP_NAME..."
    heroku create $APP_NAME
else
    echo "✅ App $APP_NAME already exists"
fi

# Set stack to container
echo "🐳 Setting stack to container..."
heroku stack:set container --app $APP_NAME

# Set environment variables
echo "⚙️  Configuring environment variables..."
heroku config:set \
    VITE_API_URL=$API_URL \
    VITE_API_TIMEOUT=15000 \
    --app $APP_NAME

# Build and push Docker image
echo "🏗️  Building and pushing Docker image..."
cd portfolio-frontend
heroku container:push web --app $APP_NAME

# Release the image
echo "🚢 Releasing the application..."
heroku container:release web --app $APP_NAME

# Open the application
echo "✅ Deployment complete!"
echo "🌐 Your frontend is available at: https://$APP_NAME.herokuapp.com"
heroku open --app $APP_NAME
