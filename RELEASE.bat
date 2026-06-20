@echo off
REM ARKITECT — publish a new version in one go.
REM Double-click this, type the new number (like 1.0.1), done.
title ARKITECT - Release
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0release.ps1" %*
