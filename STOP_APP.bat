@echo off
title Stopping Lumiere Restaurant Services

echo Stopping all Node.js processes...
taskkill /f /im node.exe >nul 2>&1

echo Stopping MongoDB...
taskkill /f /im mongod.exe >nul 2>&1

echo.
echo All services stopped.
pause
