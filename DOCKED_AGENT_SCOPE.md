# Docked-Agent Vision — Build-Ready Scope (2026-06-25)

*From a 10-agent deep-scope (5 codebase audits + 4 web-research + architect). The vision: drag/dock the agent onto a stem / master / highlighted region → she's SCOPED to it → "hears" it + acts on it. See memory [[agent-driven-session-build-vision]].*

## Difficulty (the 4 capabilities are NOT equal)
| Capability | Difficulty | Why |
|---|---|---|
| (a) Dock on a stem → "fix this / make it knock" | **Easy, mostly done** | Vocal Doctor + Auto-Mix already analyze→build-a-chain→clamp-safe; agent just points them at the docked stem |
| (c) Dock on master → "master it" | **Medium** | Same engine on the mix bus + real LUFS (essentia.js EBU-R128) |
| (d) Highlight region → "fix just this" | **Easy-Medium** | SEL already exists; slice selection→buffer→same pipeline; render-and-splice the fix back |
| (b) Dock on BLANK stem → "make an 80bpm boombap" → render FULL stems | **The moonshot — real + free** | Drive the embedded Kitchen (already cooks real in-key beats w/ separate instruments) → bounce each instrument as its own stem. NO music model, NO paid gamble |

## Architecture (dock → hear → talk → act — 80% already built)
1. **DOCK** = a new `agentScope = {kind:'track'|'master'|'region', trackId, range, hasAudio}`. Set by dragging her avatar onto a target OR a "Dock here ▸" button on each track/master/selection. (The one genuinely-NEW layer — nothing represents "she's bound to track X" today.)
2. **HEAR** = `measure()` (existing FFT/time-domain: LUFS/peak/crest, per-band, centroid, sibilance) + **essentia.js** (new, free, browser/worker — adds BPM, musical key, broadcast LUFS) → a one-sentence **"hearing report"** the LLM reads. *That sentence is the bridge between the audio and her brain.*
3. **TALK** = extend `/api/vocalassist` (plain words in → structured moves out, has a no-model keyword fallback → works with NO key).
4. **ACT** = she emits **clamped moves** `{insert,param,value,reason}`; the existing `runAutoMix()` apply-loop re-clamps to each plugin's min/max + rebuilds the rack. **She physically can't wreck a mix — the guardrails already exist** (Vocal Doctor safe-bands, Auto-Mix bounded moves).

## Moonshot verdict: DRIVE THE KITCHEN (Path A), not cloud-gen (Path B)
- **Path A (rec):** agent → Kitchen `RoomAPI.cook({genre,bpm,key})` → loop `renderStem(ids)` per instrument → drop each WAV on its own Studio track. Real, separate, in-key, editable stems. Free, in-browser, your verified engine. (`beatlabSend` already proves the cross-frame render+drop; `renderStem`/`_renderOnly` already isolate instruments.)
- **Path B (cloud, later/optional):** Stable Audio / MusicGen / Lyria — make a **stereo MIX, not stems**; paid; need a proxy; can't run in-browser. Great optional "lay a vibe" flavor later, NOT the stem engine.

