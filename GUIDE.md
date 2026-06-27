# DeMartinville — the complete guide & map

*The one place that explains everything: what each room is, how to work it, where it lives in the code, and how it all hooks together. Written from a real read of the source (2026-06-26). Two lenses on every section — **Use it** (for a person) and **Wire it** (for a builder or an agent).*

---

## What DeMartinville is

A **local-first creative OS** that runs in your browser off a small Python server on your own machine. Make music, video, images, beats, and apps; build and train your own AI agents; and publish — all free, all private, with an AI collaborator (Tiff, Kit, or one you built) you can talk to in every room.

- **Local & private** — a FastAPI server (`app.py`) serves single-file rooms (`static/*.html`) to a browser/native window at **`http://127.0.0.1:7777`**. Your work, memory, and keys live in `data/` on your machine.
- **Free, BYO-key** — everything that can run on your machine does (local LLM via LM Studio, local image gen via ComfyUI/FLUX). Cloud features light up when **you** paste your own API key.
- **Agents everywhere** — drag an agent into any room and tell it what to do; it acts through that room's controls.

### The rooms at a glance

| Room | File | What it is |
|---|---|---|
| **Main hub + chat** | `static/index.html` | Front door: talk to Tiff/Kit, memory, sessions, navigate to every room |
| **DeMartin Audio Labs** | `static/studio.html` | The DAW — record / edit / mix / master, plugins, bounce |
| **Leon Production Labs** | `static/beats.html` | Beat maker / step sequencer + instruments + AI "Cook" |
| **LePrince Visual Labs** | `static/editor.html` | After-Effects-style video/visual editor + 100+ effects |
| **Imagination Station** | `static/images.html` + `static/imagine-cloud.html` | Image gen (local, free) + image/video gen (cloud, BYO key) |
| **Agent Forge** | `static/character.html` | Build + train your own AI agents |
| **Berner Builder** | `static/build.html` | Describe an app or audio plugin → it builds it |
| **The Stream** | `static/stream.html` | Publish + listen/watch music (Notifi) & video (Cratel) |
| **Support pages** | `wall` / `market` / `profile` / `swarm`.html | The Wall (hidden), agent marketplace, profile, research swarm |
| **Public site** | `static/join.html` | The pitch page, deployed as demartinlabs.com |

---

# Part 1 — The rooms

## 🏠 Main hub + chat — `static/index.html`

**What it is.** The command center: chat with Tiff or Kit, see your session history, manage memory, navigate to every room, and choose which agent + brain helps you where.

**Use it.**
- Type in the box at the bottom and hit ➤ (Shift+Enter = newline). Switch agents with the Tiff/Kit buttons up top.
- **＋** attaches images (the agent can see them), PDFs, code, audio (it transcribes + analyzes).
- The **effort lever** (Faster ←→ Smarter) sets how deep it thinks; on Claude it unlocks **🔱 God mode**.
- Modes: 💬 Chat · ✍️ Write · 🔬 Research. The **model dropdown** picks the brain (local or your cloud keys).
- Left sidebar = sessions (click to load, ✕ to delete). Memory rail = LOCAL + CLOUD tabs.

**Wire it.** Chat → `POST /api/chat`; docked agents → `POST /api/kit`. Sessions/memory via `/api/sessions` + `/api/memory`. Helpers are injected app-wide by `static/pinkroom-nav.js` (loads `kit-helper.js`, the keys dialog `keys.js`, audio analysis `audio-ear.js` → `window.DMV_EAR`, and `stream-publish.js`). Key globals: `window.__kitOpen()`, `window.__kitSay(text)`, `window.RoomAPI`, `window.dmvSessionSnapshot()`. **Warm handoff:** jumping chat → room stashes a brief in `localStorage.dmv_handoff` that the room agent picks up once.

## 🎚️ DeMartin Audio Labs — `static/studio.html` (+ `agent-dock.js`)

