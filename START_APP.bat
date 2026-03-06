@echo off
title Lumiere Restaurant - Full Stack Startup

echo ============================================
echo   Lumiere Restaurant Management System
echo ============================================
echo.
echo [1/3] Starting MongoDB...
start "MongoDB" /min "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
timeout /t 3 /nobreak > nul

echo [2/3] Starting Backend API Server...
start "Backend API" /min cmd /k "cd /d C:\Users\Admin\Desktop\Restaurant\backend && node server.js"
timeout /t 2 /nobreak > nul

echo [3/3] Starting Frontend (React)...
start "Frontend" /min cmd /k "cd /d C:\Users\Admin\Desktop\Restaurant\frontend && npm run dev"
timeout /t 3 /nobreak > nul

echo.
echo ============================================
echo   All services are starting up!
echo.
echo   Website:  http://localhost:5173/
echo   Admin:    http://localhost:5173/admin
echo   API:      http://localhost:5000/
echo.
echo   Admin login: admin / password123
echo ============================================
echo.
echo Opening website in browser...
timeout /t 3 /nobreak > nul
start http://localhost:5173/

echo Done! Close this window.
pause
