@echo off
title DOOM — BUILD SYSTEM
color 0A
echo.
echo  ██████╗  ██████╗  ██████╗ ███╗   ███╗    ███╗   ██╗███████╗██╗    ██╗███████╗
echo  ██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║    ████╗  ██║██╔════╝██║    ██║██╔════╝
echo  ██║  ██║██║   ██║██║   ██║██╔████╔██║    ██╔██╗ ██║█████╗  ██║ █╗ ██║███████╗
echo  ██║  ██║██║   ██║██║   ██║██║╚██╔╝██║    ██║╚██╗██║██╔══╝  ██║███╗██║╚════██║
echo  ██████╔╝╚██████╔╝╚██████╔╝██║ ╚═╝ ██║    ██║ ╚████║███████╗╚███╔███╔╝███████║
echo  ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝     ╚═╝    ╚═╝  ╚═══╝╚══════╝ ╚══╝╚══╝ ╚══════╝
echo.
echo  GLOBAL THREAT INTELLIGENCE SYSTEM — BUILD TOOL
echo  ================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found! 
    echo  Please install from: https://nodejs.org/
    echo  Download the LTS version and run this script again.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo  [OK] Node.js %NODE_VER% detected
echo.

:: Install dependencies
echo  [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo  [ERROR] npm install failed
    pause
    exit /b 1
)
echo  [OK] Dependencies installed
echo.

:: Build Windows exe
echo  [2/3] Building Windows executable...
call npm run build:win
if %errorlevel% neq 0 (
    echo  [ERROR] Build failed — check output above
    pause
    exit /b 1
)

echo.
echo  [3/3] Build complete!
echo.
echo  ╔══════════════════════════════════════╗
echo  ║  OUTPUT FILES:                       ║
echo  ║  dist\DOOM Setup *.exe          ║
echo  ║  dist\DOOM *.exe (portable)     ║
echo  ╚══════════════════════════════════════╝
echo.
echo  Find your files in the 'dist' folder!
echo.
pause
