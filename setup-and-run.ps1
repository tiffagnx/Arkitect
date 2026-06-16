# Tiff's Pink Room - smart setup + launcher
# Double-clicked via "START HERE.bat". Auto-installs everything it can,
# detects the PC's specs to recommend/download the right model, then runs.
$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

function Head($m){ Write-Host $m -ForegroundColor Magenta }
function Info($m){ Write-Host $m -ForegroundColor Gray }
function Warn($m){ Write-Host $m -ForegroundColor Yellow }
function Good($m){ Write-Host $m -ForegroundColor Green }

Write-Host ""
Head "=================================================="
Head "        TIFF'S PINK ROOM  -  setup + launch"
Head "=================================================="
Info  "  (If Windows ever asks for permission, click YES.)"
Write-Host ""

# ---------- 1. SPEC CHECK + model recommendation ----------
$vram = 0; $gpuName = ""
$smi = (& nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits 2>$null)
if ($LASTEXITCODE -eq 0 -and $smi) {
  $p = ($smi -split ","); $gpuName = $p[0].Trim(); $vram = [int]($p[1].Trim())
} else {
  $g = Get-CimInstance Win32_VideoController -ErrorAction SilentlyContinue |
       Where-Object { $_.Name } | Sort-Object AdapterRAM -Descending | Select-Object -First 1
  if ($g) { $gpuName = $g.Name }
}
$ram = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory/1GB,0)
$model = "google/gemma-4-e4b"
if     ($vram -ge 16000) { $note = "Beast card - tons of headroom. gemma-4-e4b is the proven pick (try a bigger model if you want more)." }
elseif ($vram -ge 8000)  { $note = "Perfect fit - this runs fast on your card." }
elseif ($vram -ge 6000)  { $note = "Good fit - runs well on your card." }
elseif ($vram -ge 4000)  { $note = "It'll run, maybe a touch slow. Try a lighter model if it's rough." }
else                     { $note = "No big graphics card detected - it'll lean on your processor, so it works but slower. Still fine to build with." }

Head "YOUR PC:"
Info ("   GPU:  " + $(if($gpuName){$gpuName}else{"(unknown)"}))
Info ("   VRAM: " + $(if($vram){"$vram MB"}else{"n/a (no NVIDIA GPU found)"}))
Info ("   RAM:  $ram GB")
Write-Host ""
Good ("BEST MODEL FOR YOU:  $model")
Info ("   $note")
Write-Host ""

$haveWinget = [bool](Get-Command winget -ErrorAction SilentlyContinue)

# ---------- 2. Python ----------
function Find-Py {
  foreach($c in @("py","python")){ if(Get-Command $c -ErrorAction SilentlyContinue){ return $c } }
  $cand = Get-ChildItem "$env:LOCALAPPDATA\Programs\Python\Python3*\python.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
  if($cand){ return $cand.FullName }
  return $null
}
$PY = Find-Py
if(-not $PY){
  Warn "Python isn't installed yet - installing it for you..."
  if($haveWinget){
    winget install -e --id Python.Python.3.12 --silent --accept-package-agreements --accept-source-agreements
    $env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
    $PY = Find-Py
  }
  if(-not $PY){
    Warn "Couldn't auto-install Python. Opening the download page."
    Warn "Install it (CHECK 'Add python.exe to PATH'), then run START HERE again."
    Start-Process "https://www.python.org/downloads/"
    Read-Host "Press Enter to close"; exit
  }
}
Good "Python: ready."

# ---------- 3. environment + dependencies ----------
if(-not (Test-Path "$Root\venv\Scripts\python.exe")){
  Info "First-time setup: building the environment (a few minutes the first time)..."
  & $PY -m venv "$Root\venv"
  & "$Root\venv\Scripts\python.exe" -m pip install --upgrade pip --quiet
  & "$Root\venv\Scripts\python.exe" -m pip install -r "$Root\requirements.txt"
  Good "Environment: ready."
}
$VENV = "$Root\venv\Scripts\python.exe"

# ---------- 4. LM Studio (the AI engine) ----------
$LMS = "$env:USERPROFILE\.lmstudio\bin\lms.exe"
if(-not (Test-Path $LMS)){
  Warn "LM Studio (Tiff's engine) isn't installed - installing it for you..."
  if($haveWinget){
    winget install -e --id ElementLabs.LMStudio --silent --accept-package-agreements --accept-source-agreements
    & "$env:USERPROFILE\.lmstudio\bin\lms.exe" bootstrap 2>$null
  }
  if(-not (Test-Path $LMS)){
    Warn "Couldn't auto-install LM Studio. Opening lmstudio.ai."
    Warn "Install it, then run START HERE again (it'll pick up from here)."
    Start-Process "https://lmstudio.ai"
    Read-Host "Press Enter to close"; exit
  }
}
Good "AI engine: ready."

# ---------- 5. model: download (if missing) + load ----------
& $LMS server start 2>$null
$installed = (& $LMS ls 2>$null | Out-String)
if($installed -notmatch "gemma-4-e4b"){
  Info "Downloading Tiff's brain ($model). It's a few GB - this part takes a bit..."
  & $LMS get $model -y
}
Info "Loading the model onto your graphics card..."
& $LMS load $model -c 16384 --gpu max -y 2>$null
Good "Brain: loaded."

# ---------- 6. launch ----------
Write-Host ""
Good "Opening Tiff's Pink Room in your browser..."
# open the browser a few seconds after the server starts (detached)
Start-Process "powershell" -ArgumentList "-NoProfile","-Command","Start-Sleep 7; Start-Process 'http://localhost:7777'" -WindowStyle Hidden
Write-Host ""
Head "=================================================="
Head "  Pink Room is running."
Head "  KEEP THIS WINDOW OPEN while you use it."
Head "  Close this window to stop the room."
Head "=================================================="
Write-Host ""
& $VENV -m uvicorn app:app --host 127.0.0.1 --port 7777
Read-Host "Server stopped. Press Enter to close"
