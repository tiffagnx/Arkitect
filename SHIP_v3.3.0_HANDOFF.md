# Handoff — v3.3.0 ship (2026-07-02)

Cold-start orientation: read `MEMORY.md` first. This session consolidated a night of **multiple parallel sessions'** uncommitted work (Code room, Settings/Keys, Animation Station refinements) and cut **v3.3.0**. Owner's call on the number — he explicitly declined 4.0 ("I don't wanna cheat") given the scope, went 3.3.0.

## What shipped in this push

- **Code room scroll-lock** (`static/code.html`) — fast-streaming models were force-scrolling B to the bottom on every token; he couldn't read while it ran. Now only auto-scrolls if he's already near the bottom; a "New output — jump down" pill appears otherwise. Verified live (simulated a 60-line burst + manual scroll-up, confirmed lock holds and pill works) with zero data written to real sessions.
- **Settings key-reuse** (`static/settings.js`, `swarm_routes.py`) — adding a 2nd/3rd/4th model under an already-keyed provider (e.g. 3 separate OpenRouter slots) demanded re-pasting the same key or Save refused outright. Now offers `✓ using the OpenRouter key you already saved` and reuses it server-side via a new `reuse_key_from` field (raw key never crosses to the frontend). Verified read-only against B's real saved OpenRouter providers — confirmed the hint fires correctly, no test writes made.
- **`code_agent` streaming try/except** (`app.py`) — the model-streaming loop inside the Code room's agentic round loop wasn't wrapped in try/except, unlike `/api/research`'s `gen()`. Now mirrors that pattern: on a dropped connection mid-turn, yields a clean "Lost the connection to the model mid-turn" error + done instead of hanging/crashing the stream. (This was already sitting uncommitted before this session — verified correct, included as-is.)
- **Animation Station refinements** (`static/editor.html`, `static/kit-helper.js`, `app.py`, `static/studio.html`) — bundled from a parallel session per `ANIMATION_STATION_HANDOFF.md` (2026-07-01 21:12) + owner confirmation tonight that all parallel work is done. Not authored by this session — checked for merge markers (none), confirmed `py_compile` passes, and boot-tested `studio.html` / `editor.html` / `code.html` live with zero console errors before including in the push.

## Owner's model decisions (see memory `owner-model-picks-code-room`)

Dropped DeepSeek V4 from the Code room (format drift, ignores instructions). Picked **Z.ai GLM-5.2 Coding Plan** (flat monthly) + **Gemini 3.5 Flash**. Learned the GLM Coding Plan key is tool-restricted (fine for his own Code room, NOT usable as a general API key for his own product/website — that needs Z.ai's separate pay-per-token product). He's heavy-volume (Claude Max 20x, ~15%/day) — flagged GLM Lite as likely too small, Pro (~$64.8/mo) as the realistic floor.

## Release mechanics for this cut

- **Did NOT rebuild `DeMartinville.exe`** — headless session, can't launch-test a fresh PyInstaller build. Per `CLAUDE.md`: shipped the **existing, known-working exe** (built 2026-06-28) + current code via `build_zip.py`, not a fresh rebuild.
- **No gh-pages deploy this cut** — `static/join.html` and site assets (`kit-hero.png`, `static/shots/*`) were untouched tonight; the site's download button (`static/join.html`) already points at `github.com/.../releases/latest/download/DeMartinville.zip`, so cutting the GitHub release alone updates what the site serves. Nothing to force-push to gh-pages this time.
- Mac build triggers automatically off the `v3.3.0` tag (`.github/workflows/mac-build.yml`) — not a manual step.

## Open items (not done tonight, flagged for daylight)

- The stray `_s4.txt` / `_s5.txt` / `_slice.txt` / `_slice2.txt` / `_slice3.txt` files sitting untracked in repo root were left alone (not committed, not deleted) — unclear origin, look like scratch output from an earlier session. Worth a look/cleanup next session.
- Next real Animation Station piece per its own handoff: the `RoomAPI` hook for "drag Kit in, upload a photo, she builds the sprite sheet" conversationally — not started.
- Full Treatment-room Taffy parity (`treatment-room-taffy-parity-spec` in memory) — still open.
