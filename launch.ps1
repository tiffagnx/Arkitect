# ARKITECT — one-click launcher (B 2026-06-11: "everything that
# needs to turn on, turns on"). Runs HIDDEN: no console garbage.
#  1. LM Studio server up (her brain's socket)
#  2. her model loaded if it isn't already
#  3. the ARKITECT server up
#  4. browser opens to her
# The image engine is NOT started here — it boots itself on demand the
# first time an image is asked for (keeps 11GB of RAM free otherwise).

$ErrorActionPreference = "SilentlyContinue"
$lms = "$env:USERPROFILE\.lmstudio\bin\lms.exe"
$room = "C:\Users\koonc\Desktop\Projects\pink-room"
$model = "google/gemma-4-e4b"

# 1. LM Studio server (idempotent — returns fast if already running)
if (Test-Path $lms) {
  Start-Process -FilePath $lms -ArgumentList "server","start" -WindowStyle Hidden -Wait
}

# 2. Her model — load only if the server doesn't already list it
$loaded = $false
try {
  $models = (Invoke-RestMethod -Uri "http://localhost:1234/v1/models" -TimeoutSec 8).data.id
  if ($models -contains $model) { $loaded = $true }
} catch { }
if (-not $loaded -and (Test-Path $lms)) {
  # background load — the room comes up while the brain warms.
  # -c 16384: her full personality (~4k tok) + memory needs the room; fits her 8GB card (~7GB).
  Start-Process -FilePath $lms -ArgumentList "load",$model,"-c","16384","--gpu","max","-y" -WindowStyle Hidden
}

# 3. The ARKITECT server (skip if already up)
$up = $false
try { $null = Invoke-WebRequest -Uri "http://127.0.0.1:7777/" -TimeoutSec 3 -UseBasicParsing; $up = $true } catch { }
if (-not $up) {
  Start-Process -FilePath "$room\venv\Scripts\python.exe" `
    -ArgumentList "-m","uvicorn","app:app","--host","127.0.0.1","--port","7777" `
    -WorkingDirectory $room -WindowStyle Hidden
  for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep 1
    try { $null = Invoke-WebRequest -Uri "http://127.0.0.1:7777/" -TimeoutSec 2 -UseBasicParsing; break } catch { }
  }
}

# 4. Walk in
Start-Process "http://localhost:7777"
