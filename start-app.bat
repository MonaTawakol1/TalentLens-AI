@echo off
echo Starting TalentLens AI...

:: Start Backend
echo Starting Backend Server...
start "TalentLens Backend" cmd /k "cd backend && npm run start:dev"

:: Start Frontend
echo Starting Frontend Server...
start "TalentLens Frontend" cmd /k "npm run dev"

:: Wait for servers to initialize
timeout /t 5 >nul

:: Open Browser
echo Opening Application...
start http://localhost:5173

echo Application started successfully!
