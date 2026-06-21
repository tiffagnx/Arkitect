# ARKITECT — Handoff

**What it is:** a *fully local* AI creative studio that runs on your own machine — a small Python (FastAPI) server serving single-file HTML "rooms" to the browser at **http://localhost:7777**, talking to a local LLM via **LM Studio**. Free, private, offline-capable. **Tiff** is the AI collaborator (main chat). **Kit** is the in-room build-bot helper.

- **Repo:** github.com/tiffagnx/Arkitect (private)
- **Local path:** `C:\Users\koonc\Desktop\Projects\pink-room` *(folder is still named "pink-room"; the product is ARKITECT)*

---

## Run it
- Double-click **`START HERE.bat`** → `setup-and-run.ps1` auto-installs Python + LM Studio + the model, builds the venv, launches on 7777, opens an app window, and drops a desktop shortcut (Kit icon).
- Everyday fast launch: **`launch.ps1`** (server + app window; assumes already set up).
- Manual: `venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 7777`
- Brain = **LM Studio** on `localhost:1234`. `app.py` is model-portable — it uses whatever model is loaded (default tries `gemma-4-e4b-uncensored…`).

## Architecture
- **`app.py`** — FastAPI. `/api/chat` (Tiff, SSE streaming via `lm_stream`), `/api/kit` (Kit, room-aware helper), `/api/models`, local image-gen endpoints (ComfyUI/FLUX, optional). No-cache middleware on `/` + `.html/.js/.css/.json` kills stale-version confusion. Mounts `swarm_routes`.
- **`swarm_routes.py`** — the bring-your-own-key research swarm + the cloud-provider primitives (`_enabled_slots()`, `provider_once()`, `_call_with_fallback()`). Keys live in `data/swarm_keys.json` (gitignored). The Settings panel (`static/settings.js`) manages them.
- **`static/`** — the rooms, each one self-contained HTML:
  - `index.html` — home / chat (Tiff)
  - `studio.html` — **DeMartin Audio Labs** (Web-Audio DAW)
  - `build.html` — **Blueprint Builds** (vibe-code single-file apps)
  - `editor.html` — **LePrince Visual Labs** (video)
  - `images.html` — **Imagination Station** (local FLUX image gen)
  - `bit16.html` — **Bit1Six** (16-bit game)
  - `swarm.html` (research keys)
  - Shared injectors: **`pinkroom-nav.js`** (exit pill + favicon + theme-color + URL-hover strip + loads kit-helper.js), **`tec-mascot.js`** (Kit on the home send button), **`kit-helper.js`** (the "Ask Kit" in-room window).
- **`data/`** — **GITIGNORED, personal, never commit**: `memory.json`, `owner.md` (owner profile), sessions, builds, `swarm_keys.json` (API keys), voice refs. The app recreates these dirs on boot.

## Tiff vs Kit
- **Tiff** = the creative collaborator in the main chat. Local brain. The voice/director. Persona = `PERSONA` in `app.py`.
- **Kit** = the in-room build-bot helper. "Ask Kit" button in every room (not chat). Knows the room, walks you through it. `/api/kit` + `kit-helper.js`. Brain = free cloud keys (swarm) if set, else local. Persona = `KIT_SYSTEM` + `ROOM_HELP` in `app.py`.

## Design system
Steel/graphite, **NOT pink**. Accent `#3E9CB8` (steel-cyan), graphite `#0C0D10`/`#15161A`, slate `#7C8AA5`. Brand = the chrome wordmark **image** `static/arkitect-logo.png` — never type "ARKITECT" in a font. Fonts: Oxanium (display), Inter (body), Space Mono (mono). The Kit app icon is `static/kit.ico` / `kit-512.png` / `kit-192.png`.

## Conventions / gotchas (READ THESE)
- **Verify in the real browser at `http://localhost:7777`** (http, NOT https).
- **`app.py` changes need a server restart**; static (html/js/css/json) changes just need a browser refresh (no-cache is on).
- **NEVER bulk-rewrite the room HTML (emoji-heavy) with PowerShell** `Get-Content`/`-replace`/`Set-Content` — PS 5.1 reads UTF-8-no-BOM as ANSI and mojibakes every emoji. Use exact-string editing.
- **`data/` holds secrets + personal data — never commit it.** Verify with `git ls-files` before any push.
- **Edge `--app` mode can't set a custom title-bar color or taskbar icon** — only the *installed* PWA does (manifest `theme_color` + icons). The `--app` quick-launch window always shows Edge's icon/accent.
- The "LF will be replaced by CRLF" git warnings are harmless.

## Shipped (current state)
Full pink→steel rebrand across all rooms; unified exit pill; renamed rooms; home "front door" (logo + wings + Tiff & Kit intro) with an honest local/cloud tagline; **Kit** in-room helper; Studio polish (custom dark plugin menus, toolbar fix, **Cleanup** plugin, VST-style faceplates, Melodyne in the menu, auto-open plugin windows); Edge `--app` window + **PWA install** with the real Kit icon; pushed to GitHub clean (zero secrets).

## Next / queued
- **⭐ ACTIVE: Pro Tools-faithful DAW build → see [`STUDIO_DAW_HANDOFF.md`](STUDIO_DAW_HANDOFF.md).** The Studio (`static/studio.html`) is getting a real Pro Tools menu bar + editing + **bussing**. Menu bar + edit core + bussing foundation shipped; **next = bussing audio-graph routing** (`studio-research/design/sends-bussing-io.md`). That handoff has the full state, next steps, conventions, and the owner's bus model. Read it before touching the Studio.
- **BYO paid model for Tiff + Kit:** wire the saved API keys (Settings/swarm) into the chat model picker so Tiff + Kit can switch to a paid frontier model (Claude/GPT) on demand — incl. **vision** — always defaulting to free/local. Plumbing already exists in `swarm_routes` (`provider_once`, `_enabled_slots`); the build is surfacing saved providers as selectable models + routing `/api/chat` to the chosen one.
- **Knowledge import** idea: bring an existing LLM's knowledge in; show "dumb it down to fit local" vs "use a paid key for a bigger brain + more knowledge" options.
- Install the **Bloom reverb** in the Studio (`studio-research/tiff-verb-bloom.js`).
- Work the 49-item **`BUG_AUDIT.md`**.
- Collaborators joining via GitHub.
