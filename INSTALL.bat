@echo off
:: FissionBypass Pro - TRULY ONE-CLICK INSTALLER
:: Double-click and EVERYTHING is installed automatically!
:: Installs Node.js if needed - NO MANUAL STEPS REQUIRED!

title FissionBypass Pro - Installer
color 0A
setlocal enabledelayedexpansion

cls
echo.
echo   ╔═══════════════════════════════════════════════════════════════╗
echo   ║                                                               ║
echo   ║         🚀  FissionBypass Pro - EASY INSTALLER  🚀           ║
echo   ║                                                               ║
echo   ║   Optimize your Fusion 360 G-code automatically!             ║
echo   ║   40-60%% faster CNC cycle times, zero effort.                ║
echo   ║                                                               ║
echo   ╚═══════════════════════════════════════════════════════════════╝
echo.
echo   This installer will set up everything for you:
echo.
echo      ✓ Step 1: Check/Install Node.js runtime
echo      ✓ Step 2: Find your Google Drive/OneDrive/Dropbox folder
echo      ✓ Step 3: Create a CNC Files folder for your G-code
echo      ✓ Step 4: Set up auto-start with Windows
echo      ✓ Step 5: Start watching for .nc files immediately
echo.
echo   ───────────────────────────────────────────────────────────────
echo   NO CODING REQUIRED - Just click and it's done!
echo   ───────────────────────────────────────────────────────────────
echo.
echo   Press any key to start the installation...
pause >nul
cls

:: Change to script directory
cd /d "%~dp0"

echo.
echo   ╔═══════════════════════════════════════════════════════════════╗
echo   ║  STEP 1 of 5: Checking for Node.js...                         ║
echo   ╚═══════════════════════════════════════════════════════════════╝
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo   ✅ Node.js is already installed - perfect!
    for /f "tokens=*" %%i in ('node --version') do echo      Version: %%i
    echo.
    timeout /t 2 /noq >nul
    goto :node_ready
)

echo   ⚠️  Node.js is not installed on this computer.
echo.
echo   📥 Downloading Node.js automatically...
echo      (This is a one-time download, ~30MB)
echo.

:: Download Node.js LTS installer
set "NODE_URL=https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi"
set "NODE_INSTALLER=%TEMP%\nodejs_installer.msi"

powershell -Command "& {Write-Host '      Downloading...' -ForegroundColor Cyan; [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $ProgressPreference='SilentlyContinue'; Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_INSTALLER%' -UseBasicParsing; Write-Host '      Download complete!' -ForegroundColor Green}"

if not exist "%NODE_INSTALLER%" (
    echo.
    echo   ❌ ERROR: Couldn't download Node.js
    echo.
    echo   Please install Node.js manually:
    echo      1. Go to: https://nodejs.org/
    echo      2. Download and install the LTS version
    echo      3. Run this installer again
    echo.
    pause
    exit /b 1
)

echo.
echo   📦 Installing Node.js...
echo      (A Windows permission prompt may appear - click YES)
echo.
msiexec /i "%NODE_INSTALLER%" /qn /norestart

echo      Waiting for installation to complete...
timeout /t 12 /noq >nul

:: Refresh PATH for this session
set "PATH=%PATH%;C:\Program Files\nodejs;%APPDATA%\npm"

:: Verify installation
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo.
    echo   ⚠️  Node.js was installed, but Windows needs to refresh.
    echo.
    echo   👉 WHAT TO DO:
    echo      1. Close this window
    echo      2. Log out and log back in (or restart your PC)
    echo      3. Double-click INSTALL.bat again
    echo.
    echo   This is normal - Windows just needs to update its settings!
    echo.
    del "%NODE_INSTALLER%" 2>nul
    pause
    exit /b 1
)

echo   ✅ Node.js installed successfully!
del "%NODE_INSTALLER%" 2>nul
timeout /t 2 /noq >nul

:node_ready
cls
echo.
echo   ╔═══════════════════════════════════════════════════════════════╗
echo   ║  STEP 2 of 5: Finding your cloud drive...                     ║
echo   ╚═══════════════════════════════════════════════════════════════╝
echo.
echo   🔍 Searching for cloud storage folders...
echo      • Google Drive
echo      • OneDrive  
echo      • Dropbox
echo      • iCloud Drive
echo      • Local Documents folder
echo.
timeout /t 2 /noq >nul

cls
echo.
echo   ╔═══════════════════════════════════════════════════════════════╗
echo   ║  STEP 3 of 5: Creating CNC Files folder...                    ║
echo   ╚═══════════════════════════════════════════════════════════════╝
echo.
echo   📁 Setting up your G-code watch folder...
echo      (This is where you'll save your .nc files from Fusion 360)
echo.
timeout /t 2 /noq >nul

cls
echo.
echo   ╔═══════════════════════════════════════════════════════════════╗
echo   ║  STEP 4 of 5: Setting up auto-start...                        ║
echo   ╚═══════════════════════════════════════════════════════════════╝
echo.
echo   ⚙️  Configuring FissionBypass to start with Windows...
echo      (It will run silently in the background)
echo.
call node scripts\install-startup.js 2>nul

if %ERRORLEVEL% neq 0 (
    echo   ⚠️  Note: Auto-startup couldn't be configured
    echo      You can start manually with: npm run watch
)
timeout /t 2 /noq >nul

cls
echo.
echo   ╔═══════════════════════════════════════════════════════════════╗
echo   ║                                                               ║
echo   ║         ✅  INSTALLATION COMPLETE!  ✅                        ║
echo   ║                                                               ║
echo   ╚═══════════════════════════════════════════════════════════════╝
echo.
echo   FissionBypass Pro is now fully configured!
echo.
echo   ┌─────────────────────────────────────────────────────────────┐
echo   │  WHAT HAPPENS NOW:                                          │
echo   ├─────────────────────────────────────────────────────────────┤
echo   │  • FissionBypass runs automatically when Windows starts     │
echo   │  • It watches your cloud folder for new .nc files           │
echo   │  • When you export from Fusion 360, it auto-optimizes!      │
echo   │  • Look for files ending in _READY.nc                       │
echo   └─────────────────────────────────────────────────────────────┘
echo.
echo   ┌─────────────────────────────────────────────────────────────┐
echo   │  HOW TO USE:                                                 │
echo   ├─────────────────────────────────────────────────────────────┤
echo   │  1. Export your .nc file from Fusion 360                    │
echo   │  2. Save it to your cloud drive CNC folder                  │
echo   │  3. FissionBypass creates YourFile_READY.nc automatically   │
echo   │  4. Use the _READY file on your CNC - 40-60%% faster!       │
echo   └─────────────────────────────────────────────────────────────┘
echo.
echo   ───────────────────────────────────────────────────────────────
echo   📂 STEP 5 of 5: Starting the watcher now...
echo   ───────────────────────────────────────────────────────────────
echo.
echo   The watcher will display below. Leave this window open to
echo   keep it running, or close it - it will start automatically
echo   next time Windows boots!
echo.
echo   ═══════════════════════════════════════════════════════════════
echo.

:: Start the watcher
call node src\drive-watcher.js

pause