## Owner decisions (forks) — recs in **bold**
1. Moonshot engine → **drive the Kitchen** (free, real stems). Cloud later as optional flavor.
2. Stems for moonshot → **separate per-instrument stems** (the whole point; engine's capable) vs one mixed beat.
3. Dock gesture → **"Dock here ▸" button first** (ship in a day, same power) then drag-the-avatar as polish. (His vision is the drag — button is just the fast on-ramp.)
4. Region fix → **render-and-splice** (print the fix, simple) vs region-gated automation.
5. essentia.js is **AGPL** — fine for a free/open app; only matters if a closed paid build ever ships.
6. Demucs in-browser (split someone's printed mix back into stems) → **out of v1**, its own gated/progress-barred button later (big model download, slow, needs COOP/COEP headers).

## Honest caveats
- **Key/BPM detection ~75–90%** (strong on steady beats, weaker on loose/live). On GENERATED beats she's certain (she set them); on ANALYZED stems show confidence, never fake-certain. Loudness/tone numbers ARE rock-solid.
- **Small load-bearing blocker:** kit-helper.js (`:746`) calls `RoomAPI.run(action)` but the Kitchen's `RoomAPI` (beats.html `:2818`) has `cook/groove/...` and NO `.run`/`.room`. Tiny fix, but required for the agent to drive the Kitchen (moonshot Phase 4a).
- **`?host=studio&bpm=` is passed but unread** — embed ignores Studio tempo/key until wired (4b), or generated beats won't match the session.
- **Multi-stem Send-to-Studio is new** — today `beatlabSend` = one mixed 4-bar WAV → one track. Kitchen side ready; Studio-side multi-track drop is the new code.
- **Kitchen cooks a 1-bar loop (x4), not a full song** — real stems of a real loop now; full arrangement = the known "song mode" gap (follow-on).

## ✅ PHASE 0 BUILT + VERIFIED (2026-06-25)
New file **`static/agent-dock.js`** (additive; studio.html only gains `<script src=/static/agent-dock.js>` + `window.tracks = tracks;`). Adds a **"🎙 Dock" button to every track header** (patches global `laneUi`); click → sets `window.agentScope = {kind:'track'|'master', trackId, name, hasAudio}`, highlights the lane, runs **`measure()`+`detectType()`** on `t.buffer` → an engineer-grade **hearing report** (rmsDb/truePeakDb/centroid/tilt/sibRatio/crestDb + the "why", never fake-certain). Shows in a `#dockpanel` AND pushes into her chat via new **`window.__kitSay()`** (exposed in kit-helper.js). Blank stems → "tell me what to build." Live-verified in preview (dock btn, scope, lane highlight, real report from real numbers, chat push, blank path). NOT yet deployed to web (owner working the desktop program). **NEXT = Phase 1: she ACTS on the docked stem** — wire the scoped track into the existing Vocal Doctor/Auto-Mix (brain picks chain from the hearing report + the user's words → existing clamp-loop applies). Then region, master, moonshot (drive the Kitchen). essentia.js (BPM/key/LUFS) = a Phase-0b add.

---

## ✅ DOCK UI v3 + PHASES 1·2·3 BUILT + LIVE-VERIFIED (2026-06-25 night) — all in `static/agent-dock.js` (now `?v=8` in studio.html) + a tiny `kit-helper.js` hook (`?v=2`)

**UI rework (owner rejected the v0 dock btn):** the "🎙 Dock" button was killing the stem NAME row. Now → a **tiny 🎙 "snap" button in the lower control area** (`.ts-ctrls`, under rec/solo/mute). **MULTI-PARENT** (After-Effects pick-whip model): `window.agentScope = { trackIds:[] }` — snap **one / six / all / the master / a blank**, click again to unparent, "unparent all" too. **The bottom-left `#dockpanel` was DELETED** (owner: "rude, in the workspace") — the readout now lives ONLY in HER floating window (`__kitSay`); what's parented shows on the stems themselves (lit 🎙 + teal lane glow). `DMV_DOCK = {toggle, unparentAll, parentAll, list, hearingReport}`.

**Phase 1 — SHE ACTS (`window.DMV_DOCK_FIX(text, agentId)`):** hooked at the TOP of kit-helper's `ask()` (guarded → pure no-op in other rooms / when nothing's parented / when it's not a fix verb → brain answers). A **left-to-right word-walk intent parser** (`parseIntent`): "less/too/more" set a pending polarity that binds to the NEXT attribute word & resets (so "brighter, less harsh, more warmth" = bright↑, deess↑, warm↑ — no cross-clause bleed; the earlier global-`less` and 18-char-window bugs are both fixed). Maps to the **Vocal Doctor macros** (bright/warm/smooth/deess/space/throw) via `vdApplyMacro` — every move CLAMPED to the plugin's safe band. `ensureDoctor()` builds the chain QUIETLY (`vdPlan`→`vdBuildChain`→set `t._doctor`, no per-stem panel pop; falls back to `runVocalDoctor`). "fix it" → full chain. 100% client-side → free, works on ANY brain (even none), desktop AND cloud. Verified: "brighter+less harsh" raised EQ air 1.5→2.5 (clamped <3.0), deepened de-ess; polarity correct across phrasings; non-fix questions pass to the brain.

**Phase 2 — DEEPER SNAPSHOT:** `hearingReport` now also reads the stem's CURRENT processing — `chainSummary(t)`: "already on it: Compressor (4:1) → Reverb (30%)" (names + a few key knob values via `KEYP`), "my chain's loaded" (doc-tagged), "→ verb send", "muted", "panned L/R". Master + blank handled. So she sees the SOUND **and** the processing — "really in that piece." (Cross-room screenshot+vision for visual rooms = the future generalization; studio pieces are stems+plugins, covered.)

**Phase 3 — TASTE (Kit ≠ Tiff):** `STYLE` map — `bias` nudges how far each move goes (same "brighter" → Kit air 2.7, Tiff 2.2), `sig` = signature finish on "fix it" (Kit brighter/punchy, Tiff warm/lush), `flair` = her voice tag. NEVER a refusal. User-built agents = neutral (air 2.4) until taste grows from memory; overridable via `window.DMV_AGENT_STYLE`. See memory [[agent-taste-not-capability]].

**Phase 4 (no-cache) was ALREADY DONE** — app.py `_no_cache_code` middleware (`:96`) no-stores .html/.js/.css. The owner's real app already serves fresh on reload.

**Also fixed:** the Summon-agent regression (removing the session-wiping reload had broken "summon when nobody's dragged in") — `pinkroom-nav.js` now sets `dmv_active_brain=kit` + re-injects kit-helper IN PLACE (no reload, no data loss).

**⚠️ PREVIEW GOTCHA (cost ~10 tool calls):** the Claude-Preview pane will NOT honor `location.href`/`reload()`/`replace()` (sandbox; no SW, onbeforeunload null — it just ignores JS nav, stays frozen on the preview-start page). To load edited code you must `preview_stop` + `preview_start "arkitect-preview"` for a FRESH pane, then navigate. The server (uvicorn app:app on 7788) serves live-from-disk + no-cache, so it's always correct — it's only the pane that's stuck. See memory [[preview-pane-wont-reload]].

## ✅ GOD MODE ON THE DOCK — BUILT + verified (2026-06-25 night). The gap (a docked Claude got the same prompt a 4B model gets) is CLOSED. **app.py:** new shared `_god_layer(effort)` + `_is_claude_slot(slot)` helpers (top of file, after the no-cache middleware) — `/api/chat` refactored to use them, and `/api/kit` (`kit_help`) now injects `_god_layer((body.effort))` when the routed `slots[0]` is Claude. **cloud-bridge.js:** shared `godLayer(effort)` — `handleChat` refactored, `handleKit` now injects when `isClaude(slot)` (reads `body.effort`). **kit-helper.js:** an EFFORT LEVER in the agent window (`#ktEffort` chip in the Brain row) — taps to cycle ⚡Quick→🧠Balanced→🔥Deep, and 🔱God unlocks ONLY on a Claude brain (gated by the existing `isTopClaude`), with a gold chip glow + the window's `tier-max` glow; rides `/api/kit` as `effort`. Verified live: 3 stops on local (God locked), 4 stops + gold glow on a (simulated) Claude slot, re-locks on switch-back. One source of truth — no more copy-paste drift. ⚠️ still a depth PROMPT, not Anthropic's native thinking-budget dial (the deeper later upgrade). See [[claude-god-mode-vision]].

## ✅ LAUNCH KIT — drafted (2026-06-25 night) → `LAUNCH_KIT.md` (repo root). A workflow researched REAL distribution channels + drafted a README / 60s demo script / 3 post variants, then adversarially fact-checked every claim (softened the unverifiable "124 effects"→"120+", kept the roadmap marketplace OUT, made the browser-vs-desktop split honest at every CTA). ⚠️ FLAGGED: the repo's current `README.md` is STALE (says "ARKITECT", lists a non-existent `bit16.html`, claims "no API keys") — the kit's README is a clean replacement, NOT yet dropped in (owner's call). Post order: r/SideProject (dry run) → Show HN → r/makinghiphop (his actual people) → KVR/REAPER/r/audioengineering. The real bottleneck = VISIBILITY not VALUE (zero stars = an unused channel, not a bad product).

**NEXT (not started, in priority):** (1) ~~God Mode on the dock~~ DONE above; (2) the AE drag-a-line pick-whip (visual polish on the snap buttons); (3) the moonshot — dock a BLANK stem → drive the Kitchen → drop real per-instrument stems (needs the `RoomAPI.run` shim, beats.html `:2818`); (4) region fix (SEL → slice → fix → splice) + master (real LUFS via essentia.js); (5) cross-room snapshot+vision (editor/imagination). NOT committed/deployed — left uncommitted for the owner's batch (parallel sessions).

## ✅ RECEIPTS + VOICES (2026-06-25 night, same `agent-dock.js` `?v=9` + `kit-helper.js` `?v=3`)
**RECEIPTS (owner: "how can you verify what she says is TRUE?") — BUILT + verified.** After she applies a fix, `receipts(t)` renders the stem THROUGH its chain via the existing **`renderBounce({source:'track:'+id, tap:'post'})`** → re-`measure()`s the real output → reports the actual change vs the raw take (band levels taken RELATIVE to RMS so makeup gain can't fake it): *"measured vs your raw take: air +7.4 dB, low-end −3.3 dB, dynamics +1.8 dB crest, level +0.6 dB."* She CANNOT lie about what she did — the numbers come from the processed audio. Enforces [[no-fabricated-content]] with math. Best-effort (try/catch → "" if render fails; needs a COMPLETE track — gain/pan/eq/comp/send — which real tracks have, synthetic test tracks don't → that's why a test showed no receipt line). NEXT for receipts: verify against a REFERENCE track (match-to-target), and per-command A/B (before-this-command vs after) for command-precise deltas.

**VOICES (owner's character direction) — Kit = the TECHNICAL one (he's a robot): precise, spec-driven; flair "Calibrated — crisp, forward, every move in spec ⚙️". Tiff = LAID-BACK, one of the crew, a REAL artist who writes/makes beats/does everything ("what's good, whatchu working on, let's get it"); flair "That's the vibe — warm, easy, sittin' in the pocket 🫶".** Updated the dock flair + the `kit-helper.js` built-in intros + tags (Kit "the technical one · build" / Tiff "one of the crew · artist"). **CONVERSATIONAL VOICE SWEEP — DONE (2026-06-25 night):** found the real gap — in-room, Kit AND Tiff shared `KIT_SYSTEM`, which literally says *"You are Kit. You are NOT Tiff"* → so dragging Tiff into a room told her she's Kit. Fixed: `app.py` now has a new **`TIFF_ROOM_SYSTEM`** (laid-back, one-of-the-crew, real artist who writes/makes beats) and `kit_help` picks `TIFF_ROOM_SYSTEM if character=='tiff' else KIT_SYSTEM`; KIT_SYSTEM's voice reworded to technical-robot. Mirrored in `cloud-bridge.js` `buildKitSystem` (char-aware, falls back to KIT_SYSTEM) + `cloud-prompts.json` (added `TIFF_ROOM_SYSTEM` key, KIT_SYSTEM made technical; JSON validated, 20 keys). The voice only renders with a live brain/key (can't unit-test it; validated files+logic). Owner's framing: in the ROOM she's chill/one-of-the-crew, but in her LORE she's a bad-bitch artist who makes everything. See [[agent-taste-not-capability]]. ⚠️ app.py is parallel-modified — these edits were surgical/additive.

**Verify-without-bringing-anything:** owner asked "do I need to bring stuff so she knows what to listen for?" — NO for the basics: `measure()` already computes real acoustics (levels/brightness/harshness/dynamics) and the Vocal Doctor has good targets baked in → she works out of the box. Bringing his finished songs / a reference = OPTIONAL, only to teach HER his specific sound (the capture/training layer, [[agent-training-tiers-and-capture]]).

## Phased plan
- **Phase 0 — Dock + hearing report (the spine; makes it VISIBLE).** `agentScope` + "Dock here ▸" buttons + "🎙 docked on: Lead Vox" badge; `measure()`+essentia.js → the hearing-report sentence in her chat. *Quick.*
- **Phase 1 — Fix THIS stem.** Dock→call existing Vocal Doctor/Auto-Mix on the scoped track; brain picks the chain; clamp-loop applies; "what I heard / what I did" panel. *Light. First "she did the work" moment.*
- **Phase 2 — Fix THIS region.** Buffer-slice the SEL → same pipeline → render-and-splice. *Light-medium.*
- **Phase 3 — Master the mix.** Dock-on-master → bounce → measure+LUFS → clamped mastering moves → engineer-style report. *Medium.*
- **Phase 4 — MOONSHOT (cook→full stems, Path A).** 4a: add `RoomAPI.run()`+`.room` to the Kitchen (the blocker). 4b: wire `?host=studio&bpm=`. 4c: dock-on-blank → `cook` → multi-stem bounce → drop each on its own track. *Hard 80% exists; 4c is the new multi-track drop.*
- **Phase 5 (later):** cloud-gen flavor (Path B, BYO-key, labeled); Demucs stem-split (gated); song-structure cooking.

**Fastest "holy shit it works" = Phase 0 + Phase 1** (the dock, the hearing report, her fixing a stem she heard — almost all proven code).

## Key files
`static/studio.html` — `measure()`/`detectType()` (~:5269/:5495), `autoMix`/`runAutoMix` (~:5558/:5688), Vocal Doctor (~:6201–6320), `openBeatLab`/`beatlabSend` (:4696/:4738), master track + bounce, SEL. · `static/beats.html` — `RoomAPI` (:2818, needs `.run`/`.room`), `composeBeat`/`renderStem`/`_renderOnly`/`wavBase64`. · `static/kit-helper.js` `:746` (the `RoomAPI.run` drive hook). · `app.py` `/api/vocalassist` (~:4975). · **New deps:** essentia.js (BPM/key/LUFS, AGPL), optional Meyda (live meter, MIT).