**What it is.** A real browser DAW (Web Audio). Record vocals or drop audio onto separate tracks (stems), edit clips Pro-Tools-style, stack plugins, automate, and bounce to WAV/MP3. An AI agent docks onto stems and applies *measured* mixing fixes — every move re-renders and re-analyzes, so it never lies about what it did.

**Use it.**
- **Record a take** or drag audio in → each becomes a track. Tools: Grabber (move), Trimmer (resize), Selector (range), or Smart Tool (all three). Grab the bottom-left dB badge to ride clip gain; top corners for fades.
- Space = play. Add plugins in the insert slots (A–E, F–J); right-click to edit. Send to FX buses via the Sends columns. Ride volume/pan with the **A** automation button.
- Click a track to open its **Mix** channel strip. **Export WAV** in the File menu → pick source (master / stem / selection / bus), format, bit depth, range.
- **Dock the agent** with the 🎙 snap button under a track's controls, then tell it: *"brighter," "warmer," "less harsh," "more punch,"* or *"fix it."* Session-wide commands: *gain-stage, recipe (90s/boom-bap/modern), harmony, choir, vocoder, pultec, parallel saturation, sidechain pump, stutter, build to drop, SFX.*

**Wire it.** Tracks live in `window.tracks` (studio.html:945). Lanes are `#lane-{id}` (built by `laneUi`, 4450). Bounce = `renderBounce` (7122). The agent path is `agent-dock.js`: `window.DMV_DOCK_FIX(text, agentId)` (378) → `parseIntent` → `applyMovesToTrack` (286) → measured `receipts` (266). Session verbs are `window.studioGainStage / studioRecipe / studioHarmonize / studioPultec / studioStutter / studioDrop / studioGenSfx …` (382–417). The **agent-work glow** (`room-glow.js`) lights the stem being worked. **Agent-drivable:** fully — via `DMV_DOCK_FIX` + the `window.studio*` verbs. Exports: "Send to Studio" (from other rooms) drops a file as a track; "To Notifi" publishes to The Stream.

## 🥁 Leon Production Labs — `static/beats.html` (+ `beat-dock.js`)

**What it is.** A full beat maker: step sequencer, piano roll, 20+ Web-Audio instruments, mixer, and an AI **🍳 Cook** that composes a genre-accurate track (drums + 808 + chords + melody, in key) in seconds. 100% local.

**Use it.**
- **🍳 Cook** → describe a vibe ("trap at 140," "lo-fi boom-bap") → it builds the whole arrangement. Or build by hand: toggle steps in the **Channel Rack**, write notes in the **Piano Roll** (✨ Gen auto-writes in key), drag **BPM/SWING**, lock the **🔒 Key**.
- **Add ▸ [instrument]** to layer sounds; drag an audio file in to make a sampler. Turn your **voice into an instrument** (chop or synth).
- Export: **WAV / stems / MIDI**, or **⤓ Send to Studio** to drop the beat on a DAW track.

**Wire it.** Documented surface `window.RoomAPI` (beats.html:~2900): `cook, groove, setTempo, setKey, humanize, randomize, play, stop, genres, describe` (+ ~25 verbs incl. `addInstrument, designInstrument, generate, vocalToInstrument, sfx, shape, mix, bounce, exportStems, exportMidi`). Natural-language front door = `beat-dock.js` `window.DMV_DOCK_FIX(text, agentId)` (~60 patterns; Kit=precise / Tiff=vibey taste). Backend: `/api/sfx`. **Agent-drivable:** 100%. *(MCP note: beats already exposes `window.RoomAPI` — add the `room-glow.js` + `mcp-bridge.js` includes to fully light it up.)*

## 🎬 LePrince Visual Labs — `static/editor.html` (+ `leprince-fx.js`, `editor-inpaint.js`, `editor-trace.js`)

**What it is.** A streamlined After Effects in the browser: import video/images, arrange on a timeline, keyframe layer properties, apply 100+ effects, draw vector masks, content-aware fill, auto-trace, and export MP4.

