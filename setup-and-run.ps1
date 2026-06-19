# ARKITECT - smart setup + launcher
# Double-clicked via "START HERE.bat". Auto-installs everything it can,
# detects the PC's specs to recommend/download the right model, then runs.
$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

# ---------- SINGLE INSTANCE — a 2nd double-click shouldn't spawn a 2nd ARKITECT ----------
# A PORT CHECK (not a mutex — a mutex can deadlock a real relaunch): if the server is already
# listening on 7777, this launch just brings the existing window to the front (or reopens one)
# and exits — it never starts a duplicate. "RESTART ARKITECT.bat" frees the port first, so it
# always relaunches cleanly onto the latest code.
$alreadyUp = $false
try { $alreadyUp = [bool](Get-NetTCPConnection -LocalPort 7777 -State Listen -ErrorAction SilentlyContinue) } catch { }
if ($alreadyUp) {
  try {
    Add-Type -ErrorAction SilentlyContinue -TypeDefinition @'
using System; using System.Runtime.InteropServices;
public class ArkWin {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
}
'@
    $w = Get-Process msedge,chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like '*ARKITECT*' } | Select-Object -First 1
    if ($w) { [ArkWin]::ShowWindow($w.MainWindowHandle, 9) | Out-Null; [ArkWin]::SetForegroundWindow($w.MainWindowHandle) | Out-Null }
    else { Start-Process 'http://localhost:7777' }   # window was closed but server's up → reopen one
  } catch { }
  exit
}

function Head($m){ Write-Host $m -ForegroundColor Magenta }
function Info($m){ Write-Host $m -ForegroundColor Gray }
function Warn($m){ Write-Host $m -ForegroundColor Yellow }
function Good($m){ Write-Host $m -ForegroundColor Green }

# ---------- 0. APPLY a staged update (from the in-app updater), if any ----------
# The app downloads a new release into _update\staged\ while it's running; the
# actual file swap happens HERE, with the server down, so nothing is ever locked
# or half-written. Your data\ and venv\ are never touched, and a rollback zip is
# saved first. Runs only when a staged update is present — otherwise a no-op.
$AppliedUpdate = $false
$updDir  = Join-Path $Root "_update"
$staged  = Join-Path $updDir "staged"
$pending = Join-Path $updDir "pending.json"
if ((Test-Path $pending) -and (Test-Path $staged)) {
  $ver = "?"
  try { $info = Get-Content $pending -Raw | ConvertFrom-Json; if ($info.version) { $ver = $info.version } } catch { }
  Write-Host ""
  Head "Installing ARKITECT update (v$ver)..."
  if ((Test-Path (Join-Path $staged "app.py")) -and (Test-Path (Join-Path $staged "static"))) {
    try {
      $ts = Get-Date -Format "yyyyMMdd-HHmmss"
      # rollback safety net: zip the current code (NOT data/venv) before overwriting
      $backup = Join-Path $updDir ("backup-" + $ts + ".zip")
      $keep = @("venv","data","_update",".git","__pycache__")
      $toBackup = Get-ChildItem -Path $Root -Force | Where-Object { $keep -notcontains $_.Name }
      if ($toBackup) {
        try { Compress-Archive -Path ($toBackup.FullName) -DestinationPath $backup -Force -ErrorAction Stop }
        catch { Warn "  (couldn't write a rollback zip - continuing anyway)" }
      }
      # copy the new files over the install; skip the user's data/venv and our own working dirs
      robocopy $staged $Root /E /XD (Join-Path $staged "data") (Join-Path $staged "venv") (Join-Path $staged "_update") (Join-Path $staged ".git") /NFL /NDL /NJH /NJS /NP | Out-Null
      if ($LASTEXITCODE -ge 8) { Warn "  (some files may not have copied - rollback zip is in _update)" }
      Remove-Item $staged  -Recurse -Force -ErrorAction SilentlyContinue
      Remove-Item $pending -Force -ErrorAction SilentlyContinue
      $AppliedUpdate = $true
      Good "Update installed (v$ver).  Rollback copy: _update\backup-$ts.zip"
    } catch {
      Warn "Update install hit a snag: $($_.Exception.Message). Launching the current version."
    }
  } else {
    Warn "Staged update looked incomplete - skipped. Launching the current version."
    Remove-Item $pending -Force -ErrorAction SilentlyContinue
  }
  Write-Host ""
}

Write-Host ""
Head "=================================================="
Head "        ARKITECT  -  setup + launch"
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
if ($AppliedUpdate) {                       # an update may have changed requirements.txt — keep deps in sync
  Info "Syncing dependencies after the update..."
  & $VENV -m pip install -r "$Root\requirements.txt" --quiet
}

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

# ---------- 5.5 desktop shortcut (so it's one click from now on) ----------
try {
  $lnk = Join-Path ([Environment]::GetFolderPath("Desktop")) "ARKITECT.lnk"
  if(-not (Test-Path $lnk)){
    $ws = New-Object -ComObject WScript.Shell
    $sc = $ws.CreateShortcut($lnk)
    $sc.TargetPath = Join-Path $Root "START HERE.bat"
    $sc.WorkingDirectory = $Root
    $ico = Join-Path $Root "static\kit.ico"
    if(Test-Path $ico){ $sc.IconLocation = $ico }
    $sc.Description = "ARKITECT - your local AI creative studio"
    $sc.Save()
    Good "Put an ARKITECT shortcut on your desktop (the little guy)."
  }
} catch { }

# ---------- 6. launch ----------
Write-Host ""
Good "Opening ARKITECT in your browser..."
# open the browser a few seconds after the server starts (detached)
# open ARKITECT in its OWN app window (no tabs/address bar) once the server warms — detached
$arkUrl  = "http://localhost:7777"
$arkProf = "$env:LOCALAPPDATA\ARKITECT\app-window"
$arkEdge = @("$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe","${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
$arkChrome = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe","${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe","$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
$arkBrowser = if($arkEdge){ $arkEdge } elseif($arkChrome){ $arkChrome } else { $null }
if($arkBrowser){
  $launch = "Start-Sleep 7; Start-Process '$arkBrowser' -ArgumentList '--app=$arkUrl','--user-data-dir=$arkProf','--window-size=1500,950'"
} else {
  $launch = "Start-Sleep 7; Start-Process '$arkUrl'"
}
Start-Process "powershell" -ArgumentList "-NoProfile","-Command",$launch -WindowStyle Hidden
Write-Host ""
Head "=================================================="
Head "  ARKITECT is running."
Head "  KEEP THIS WINDOW OPEN while you use it."
Head "  Close this window to stop the room."
Head "=================================================="
Write-Host ""
# On the DEV machine (a git checkout) auto-reload on .py edits, so code changes apply WITHOUT a
# manual restart. Shipped ZIP installs (no .git) run the stable single-process server. uvicorn's
# reloader only watches *.py by default, so session writes under data/ never trigger a reload.
$reloadArgs = @(); if (Test-Path (Join-Path $Root ".git")) { $reloadArgs = @("--reload") }
& $VENV -m uvicorn app:app --host 127.0.0.1 --port 7777 @reloadArgs
Read-Host "Server stopped. Press Enter to close"
