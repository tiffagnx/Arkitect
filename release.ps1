# ARKITECT — one-command release.
#   .\release.ps1 1.0.1     (or double-click RELEASE.bat and type the number)
# Bumps the version, rebuilds the .exe, packages the distributable zip, and publishes
# the GitHub release. After this, every user's ARKITECT offers the update automatically.
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
Write-Host "Releasing ARKITECT $Tag" -ForegroundColor Magenta

# 1) bump APP_VERSION in app.py
$appPath = Join-Path $Root "app.py"
$app = Get-Content $appPath -Raw
$app2 = [regex]::Replace($app, 'APP_VERSION\s*=\s*"[^"]*"', "APP_VERSION = `"$Version`"", 1)
if ($app2 -eq $app) { Write-Host "Couldn't find APP_VERSION in app.py" -ForegroundColor Red; Read-Host "Enter to close"; exit 1 }
Set-Content $appPath $app2 -NoNewline -Encoding UTF8
Good "version -> $Version"

# 2) rebuild the .exe so the release carries the current code, then 3) package the zip
if (-not (Test-Path (Join-Path $Root "venv\Scripts\pyinstaller.exe"))) { Step "installing pyinstaller..."; & $VENV -m pip install --quiet pyinstaller }
Step "building ARKITECT.exe..."
& (Join-Path $Root "venv\Scripts\pyinstaller.exe") --noconfirm (Join-Path $Root "ARKITECT.spec") *> $null
Move-Item -Force (Join-Path $Root "dist\ARKITECT.exe") (Join-Path $Root "ARKITECT.exe")
Remove-Item -Recurse -Force (Join-Path $Root "build"),(Join-Path $Root "dist") -ErrorAction SilentlyContinue
Good "exe built"
$zip = Join-Path $Root "ARKITECT.zip"
Step "packaging distributable..."
& $VENV (Join-Path $Root "build_zip.py") $zip *> $null
Good "zip built"

# 4) commit the version bump + push
& git add app.py *> $null
& git commit -m "Release $Tag" *> $null
& git push *> $null
Good "pushed"

# 5) publish the GitHub release with the zip as the asset
$gh = Get-Command gh -ErrorAction SilentlyContinue
if ($gh) {
  & gh release create $Tag "$zip" --title "ARKITECT $Tag" --notes "ARKITECT $Tag. Open the gear in any room - it'll offer the update; one click installs it (your sessions & keys stay put)."
  Write-Host ""
  Write-Host "RELEASED $Tag. Everyone's ARKITECT will offer it on next open." -ForegroundColor Green
} else {
  Write-Host ""
  Write-Host "GitHub CLI (gh) isn't installed yet - I'll open the release page; drag ARKITECT.zip into it and hit Publish." -ForegroundColor Yellow
  Write-Host "(One-time fix so this is fully automatic next time: winget install GitHub.cli ; then: gh auth login)" -ForegroundColor Yellow
  Start-Process "https://github.com/tiffagnx/Arkitect/releases/new?tag=$Tag&title=ARKITECT%20$Tag"
  Start-Process $Root
}
Read-Host "Done - Enter to close"
