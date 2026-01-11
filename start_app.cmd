@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
echo Starting Backend...
start "Backend" /D backend cmd /c "npm run start:dev"
echo Starting Frontend...
start "Frontend" cmd /c "npm run dev"
echo Application started. Check the new windows.
pause
