@echo off
REM Heroku Deployment Script for Laravel API (Windows)
REM Usage: deploy-api-to-heroku.bat [app-name]

setlocal enabledelayedexpansion

if "%1"=="" (
    set APP_NAME=portfolio-api
) else (
    set APP_NAME=%1
)

echo 🚀 Deploying Portfolio API to Heroku...
echo App Name: %APP_NAME%

REM Check if Heroku CLI is installed
where heroku >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Heroku CLI is not installed. Please install it first.
    echo Visit: https://devcenter.heroku.com/articles/heroku-cli
    exit /b 1
)

REM Login to Heroku Container Registry
echo 🔐 Logging into Heroku Container Registry...
heroku container:login

REM Create Heroku app if it doesn't exist
echo 📦 Checking if app exists...
heroku apps:info --app %APP_NAME% >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Creating Heroku app: %APP_NAME%...
    heroku create %APP_NAME%
) else (
    echo ✅ App %APP_NAME% already exists
)

REM Set stack to container
echo 🐳 Setting stack to container...
heroku stack:set container --app %APP_NAME%

REM Add JawsDB MySQL addon
echo 🗄️  Adding MySQL database...
heroku addons:info jawsdb --app %APP_NAME% >nul 2>nul
if %ERRORLEVEL% neq 0 (
    heroku addons:create jawsdb:kitefin --app %APP_NAME%
    echo ⏳ Waiting for database to provision...
    timeout /t 10 /nobreak >nul
)

REM Set environment variables
echo ⚙️  Configuring environment variables...
heroku config:set APP_ENV=production APP_DEBUG=false LOG_CHANNEL=stderr SESSION_DRIVER=database CACHE_STORE=database QUEUE_CONNECTION=database --app %APP_NAME%

REM Generate APP_KEY if not set
heroku config:get APP_KEY --app %APP_NAME% | findstr /C:"base64:" >nul
if %ERRORLEVEL% neq 0 (
    echo 🔑 Generating APP_KEY...
    cd portfolio-api
    for /f "delims=" %%i in ('php artisan key:generate --show') do set APP_KEY=%%i
    heroku config:set APP_KEY=!APP_KEY! --app %APP_NAME%
    cd ..
)

REM Build and push Docker image
echo 🏗️  Building and pushing Docker image...
cd portfolio-api
heroku container:push web --app %APP_NAME%

REM Release the image
echo 🚢 Releasing the application...
heroku container:release web --app %APP_NAME%

REM Run database migrations
echo 🗃️  Running database migrations...
heroku run php artisan migrate --force --app %APP_NAME%

echo ✅ Deployment complete!
echo 🌐 Your API is available at: https://%APP_NAME%.herokuapp.com
heroku open --app %APP_NAME%

cd ..
endlocal
