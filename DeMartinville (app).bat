@echo off
REM DeMartinville — open as a NATIVE WINDOW (own taskbar icon, no browser).
REM Assumes the environment is already set up (run START HERE.bat once first).
REM pythonw = no console window, so it feels like a real app.
title DeMartinville
cd /d "%~dp0"
start "" "%~dp0venv\Scripts\pythonw.exe" "%~dp0desktop.py"