**Use it.**
- **＋** (media bin) or drag files in → drag clips onto the timeline. Select a clip → the **Inspector** (right) edits position/scale/rotation/opacity. Space = preview.
- **Layer ▸ New Mask** / Pen tool to mask; **Layer ▸ Content-Aware Fill** removes objects. **Effect** menu adds effects. **Animation ▸ Add Keyframe** for any animatable property.
- **▶ Export** (top-right) → MP4 (x264 or NVENC). `File ▸ Composition Settings` (Ctrl+K) sets canvas/fps/duration.

**Wire it.** Render loop = `drawFrame()` / `drawFrameInto(...)`. Project model = `project.tracks[].clips[]` (each clip: transform + `masks` + keyframes + `fx*` fields). Backend: `/api/editor/*` (import, media, projects, export; plus a **WebSocket** `/api/editor/export_frames` for motion/effect-exact renders). Effect plugins register via `window.LP_FX.register(d)`; inpaint = `window.LPInpaint`, trace = `window.LPTrace`. Publish a finished render to The Stream via `window.streamPublishDialog({kind:'video', editor_jid})`. **Agent-drivable:** yes, but via the project JSON + `/api/editor/*` + window functions (`contentAwareFill`, `autoTrace`, `setPlayhead`, `togglePlay`) — no `window.RoomAPI` yet.

## 🎨 Imagination Station — `static/images.html` (local) + `static/imagine-cloud.html` (cloud)

**What it is.** Two rooms. **Local** (`images.html`) generates images free on your GPU — DRAFT (fast), PHOTO (realistic), Z-IMAGE (fast realistic), EDIT (instruction edits). **Cloud** (`imagine-cloud.html`) does premium image + **video** via Atlas Cloud (Nano Banana, Seedream, Qwen, Wan, Kling, Hailuo) on **your** key (pennies/image; video genuinely costs).

**Use it.**
- **Local:** write a prompt (or **✨ Polish** to let Tiff sharpen it), pick mode + aspect, optionally attach a reference for img2img/edit, hit **✦ Generate**. **🧹 free memory** when done to un-lag the machine.
- **Cloud:** save your Atlas key (encrypted), pick **IMAGE** or **VIDEO**, a model, options (aspect/duration/etc.), prompt, generate. Up to 4 images at once.

**Wire it.** Local: `POST /api/image` (+ `/api/image/polish`, `/api/image/free`, `/api/image/gallery`, `/api/image/file/{name}`). Cloud: `POST /api/cloud/generate` (+ `/api/cloud/key`). Both expose `window.RoomAPI.run({...})` — local takes `{mode,size,realism,prompt}`, cloud takes `{kind,prompt,image,aspect,count,seconds,model}`. **Capability:** `/api/capability` returns `recommend:"cloud"` on weak machines and `images.html` redirects to cloud unless `?local=1`. **Agent-drivable:** fully (cloud needs a saved key first — the user sets that).

## 🧬 Agent Forge — `static/character.html`

**What it is.** Where you build your own AI agent. An agent = a **persona** (voice/craft/face) + a **knowledge pack** (rules learned from your real work) + a **chosen brain** — *not* a fine-tuned model. It lives locally and gets smarter as you train it.

**Use it.** Six steps: **name + tagline** → **face** (Pixel-Me via Gemini, upload, or color) → **craft** (Producer / Mix / Beatmaker / Writer / Video / Builder — sets its home room) → **voice** (Chill / Precise / Hype / Zen) → **knowledge notes** → **train** (Watch = log moves, Feed = paste a corpus, Work = learns as you go). Readiness bar = build (≤80%) + trained (≤20%). **Save + Take** opens it in its home room.

**Wire it.** Roster in `localStorage.dmv_characters`; packs on disk via `/api/agents` (CRUD), `/api/agents/{id}/train` (distills real evidence only — never fakes progress), `/api/agents/{id}/readiness`, `/api/character/prompt` (Gemini writes the pixel-art prompt). `window.RoomAPI.run({action:"fill_agent", ...})` lets Tiff auto-fill the form. Taking an agent into a room = navigate with `?char={id}`. **Agent-drivable:** yes (fill + train + inspect).

