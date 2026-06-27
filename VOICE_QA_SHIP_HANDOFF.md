# Voice / UI / QA — Session Handoff (2026-06-26 night)

Cold-start orientation for the work batched tonight. The owner batched **all three open
sessions** into one commit to get clean and start fresh. This file = the voice/UI/QA session;
the MCP session is in `MCP_SERVER_HANDOFF.md` + `MCP_GLOW_GUIDE_HANDOFF.md`; the Visual Labs
session is already committed (see `git log` around `64555d9`).

## What this session shipped (in the batch)

**🔊 Voice OUT — agents speak their replies (Fish Audio).**
- `app.py` → new **`/api/tts`** (after `/api/sfx`, ~line 3376). Proxies Fish Audio on the user's
  saved `fish_audio` key (`_gen_keys_load()`). **The `model: s2.1-pro` HTTP HEADER is what makes the
  inline `[expression]` tags fire** — S1 ignores square brackets. `reference_id` = the voice/clone
  model id. Returns base64 mp3. Empty body → graceful `{"error":...}` (verified live, no audio).
- `static/keys.js` → new **"Voices"** section in the Keys hub: a **Fish Audio key** card (saves
  server-side via `/api/cloud/key` provider `fish_audio`) + per-agent **voice model id** inputs
  (Kit/Tiff prefilled). Stored in `localStorage.dmv_voice_models`.
- `static/kit-helper.js` → per-agent **🔊 toggle** (next to mic) + playback on reply
  (`getVoiceModelId` / `getVoiceOn` / `setVoiceOn` / `playTTS`). No key/id → **browser
  SpeechSynthesis fallback** so an agent always talks. Owner's Fish voice ids:
  **Kit = `5312c04032034388bb6bac44c94c804d`**, **Tiff = `8526ee26387448b2a86c1d1052148a4b`**.
  → `[[kit-tiff-voice-system]]`.

**❓ Help "?" moved OFF the canvas → top bar.** `static/help.js` now mounts the `#dmvHelpBtn` into
the shared top bar (`.kit-mount, .top`, same mount Feedback uses) instead of floating bottom-left
over the canvas/timeline. Rule learned: `[[no-floating-ui-over-canvas]]`.

**🎛️ Top-bar buttons consistent + beats overflow fixed.** `static/pinkroom-nav.js` — "Summon
agent" now matches Feedback's exact size (34px / radius 10 / pad 0 12px). `static/beats.html` —
`.kit-mount` is now `position:sticky; right:0` so the Summon agent / Feedback / ? cluster never
scrolls off the toolbar edge.

**✅ `check.py` (NEW, repo root) — the QA harness.** `python check.py [port]` byte-compiles every
`.py`, `node --check`s every `static/*.js`, and (if the app is up) GETs every room + read-only
endpoints + 2 **safe empty-body guard POSTs** (`/api/tts`, `/api/sfx`). Never renders audio/video,
never spends a credit. Run it before every commit. **It does NOT** catch runtime JS console errors
or judge whether something *looks* right — that eyeball check stays human.

**📄 Docs for contributors.** `CONTRIBUTING.md` + `README.md` rewritten — current, accurate,
DeMartinville-branded, agent-neutral, full architecture map, run steps, `check.py`, conventions.
For real coders to land once there's a demo video.

## Open threads (parked — owner's call next session)

- 🎤 **Live-test Kit's voice** — owner adds his Fish key in Keys→Voices, flips 🔊, talks. (`/api/tts`
  needs an **app restart** to load — uvicorn has no `--reload` in the packaged launcher.)
- 🎭 **S2 expression tags in replies** so Kit *performs* `[cocky]`/`[laughing]` live (needs a
  system-prompt change + stripping the tags from the displayed chat text, carefully — don't nuke
  links/citations). Owner's steer: agents should **already know the rooms** — don't bolt on a
  "instant help" band-aid.
- ✏️ **Studio "Song Guide" FAB** (`guideFab`, `static/studio.html` ~7559) still floats bottom-right
  over the timeline; it auto-hides after first dismiss. Move to top bar OR leave. Owner couldn't
  locate it — parked.
- 🔎 **THE BIG ONE — a full UI/rooms AUDIT.** Owner wants ONE coherent pass that lists every
  inconsistency / floating-thing / broken bit at once, instead of fixing one button at a time
  (which he calls "going backwards"). **Do the audit before more reactive UI fixes.**

## Owner context
- A **commercial** is waiting on "done"; the real blocker is that he's the **sole human QA**.
  Reframe to keep giving: ship **ONE solid flow** (the talk-to-Kit voice demo), not a bug-free
  everything. `check.py` + contributor docs attack this. → `[[commercial-blocker-and-qa-bottleneck]]`
- Boogie is **OUT** as a target user. → `[[boogie-beats-collaborator]]`

## Verify
- App = **port 7777**; uvicorn has **no `--reload`** in the launcher → **restart** to load `.py`
  changes (e.g. `/api/tts`). Static (`.html`/`.js`) = browser refresh.
- `python check.py` before any commit.
