#!/bin/bash

# Heroku Deployment Script for Laravel API
# Usage: ./scripts/deploy-api-to-heroku.sh [app-name]

APP_NAME=${1:-portfolio-api}

echo "🚀 Deploying Portfolio API to Heroku..."
echo "App Name: $APP_NAME"

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

# Add JawsDB MySQL addon (free tier)
echo "🗄️  Adding MySQL database..."
if ! heroku addons:info jawsdb --app $APP_NAME &> /dev/null; then
    heroku addons:create jawsdb:kitefin --app $APP_NAME
    echo "⏳ Waiting for database to provision..."
    sleep 10
else
    echo "✅ Database already exists"
fi

# Get JawsDB connection details and set Laravel environment variables
echo "⚙️  Configuring environment variables..."
JAWSDB_URL=$(heroku config:get JAWSDB_URL --app $APP_NAME)

if [ -n "$JAWSDB_URL" ]; then
    # Parse the JAWSDB_URL
    DB_USERNAME=$(echo $JAWSDB_URL | sed -e 's/mysql:\/\/\([^:]*\):.*/\1/')
    DB_PASSWORD=$(echo $JAWSDB_URL | sed -e 's/mysql:\/\/[^:]*:\([^@]*\)@.*/\1/')
    DB_HOST=$(echo $JAWSDB_URL | sed -e 's/mysql:\/\/[^@]*@\([^:]*\):.*/\1/')
    DB_PORT=$(echo $JAWSDB_URL | sed -e 's/mysql:\/\/[^@]*@[^:]*:\([^\/]*\)\/.*/\1/')
    DB_DATABASE=$(echo $JAWSDB_URL | sed -e 's/.*\/\(.*\)/\1/')

    heroku config:set \
        APP_ENV=production \
        APP_DEBUG=false \
        LOG_CHANNEL=stderr \
        DB_CONNECTION=mysql \
        DB_HOST=$DB_HOST \
        DB_PORT=$DB_PORT \
        DB_DATABASE=$DB_DATABASE \
        DB_USERNAME=$DB_USERNAME \
        DB_PASSWORD=$DB_PASSWORD \
        SESSION_DRIVER=database \
        CACHE_STORE=database \
        QUEUE_CONNECTION=database \
        --app $APP_NAME
fi

# Generate and set APP_KEY if not set
if [ -z "$(heroku config:get APP_KEY --app $APP_NAME)" ]; then
    echo "🔑 Generating APP_KEY..."
    APP_KEY=$(php artisan key:generate --show)
    heroku config:set APP_KEY=$APP_KEY --app $APP_NAME
fi

# Build and push Docker image
echo "🏗️  Building and pushing Docker image..."
cd portfolio-api
heroku container:push web --app $APP_NAME

# Release the image
echo "🚢 Releasing the application..."
heroku container:release web --app $APP_NAME

# Run database migrations
echo "🗃️  Running database migrations..."
heroku run php artisan migrate --force --app $APP_NAME

# Open the application
echo "✅ Deployment complete!"
echo "🌐 Your API is available at: https://$APP_NAME.herokuapp.com"
heroku open --app $APP_NAME
