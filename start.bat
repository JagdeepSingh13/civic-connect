@echo off
echo Starting Civic Connect Application...
echo.

echo [1/4] Starting MongoDB (if not already running)...
echo Please ensure MongoDB is running on localhost:27017
echo.

echo [2/4] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul

echo [3/4] Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul

echo [4/4] Application Started!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
