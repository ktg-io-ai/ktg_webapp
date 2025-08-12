@echo off
echo Starting KTG Framework...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo ================================
echo   KTG Framework Starting...
echo ================================
echo.
echo Dashboard will be available at:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
npm start