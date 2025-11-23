# 🚀 Heroku Deployment Guide - Portfolio with Docker

This guide will walk you through deploying your Laravel API and React Frontend to Heroku using Docker containers.

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Heroku CLI** installed - [Download here](https://devcenter.heroku.com/articles/heroku-cli)
2. **Docker** installed and running - [Download here](https://www.docker.com/products/docker-desktop)
3. **Git** installed
4. A **Heroku account** - [Sign up here](https://signup.heroku.com/)

## 🏗️ Architecture Overview

Your portfolio consists of two separate applications:
- **Backend**: Laravel API (portfolio-api)
- **Frontend**: React SPA (portfolio-frontend)

Both will be deployed as separate Heroku apps using Docker containers.

## 📁 Project Structure

```
portfolio/
├── portfolio-api/          # Laravel Backend
│   ├── Dockerfile
│   ├── heroku.yml
│   ├── Procfile
│   ├── docker/
│   │   ├── nginx/
│   │   ├── supervisor/
│   │   └── deploy.sh
│   └── .dockerignore
├── portfolio-frontend/     # React Frontend
│   ├── Dockerfile
│   ├── heroku.yml
│   ├── docker/
│   │   ├── nginx.conf
│   │   └── env-config.sh
│   └── .dockerignore
├── docker-compose.yml      # Local development
└── scripts/                # Deployment scripts
    ├── deploy-api-to-heroku.bat
    ├── deploy-frontend-to-heroku.bat
    ├── deploy-api-to-heroku.sh
    └── deploy-frontend-to-heroku.sh
```

## 🚀 Quick Start - Automated Deployment

### For Windows Users:

```cmd
# Deploy API
cd scripts
deploy-api-to-heroku.bat my-portfolio-api

# Deploy Frontend (replace with your API URL)
deploy-frontend-to-heroku.bat my-portfolio-frontend https://my-portfolio-api.herokuapp.com/api
```

### For Linux/Mac Users:

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Deploy API
./scripts/deploy-api-to-heroku.sh my-portfolio-api

# Deploy Frontend
./scripts/deploy-frontend-to-heroku.sh my-portfolio-frontend https://my-portfolio-api.herokuapp.com/api
```

## 📝 Manual Deployment Steps

### Step 1: Install Heroku CLI

```bash
# Verify installation
heroku --version

# Login to Heroku
heroku login
```

### Step 2: Login to Heroku Container Registry

```bash
heroku container:login
```

### Step 3: Deploy Laravel API

```bash
# Navigate to API directory
cd portfolio-api

# Create Heroku app
heroku create my-portfolio-api

# Set stack to container
heroku stack:set container --app my-portfolio-api

# Add MySQL database (JawsDB free tier)
heroku addons:create jawsdb:kitefin --app my-portfolio-api

# Wait for database to provision (about 1-2 minutes)
# You can check status with:
heroku addons:info jawsdb --app my-portfolio-api

# Set environment variables
heroku config:set \
  APP_ENV=production \
  APP_DEBUG=false \
  LOG_CHANNEL=stderr \
  SESSION_DRIVER=database \
  CACHE_STORE=database \
  QUEUE_CONNECTION=database \
  --app my-portfolio-api

# Generate and set Laravel APP_KEY
php artisan key:generate --show
# Copy the output and run:
heroku config:set APP_KEY=base64:your-generated-key-here --app my-portfolio-api

# Build and push Docker image
heroku container:push web --app my-portfolio-api

# Release the container
heroku container:release web --app my-portfolio-api

# Run database migrations
heroku run php artisan migrate --force --app my-portfolio-api

# Optional: Seed database if you have seeders
heroku run php artisan db:seed --force --app my-portfolio-api

# Open your API
heroku open --app my-portfolio-api
```

### Step 4: Configure CORS for API

Update your API's CORS settings to allow your frontend domain:

```bash
# Get your frontend URL first (after deploying frontend)
heroku config:set \
  FRONTEND_URL=https://my-portfolio-frontend.herokuapp.com \
  SANCTUM_STATEFUL_DOMAINS=my-portfolio-frontend.herokuapp.com \
  --app my-portfolio-api
```

### Step 5: Deploy React Frontend

```bash
# Navigate to frontend directory
cd ../portfolio-frontend

# Create Heroku app
heroku create my-portfolio-frontend

# Set stack to container
heroku stack:set container --app my-portfolio-frontend

# Set environment variables (use your API URL)
heroku config:set \
  VITE_API_URL=https://my-portfolio-api.herokuapp.com/api \
  VITE_API_TIMEOUT=15000 \
  --app my-portfolio-frontend

# Build and push Docker image
heroku container:push web --app my-portfolio-frontend

# Release the container
heroku container:release web --app my-portfolio-frontend

# Open your frontend
heroku open --app my-portfolio-frontend
```

## 🧪 Local Testing with Docker

Before deploying to Heroku, test your Docker setup locally:

```bash
# Copy environment file
cp .env.docker .env

# Edit .env with your local configuration
# Set DB_PASSWORD, API_APP_KEY, etc.

# Build and start all services
docker-compose up --build

# Access the applications:
# Frontend: http://localhost:3000
# API: http://localhost:8000

# Stop services
docker-compose down

# Clean up (remove volumes)
docker-compose down -v
```

## 🔧 Configuration Files Explained

### portfolio-api/Dockerfile
Multi-stage build for Laravel with PHP-FPM, Nginx, and Supervisor.

### portfolio-api/heroku.yml
Tells Heroku to use container deployment for the API.

### portfolio-api/Procfile
Defines the web process that runs on Heroku (deployment script + supervisor).

### portfolio-frontend/Dockerfile
Multi-stage build: builds React app, then serves with Nginx.

### portfolio-frontend/docker/env-config.sh
Runtime script to inject environment variables into the React app.

## 🗄️ Database Setup

### JawsDB MySQL (Free Tier)

Heroku provides several MySQL options. JawsDB offers a free tier:
- 5MB storage
- 10 connections
- Perfect for development/testing

The deployment script automatically adds JawsDB and configures Laravel to use it.

### Manual Database Configuration

If you need to configure the database manually:

```bash
# Get JawsDB URL
heroku config:get JAWSDB_URL --app my-portfolio-api

# The URL format is:
# mysql://username:password@hostname:port/database_name

# Set individual Laravel DB config vars
heroku config:set \
  DB_CONNECTION=mysql \
  DB_HOST=your-db-host \
  DB_PORT=3306 \
  DB_DATABASE=your-db-name \
  DB_USERNAME=your-db-username \
  DB_PASSWORD=your-db-password \
  --app my-portfolio-api
```

## 🔐 Environment Variables

### API Required Variables:
```bash
APP_KEY=base64:...          # Generate with: php artisan key:generate --show
APP_ENV=production
APP_DEBUG=false
DB_HOST=...                 # From JawsDB
DB_PORT=3306
DB_DATABASE=...             # From JawsDB
DB_USERNAME=...             # From JawsDB
DB_PASSWORD=...             # From JawsDB
FRONTEND_URL=https://...    # Your frontend URL
```

### Frontend Required Variables:
```bash
VITE_API_URL=https://...    # Your API URL + /api
VITE_API_TIMEOUT=15000
```

## 📊 Monitoring and Logs

### View Logs:
```bash
# API logs
heroku logs --tail --app my-portfolio-api

# Frontend logs
heroku logs --tail --app my-portfolio-frontend
```

### Check App Status:
```bash
heroku ps --app my-portfolio-api
heroku ps --app my-portfolio-frontend
```

### Scale Dynos:
```bash
# Scale up
heroku ps:scale web=1 --app my-portfolio-api

# Scale down (stop)
heroku ps:scale web=0 --app my-portfolio-api
```

## 🔄 Updating Your Application

### Update API:
```bash
cd portfolio-api

# Make your changes, then:
heroku container:push web --app my-portfolio-api
heroku container:release web --app my-portfolio-api

# Run new migrations if needed
heroku run php artisan migrate --force --app my-portfolio-api
```

### Update Frontend:
```bash
cd portfolio-frontend

# Make your changes, then:
heroku container:push web --app my-portfolio-frontend
heroku container:release web --app my-portfolio-frontend
```

## 🐛 Troubleshooting

### Application Crashes:
```bash
# Check logs
heroku logs --tail --app your-app-name

# Check dyno status
heroku ps --app your-app-name

# Restart dynos
heroku restart --app your-app-name
```

### Database Issues:
```bash
# Check database connection
heroku run php artisan db:show --app my-portfolio-api

# Reset database (WARNING: Deletes all data)
heroku run php artisan migrate:fresh --force --app my-portfolio-api
```

### Container Build Issues:
```bash
# Check if Docker is running
docker --version

# Test build locally
docker build -t test-build .

# Check Heroku container registry login
heroku container:login
```

### Environment Variable Issues:
```bash
# List all config vars
heroku config --app your-app-name

# Set a variable
heroku config:set VAR_NAME=value --app your-app-name

# Unset a variable
heroku config:unset VAR_NAME --app your-app-name
```

## 💰 Cost Considerations

### Free Tier:
- **Dynos**: 1000 free dyno hours/month (with credit card verification)
- **Database**: JawsDB Kitefin (5MB free)
- **Limitations**: 
  - Apps sleep after 30 minutes of inactivity
  - Cold start delay when waking up
  - Limited to 2 web processes

### Paid Options:
- **Hobby Dyno** ($7/month): Never sleeps, custom domains
- **Database**: ClearDB or JawsDB paid plans for more storage

## 🔗 Custom Domain

To use a custom domain:

```bash
# Add domain
heroku domains:add www.yourdomain.com --app my-portfolio-frontend

# Get DNS target
heroku domains --app my-portfolio-frontend

# Update your DNS provider with the provided CNAME/DNS target
```

## 📚 Additional Resources

- [Heroku Docker Deployment](https://devcenter.heroku.com/articles/container-registry-and-runtime)
- [Heroku CLI Reference](https://devcenter.heroku.com/articles/heroku-cli-commands)
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [Heroku Add-ons](https://elements.heroku.com/addons)

## ✅ Deployment Checklist

- [ ] Install Heroku CLI and Docker
- [ ] Login to Heroku and Container Registry
- [ ] Create API app and add database
- [ ] Configure API environment variables
- [ ] Deploy API container
- [ ] Run database migrations
- [ ] Create Frontend app
- [ ] Configure Frontend environment variables (with API URL)
- [ ] Deploy Frontend container
- [ ] Update API CORS settings with Frontend URL
- [ ] Test both applications
- [ ] Set up monitoring/logging
- [ ] Configure custom domain (optional)

## 🎉 Success!

Your portfolio is now live on Heroku! 

- **Frontend**: https://my-portfolio-frontend.herokuapp.com
- **API**: https://my-portfolio-api.herokuapp.com

For ongoing maintenance, remember to:
- Monitor logs regularly
- Update dependencies
- Back up your database
- Test changes locally before deploying

---

**Need help?** Check the Heroku documentation or run `heroku help` for CLI assistance.