## 🛠️ Berner Builder — `static/build.html`

**What it is.** Describe an app or an audio effect in plain English and get a working single-file thing you can test immediately. **App mode** → live-preview web app. **Plugin mode** → a Web-Audio DSP plugin on a test bench (knobs, spectrum, scope, A/B).

**Use it.** Type a description → **Talk** (discuss) or **Build** (make it). 📎 attach references. Toggle **🌐 App / 🎛 Plugin**. **View** menu = Preview/Code/Console + **Auto-fix errors** (patches runtime errors up to 2×) + Screen-size. **🛰 Research** fact-checks APIs first. **File ▸ Save** (apps → Your Builds; plugins → sent to the Studio).

**Wire it.** `POST /api/build` (SSE stream; body `{mode, model, history, assets}`), `/api/research-for-build`, `/api/builds` + `/api/plugins` (CRUD). Preview iframe talks back via `postMessage`; plugins validate in an `OfflineAudioContext` + a `TIFF_PLUGINS.register()` check. **Agent-drivable:** partially — drive `/api/build` directly or the form; no `window.RoomAPI` yet.

## 📡 The Stream — `static/stream.html` (+ `stream-publish.js`)

**What it is.** Publish finished work and browse others'. **Notifi** = a music feed (listen/queue/download). **Cratel** = a video gallery (fullscreen theater). Local by default; artists embed their own payout link (Cash App/PayPal/Ko-fi) — **0% middleman, 100% to creator**.

**Use it.** Tabs switch Notifi/Cratel. Click a track/video to play. **+ Publish** → drop a file, title/creator, optional cover + payout link + ownership check → publish. The settings chip sets your handle + **Local / Shared** mode.

**Wire it.** `GET /api/stream`, `POST /api/stream/publish` (file data-URI **or** disk `path` **or** `editor_jid`), `GET /api/stream/media/{name}` (Range scrubbing), `DELETE /api/stream/{sid}`. **Cross-room:** any room calls `window.publishToStream(opts)` / `window.streamPublishDialog(opts)` (from `stream-publish.js`, loaded everywhere). Shared mode needs env `DMV_SHARED=1`. **Agent-drivable:** via the publish helpers; no `window.RoomAPI` yet.

## 🧩 Support pages — `wall.html` · `market.html` · `profile.html` · `swarm.html`

- **The Wall** (hidden easter egg, opened from a faint spray-mark by the logo) — claim a spot, draw a signature; saved local + `POST /api/wall/sign`. Don't re-add it to the menu.
- **Marketplace** — browse every agent ("skill") by craft, search, **deploy into a room** (`?char=id`). Reads `localStorage.dmv_characters`.
- **Profile** — a creator's showroom template (receipts / work / track record). Pure HTML.
- **Research Swarm** — add LLM providers (your free keys), then ask a question that fans out across all of them in parallel and merges via your local brain. `/api/swarm/*` + `/api/research-swarm` (SSE).

## 🌐 Public site — `static/join.html` → demartinlabs.com

**What it is.** The pitch page (a manifesto, not a tour): local + private + free, train your own agent on your real moves, pay-per-use you-keep-100%. Static, no backend. **Download** buttons point at the GitHub release zip (Mac variant swapped via WebGL GPU detect). **Deploy:** rebuild `index.html` from this file, force-push `gh-pages` of `tiffagnx/Arkitect` — always include `CNAME`, `kit-hero.png`, `static/shots/*`.

---

# Part 2 — How it all hooks together

## The backend & API — `app.py` (+ `swarm_routes.py`, `room_relay.py`)

A localhost-only FastAPI server on **7777**. A request flows: browser/MCP `POST /api/*` → build a system prompt (the `PERSONA` + room help + memory + live session) → route to a brain (local **LM Studio** on `localhost:1234`, or a `cloud:<slot>` provider) → stream the answer back as **SSE** (`{type:"delta"}` … `{type:"done"}`). Memory rides in the *final user message* (not the system prompt) to keep the LM Studio prompt cache warm.

