@echo off
:: FissionBypass Pro - ONE-CLICK INSTALLER
:: Just double-click this and everything is set up!

title FissionBypass Pro - Installer
color 0A

echo.
echo  ======================================================
echo   FissionBypass Pro - ONE-CLICK INSTALLER
echo  ======================================================
echo.
echo  This will:
echo    1. Check for Node.js
echo    2. Auto-detect your Google Drive folder
echo    3. Create CNC Files folder if needed
echo    4. Install auto-startup (runs when Windows boots)
echo    5. Start the watcher immediately
echo.
echo  ======================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo  ERROR: Node.js is not installed!
    echo.
    echo  Please install Node.js from: https://nodejs.org/
    echo  Then run this installer again.
    echo.
    pause
    exit /b 1
)

echo  [OK] Node.js found
echo.

:: Change to script directory
cd /d "%~dp0"
cd ..

:: Install startup
echo  Installing auto-startup...
node scripts\install-startup.js
echo.

:: Start the watcher
echo  Starting FissionBypass Watcher...
echo.
echo  ======================================================
echo   INSTALLATION COMPLETE!
echo  ======================================================
echo.
echo  The watcher is now running and will auto-start on boot!
echo  Just drop .nc files into your Google Drive CNC folder.
echo.
echo  To stop: Close this window or press Ctrl+C
echo  To uninstall: npm run uninstall-startup
echo.

node src\drive-watcher.js
pause
