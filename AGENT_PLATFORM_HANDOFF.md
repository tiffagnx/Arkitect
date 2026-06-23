# AGENT PLATFORM — HANDOFF (cold start = "be me")

*Written 2026-06-23, ~12:10am, end of a marathon session. Read this + `MEMORY.md` (auto-memory) first. The owner ("B") works with ONE code session per night and wants to just say "go" — this doc is so you ARE the last guy.*

> ⚠️ **There is a PARALLEL session in this repo.** It owns `START_HERE.md` (leave it alone) and cut **v1.8.0** + Beat Lab undo/redo tonight. ALWAYS `git log -3` + `git status` before committing; commit **only your files** with explicit paths (never `git add -A`); never touch `START_HERE.md`.

---

## TL;DR — what tonight was
We **proved the platform thesis**: an agent you drag into a room *runs the tool*, and an agent you talk to *builds another agent*. It's not a chatbot in a corner — it drives the app. All committed + pushed to `master`, **and SHIPPED as `v1.9.0`** — the live Mac + PC download everyone now gets (the version tag auto-triggers the free GitHub Actions Mac build).

**Commits (master):** `cd0a716` (cloud gen + agent-drives-the-room + DeMartinville rename + encrypted keys) → `a996b66` (Agent Forge onboarding) → `43861b5` (FAB fix + this handoff) → v1.9.0 version-bump + release.

> ⚠️ **v1.9.0 shipped WITH the cloud generator untested against a real Atlas key** (owner's explicit call — he wanted it out). It fails gracefully (error message, never crashes; needs the user's own key; local generation unaffected). **First job next session: live-test cloud gen with B's real key** (see NEXT #2). If it's broken, hotfix + cut v1.9.1.

---

## WHAT GOT BUILT (with file pointers)

**1. Cloud image/video generator — `static/imagine-cloud.html` + `/api/cloud/generate` (app.py).**
BYO-key, **Atlas Cloud** (one async API: `POST /api/v1/model/generateImage|generateVideo` → poll `/model/prediction/{id}`; model in the JSON body). Side-by-side IMAGE | VIDEO panels, per-model options that adapt (Nano Banana: aspect/res/web-search; Wan 2.7: size/thinking; etc.), all 4 modes, count 1–4. Reached from Imagination Station via a `☁ Switch to Cloud` button on `static/images.html`. Local (`images.html`, free GPU/ComfyUI) stays; weak machines (`/api/capability` `recommend:"cloud"`) auto-redirect to cloud; `?local=1` forces local. Verified model catalog from a research workflow — full output was in task `w209c8y55`; models seeded: images = nano-banana-pro(+/edit), seedream-v4, qwen-image-2.0, wan-2.7/image-edit, qwen-image/edit-plus; video = wan-2.5 t2v, hailuo-02/pro, kling-v3.0-pro i2v, kling-v2.1 i2v, seedance-2.0 i2v, wan-2.7 (t2v + i2v). ⚠️ **Some video params are low-confidence** (flagged "(verifying)" in the UI) — Atlas renders schemas client-side; confirm against the live playground with a real key before trusting.

**2. Agent DRIVES the room (the core).** `app.py /api/kit` emits a server-validated `` ```action {json}``` `` block (exact copy of the proven `/api/beatbrain` `set`-block pattern — NOT native tool-calling, because the local LM-Studio model's tool-calling is unreliable + the cloud compat door 400s on unknown fields). `ROOM_ACTIONS` (app.py) is the whitelist/clamp = the hard safety boundary (the agent literally can't fire an unknown/out-of-range action). `/api/kit` returns `{reply, action}`. The frontend dispatches `action` to each room's `window.RoomAPI.run(...)`. `RoomAPI` is exposed on `images.html`, `imagine-cloud.html`, and `character.html` (the Forge). Verified live: "make a photo of a neon alley" → Tiff wrote a pro prompt (from the new KB) + fired a validated `generate_image`.

