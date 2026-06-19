@echo off
title ARKITECT - restart
echo.
echo    Restarting ARKITECT with the latest version...
echo    (stopping the old server, then starting fresh)
echo.
rem Stop the ARKITECT server on port 7777 — the listening process AND its parent
rem (covers uvicorn's auto-reload parent+worker), so the new code can take the port.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$cs = Get-NetTCPConnection -LocalPort 7777 -State Listen -ErrorAction SilentlyContinue; foreach($c in $cs){ $opid=$c.OwningProcess; try{ $par=(Get-CimInstance Win32_Process -Filter ('ProcessId='+$opid)).ParentProcessId }catch{ $par=0 }; if($par -gt 4){ taskkill /F /T /PID $par 2>$null }; taskkill /F /T /PID $opid 2>$null }"
rem let the port release
ping -n 3 127.0.0.1 >nul
rem launch fresh (START HERE re-runs setup + starts the server on the latest code)
start "" "%~dp0START HERE.bat"
exit
