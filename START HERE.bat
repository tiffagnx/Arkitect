@echo off
title Tiff's Pink Room
cd /d "%~dp0"

echo ============================================
echo    TIFF'S PINK ROOM
echo ============================================
echo.

REM ---- 1. find Python ----
set "PY="
where py >nul 2>&1 && set "PY=py"
if not defined PY ( where python >nul 2>&1 && set "PY=python" )
if not defined PY (
  echo  [!] Python is not installed yet.
  echo.
  echo      I'm opening the download page now.
  echo      Install it, and CHECK the box "Add python.exe to PATH"
  echo      on the first screen. Then run this file again.
  echo.
  start "" https://www.python.org/downloads/
  pause
  exit /b
)

REM ---- 2. first run: build the environment + install deps ----
if not exist "venv\Scripts\python.exe" (
  echo  First-time setup -- building the environment.
  echo  This takes a few minutes the first time. Hang tight...
  echo.
  %PY% -m venv venv
  "venv\Scripts\python.exe" -m pip install --upgrade pip
  "venv\Scripts\python.exe" -m pip install -r requirements.txt
  echo.
  echo  Setup complete.
  echo.
)

REM ---- 3. start the AI engine (LM Studio) and warm a model ----
set "LMS=%USERPROFILE%\.lmstudio\bin\lms.exe"
if exist "%LMS%" (
  echo  Starting the AI engine...
  "%LMS%" server start >nul 2>&1
  "%LMS%" load google/gemma-4-e4b -c 16384 --gpu max -y >nul 2>&1
) else (
  echo  [!] LM Studio not found -- Chat and the Builder need it.
  echo      Install it from https://lmstudio.ai and download a model.
  echo      The room will still open; the AI just won't answer yet.
)
echo.

REM ---- 4. open the browser shortly after the server comes up ----
start "" cmd /c "timeout /t 8 >nul & start http://localhost:7777"

echo  ============================================
echo   Pink Room is starting...
echo   Your browser will open in a few seconds.
echo.
echo   KEEP THIS WINDOW OPEN while you use it.
echo   Close this window to stop the room.
echo  ============================================
echo.

"venv\Scripts\python.exe" -m uvicorn app:app --host 127.0.0.1 --port 7777

pause
