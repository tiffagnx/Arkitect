# DeMartinville — one-command release.
#   .\release.ps1 1.0.1     (or double-click RELEASE.bat and type the number)
# Bumps the version, rebuilds the .exe, packages the distributable zip, and publishes
# the GitHub release. After this, every user's DeMartinville offers the update automatically.
param([string]$Version)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root
$VENV = Join-Path $Root "venv\Scripts\python.exe"
function Step($m){ Write-Host "  $m" -ForegroundColor Gray }
function Good($m){ Write-Host "  $m" -ForegroundColor Green }

if (-not $Version) { $Version = Read-Host "New version number (e.g. 1.0.1)" }
$Version = $Version.TrimStart('v',' ')
if ($Version -notmatch '^\d+\.\d+\.\d+$') { Write-Host "Version must look like 1.0.1" -ForegroundColor Red; Read-Host "Enter to close"; exit 1 }
$Tag = "v$Version"
Write-Host ""
Write-Host "Releasing DeMartinville $Tag" -ForegroundColor Magenta

# 1) bump APP_VERSION in app.py
$appPath = Join-Path $Root "app.py"
$app = Get-Content $appPath -Raw
$app2 = [regex]::Replace($app, 'APP_VERSION\s*=\s*"[^"]*"', "APP_VERSION = `"$Version`"", 1)
if ($app2 -eq $app) { Write-Host "Couldn't find APP_VERSION in app.py" -ForegroundColor Red; Read-Host "Enter to close"; exit 1 }
Set-Content $appPath $app2 -NoNewline -Encoding UTF8
Good "version -> $Version"

# 1b) mirror the version into static/studio.html — its in-browser updater keeps its OWN copy,
#     so if this isn't bumped too the Studio reports a stale version (the "jumped up" mismatch).
$stPath = Join-Path $Root "static\studio.html"
if (Test-Path $stPath) {
  $st = Get-Content $stPath -Raw
  $st2 = [regex]::Replace($st, 'const APP_VERSION\s*=\s*"[^"]*"', "const APP_VERSION = `"$Version`"", 1)
  if ($st2 -ne $st) { Set-Content $stPath $st2 -NoNewline -Encoding UTF8; Good "studio.html version -> $Version" }
  else { Write-Host "  (studio.html APP_VERSION not found — check it didn't move)" -ForegroundColor Yellow }
}

# 2) rebuild the .exe so the release carries the current code, then 3) package the zip
if (-not (Test-Path (Join-Path $Root "venv\Scripts\pyinstaller.exe"))) { Step "installing pyinstaller..."; & $VENV -m pip install --quiet pyinstaller }
Step "building DeMartinville.exe..."
& (Join-Path $Root "venv\Scripts\pyinstaller.exe") --noconfirm (Join-Path $Root "DeMartinville.spec") *> $null
Move-Item -Force (Join-Path $Root "dist\DeMartinville.exe") (Join-Path $Root "DeMartinville.exe")
Remove-Item -Recurse -Force (Join-Path $Root "build"),(Join-Path $Root "dist") -ErrorAction SilentlyContinue
Good "exe built"
$zip = Join-Path $Root "DeMartinville.zip"
Step "packaging distributable..."
& $VENV (Join-Path $Root "build_zip.py") $zip *> $null
Good "zip built"

# 4) commit the version bump + push
& git add app.py static/studio.html *> $null
& git commit -m "Release $Tag" *> $null
& git push *> $null
Good "pushed"

# 5) publish the GitHub release with the zip as the asset
$gh = Get-Command gh -ErrorAction SilentlyContinue
if ($gh) {
  & gh release create $Tag "$zip" --title "DeMartinville $Tag" --notes "DeMartinville $Tag. Open the gear in any room - it'll offer the update; one click installs it (your sessions & keys stay put)."
  Write-Host ""
  Write-Host "RELEASED $Tag. Everyone's DeMartinville will offer it on next open." -ForegroundColor Green
} else {
  Write-Host ""
  Write-Host "GitHub CLI (gh) isn't installed yet - I'll open the release page; drag DeMartinville.zip into it and hit Publish." -ForegroundColor Yellow
  Write-Host "(One-time fix so this is fully automatic next time: winget install GitHub.cli ; then: gh auth login)" -ForegroundColor Yellow
  Start-Process "https://github.com/tiffagnx/Arkitect/releases/new?tag=$Tag&title=DeMartinville%20$Tag"
  Start-Process $Root
}
Read-Host "Done - Enter to close"
