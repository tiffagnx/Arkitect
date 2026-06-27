# Contributing to DeMartinville

DeMartinville is a **local-first creative OS** — a set of rooms (make music, beats, video,
images, build apps) with AI agents (Tiff, Kit, and ones you build) that work *inside* them.
It runs on your own machine: a local LLM, or your own cloud API keys. Nothing is locked to
anyone's account.

The project is small on purpose and uses **no framework / no build step** — you can read most
of it in an afternoon. Welcome. Here's how to work on it without breaking anything.

---

## The philosophy (please keep it)

1. **Local-first, always.** Nothing should *require* a cloud account or an API key. Optional,
   user-supplied integrations (a cloud model, a paid voice) are great — but the default
   experience must run entirely on the user's own hardware, offline.
2. **Bring-your-own-key — never hardcode a key.** API keys belong to the *user*. They're saved
   **encrypted** under `data/` (Windows DPAPI) and are excluded from the shipped build. Never
   commit a key, never ship the developer's key, never read a key from anywhere but the user's
   own saved store (`_gen_keys_load()` in `app.py`, or the swarm provider store).
3. **Keep it simple and readable.** Backend = `app.py` (+ a few helper modules). Each room is one
   self-contained `static/*.html` in **vanilla HTML/CSS/JS** — no React, no bundler. "View source
   and learn" is a feature. Resist adding a framework.
4. **Never commit personal data.** Everything under `data/` is private and git-ignored (keys,
   chat history, memory, sessions, agents, `owner.md`). Put personal details there, never in a
   tracked file.
5. **It's "DeMartinville."** One canonical logo; never font-render the wordmark. User-facing text
   says DeMartinville, not the old "ARKITECT" name.

---

## Running it locally

```bash
python -m venv venv
venv\Scripts\activate                       # macOS/Linux:  source venv/bin/activate
pip install -r requirements.txt

# OPTION A — local brain (free, offline): install LM Studio, load a chat model,
#            start its server on :1234  (the desktop launcher does this for you)
# OPTION B — no local brain: just run the app, then add a cloud key in the in-app Keys hub

python -m uvicorn app:app --port 7777 --reload
# open http://localhost:7777
```

- **Port is 7777.** `--reload` restarts the server on `app.py` edits (use it for dev).
- ⚠️ The packaged desktop launcher (`launch.ps1`) runs **without** `--reload`, so if you're
  testing that way, you must **restart the app** to pick up `.py` changes. Static pages
  (`*.html` / `*.js`) only need a **browser refresh** either way.

---

## ✅ Before you commit: run the health check

```bash
python check.py            # default port 7777   (python check.py 7799 for another port)
```

`check.py` byte-compiles every `.py`, `node --check`s every `static/*.js`, and — if the app is
running — GETs every room + every read-only endpoint and flags any 5xx. It's **safe** (read-only;
it never renders audio/video or spends a credit). Green = you didn't break the obvious stuff.

It does NOT catch *runtime* JS console errors or judge whether something *looks* right — so still
**open the page you touched in the browser** and confirm it actually works.

---

## Where things live

**Backend**

| File | What |
|------|------|
| `app.py` | FastAPI backend — every `@app.get/@app.post` route (`/api/*`), serves the rooms, key storage (`_gen_keys_load`/`_gen_keys_save`) |
| `swarm_routes.py` | The "brain" layer — cloud LLM provider routing, Anthropic native effort/thinking, Whisper transcription, the encrypted-key vault (`_enc_secret`/`_dec_secret`) |
| `room_relay.py` + `mcp_server/` + `static/mcp-bridge.js` | The MCP server — drive the app from Claude Desktop / any MCP client, plus the live-room command relay |
| `plugin_host.py` | Hosts the user's real VST3/AU plugins (via `pedalboard`) in a crash-isolated subprocess |
| `desktop.py`, `launch.ps1`, `setup-and-run.ps1`, `build_zip.py`, `release.ps1` | Desktop packaging + release |
| `.github/workflows/mac-build.yml` | Free Mac build (Intel + arm64), auto-triggered by a `vX.Y.Z` tag |

