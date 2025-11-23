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

# Create storage link if it doesn't exist
if [ ! -L public/storage ]; then
    echo "Creating storage link..."
    php artisan storage:link
fi

# Set correct permissions
echo "Setting permissions..."
chmod -R 775 storage bootstrap/cache

echo "Deployment completed successfully!"
