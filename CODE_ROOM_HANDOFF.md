# Code Room + Memory Panel — Session Handoff
_Session: 2026-06-29 · Branch: master · **v3.1.1 shipped**_

## Hotfixes shipped in v3.1.1 (same session, after v3.1.0)

- **Cloud model labels garbled** (`app.py` line 599) — ☁ and · chars were stored as corrupted bytes; fixed via raw byte replacement + BOM strip
- **Double-click does nothing** (`desktop.py` `_focus_existing_window`) — secondary instances only waited 5 s for the window then gave up silently; raised to 90 s so extra clicks during startup will find and focus the window
- **Kit freeze frame** (`static/code.html` `FREEZE_MS`) — reduced from 20 s to 10 s

---

---

## What Was Built This Session

### Code Room (`static/code.html`)

**Kit identity** (`app.py` CODE_AGENT_SYSTEM ~line 1583)
- Kit is a technical robot builder; knows Bryan (25-yr SA vocal engineer, Lil Flip/MO3/Big Sid); knows DeMartinville

**Media upload** — images, audio, video all work now
- File input accepts `image/*, audio/*, video/*`
- Images → vision; audio/video → Whisper transcription → text in input

**Prompt caching + smart context checklist** (`app.py` `/api/code/agent`)
- `_sse()` helper avoids curly-quote Python syntax errors
- Dual payload: Claude gets `cache_control: ephemeral` on system blocks (~90% cost savings); local/non-Claude gets plain payload
- Smart pre-flight: fetches file tree / file content only if keywords suggest it's needed
- Token budget by effort: hist_limit 4/8/14/20, max_tok 1024/4096/8192

**Model picker upgrades**
- `localParamCap()` — accurate VRAM → usable model size (8GB = ~4B, not 7B)
- `advisorHtml()` — shows Local cap + Cloud providers as two clear sections
- `modelDesc(m)` — one-liner description under each model name in the dropdown
- `kitPickModel()` / `codeScore()` — picks best across local AND cloud for current effort
- "Let Kit choose" button — auto-selects best model for effort level
- Kit model-advisor bubble — slides up from bottom-right, rule-based recommendation aware of VRAM cap + cloud keys, action buttons to switch or go to Settings

**Fast startup** (`desktop.py`)
- Window appears immediately with dark `_LOADING_HTML` loading screen
- Navigates to real app once server ready (background thread)
- Before: blank for up to 60s → user kept double-clicking

**Desktop shortcut** (`desktop.py`)
- `create_desktop_shortcut()` places `DeMartinville.lnk` on Desktop on first launch

### Memory Panel (`static/index.html`)

**Compact memory cards**
- Cards collapsed to single title line (click to expand body)
- Frees up space for the import section below

**Import from another AI**
- Collapsible section: "Import from another AI" between the card list and "Remember it"
- Local tab: compressed prompt (8 bullets, one sentence each) → parses up to 10 entries, 160-char bodies
- Cloud tab: 6 checkboxes, "Everything — full dump" option → rich prompt → parses up to 200 entries, handles `## Header` blocks + bullets
- Prompt works with ANY AI (ChatGPT, Gemini, Grok, Claude, whatever)
- Parse & save splits bullets/headers, saves each as a separate memory entry

---

## What Needs a Server Restart (port 7777)

All `app.py` changes need restart before testing:
- Kit identity system prompt
- `/api/code/agent` caching + smart checklist
- `_sse()` helper
- `swarm_routes.py` caching (`_cache_system` blocks)

Static `.html` / `.js` files take effect on page refresh — no restart needed.

---

## What to Test

- [ ] Kit identity: open Code room, ask "who are you" — should name itself Kit, know Bryan
- [ ] Image upload: drag a PNG/JPG into Code room chat
- [ ] Audio upload: drag an mp3 → should transcribe and appear as text
- [ ] Model dropdown: should show description under each model name
- [ ] "Let Kit choose": auto-selects best for current effort level
- [ ] Kit bubble: open model menu → "🤖 Ask Kit" → bubble slides up with smart recommendation
- [ ] VRAM tip: 8GB should say "local tops at ~4B" (not 7B)
- [ ] Memory cards: cloud memory panel → cards single-line, click expands
- [ ] Import (local): copy prompt → paste into ChatGPT → paste back → parse & save → check memory
- [ ] Import (cloud): same flow with rich prompt → should save many detailed entries
- [ ] Fast startup: launch via bat → window appears in ~1-2s with dark loading screen

---

## Still Pending

- **Styled dialogs (`dmv-modal.js`)** — all native `confirm()`/`alert()`/`prompt()` across 10+ files still use the browser default. Work started (CSS + HTML planned) but not built yet. Big sweep needed across: `settings.js`, `swarm.html`, `character.html`, `images.html`, `stream.html`, `wall.html`, `studio.html`, `editor.html`, `beats.html`, `kit-helper.js`
- **Kit bubble auto-routing** — could route automatically (local for quick/free, cloud for deep) without user having to manually switch

---

## Files Changed (uncommitted)

- `app.py` — Kit identity, `_sse()`, caching, `/api/code/agent`
- `swarm_routes.py` — `_anthropic_body()` accepts `system_blocks` for caching
- `static/code.html` — media upload, model picker, Kit bubble, VRAM fix, model descriptions
- `static/index.html` — compact memory cards, import from another AI
- `desktop.py` — fast startup loading screen, desktop shortcut

## Ports / Run Notes

- Port **7777** — main app (no `--reload` → restart for `.py` changes)
- Parallel sessions use **7799 / 7788**
- Never `git add -A` — always add explicit file paths