**Rooms** (`static/*.html` — one self-contained file each)

| File | Room |
|------|------|
| `index.html` | Main hub + chat |
| `studio.html` | **DeMartin Audio Labs** — the DAW (record/edit/mix/master, Web Audio) |
| `beats.html` | **Leon Production Labs** — the beat maker (`window.RoomAPI`) |
| `editor.html` | **LePrince Visual Labs** — video + compositing (After-Effects style) |
| `images.html` / `imagine-cloud.html` | **Imagination Station** — image gen (local GPU / cloud) |
| `build.html` | **Berner Builder** — describe an app or plugin → it builds it |
| `stream.html` | **The Stream** — publish + listen/watch (Notifi / Cratel) |
| `character.html` | **Agent Forge** — build + train your own agent |
| `market.html`, `wall.html`, `swarm.html`, `profile.html`, `join.html` | Marketplace, the Wall, Research Swarm, profile, public pitch page |

**Shared front-end scripts** (injected app-wide by `pinkroom-nav.js` — change one, it lands in every room)

| File | What |
|------|------|
| `pinkroom-nav.js` | The shared injector — back button, "Summon agent" button, and loads the scripts below |
| `kit-helper.js` | The in-room agent window (Kit / Tiff / your agents); per-agent model, crew, voice |
| `keys.js` | The unified Keys hub (`window.openKeys`) — brain / media / voice keys |
| `help.js` | The per-room quick guide (the "?" in the top bar) |
| `feedback-buddy.js` | The in-room feedback collector |
| `cloud-ai.js` / `cloud-bridge.js` | The hosted / BYO-key AI lane (a no-op on desktop/localhost) |
| `agent-dock.js` / `beat-dock.js` | Agents that *act* inside the Studio / Leon Labs (NLU + safe moves) |
| `audio-ear.js` | Free in-browser audio analysis (loudness/brightness/dynamics) so agents can "hear" |
| `leprince-fx.js`, `editor-inpaint.js`, `editor-trace.js` | Editor effects, content-aware fill, auto-trace |
| `settings.js`, `copy-anywhere.js`, `room-glow.js`, `tec-mascot.js`, `pt-menus.js`, `ae-menus.js`, `stream-publish.js` | Settings, copy UX, glow, mascot, Studio/Editor menu bars, publish helper |

**`data/`** — private, git-ignored: encrypted keys (`gen_keys.json`), sessions, agents, memory,
`owner.md`. **Never commit anything here.**

---

## UI conventions (learned the hard way)

- **Utility chrome goes in the top bar or menus — never floating over a room's canvas/timeline.**
  A "?" or a tool button parked over the work surface covers the user's tracks/clips and reads as
  broken. Mount shared chrome into the top bar (`document.querySelector(".kit-mount, .top")`) like
  `feedback-buddy.js` and `help.js` do.
- **Keep the top-bar buttons a consistent size** (Summon agent / Feedback / help all match).
- **Don't ship fake/dead UI.** A "coming soon" stub is a real wanted feature — make it work or put
  a working equivalent in place; deleting is the last resort.

---

## Submitting a change

1. Branch off `master`.
2. Make the change. Run **`python check.py`** (green), and **open the page in the browser** to
   confirm it actually works — there's no type-checker safety net here.
3. Open a PR describing **what** changed and **why**. Screenshots help for UI work.

Small, focused PRs beat giant ones. Bug reports and ideas as issues are just as welcome as code.

## Code style

- Match the surrounding style; no formatter is enforced.
- Comments explain *why* / the gotcha, not *what*. Keep the short "here's the trap" notes.
- No new dependency without a good reason — the whole point is that it stays small and readable.
