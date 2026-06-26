# WEBSITE / FOR CREATORS — session handoff (2026-06-26 night)

*Cold start: read this + `MEMORY.md`. This session owned the public website / For Creators page / Mac distribution / the v2.3.0 ship + the strategic "studio = download" pivot.*

## Live state of demartinlabs.com RIGHT NOW (deployed)
- **Front door = the PITCH.** demartinlabs.com root redirects EVERYONE (phone + desktop) → `/for-creators`. Lives in gh-pages `index.html` + `app/index.html` as an early `location.replace('/for-creators')`, guarded to skip localhost/the desktop app. Reverses the old cloud-port "root = app" flip — **owner's call: the website is the pitch; the studio is a download.**
- **For Creators (`static/join.html` → gh-pages `for-creators/index.html`) is DOWNLOAD-ONLY.** The "Open it free in your browser" CTAs were removed. Download for Windows + a real Mac (Apple Silicon) download. Mobile-responsive (heavy per-word scroll-reveal disabled on phones; a phone-note says the studio runs on a computer).
- **Mac instructions = FIXED.** Old "Open Anyway" steps were factually BROKEN on macOS Sequoia (Apple killed that button for unsigned apps). Replaced with a dummy-proof 5-step walkthrough using the one command that works: `xattr -dr com.apple.quarantine /Applications/DeMartinville.app`. Full verified, cited truth → [[mac-unsigned-open-fix]].
- **The browser app still EXISTS at `/app`** (parked, unlinked — no button points to it). Owner leaned "delete it," but I PARKED it because the crew session built Crew Mode FOR that hosted app. Fully killing `/app` is a cross-session decision.

## What shipped this session
- **v2.3.0 RELEASED** (`4c64541`, tag `v2.3.0`): committed the night's whole tree, bumped both version homes (app.py + studio.html), built `DeMartinville.zip` (existing exe, NO rebuild), cut the release (Win zip attached + Mac arm64 auto-build from the tag), deployed the full site. *(Crew session has since bumped to v2.4.0 → v2.5.0.)*
- For Creators rewrite (whole-machine showcase + agent-platform pillar, nameless 2nd-person story, brand cleanup), de-Tiff main chat, mobile fixes, front-door flip, download-only, Mac-instructions fix.

## Decisions / vision (owner)
- **Studio = desktop download, period** — can't run a DAW in a phone browser; stop chasing never-downloaders. The REAL phone play = remote-control your desktop agent → [[phone-remote-agent-control]] (NOT built — next big thing).
- **No $99 for Mac** — users run ONE free command; page now says it right → [[mac-unsigned-open-fix]].
- **Brand rule:** name what we USE (models/pay links), drop what we DON'T (Pro Tools/After Effects) → [[for-creators-rewrite-pitch]].
- **Not Tiff-centric** → [[not-tiff-centric]].

## Open items / next
- ⚠️ **Reconcile the front-door redirect in master:** gh-pages has root→pitch (redirect-for-all), but master's `static/index.html` still has the earlier phone-only version (the crew session owns index.html; I deployed the flip surgically to gh-pages only). A full site redeploy *from master* would REVERT the flip — update master's redirect to match.
- ⚠️ **Live hosted app = v2.3.0 code; the release is v2.5.0.** Crew shipped v2.4.0→v2.5.0 to GitHub but hasn't redeployed the hosted app. Their deploy to make.
- **Decide:** fully kill `/app` (hosted browser app) or keep it for Crew Mode — cross-session call.
- **Optional:** add a `codesign --verify` assert to `.github/workflows/mac-build.yml` to catch a mangled bundle (build is otherwise correct — uses `ditto`, do NOT add `codesign --deep`).
- **5-minute Mac proof test** lives in [[mac-unsigned-open-fix]] — run it whenever a real Apple-Silicon Sequoia Mac is available to lock the verdict with receipts.

## Parallel sessions
Crew-mode session is actively shipping (v2.4.0 → v2.5.0; in-room crew picker inside the agent window). They own `index.html`, `kit-helper.js`, `app.py`, crew files. I only touched `static/join.html` (committed solo, explicit path) + surgical gh-pages edits — no clobber. Uncommitted in the tree and NOT mine (leave intact): `make_public_seed.py`, `static/seed/public_seed.json`, `static/wall.html`, `AUDIT_HANDOFF.md`.
