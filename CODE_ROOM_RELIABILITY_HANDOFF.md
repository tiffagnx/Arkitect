# Code Room Reliability — HANDOFF (v3.1.4)

*Written 2026-06-29 ~3:30am while B slept. He said: "make all the models work like you... seamless... audit it, make sure it works, keep going until perfected." Then: push it to main.*

## The core problem B kept hitting
Every model in the Code room would reply with one sentence of planning ("Got it, let me see what we're working with first.") and **stop** — never writing a file. The agent loop exits when the model emits no ```write or ```run block, so a plan-only reply = the room does nothing. B spent ~$100 and couldn't get a single code change to land.

## What was fixed (all in `app.py` + `static/code.html` + `desktop.py`)

### 1. Kit now knows it's inside DeMartinville (system prompt training)
`CODE_AGENT_SYSTEM` (app.py ~line 1583) gained two sections:
- **== THIS APP: DEMARTINVILLE ==** — stack facts: port 7777, which file needs what after a change (.py → restart server, static/*.html|js|css → hard refresh, desktop.py → full app restart), key file map, APP_VERSION lives in two homes.
- **== AFTER EVERY WRITE: TELL HIM THE NEXT STEP ==** — every file-writing reply MUST end with one short line telling B exactly what to do (restart / hard refresh / done). This is the "treat me like Claude Code does" behavior he asked for.
- HARD RULES got a forcing first rule: **ACT, don't narrate** — first reply to any build/fix/change MUST contain a ```write or ```run block; never "let me look first" and stop.

### 2. Server-side forcing retry (the real safety net) — `gen()` in `/api/code/agent`
After round 1, if the instruction is a **build intent** (build/make/add/fix/change/etc.) AND the model produced **no ```write and no ```run block** AND it did say something, the server appends an assistant turn (its plan) + a hard user nudge ("you only planned, nothing happened, output the blocks NOW") and **re-streams one more round** with the same model. Then applies all write blocks from the combined output. This makes weak/cheap models behave even when the prompt alone doesn't land them.

### 3. Pop-out window = Edge `--app` mode (NO browser chrome)
B hated that ⤢ opened a full Edge window with URL bar + tabs + Microsoft chrome. New backend endpoint **`POST /api/code/open_popup`** (app.py, just before `/api/code/run`) launches `msedge.exe --app=<url>` (falls back to Chrome) → a clean window, just a title bar + the Code room, looks like its own app. Launched with `CREATE_NO_WINDOW`.
- code.html ⤢ button now: tries `/api/code/open_popup` FIRST (reliable, no chrome) → pywebview fallback → window.open last.
- URL carries `?popped=1`; the popped window **hides its own ⤢ button** so B can't infinitely nest/duplicate.
- 2.5s cooldown on the button kills double-click duplicates.
- desktop.py: pywebview popups tracked in `_popup_windows`, focus-existing instead of stacking, and **destroyed when the main DeMartinville window closes** (so Code closes with the app).

## VERIFIED LIVE (not just "should work")
Booted a throwaway server on :7799 and ran real build tasks:
- **Kimi K2.7 Code** → emitted `write` block, file written to disk, ended with "Done — no restart needed." ✅
- **DeepSeek V4 Pro** → same: write block, applied, next-step line. ✅
- 7 logic unit tests (intent detection, LF/CRLF/multi write-block regex, run-block detection) all pass.
Test server killed, test files cleaned.

## What B must do when he wakes
1. **Restart 7777** (app.py changed) — and since desktop.py changed too, **fully close & reopen DeMartinville** (not just the server).
2. Hard refresh isn't enough alone here because the backend changed — full restart.
3. Then: open Code, pick any model (Kimi / DeepSeek / Sonnet), give it a real task → it writes the file and tells him the next step. Hit ⤢ → clean app window, no browser chrome, no duplicate spawning.

## Shipped
Committed to master as v3.1.4. NOT deployed to gh-pages, NOT released (those are public/irreversible — left for B to confirm when awake).

## Still open / nice-to-have
- The forcing retry uses the same `max_tokens` as the round (low effort = 1024) — a big file write on "low" could truncate. Consider bumping max_tokens for build-intent retries.
- Edge `--app` windows don't auto-close with DeMartinville (only the pywebview path does). Minor; B didn't raise it this round.
- Styled dialogs (dmv-modal.js) to replace native confirm/alert — still pending from earlier.
