# DeMartinville — "Audio Does Everything" Reuse Audit

*Run 2026-06-26 (5-agent Workflow, deep read of studio.html / agent-dock.js / beats.html / beat-dock.js + duplication sweep). The question it answers: what's already built (don't rebuild) vs. the genuine new work — so the "Audio does everything" build reuses instead of duplicating.*

---

## ✅ ALREADY DONE — reuse, do NOT rebuild

The Audio Lab is **~92% feature-complete** for the vision. Nearly everything already ships.

**Beat-making (in-studio, as a plugin):**
- `openBeatLab()` (studio.html:4706) injects beats.html as a same-origin iframe plugin — full FL-style maker, 25+ instruments, cook-a-beat, piano roll, SFX, vocal→instrument — **inside Studio already**.
- `beatlabSend()` (studio.html:4748–4770) calls the iframe's `renderPatternWav(4)` + `wavBase64()`, builds a File, reuses `addFiles([file])` to drop the beat onto a new track. End-to-end.

**Recording + mixing (the post-producer core):**
- Vocal recording — transport arm + per-track record-arm (●), per-track input device, live waveform (studio.html:6847–6869, 5813–5829).
- Full mixing console — faders, pan, 5 inserts/track (A–J), pre/post sends to aux buses, master chain, metering (studio.html:5119–5210).
- Clip editing — move, trim, split (`_splitAt()` :1038), heal (`healSeparation()` :1080), consolidate (`consolidateSelection()` :1097). Grid-aware, undo-backed.

**Agent production moves (already wired):** harmonies `studioHarmonize()` :6383 · choir `studioChoir()` :6401 · vocoder `studioVocoder()` :6419 · chop `clipFx_chop()` :1319 · stutter `studioStutter()` :6512 · build-to-drop `studioDrop()` :6532 · SFX `studioGenSfx()` :6561 · reverse `clipFx_reverse()` :1314 · Pultec / parallel-sat / sidechain-pump :6399–6446.

---

## 🟡 PARTIAL — extend, don't restart

- **"Layer a vocal"** — works via `studioHarmonize('thick')` (3 voices); no dedicated "layer/double" verb.
- **Reverse + sync to beat** — `clipFx_reverse()` + BPM-timed reverse-reverb exist; no direct verb that reverses *and* snaps clip start to the beat.
- **Fade** — Smart-Tool corner fades + `.gain` exist; no fade-time UI / "fade in 2s" verb.
- **Selection-scoped agent moves** — `SEL = {trackId,a,b}` is tracked and all *manual* edits respect it, but **agent-dock.js can't read SEL** — every agent move hits the whole clip/track. **Biggest gap.**

---

## 🔴 GENUINELY MISSING — the real new build (only ~5 things)

1. **Selection-scoped agent moves** (highest ROI) — expose the selection to agent-dock.js so "add harmonies / chop this / brighter" applies to the highlighted region. This IS the "highlight a region and ask" feature — the one truly missing primitive.
2. **"Reverse + sync to beat" verb** — `clipFx_reverse()` + align start to the grid.
3. **"Layer / double" verb** — route to existing `studioHarmonize('thick')`.
4. **Fade UI + verb.**
5. **Time-stretch** (`studioTimeStretch`) — off-BPM beats land wrong; nice-to-have, not Slice 1.

---

## ♻️ DUPLICATION / REDUNDANCY

- **Dual-dock naming clash:** `window.DMV_DOCK_FIX` is defined in BOTH beat-dock.js (beats) and agent-dock.js (studio). On any page loading both, the second wins. **Verify which answers in Studio before adding verbs; new studio verbs go in the surviving agent-dock.js handler.**
- **Parallel-but-different APIs (same intent, two impls):** `studioGenSfx()` vs beats `A.sfx()`; `studioVocoder()` vs `A.vocalToInstrument()`; `studioPultec/Pump()` vs `A.mix()`. `/api/beatbrain` + `/api/vocalassist` (app.py:5362/5448) near-identical → could fold into `/api/kit?mode=`. Optional cleanup, not urgent.
- **The standalone Leon / beats.html room — KEEP THE FILE, do NOT delete/fold.** beats.html IS the entire beat engine; Studio has zero synth/drum code and just loads the iframe. Deleting beats.html breaks the in-studio beat plugin. Autosave collision is already guarded (studio.html:4732–4741). We correctly pulled the *nav link* (two-room focus) while keeping the file — "keep the file, hide the standalone door." New beat-side verbs belong in beats.html's `window.RoomAPI` via beat-dock.js, never re-implemented in studio.
- **Dead code to confirm ship-or-drop:** `studio-research/tiff-verb-bloom.js` (orphaned) + `studio-research/*` folders.

---

## ⚠️ CONFLICTS / RISKS

- **Recent uncommitted MCP / glow / help / connect work: CLEAN ✓** — all additive + guarded, no overwrites. `room_relay.py` + `mcp_routes.py` ARE wired into app.py (4826, 4828). Three status dots (`.fab-dot`, `.dmv-glow-dot`, `.as-mcpdot`) are distinct, not dupes. Script load order in studio.html is correct; all self-guard against double-load. Ready to commit.
- The dual-dock clash is the one thing to verify before adding studio agent verbs.
- uvicorn has **no `--reload`** → restart to load .py changes. Parallel sessions → commit only own paths.

---

## 🎯 BOTTOM LINE for Slice 1 (make-a-beat first-class on the board)

**REUSED (don't touch):** `openBeatLab()` + `beatlabSend()` (the open + bounce-to-track flow), `addFiles([file])` (import path), beats.html engine + `window.RoomAPI` + beat-dock.js (the maker), the autosave guard.

**NEW (small, surgical):**
1. Make **"🥁 add a beat"** a first-class board action (a board/toolbar button or agent verb) that routes to the existing `openBeatLab()` / `beatlabSend()`. Pure wiring, zero engine work.
2. Resolve the dual-dock clash so the agent verb fires in Studio.
3. Optionally auto-send on close so "make me a beat" lands straight on a track.

**The honest answer to the worry:** the beat→track pipeline, the recorder, the mixer, and 9 of the agent moves are **already built**. Slice 1 is ~90% wiring an existing flow into the board — not a rebuild. The one genuinely-new primitive worth building is the **selection-scoped "highlight a region and ask"** move.
