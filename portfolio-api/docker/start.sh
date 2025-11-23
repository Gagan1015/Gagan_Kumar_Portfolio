#!/bin/bash

# Replace port 80 with Heroku's PORT in nginx config
sed -i "s/listen 80;/listen ${PORT:-80};/" /etc/nginx/sites-available/default

# Run deployment tasks
bash docker/deploy.sh

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