- **~80 endpoints.** Chat/brains: `/api/chat`, `/api/kit`, `/api/research`, `/api/models`, `/api/extract`. Gen: `/api/image*`, `/api/cloud/generate`, `/api/sfx`, `/api/transcribe`. Work: `/api/studio/projects`, `/api/editor/*`, `/api/sessions`, `/api/memory`, `/api/agents*`, `/api/builds`, `/api/plugins`, `/api/stream*`. Status: `/api/health`, `/api/version`, `/api/capability`.
- **Routers** are wired at the end of `app.py`: `include_router(swarm_router)` + `include_router(room_relay_router)`.
- **Add an endpoint:** mirror the `/api/chat` pattern (`@app.post(...)`, `body = await req.json()`, return JSON or `StreamingResponse(gen(), media_type="text/event-stream")`). For one-shot LLM calls use `lm_once(...)`; for cloud, `swarm_routes.provider_once/provider_stream`.

## The brains & agents — `agent-dock.js`, `kit-helper.js`, `cloud-*.js`, `kit_kb.py`

An **agent = persona + knowledge pack + brain + room context.** Kit (technical) and Tiff (warm) are built in; you can build your own in Agent Forge.

- **Flow:** you message a docked agent → `POST /api/kit` (with `room`, `character`, `model`, `effort`, `crew`, live `session`) → the brain answers, optionally emitting a fenced ` ```action{…}``` ` block → it's validated against that room's `ROOM_ACTIONS` whitelist → the room runs it via `window.RoomAPI.run(action)` (or `window.studio*` for the DAW).
- **Docking:** drag an agent into a room (or 🎙 snap onto a stem in the DAW). **Crew mode** = the lead consults up to 4 other brains in parallel and synthesizes (breadth). **God Mode** = when the lead is Claude, the effort dial drives Anthropic's native `/v1/messages` with real `output_config.effort` + adaptive thinking (depth). They stack.
- **Brain pick:** per-agent model (`dmv_agent_model_*` or a user agent's `.model`); `tier="local"` honors privacy, `tier="private/max"` uses cloud if a key exists. Knowledge retrieval = keyword/synonym (`kit_kb.py`), no embeddings.
- **Add a capability:** define the action in `ROOM_ACTIONS`, expose a `window.RoomAPI` method (or `DMV_DOCK_FIX` for NL), and the validation/execution is automatic.

## Keys, capability & "what powers what" — `keys.js`, `swarm_routes.py`

Free + local-first; **you paste your own keys** to unlock cloud. Keys are stored **encrypted at rest** (Windows DPAPI) in `data/` — **gitignored, excluded from the zip, never sent to the browser** (the picker only carries an opaque `cloud:<slot>` id; the server looks up the real key). `/api/capability` reads your hardware once and returns a verdict (`good`/`marginal`/`poor`) + `recommend` + `has_cloud_key`.

| Feature | Key needed | Cost |
|---|---|---|
| Chat / writing | local LLM **or** any provider (Groq free) | free → pay-as-you-go |
| See images (vision) | Gemini / Claude / GPT / Grok | free (Gemini) → paid |
| Hear a song — numbers (DSP) | none (in-browser) | free |
| Hear a song — words (transcribe) | Groq (Whisper) | free tier |
| Make images | built-in FLUX **or** Atlas/FAL/KIE | free local → pennies |
| Make video | Atlas (cheapest) | pennies/sec — **genuinely costs** |
| God Mode (deep reasoning) | Claude (or Groq `gpt-oss-120b`) | paid → free |
| Research | Tavily (cleaner) or DuckDuckGo (free) | free |

## MCP + live agent control — `mcp_server/`, `room_relay.py`, `mcp-bridge.js`, `room-glow.js`

Lets **Claude (Desktop/Code) drive DeMartinville** from outside, in three layers (see `MCP_SERVER_HANDOFF.md`):
- **Layer 1 — backend powers:** `mcp_server/server.py` (a FastMCP stdio server, 24 tools) calls the `/api/*` surface — chat, gen, render, manage agents/projects/memory, publish. Live-verified.
- **Layer 2 — the command relay:** `room_relay.py` (`/api/room/{hello,poll,result,command,clients}`) + `static/mcp-bridge.js` (include it in a room → it joins the relay and runs commands against `window.RoomAPI` / `window.studio*`). MCP tools: `dmv_rooms_open`, `dmv_room_describe`, `dmv_room_command`.
- **The agent-work glow:** `static/room-glow.js` — `roomGlow(target,{agent,label,state})` lights the exact element an agent is working on (compositor-only, seizure-safe). Wired into the DAW's docked-agent path.

## Run, build & deploy — `launch.ps1`, `desktop.py`, `release.ps1`, `build_zip.py`

- **Run:** the launcher (`ARKITECT.exe` → `launch.ps1`, or `desktop.py` for the native window) starts `uvicorn app:app` on **7777** and the LM Studio brain on **1234**. Dev: `venv\Scripts\python -m uvicorn app:app --port 7777`. **No `--reload`** — restart to load `.py` changes. `static/*.html` serve fresh on reload; `app.py` is frozen into the exe.
- **Ports:** **7777 = the live app.** 7799/7788 = parallel-session preview ports only.
- **Release:** `release.ps1 X.Y.Z` bumps `APP_VERSION` in **both** homes (`app.py` *and* `static/studio.html`), builds a clean zip (`build_zip.py`, excludes `venv/`, `data/`, keys), tags `vX.Y.Z`. The tag **auto-triggers the free Mac build** (Intel + arm64, attached to the release). ⚠️ Intel macOS builds historically never finish; arm64 is reliable. Don't blind-rebuild the exe in a headless session.
- **Deploy site:** rebuild `index.html` from `static/join.html`, force-push `gh-pages` — always include `CNAME` + `kit-hero.png` + `static/shots/*`.

---

# Part 3 — Quick reference

**Ports:** app **7777** · LM Studio **1234** · preview 7799/7788.

**Key window globals (room control):** `window.RoomAPI.run(action)` · `window.studio*` (DAW verbs) · `window.DMV_DOCK_FIX(text, agentId)` · `window.roomGlow(target, opts)` · `window.publishToStream(opts)` · `window.DMV_EAR.analyze(file)` · `window.__kitOpen()` / `window.__kitSay(text)` · `window.openKeys(cat)`.

**Per-room control surface:**

| Room | Agent control |
|---|---|
| studio | `window.studio*` + `DMV_DOCK_FIX` ✅ |
| beats | `window.RoomAPI` (~25 verbs) + `DMV_DOCK_FIX` ✅ |
| images / imagine-cloud / character | `window.RoomAPI.run(...)` ✅ |
| editor | project JSON + `/api/editor/*` + window fns (no RoomAPI yet) |
| build / stream | `/api/*` + window fns (no RoomAPI yet) |

**"How do I add…":**
- *a new room* → `static/newroom.html`, serve it, expose `window.RoomAPI = { room, run(action) }`, add the helper includes (`pinkroom-nav.js`, optionally `mcp-bridge.js` + `room-glow.js`).
- *a new agent action* → add it to `ROOM_ACTIONS` + a `window.RoomAPI` method; validation/exec is automatic.
- *a new cloud provider* → add to `PRESETS` in `swarm_routes.py`.
- *a key-gated feature* → read the key server-side (`_load_keys()` / `_gen_keys_load()`), call the provider, fail gracefully on 401.
- *live external control of a room* → include `mcp-bridge.js`; drive it with `dmv_room_command(room, action, args)`.

**Cold-start docs:** this guide first, then the relevant `*_HANDOFF.md` (e.g. `MCP_SERVER_HANDOFF.md`), and `CLAUDE.md` for the ship routine. Auto-memory lives in `MEMORY.md`.
