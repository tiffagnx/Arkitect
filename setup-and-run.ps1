# DeMartinville - smart setup + launcher
# Double-clicked via "START HERE.bat". Auto-installs everything it can,
# detects the PC's specs to recommend/download the right model, then runs.
$ErrorActionPreference = "Continue"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

# ---------- SINGLE INSTANCE — a 2nd double-click shouldn't spawn a 2nd DeMartinville ----------
# A PORT CHECK (not a mutex — a mutex can deadlock a real relaunch): if the server is already
# listening on 7777, this launch just brings the existing window to the front (or reopens one)
# and exits — it never starts a duplicate. "RESTART DeMartinville.bat" frees the port first, so it
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
    $w = Get-Process msedge,chrome -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like '*DeMartinville*' } | Select-Object -First 1
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
  Head "Installing DeMartinville update (v$ver)..."
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
Head "        DeMartinville  -  setup + launch"
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
$weak = $false   # too light for a useful LOCAL brain → steer to a cloud API key instead
if     ($vram -ge 16000) { $note = "Beast card - tons of headroom. gemma-4-e4b is the proven pick (try a bigger model if you want more)." }
elseif ($vram -ge 8000)  { $note = "Perfect fit - this runs fast on your card." }
elseif ($vram -ge 6000)  { $note = "Good fit - runs well on your card." }
elseif ($vram -ge 4000)  { $note = "It'll run, maybe a touch slow. Try a lighter model if it's rough." }
else {
  $weak = $true
  $note = "No real graphics card here - a LOCAL AI brain would run on the processor and be too slow to use. The STUDIO still runs great (record, mix, video, beats). For fast AI, add your own API key when the app opens (Groq/Google have free tiers) - it'll walk you through it."
}

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
  foreach($c in @("py","python")){
    $cmd = Get-Command $c -ErrorAction SilentlyContinue
    # skip the Microsoft Store placeholder (a stub in WindowsApps that can't build a venv)
    if($cmd -and $cmd.Source -notmatch 'WindowsApps'){ return $c }
  }
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
  if(-not (Test-Path "$Root\venv\Scripts\python.exe")){
    # venv didn't build — almost always the 'python' here is the Microsoft Store placeholder,
    # not the real thing. Tell the user exactly how to fix it instead of crashing 100 lines later.
    Warn ""
    Warn "Python couldn't build its environment on this PC."
    Warn "This usually means 'python' is the Microsoft Store placeholder, not the real one. Fix in 2 minutes:"
    Warn "   1) Install Python from python.org  (CHECK the box 'Add python.exe to PATH')"
    Warn "   2) Run START HERE again - it'll pick up from here."
    Start-Process "https://www.python.org/downloads/"
    Read-Host "Press Enter to close"; exit
  }
  & "$Root\venv\Scripts\python.exe" -m pip install --upgrade pip --quiet
  & "$Root\venv\Scripts\python.exe" -m pip install -r "$Root\requirements.txt"
  Good "Environment: ready."
}
$VENV = "$Root\venv\Scripts\python.exe"
if ($AppliedUpdate) {                       # an update may have changed requirements.txt — keep deps in sync
  Info "Syncing dependencies after the update..."
  & $VENV -m pip install -r "$Root\requirements.txt" --quiet
}

# ---------- 4. LM Studio (the local AI engine) ----------
# On a weak machine we DON'T install it (or download a model below) - a local brain would
# just crawl. The app steers to the fast path instead (your own API key). Saves a big download.
$LMS = "$env:USERPROFILE\.lmstudio\bin\lms.exe"
if($weak){
  Warn "Skipping the local AI engine on this machine - it'd be too slow to use."
  Info "When DeMartinville opens, add your own API key for fast AI (free options) - or just use the studio."
} elseif(-not (Test-Path $LMS)){
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
  Good "AI engine: ready."
} else {
  Good "AI engine: ready."
}

# ---------- 4.5 ffmpeg (the video editor + audio MP3 export need it) ----------
if(-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)){
  Warn "ffmpeg (video/audio export) isn't installed - installing it for you..."
  if($haveWinget){
    winget install -e --id Gyan.FFmpeg --silent --accept-package-agreements --accept-source-agreements
    # winget adds it to the Machine PATH; refresh THIS session so the server (started below) sees it
    $env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
  }
  if(-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)){
    Warn "Couldn't auto-install ffmpeg - the video editor's exports need it. Get it from ffmpeg.org"
    Warn "(or run 'winget install Gyan.FFmpeg'), then restart DeMartinville. Everything else still works."
  } else { Good "Video/audio engine (ffmpeg): ready." }
} else { Good "Video/audio engine (ffmpeg): ready." }

# ---------- 5. model: download (if missing) + load ----------
if(-not $weak){
  & $LMS server start 2>$null
  $installed = (& $LMS ls 2>$null | Out-String)
  if($installed -notmatch "gemma-4-e4b"){
    Info "Downloading Tiff's brain ($model). It's a few GB - this part takes a bit..."
    & $LMS get $model -y
  }
  Info "Loading the model onto your graphics card..."
  & $LMS load $model -c 16384 --gpu max -y 2>$null
  Good "Brain: loaded."
}

