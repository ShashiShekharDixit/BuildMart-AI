@echo off
REM ============================================================
REM BuildMart AI — Quick Start Script (Windows)
REM Double-click to run, or run in Command Prompt
REM ============================================================

echo.
echo ==========================================
echo   BuildMart AI -- Quick Start (Windows)
echo ==========================================
echo.
echo Choose startup mode:
echo   1) Frontend only (no Java/MySQL needed)
echo   2) Full stack (Java 17 + MySQL + Redis)
echo   3) Docker (requires Docker Desktop)
echo.
set /p choice="Enter choice [1/2/3] (default: 1): "
if "%choice%"=="" set choice=1

if "%choice%"=="1" goto frontend_only
if "%choice%"=="2" goto full_stack
if "%choice%"=="3" goto docker_mode
goto invalid

:frontend_only
echo.
echo Starting Frontend Only...
cd frontend
if not exist "node_modules" (
  echo Installing dependencies (first time -- takes 2-3 minutes)...
  call npm install
)
echo.
echo Starting React dev server at http://localhost:3000
echo Demo data will be shown (no backend needed)
echo.
call npm start
goto end

:full_stack
echo.
echo Starting Full Stack...
echo.
echo [1/2] Starting Spring Boot backend...
start "BuildMart Backend" cmd /k "cd backend && mvn spring-boot:run"
echo Backend starting in new window...
echo.
timeout /t 30 /nobreak > nul
echo [2/2] Starting React frontend...
cd frontend
if not exist "node_modules" call npm install
start "BuildMart Frontend" cmd /k "npm start"
echo.
echo ==========================================
echo   BuildMart AI is running!
echo ==========================================
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:8080/api
echo   Swagger:   http://localhost:8080/api/swagger-ui.html
echo ==========================================
goto end

:docker_mode
echo.
echo Starting with Docker...
if not exist ".env" copy .env.example .env
docker compose up --build
goto end

:invalid
echo Invalid choice
pause

:end
