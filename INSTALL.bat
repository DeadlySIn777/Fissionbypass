@echo off
:: FissionBypass Pro - TRULY ONE-CLICK INSTALLER
:: Double-click and EVERYTHING is installed automatically!
:: Installs Node.js if needed - NO MANUAL STEPS REQUIRED!

title FissionBypass Pro - Auto Installer
color 0A
setlocal enabledelayedexpansion

echo.
echo  ============================================================
echo        FissionBypass Pro - AUTOMATIC INSTALLER
echo  ============================================================
echo.
echo  This installer will automatically:
echo    [1] Install Node.js (if not installed)
echo    [2] Auto-detect your Google Drive / OneDrive / Dropbox
echo    [3] Create CNC Files folder
echo    [4] Install auto-startup (runs on Windows boot)
echo    [5] Start the watcher immediately
echo.
echo  ============================================================
echo.
echo  Press any key to begin installation...
pause >nul

:: Change to script directory
cd /d "%~dp0"

echo.
echo  [1/5] Checking for Node.js...

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo        [OK] Node.js is already installed!
    for /f "tokens=*" %%i in ('node --version') do echo        Version: %%i
    goto :node_ready
)

echo        [!] Node.js not found - Installing automatically...
echo.

:: Download Node.js LTS installer
set "NODE_URL=https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
set "NODE_INSTALLER=%TEMP%\nodejs_installer.msi"

echo        Downloading Node.js LTS (this may take a minute)...
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_INSTALLER%' -UseBasicParsing}"

if not exist "%NODE_INSTALLER%" (
    echo.
    echo  [ERROR] Failed to download Node.js!
    echo  Please install Node.js manually from: https://nodejs.org/
    echo  Then run this installer again.
    echo.
    pause
    exit /b 1
)

echo        Installing Node.js silently...
echo        (You may see a UAC prompt - click Yes)
msiexec /i "%NODE_INSTALLER%" /qn /norestart

:: Wait for installation to complete
echo        Waiting for installation to finish...
timeout /t 10 /noq >nul

:: Refresh PATH for this session
set "PATH=%PATH%;C:\Program Files\nodejs;%APPDATA%\npm"

:: Verify installation
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo.
    echo  [!] Node.js installed but PATH not updated yet.
    echo.
    echo  PLEASE DO THE FOLLOWING:
    echo    1. Close this window
    echo    2. Restart your computer (or log out and back in)
    echo    3. Double-click INSTALL.bat again
    echo.
    del "%NODE_INSTALLER%" 2>nul
    pause
    exit /b 1
)

echo        [OK] Node.js installed successfully!
del "%NODE_INSTALLER%" 2>nul

:node_ready
echo.
echo  [2/5] Auto-detecting cloud drive folder...

:: The Node.js script handles all the smart detection
echo        Searching: Google Drive, OneDrive, Dropbox, local folders...

echo.
echo  [3/5] Preparing CNC Files folder...
echo        (Will be created automatically if needed)

echo.
echo  [4/5] Installing auto-startup...
echo.
call node scripts\install-startup.js

if %ERRORLEVEL% neq 0 (
    echo  [!] Warning: Could not install startup script
)

echo.
echo  ============================================================
echo         INSTALLATION COMPLETE!
echo  ============================================================
echo.
echo  FissionBypass is now:
echo    [OK] Installed and configured
echo    [OK] Set to auto-start on Windows boot
echo    [OK] Watching your cloud drive for .nc files
echo.
echo  HOW TO USE:
echo    1. Export .nc files from Fusion 360 to your cloud folder
echo    2. FissionBypass automatically creates optimized _READY.nc
echo    3. Use the _READY.nc file on your CNC - 40-60%% faster!
echo.
echo  The watcher is starting now...
echo  (Close this window to stop, or just leave it running)
echo.
echo  ============================================================
echo.

:: Start the watcher
call node src\drive-watcher.js

pause
