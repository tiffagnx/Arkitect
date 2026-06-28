# Audio-does-everything build — handoff (for tomorrow's test)

*2026-06-26 night → owner tests 2026-06-27. Direction LOCKED: collapse to TWO front-door rooms (DeMartin Audio + LePrince Visual); the **Audio Lab does everything**. Audit (`AUDIO_AUDIT.md`): the Audio Lab is ~92% there — mostly WIRING, not rebuild. **Everything below is UNCOMMITTED** (owner's batch).*

> ⚠️ **The AUDIO behavior is NOT runtime-verified** — headless audio render crashes the owner's machine ([[headless-audio-render-crashes-machine]]), so everything audio is **load-verified only** (parses clean, DAW intact, functions defined). The owner tests the actual SOUND. He expects + wants to find bugs tomorrow; a bug-review workflow ran tonight (findings in the next report).

## Built tonight (load-verified)

- **Front page → two rooms** (`static/index.html`): Rooms = DeMartin Audio + LePrince Visual ONLY. Leon pulled OFF the front page (⚠️ KEEP `static/beats.html` — it IS the beat engine the studio plugin loads via iframe; deleting it breaks the 🥁 button). The Stream → bottom of More. Memory → the very bottom.
- **Killed the floating Guide FAB** (`static/studio.html` `_ensureGuideFab`/`maybeShowGuide` neutered): no more bottom-right "🎤 Guide" + no auto-pop on an empty board (owner peeve / [[no-floating-ui-over-canvas]]). `openSongGuide()` still exists for a future quiet entry point.
- **Slice 1A — "🥁 Make a beat" is first-class** on the studio empty board (`studio.html:911` → existing `openBeatLab()`). The flow now reads: open Audio → make a beat → stems drop → record under it.
- **Slice 1B — region-scoped "highlight a region and ask"** (GENERATIVE moves): new `_ssRegionOf(s)` helper (`studio.html` ~6373) makes `studioHarmonize` / `studioChoir` / `studioVocoder` honor the active time-selection `SEL` → they generate from JUST the highlighted slice (`_sliceBuffer`) and place it at the region. No selection = whole clip (unchanged).
- **"Layer / double" verb** (`static/agent-dock.js`, just before the harmony block) → "layer it / double it / thicken the vocal" routes to `studioHarmonize('thick')`; region-scoped automatically.

## OWNER TEST TOMORROW (the audio I couldn't verify)

1. Drop in / record a vocal → grab the **Select tool (⌶)** → **highlight a section** → tell the agent **"add harmonies"** / "stack a choir" / "turn this into a synth" / "layer it" → it should land on **just the highlighted part**, under it.
2. **"🥁 Make a beat"** → cook → Send to Studio → stems land on tracks → record under them.
3. Sanity: with **no** selection, "add harmonies" should still do the **whole clip** (unchanged behavior).

## NOT done yet — next pieces

- **In-place FX region-scoping** (stutter / chop / drop "right here") — these REWRITE the clip buffer in place (`s.cl.buffer = out`, studio.html:6527/6553), so region-scoping needs a **splice-back** (or split-then-process). NOT built — it's the riskiest piece; build carefully + owner tests.
- "Reverse + sync to beat" verb · fade verb · time-stretch (the audit's remaining gaps).
- A quiet home for the song-guide (first-timers) — e.g., fold into the top-bar `?`.

## Bug-sweep (ran tonight — adversarial review over ALL this session's uncommitted work)

**FIXED + load-verified:**
- Glow pills showed the lowercase agent **id** ("kit working on…") — `active` is never in agent-dock.js's scope; now title-cased → "Kit". (`agent-dock.js`)
- "Layer/double" verb regex tightened — no longer false-matches "layer **in** some reverb", and "stack it thick" got a word boundary. (`agent-dock.js`)
- "🥁 Make a beat" button now `if(window.openBeatLab)`-guarded. (`studio.html`)
- MCP setup: path-length margin 260→240; and a **malformed** Claude config is now **refused** (`config_malformed`) instead of silently overwritten — protects the user's other connectors. (`mcp_routes.py`)

**FLAGGED for you (NOT fixed — judgment call):**
- `room_relay.py` — if a room answers *after* a command times out, the late result is dropped and a **manual** MCP retry could double-apply. Real edge case, but NOT auto-triggered (the MCP tool makes one call, no auto-retry) and a proper fix needs an idempotency key, not a one-liner. Address deliberately.
- `static/audio-ear.js` — NaN on very short clips + a resampler tail drop. Real, but **not one of this build's files** (another session / pre-existing), so left untouched per parallel-session rules. Worth a fix when that file's owner is around.

**Two reviewer "🔴 criticals" were FALSE ALARMS (verified against source):** the choir pitched-buffer length (`fxPitchBuf` is duration-preserving) and the `_ssRegionOf` region-timing (the math is sound — `start:ra` is absolute, placement is correct).

## Files touched this build (uncommitted)

`static/studio.html` (region helper + 3 generative moves + make-a-beat button + Guide-FAB removal), `static/agent-dock.js` (layer verb + the agent-work glow hook), `static/index.html` (reorg + Connect link), `static/settings.js` (Connect-to-Claude section), `mcp_routes.py` (new — in-app MCP connect). Plus this session's earlier uncommitted work: `mcp_server/`, `room_relay.py`, `static/mcp-bridge.js`, `static/room-glow.js`, `static/help.js`, app.py includes. See `AUDIO_AUDIT.md`, `MCP_SERVER_HANDOFF.md`, `MCP_GLOW_GUIDE_HANDOFF.md`.

⚠️ uvicorn runs **no `--reload`** → restart the app to load `mcp_routes`/`room_relay`. Parallel sessions → commit only own explicit paths, never `git add -A`.
