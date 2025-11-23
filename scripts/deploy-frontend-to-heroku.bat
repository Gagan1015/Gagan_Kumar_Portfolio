@echo off
REM Heroku Deployment Script for React Frontend (Windows)
REM Usage: deploy-frontend-to-heroku.bat [app-name] [api-url]

setlocal

if "%1"=="" (
    set APP_NAME=portfolio-frontend
) else (
    set APP_NAME=%1
)

if "%2"=="" (
    set API_URL=https://portfolio-api.herokuapp.com/api
) else (
    set API_URL=%2
)

echo 🚀 Deploying Portfolio Frontend to Heroku...
echo App Name: %APP_NAME%
echo API URL: %API_URL%

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

REM Set environment variables
echo ⚙️  Configuring environment variables...
heroku config:set VITE_API_URL=%API_URL% VITE_API_TIMEOUT=15000 --app %APP_NAME%

REM Build and push Docker image
echo 🏗️  Building and pushing Docker image...
cd portfolio-frontend
heroku container:push web --app %APP_NAME%

REM Release the image
echo 🚢 Releasing the application...
heroku container:release web --app %APP_NAME%

echo ✅ Deployment complete!
echo 🌐 Your frontend is available at: https://%APP_NAME%.herokuapp.com
heroku open --app %APP_NAME%

cd ..
endlocal