# ---------- 5.5 desktop shortcut → the native DeMartinville app (its own icon, pins to taskbar) ----------
# Points at DeMartinville.exe when it's been built (the real program), else at the launcher.
try {
  $lnk = Join-Path ([Environment]::GetFolderPath("Desktop")) "DeMartinville.lnk"
  $exe = Join-Path $Root "DeMartinville.exe"
  $target = if (Test-Path $exe) { $exe } else { Join-Path $Root "START HERE.bat" }
  $ws = New-Object -ComObject WScript.Shell
  $sc = $ws.CreateShortcut($lnk)            # always (re)create so an old browser-shortcut updates
  $sc.TargetPath = $target
  $sc.WorkingDirectory = $Root
  $ico = Join-Path $Root "static\app-icon.ico"
  if(-not (Test-Path $ico)){ $ico = Join-Path $Root "static\kit.ico" }
  if(Test-Path $ico){ $sc.IconLocation = $ico }
  $sc.Description = "DeMartinville - your local AI creative studio"
  $sc.Save()
  Good "DeMartinville shortcut is on your desktop."
} catch { }

# ---------- 6. launch ----------
Write-Host ""
$arkUrl  = "http://localhost:7777"
$arkExe  = Join-Path $Root "DeMartinville.exe"
$isDev   = Test-Path (Join-Path $Root ".git")
$launch  = $null

# SHIPPED install with the native app present: let DeMartinville.exe run the engine IN ITS OWN
# WINDOW and hand off — so there's NO leftover terminal (the thing that confused people).
# Launch it, then watch the port: if the .exe brings the engine up itself, this window's job
# is done and it CLOSES. If it doesn't (an older .exe that expects an external server), we
# fall through and host the engine here — the original behavior — so nothing ever breaks.
if ((Test-Path $arkExe) -and (-not $isDev)) {
  Good "Opening DeMartinville in its own window..."
  Start-Process $arkExe
  $up = $false
  for($i=0; $i -lt 25; $i++){
    Start-Sleep 1
    try { if (Get-NetTCPConnection -LocalPort 7777 -State Listen -ErrorAction SilentlyContinue) { $up = $true; break } } catch {}
  }
  if ($up) {
    Write-Host ""
    Good "DeMartinville is running in its own window."
    Good "You can close this terminal - it's not needed. Next time, just use the desktop icon."
    Start-Sleep 3
    exit
  }
  Warn "Running the engine from here instead (older app build) - the window's already open."
  # exe is already launched + waiting; just host the server below (no relaunch → $launch stays null)
}
elseif (Test-Path $arkExe) {
  # dev checkout: host here + attach the native window (keeps --reload working)
  Good "Opening DeMartinville (native window)..."
  $launch = "Start-Sleep 7; Start-Process '$arkExe'"
}
else {
  # no native app: a chrome-less browser app-window onto the server we host here
  Good "Opening DeMartinville..."
  $arkProf = "$env:LOCALAPPDATA\DeMartinville\app-window"
  $arkEdge = @("$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe","${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
  $arkChrome = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe","${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe","$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
  $arkBrowser = if($arkEdge){ $arkEdge } elseif($arkChrome){ $arkChrome } else { $null }
  if($arkBrowser){ $launch = "Start-Sleep 7; Start-Process '$arkBrowser' -ArgumentList '--app=$arkUrl','--user-data-dir=$arkProf','--window-size=1500,950'" }
  else { $launch = "Start-Sleep 7; Start-Process '$arkUrl'" }
}
if ($launch) { Start-Process "powershell" -ArgumentList "-NoProfile","-Command",$launch -WindowStyle Hidden }
# last guard: if the .exe already bound the port, don't double-host (just close out cleanly)
try { if (Get-NetTCPConnection -LocalPort 7777 -State Listen -ErrorAction SilentlyContinue) { Write-Host ""; Good "DeMartinville is running in its own window - you can close this terminal."; Start-Sleep 3; exit } } catch {}
Write-Host ""
Head "=================================================="
Head "  DeMartinville is running."
Head "  Keep this window open while you use it (it runs the engine)."
Head "  Tip: next time, open DeMartinville from the desktop icon - no terminal needed."
Head "=================================================="
Write-Host ""
# On the DEV machine (a git checkout) auto-reload on .py edits, so code changes apply WITHOUT a
# manual restart. Shipped ZIP installs (no .git) run the stable single-process server. uvicorn's
# reloader only watches *.py by default, so session writes under data/ never trigger a reload.
$reloadArgs = @(); if ($isDev) { $reloadArgs = @("--reload") }
& $VENV -m uvicorn app:app --host 127.0.0.1 --port 7777 @reloadArgs
Read-Host "Server stopped. Press Enter to close"
