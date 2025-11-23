#!/bin/bash

# Wait for database connection
until php artisan db:show 2>/dev/null; do
  echo "Waiting for database connection..."
  sleep 2
done

echo "Database is ready!"
