# Handoff — v1.8.0 ship + Beat Lab web demo + novice-UX fixes (2026-06-22)

Cold-start orientation: read `MEMORY.md` first. This handoff covers the session that cut **v1.8.0**, put **Beat Lab on the web** as a no-download demo, and fixed the first-real-user confusion in Beat Lab. (Don't overwrite `START_HERE.md` — that's a parallel session's.)

## Where things stand

- **v1.8.0 is released** → https://github.com/tiffagnx/Arkitect/releases/tag/v1.8.0
  - Windows `ARKITECT.zip` (33.8 MB, clean ~104 files) — **live now**.
  - Mac **arm64** `DeMartinville-mac-arm64.zip` — built on the tag + **verified attached** (every Mac since late 2020).
  - Version bumped in **both homes**: `APP_VERSION` in `app.py` AND `const APP_VERSION` in `static/studio.html`. `release.ps1` + `CLAUDE.md` were fixed so future releases bump both automatically (was a "jumped up" mismatch before).
- **Beat Lab is live on the web** (no download): **demartinlabs.com/static/beats.html**
  - Fully synthesized, `/api` calls `.catch()` to no-ops → runs standalone on gh-pages.
  - Host-gated extras (only show on the public site): a "Get the full studio" demo banner + a first-time onboarding nudge that pulses ▶ Play.
  - "🥁 Try Beat Lab — free, in your browser" CTA on both cta-rows of `static/join.html`.
- **Beat Lab novice-UX fixes shipped (v1.8.0 + gh-pages):** real **Undo/Redo** (`Ctrl+Z` / `Ctrl+Shift+Z` + Edit menu), velocity strip now **teaches** ("how hard each hit plays… not pitch"), and selecting a melodic instrument points you to the **🎹 Piano roll** for pitch. All verified in preview.

## The model that matters (tell the owner again if he stresses about "twice the work")

**The web demo and the downloadable program run the SAME files** — `static/*.html`, one per room. A fix is written ONCE → flows to both (program on refresh, demo on one gh-pages push). For the **live-testing loop**, the tester (target = Boogie, the real beat-maker — owner is a Pro Tools *vocal* guy) works the **link**, so fixes reach him the instant you redeploy — no rebuild, no release. See memory `web-demo-test-harness`.

## How to fix-and-redeploy a room (the loop)

1. Edit `static/<room>.html`.
2. Verify in preview (`arkitect-preview` on :7788).
3. Commit your file(s) only (explicit paths; never `git add -A` — a parallel session owns `START_HERE.md`).
4. Deploy the demo page to gh-pages: worktree off `origin/gh-pages`, copy the one file into `static/`, commit, push `HEAD:gh-pages`. Leave `CNAME` + `kit-hero.png` + `shots/*` untouched.
5. (Downloaded users only get it on the next release — `release.ps1 <ver>`, already automated; Mac builds on the tag.)

## Open items (flagged, not done — daylight calls)

- **Mac Intel build** — the free macos-13 runner effectively never finishes; pre-2020 Intel Macs get a 404 on the Mac button. Fix = a **universal2** build (one `.app`, both chips). Workflow change.
- **"ARKITECT" name** still on the Windows `.exe` title + `ARKITECT.zip` filename. Renaming is NOT free — the **auto-updater keys off that exact name**; needs a planned migration. Don't blind-rebuild the exe headless.
- From earlier in the session (not started): **capture pipeline** (the real "training" — screenshots/voice/tool-moves → knowledge pack), **agent profile pages + real reviews** (needs a Cloudflare backend, stars start empty), **crew multi-select bundle**, **MCP server** integration, **true native Claude effort dial** (`/v1/messages`).

## Tooling notes

- `gh` is at `C:\Program Files\GitHub CLI\gh.exe` (NOT on bash PATH; on PowerShell only via full path here).
- PowerShell here-strings for `git commit -m` keep failing → write the message to a temp `.txt`, `git commit -F`.
- `release.ps1` ends on a `Read-Host` that hangs non-interactive — run by hand or background it.
