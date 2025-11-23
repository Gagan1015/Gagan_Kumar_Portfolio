#!/bin/bash
set -e

echo "Starting deployment process..."

# Wait for database to be ready
echo "Waiting for database connection..."
php artisan db:wait

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force --no-interaction

# Clear and cache configurations
echo "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage directories if they don't exist
echo "Creating storage directories..."
mkdir -p storage/app/public
mkdir -p storage/app/public/projects
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs

# Create storage link if it doesn't exist
if [ ! -L public/storage ]; then
    echo "Creating storage link..."
    php artisan storage:link
fi

# Set correct permissions
echo "Setting permissions..."
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

echo "Deployment completed successfully!"