**3. Agent prompt-craft KB.** `static/kit_kb/images/prompt-craft.md` + `video-prompt-craft.md` (folder = room id `images`; the cloud room id `imagine-cloud` is **aliased to `images`** in `/api/kit` via `kb_room`). Makes Tiff write expert image/video prompts. `kit_kb.py` scopes by folder name; restart uvicorn (or it picks up via mtime) to load.

**4. In-room agent window — `static/kit-helper.js` (injected by `static/pinkroom-nav.js`).** Persists the chosen agent across local↔cloud + room hops (`localStorage dmv_active_brain`/`dmv_brain_tier`). ONE `Summon agent` button (pinkroom-nav) opens it; the FAB is a **passive name-chip** showing who's in the room (now shows the ACTIVE character's face — the FAB used to always show Kit's sprite; fixed via `fabAvatar()`). 📎 **image upload** → vision turn (`/api/kit` `image` → `_kit_local(...,image)`, local model SEES it). **Dock** toggle (⤵, only in rooms with `<div id="agentDock">` = images + cloud) docks it above the generator; floating window is **resizable**.

**5. Agent Forge onboarding — `static/character.html` ("Agent Forge").**
- `⚡ Start here` button in the hero → brings Tiff in (`?brain=tiff`) with a first-timer welcome ("I'm an agent, this is a live demo…"). Forge stays clean until pressed (kit-helper skips localStorage-restore when `room==="character"`).
- Forge window scoped to a SOLO build: only Tiff (roster/Kit/+Build hidden, riff/pipeline buttons hidden, more typing room).
- **Phase 2 (works):** Tiff FILLS the builder from conversation — `fill_agent` action (validated: name/tagline/notes + craft enum [producer/mix/beatmaker/writer/editor/builder] + vibe enum [chill-mentor/precise-tech/hype/zen-teacher]) → `window.RoomAPI.run` sets the fields. Verified end-to-end: "I'm Banx, a mix engineer, keep it precise" → she returned `fill_agent name:Banx craft:mix vibe:precise-tech`.
- "Their voice" → "Their vibe" (it's tone, not audio).

**6. DeMartinville rename (ARKITECT→DeMartinville).** exe/spec/launchers/updater all in sync: `DeMartinville.spec` (name='DeMartinville' → `dist/DeMartinville.exe`), `release.ps1`, `setup-and-run.ps1`, `build_zip.py` (→ `DeMartinville.zip` + `DeMartinville/` folder), `desktop.py` (mutex/title/comments), `app.py` (FastAPI title + Tiff/Kit persona + dialog text), `.bat` launchers renamed. **PROTECTED — do NOT sweep these:** the GitHub repo `tiffagnx/Arkitect` (updater REPO + gh-pages), lowercase `localStorage` keys `arkitect_if_names`/`arkitect-studio-tool`, the `.ark` session extension. (Case-sensitive `ARKITECT`→`DeMartinville` replace left them alone.)

**7. Security — keys encrypted at rest.** `swarm_routes.py` DPAPI vault (`_enc_secret`/`_dec_secret` via ctypes crypt32, Windows-user-bound, tagged `dpapi:`, plaintext fallback). `_load_keys` decrypts on read (legacy plaintext passes through), `_save_keys` encrypts. Cloud key moved OFF browser localStorage → encrypted `data/gen_keys.json` via `/api/cloud/key`. Honest posture: localhost-only server, local-first (no central key honeypot), HTTPS to providers, keys gitignored + out of the zip. Existing plaintext swarm keys encrypt on next save (no auto-migrate — the running OLD app shares `data/`).

**8. Other:** main chat (`static/index.html`) per-message copy button + clickable links + lyric/code blocks + scroll-while-streaming (don't yank to bottom). Beat Lab (`static/beats.html`) brand label removed + back-button moved left. `desktop.py`: window opens maximized, right-click Paste restored (`debug=True` + no auto-devtools), **mic one-time-allow** (persistent WebView2 profile `%APPDATA%\DeMartinville\webview-profile`, `private_mode=False, storage_path`).

---

## DEV WORKFLOW (critical — this confused B tonight)
- **`static/*` (HTML/JS/CSS/KB md) = LIVE on a refresh.** Served from disk by any build.
- **`app.py` + `desktop.py` are FROZEN INTO `DeMartinville.exe`** (`DeMartinville.spec` `hiddenimports=['app']`). So backend/native changes need either:
  - a **rebuild**: `venv\Scripts\pyinstaller.exe --noconfirm DeMartinville.spec` → `dist/DeMartinville.exe`; then `cp dist/DeMartinville.exe DeMartinville.exe` (the running exe is at repo root; the gitignored exe ships via release, NOT git), OR
  - **run `DeMartinville (app).bat`** (script mode = `pythonw desktop.py` → uvicorn `--reload` from disk) → app.py auto-reloads, NO rebuild. **Tell B to use the .bat for live iteration nights.**
- **Verify with the preview server** (Claude Preview MCP, `arkitect-preview`, port **7788**) — restart it (`preview_stop`+`preview_start`) to load app.py changes; navigate with `window.location.href` + verify via `preview_eval` (the screenshot tool kept timing out — use eval/snapshot). The owner's real app is `DeMartinville.exe` on port **7777** (separate).

---

## WHAT'S NOT DONE / NEXT (priority order)
1. **Forge avatar generation (the last Forge slice).** Tiff fills name/craft/vibe/notes but does NOT yet generate the avatar in-app. Build: a `generate_avatar` action + a "Generate" button in `character.html`'s face step → call `/api/cloud/generate` (nano-banana edit, the dropped photo as `images[]`) with a LOCKED spec (head-and-shoulders, centered, square, solid bg color, chosen style pixel/cartoon/realistic) → set the result as the avatar (reuse the green-screen + chroma-key for the uniform bg). Tuck the existing manual Gemini card behind a "no key? free" toggle. Needs the owner's Atlas key.
2. **Live-test cloud gen with B's real Atlas key.** `/api/cloud/generate` is verified to BUILD requests right + the vault round-trips, but a real end-to-end generation (image + video) has NOT run with a real key. Get his key in the cloud page → generate → confirm output URLs render. Confirm the low-confidence video params.
3. **Dependency-aware guided WORKFLOW** (B's vision, [[guided-agent-onboarding-vision]]): the agent runs a newcomer through the craft in dependency order (record→edit→mix→master), offering a/b/c choices easiest→hardest, only what's doable now. This sits ON TOP of the action-control loop.
4. **Marketplace / "buy the agent that writes better prompts"** ([[skill-to-room-marketplace-vision]]) — vision, not a build task.
5. Full heytiff **director-style KB port** (only prompt-craft cards done); Mac DPAPI (Keychain); verify mic one-time-allow live on his machine.

---

## GOTCHAS
- **Cloud gen needs B's Atlas key** (signup `atlascloud.ai/console/api-keys`) — not entered yet AFAIK.
- **Don't re-add** the in-app "BEAT LAB" brand label (he hates it) or a second agent button.
- **Rename landmines** (above) — never sweep the repo URL / save-keys / `.ark`.
- **Parallel session** — check git before committing; `START_HERE.md` is theirs.

---

## HOW B WORKS (so you ARE me)
Read these memories: [[bit16-and-cloud-gen]], [[guided-agent-onboarding-vision]], [[owner-accurate-credit]], [[owner-needs-to-see-not-be-told]], [[owner-spiral-is-the-stop-signal]], [[no-fabricated-content]].
- **Build it so he can SEE it; don't lecture.** Flag a doubt ONCE, then build his exact idea fast so he can react.
- **Accurate, never flattery** — he corrects over-praise. Credit the SPEED to the tooling (Opus 4.8, run hard); credit him for VISION, taste, and relentlessness.
- **"lock it in" / "ship it" = commit** (his files only, master, Co-Authored-By line). He's lucid + gives sharp feedback even at 1am — if he goes off / "woe is me", THAT's the fried-signal → lock what's good + call the break.
- **NEVER fabricate** people/data in his product. Empty > fake.
- He's the real deal (≈25-yr vocal engineer); match his rawness, stay grounded.
