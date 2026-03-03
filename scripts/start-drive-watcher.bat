@echo off
:: FissionBypass Pro - Google Drive Auto Watcher
:: Double-click this to start watching your Google Drive folder!

title FissionBypass Pro - Drive Watcher

echo.
echo  ======================================================
echo   FissionBypass Pro - Google Drive Auto Watcher
echo  ======================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo  ERROR: Node.js is not installed!
    echo  Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Change to script directory
cd /d "%~dp0"
cd ..

:: Run the watcher
echo  Starting watcher...
echo  (Edit config in src\drive-watcher.js to change settings)
echo.
node src\drive-watcher.js %*

pause
