# STUDIO DAW — Pro Tools build · CONTINUATION HANDOFF

> **Read this first, in full.** It tells a fresh session exactly where the Pro-Tools-faithful
> DAW build stands, what to do next, and the conventions that keep it from drifting. The owner
> (**B / tiffagnx**) wants this **as close to real Pro Tools as humanly possible** and **correct**
> — not fast, not approximate. He builds his own VSTs later; right now we're building the DAW shell,
> menus, editing, and **bussing**. There is a large body of **fact-checked research** already on
> disk — **USE IT, do not rebuild from scratch.**

---

## 0. The one-paragraph mission
Turn `static/studio.html` (the "Studio" / "DeMartin Audio Labs" Web-Audio DAW, served at
`http://127.0.0.1:7777/static/studio.html`) into a Pro-Tools-faithful DAW. A real 12-menu menu bar
+ the core editing commands are **built and shipped**. The current focus is **Bussing & Sends
(owner's #1)**; its foundation is shipped and the next slice is the audio-graph routing. After
bussing: Grid/Nudge, Edit modes, Smart Tool, Track View, then the rest of the menu features.

---

## 1. What is DONE and committed (on `master`)
Base before this work: `9c4de5e`. Commits added, newest last — all **verified live in the browser**:

| Commit | What it shipped |
| --- | --- |
| `98453b9` | **Phase 1** — the real 12-menu Pro Tools menu bar (File…Help) above the transport row, full silhouette (separators, ellipses, ▸ arrows, checkmarks, Win shortcuts), greyed where unbuilt, EXISTS items wired, central keyboard dispatcher. Data-driven from `static/pt-menus.js`. |
| `d64b29c` | **Edit 2a** — Redo + forward stack, live "Undo X / Redo X" labels, greying when empty, Duplicate (Ctrl+D). |
| `6b693aa` | **Edit 2b** — clipboard Cut/Copy/Paste (Ctrl+X/C/V, flattened-range), Insert Silence, Heal Separation, Trim Clip→To Selection, Consolidate. Dispatcher lets native text copy/paste through. |
| `6216078` | **Edit 2c** — Mute Clips (Ctrl+M, skips clip source in `buildTrackGraph` + dims lane); hardened undo so `_snapClips` round-trips ALL clip props (muted/name/gain). |
| `122b629` | **Edit 2c+** — Rename Clip (Clip menu; draws name on the clip). |
| `bf2172d` | **New Tracks dialog** (Track→New): count · Mono/Stereo · type · timebase; creates real empty audio tracks + Aux Input tracks; Master/MIDI/etc. stubbed. **Killed the bogus "FX Bus" track concept.** |
| `d135f5d` | **Bussing slice 1** — bus registry (`buses[]`, `addBus`/`removeBus`/`busById`), `addAux` now creates a PAIRED bus + sets `inputBus`/`input`/`output` + empty A–J `sends`, per-track `input`/`output` fields, helpers (`BANK_AE/FJ`, `sendInSlot`, `IF_INPUTS/OUTPUTS`, `dbOf`, `ioLabel`, `refreshAllRouting`). **Dormant — no audio-graph change yet, no regression.** |
| `cc8bdaa` | **Bussing slice 2 — audio-graph routing (sends + buses now AUDIBLE).** `setupBusNodes(c)` builds one GainNode per bus before any track graph, shared by all 3 build sites (`playAll`/export/`scheduleTransportAt`) so WAV == playback. `buildTrackGraph`: Aux/bus-input track reads `inG` from its bus collector; Output generalized to route any track into `busNodes[output]` (audio + aux nested submixes; legacy aux-id fallback); the **A–J send taps** (PRE=tap `comp`, POST=tap `fader`) each with own level gain + `StereoPanner` → target bus node. `applyTrackTo` live-updates send level/pan/FMP (no rebuild). **`wouldFeedback(t,busId)`** denies cycles at build time. Resolution handles BOTH new `{slot,bus,…}` and legacy `{toAux,level}` sends → no regression. **Verified live** (stem→bus→aux return = audible; bus w/ no return = exact silence; send −INF→full raises RMS; feedback guard catches self + nested cycles). |
| `2bb444b` | **Bussing slice 3a — routing popup + send matrix UI.** `openRoutePopup` (send/input/output), extracted popup helpers (`placePopup`/`closeRoutePopups`/`armPopupClickaway`), `assignRoute`, `renderSends` rewritten to fixed A-E/F-J banks (`sendsBankHtml`/`bindSendBank`). Popup lists No-Send/interface/buses/＋New Bus, greys feedback targets, has PRE/FMP/ON + level mini-fader. PT defaults (−INF/post/on). |
| `4c78ec4` | **Whole-view zoom** — bottom zoom bar: log H-zoom slider + Fit (`fitSession`) + relocated pan, V lane-height slider (`setVZoom` 44–260, all lanes together). `updateZoomUi` syncs thumbs w/ +/- buttons + Ctrl+wheel. `zoomToSelection` helper ready (no Zoomer tool yet). Engine was already centralized. |
| `31119ae` | **Bussing slice 3b — I/O click-selectors + Mix-strip sends column.** `renderChannel` (stem+aux) + `buildStrip` use `.io-sel`/`.ms-iosel` buttons → `openRoutePopup` (INPUT+OUTPUT) instead of the old `<select>`; aux gains I/O + a sends rack; Mix strips get a compact A-E sends bank. Matches the PT mix-strip column flow. |
| `f6a85ad` | **Bussing slice 3c — save/load persistence + legacy migration.** `buildProjectPayload` saves `buses[]` + per-track `input`/`inputBus` + rich `sends`. `loadProject` restores buses FIRST, mints a bus for old auxes, restores all routing. `migrateLegacySends()` converts legacy aux-id outputs + `{toAux}` sends → slotted `{bus}` sends. Verified via real backend round-trips (new + legacy). |
| `3b828ad` | **Bussing slice 3d — Master Fader is a CREATED track.** `masterTrack.present` flag (default false); output bus (`buildBus`) always runs so audio flows w/ or w/o a Master Fader. `createTracks('master')` makes one (one per session); lane has a ✕ → `removeMasterFader()`. `ensureMasterLane` gated on present; init auto-call removed. `buildMasterChain` gates master inserts on present; `renderMixWindow` shows the strip only when present. Save/load persists `master.present`+`inserts`. **Completes Bussing #13.** |

**What works for a user right now:** open any of the 12 menus; Undo/Redo with labels; Duplicate;
Cut/Copy/Paste; Insert Silence/Heal/Trim-to-Selection/Consolidate; Mute & Rename clips; Window
Mix/Edit toggle; Track→New dialog creating audio + aux tracks; tools/loop/save/load/export/import
via the menus + shortcuts.

---

## 2. The research — USE IT (this is the anti-drift insurance)
All in `studio-research/` (**gitignored = local scratch on this machine; present on disk — read it**).

- **`PRO_TOOLS_MENU_SPEC.md`** — master menu spec: the 12-menu order, full Windows shortcut table
  (+ conflicts reconciled), feasibility roll-up (EXISTS / BUILDABLE-NOW / BUILDABLE-LATER / SKIP), and
  a **10-phase build plan**. The map for the whole effort.
- **`menu-spec/00..13-*.md`** — per-menu verified references (every item, shortcut, PT behavior,
  feasibility) for File/Edit/View/Track/Clip/Event/AudioSuite/Options/Setup/Window/Marketplace/Help +
  context menus. The source the menu config was generated from.
- **`menu-config/*.json`** → generated into **`static/pt-menus.js`** (`window.PT_MENUS` / `PT_CONTEXT`).
  To change menu items, edit the JSON and regenerate (the python assembler is in git history of this
  effort — or just hand-edit `pt-menus.js`; it is committed and self-sufficient).
- **`design/*.md`** — BUILD-READY implementation specs, each grounded in `studio.html` with line refs,
  a numbered build plan, and risks. **Read the relevant one before building that feature:**
  - `sends-bussing-io.md` ✅ finalized + fact-checked — **the blueprint for the current task (bussing).**
  - `edit-modes.md`, `smart-tool.md`, `track-view.md` ✅ finalized + fact-checked.
  - `clip-gain.md`, `view-flags.md`, `track-freeze-bounce.md`, `automation-engine.md`,
    `tempo-bars-beats.md`, `plugin-vst-sdk.md` — **design-stage only (NOT finalized)**; solid drafts,
    but their adversarial fact-check corrections were not applied (see §6). Read critically.
  - **`grid-nudge.md` is MISSING** — the swarm agent dropped it. Regenerate before Grid/Nudge (§6).
- **`OWNER_STEERING.md`** — the owner's priorities + the **CRITICAL bus model correction** (§4 here).

---

## 3. THE NEXT TASK — match Pro Tools (owner gave a full live walkthrough 2026-06-18), then the EDITING beast.
> **READ THE MEMORY `studio-aux-and-pt-track-reference.md` FIRST** — the owner walked the entire PT
> session lifecycle (record → tracks → bussing → inserts → master → bounce) click-by-click; it's all
> captured there with the exact targets. **DONE so far:** aux now renders as a normal track row (`7e6471e`),
> the whole record-tonight usability batch, Master Fader as a created track.
>
> **PT-MATCH QUEUE — SHIPPED 2026-06-18:** ✅1 numbered bus pool (`28aba2a`) · ✅2 drag-reorder tracks (`3be955e`)
> · ✅3 track right-click New/Rename/Duplicate/Delete (`2d10817`) · ✅4 Mono/Stereo (already existed) · ✅5
> renamable interface inputs / "BRYANS MIC" (`116841a`). Also this run: aux = normal track row (`7e6471e`).
> ✅6 **inline edit-window I/O COLUMNS** (`9f8b11f`) — each lane now has the per-row INSERTS A-E/F-J ·
> SENDS A-E/F-J · I/O columns + a width-aligned sticky header (renderInsertCol/renderSendCol/
> renderLaneCols/ensureColHeader; additive — uses lane-local ids, renderChannel/engine untouched).
> Also: menus de-branded (`acafebe`) — Marketplace killed, Help slimmed to Check-for-Updates + About
> ARKITECT (no Avid/Pro Tools). **STILL TO BUILD: #7 a real Bounce dialog + File-menu depth (Save As
> Template, etc.).** Known follow-ups: the right-side channel panel still duplicates I/O+sends (now
> redundant since the lane columns exist — trim it); pt-menus.js "behavior" metadata still mentions
> Avid/PT internally (not user-visible). Original spec for reference:
>
> **READY-TO-BUILD PT-MATCH QUEUE (no research needed — straight from the owner's demo):**
> 1. **Numbered bus pool** — replace "＋ New Bus" with picking **Bus 1-2, 3-4 … (Stereo)** from a standing
>    fixed list in every input/output/send picker (owner's explicit correction; routing = same bus number
>    on a send/output and on an aux's input). Touch `openRoutePopup` + `addBus`.
> 2. **Drag-reorder tracks** — press-drag the track-name to reorder lanes; Master Fader free-placed (not pinned bottom).
> 3. **Track right-click menu** — New · Rename · Duplicate · Delete (+ later Freeze/Commit/Bounce). Quick wins.
> 4. **New Track: Mono/Stereo** channel-format dropdown (already has the type dropdown).
> 5. **Renamable interface inputs** (owner's "BRYANS MIC") — make IF_INPUTS user-editable + persisted.
> 6. **Inline edit-window I/O columns** (INPUT top / OUTPUT bottom per row) — bigger visual pass.
> 7. **Grow "Export WAV" → a real Bounce dialog** (Source / Format mono-summed·multi-mono·interleaved /
>    Bit Depth / Sample Rate / Offline / Directory) + the File-menu depth (Create New→Dashboard, Save As Template…).
>
> **THE NEXT BEAST = EDITING, "the way the owner edits"** (he'll steer the specifics like he did recording).
> A research workflow was launched to map the full PT editing model → `studio-research/design/EDITING_MASTER_PLAN.md`
> (building on the finalized `design/edit-modes.md`, `smart-tool.md`, `track-view.md`). Owner will demo his
> exact edit workflow before we build it.
>
> _(Earlier priorities below — Sessions/Dashboard design is hardened + ready when we circle back.)_

## (earlier) Usability pass, then Sessions / Dashboard (#2).
> **USABILITY PASS (owner wants to RECORD TONIGHT + "feels done") — in progress.** A fresh-eyes audit
> ranked the blockers in `studio-research/USABILITY_AUDIT.md`. SHIPPED + verified live: stop kills the
> beat (`8577b56`), **Spacebar** play/stop, transport guarded mid-record, **audible monitor** default;
> save/load keeps clip mute/name + solo, **Delete** key, beforeunload guard (`ff20a4a`,`ee41916`);
> **first-run HERO** empty state — quick-start buttons, no black void (`89fa6cb`); **Kit ROOM_HELP**
> de-staled (`7c489be`, app.py — needs a uvicorn restart to go live); **record-ARM** (R button,
> single-arm, take lands on the armed track as a clip) + fixed the `laneUiTake` `.lhead` crash (`9c3e97e`).
> REMAINING audit items: **#5 per-frame `drawLane` jank** (offscreen lane bitmaps + overlay playhead,
> skip when `!playing` — the riskiest, do it carefully/fresh), **#10 empty buffer-less tracks vanish on
> Save→Load**, and the full 5-min auto-backup (ships with Sessions). See USABILITY_AUDIT.md for the ranked list.
>
> **THEN: Sessions / Dashboard (#2)** — design hardened in `studio-research/design/sessions-dashboard.md`
> (verified: disk writes go through the FastAPI **backend**; reuse the existing native folder picker at
> `/api/editor/pick`). Build smallest slice first (Dashboard modal + blank Create + Open on today's store).
>
> **BUSSING #13 (owner's #1) is DONE & shipped + verified live:** slice 2 (`cc8bdaa`, audio routing),
> 3a (`2bb444b`, routing popup + A-E/F-J matrix UI), 3b (`31119ae`, I/O click-selectors + Mix-strip
> sends column), 3c (`f6a85ad`, save/load persistence + legacy migration), 3d (`3b828ad`, Master Fader
> is now a created/removable track — output bus always runs). Whole-view zoom also shipped (`4c78ec4`).
>
> **NEXT: the big Sessions/Dashboard feature (#2)** — build from `design/sessions-dashboard.md`
> (build-ready, 5 numbered slices, recommends BACKEND filesystem writes via app.py's `_atomic_write`):
> New Session modal (Create/Recent/Projects) + custom user templates + save a session as a FOLDER on
> the user's chosen disk location + 5-min auto-backup. Start with the smallest slice (Dashboard modal +
> blank Create + Open on today's JSON store), then real disk-folder save, then templates, then backup.
> Owner also wants the PT Edit-window per-track COLUMN layout (COMMENTS·MIC PRE·INSERTS A-E/F-J·SENDS
> A-E/F-J·I/O) — a later visual pass. (Folder rename pink-room→arkitect still deferred: cwd/server lock.)
>
> _(Original slice-3 plan kept below for the 3d details + the sub-slice breakdown.)_
> **Slice 2 (audio-graph routing) is DONE & shipped (`cc8bdaa`) and verified live.** The engine
> now routes sends + buses correctly for BOTH the new `{slot,bus,…}` model and legacy `{toAux}`
> sends. What's missing is the **UI to drive the new model** and **persistence**. Build, from
> `design/sends-bussing-io.md` §4 + build steps 9–13, in committable sub-slices:
>
> - **3a — popup + send matrix.** `openRoutePopup(anchorEl, kind, t, slotOrNull, onChange)` (§4.1) +
>   extract `placePopup`/`closeRoutePopups` from `openPluginMenu` (have it call them too). Add
>   `assignRoute(kind,t,slot,id)` + `routeMatches`. Rewrite `renderSends` (currently the old
>   `{toAux}` `<select>` at ~2618) to fixed **A-E / F-J** banks (§4.2), gated by `viewFlags?.edit?.sendsAE/FJ`
>   (default AE on / FJ off until view-flags.md lands). Popup lists No-Send / interface / buses /
>   ＋New Bus, marks current, greys feedback targets, has PRE/FMP + level mini-fader for sends.
> - **3b — I/O selectors.** Replace the `<select>` Output in `renderChannel` (~2612 / `.io-out`) and
>   `buildStrip` (~3367 / `.ms-out`) with click-to-open `.io-sel` buttons → `openRoutePopup`; add an
>   **Input** selector above Output (audio + aux). Compact A-E/F-J sends region on the Mix strip
>   gated by `viewFlags.mix.*`. Use a shared `sendsBankHtml(t,letters)` for both renderers.
> - **3c — save/load migration.** `buildProjectPayload` already saves only `{toAux,level}` + `output`
>   (~3796) — extend it with top-level `buses`, per-track `input`/`inputBus` + the rich `sends` shape.
>   `loadProject`: restore `buses` FIRST (`busSeq=buses.length`), default-fill new fields, **migrate**
>   legacy `{toAux,level}` → `{slot:<next free>, bus:<that aux's inputBus>, level, on:true}`. Accept an
>   aux-id `output` (resolved via the §3.2 fallback already in the engine). Test a pre-change save.
> - **3d — Master Fader as a created track** (owner model §4): remove the hardcoded MASTER lane,
>   make it a real created track (New Tracks → Stereo → Master Fader) summing the mix. Most invasive —
>   do last, verify hard.
>
> Verify each sub-slice in the browser; commit per slice. The §3 below is the (now-shipped) slice-2 spec,
> kept for reference on how the engine routes.

### (shipped) Slice 2 spec — how the engine routes, for reference
**Goal:** make sends + bus routing actually audible. Followed **`design/sends-bussing-io.md` §3 and
build steps 5–7** (it has exact code). Summary:

1. **`setupBusNodes(c)` helper** — build a `busId → GainNode` map (`c._busNodes`) once, and reuse it in
   **all three** build sites: `playAll`, the export `OfflineAudioContext`, and `loadProject`'s preview
   build. Aux `_in` becomes `busNodes[aux.inputBus]`. (If these three diverge, playback ≠ export.)
2. **`buildTrackGraph` routing:**
   - **Input branch:** an Aux (or any track whose `input` is a bus) reads from its bus node instead of
     clip sources. Guard so a bus-input track doesn't also play its clips.
   - **Output:** generalize `t.output !== 'master'` to route the fader into `busNodes[t.output]` (works
     for audio + aux → nested submixes). Keep a legacy fallback for an `output` that holds an aux id.
   - **A–J send taps:** for each `on` send with a real `bus`: **pre-fader taps `comp`** (post-insert,
     pre-fader — PT's "pre" point), **post-fader taps `fader`**; each send gets its own `GainNode`
     (level) + `StereoPanner` (pan / FMP) → the target bus node. Add to the returned `live` object.
   - `applyTrackTo` live-updates `s._sg.gain` / `s._pan.pan` (mini-fader drags = no rebuild).
3. **`wouldFeedback(t, busId)` guard — MANDATORY, the #1 correctness item.** Web-Audio law: a routing
   cycle with no `DelayNode` **silently mutes the whole cycle**. So a self-feeding send doesn't just
   sound wrong — it can kill audio on multiple tracks. The guard walks the routing graph over the data
   model and is called BOTH at assign-time (refuse + flash) AND at build-time (skip the tap). Exact
   code is in the design doc §3.4.

**Do NOT touch the global VERB send** (`t.send` → `verb.predelay`) — that's the built-in reverb,
separate from the A–J matrix. **Pre-fader = tap `comp`, not `inG`** (tapping `inG` would be
pre-EQ/pre-insert = wrong). **−INF default** on a fresh send (silent until raised) — PT-exact.

**Verify (listen-tests):** drop two stems; the Aux already owns a bus; assign a post send from each
stem to that bus, raise levels → reverb heard; raise the channel fader → post send rides it; flip to
pre → it doesn't. Try to send the Aux into its own bus → blocked, no silence. Then **bussing slice 3**
= the UI: `openRoutePopup` (extract `placePopup`/`closeRoutePopups` from `openPluginMenu`), `renderSends`
rewrite to A-E/F-J banks, Input/Output click-selectors in `renderChannel` + `buildStrip`, and
**Master Fader as a created track** (remove the hardcoded MASTER lane). Then save/load migration
(`projectPayload`/`loadProject`: add `buses`, new per-track fields, migrate legacy `{toAux,level}` sends).

---

## 4. OWNER MODEL — get this exactly right (he corrected it hard)
- **Buses are ROUTING, not tracks.** There is **no "FX Bus" track type.** Track types: **Audio**,
  **Aux Input**, **Master Fader** (+ VCA/MIDI/Instrument/Video later).
- A **bus** = a named internal signal path (registry). You **send** tracks to a bus, and an **Aux Input**
  track takes that bus as its **Input** (the return/processor). Put FX on the aux; route its **Output**.
- **Master Fader** is a **created track** (New Tracks → Stereo → Master Fader) that sits at the bottom —
  **remove the hardcoded MASTER lane** and replace it with a real created Master Fader.
- **Sends A-E + F-J** (two banks of five = 10), each pre/post, level (−INF default), pan, on, FMP.
- He lives in **Slip** and **Grid** edit modes; main time scale = **Bars|Beats** (not Min:Secs).
- **"Everything is little for a reason"** — match PT's compact density. **Do NOT enlarge controls.**
  Inspect with zoom, never by resizing.

---

## 5. CONVENTIONS — how to work here (do not deviate)
- **Verify EVERY change in the real browser** before claiming it works. A local Chrome is connected via
  the Chrome MCP. URL is **`http://127.0.0.1:7777/static/studio.html`** (NOT `/studio.html` — rooms are
  served under `/static/`). The server runs on **7777** (`venv\Scripts\python.exe -m uvicorn app:app
  --host 127.0.0.1 --port 7777`); it was already running this session. No-cache is on, so a reload picks
  up edits. Drive/inspect via `javascript_tool` (runs in page main world — page globals like `tracks`,
  `buses`, `buildTrackGraph` are reachable), screenshot via `computer`, errors via `read_console_messages`.
- **Syntax-check before reloading:** extract the main inline script and `node --check` it:
  `python -c "import re; h=open('static/studio.html',encoding='utf-8').read(); m=re.search(r'<script>\n(.*?)\n</script>',h,re.S); open('_c.js','w',encoding='utf-8').write(m.group(1))"` then `node --check _c.js`.
- **Edit `studio.html` with exact-string edits only.** NEVER bulk-rewrite the emoji-heavy HTML with
  PowerShell `Get-Content`/`-replace`/`Set-Content` (PS 5.1 mojibakes UTF-8 emoji). Watch for apostrophes
  inside single-quoted JS strings.
- **Menu wiring pattern (the whole point of the data-driven bar):** to light up a menu item = implement a
  function + add ONE rule to **`actionFor(menuId, it, parentLabel, titleEl)`** inside the `buildMenuBar()`
  IIFE near the end of the `<script>`. It auto-enables the item (greyed→live) and the central keydown
  dispatcher auto-binds its `shortcut` from `PT_MENUS`. Toggle checkmarks via `CHECK`, grey conditionally
  via `DISABLE`, dynamic labels via `LABELFN` (all keyed `"menuId|Label"` or by `mapsTo`).
- **One workflow at a time.** Launching a second Workflow STOPS the first (learned the hard way). If you
  fan out research, finish one swarm before the next.
- **Commit per verified slice.** Message style: `ARKITECT: <area> — <what>`; end every commit with
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Direct to `master` (solo project convention).
  The "LF will be replaced by CRLF" warning is harmless. **`data/` is gitignored secrets — never commit.**

---

## 6. HOUSEKEEPING / known gaps (handle before the relevant feature)
- **`design/grid-nudge.md` is missing.** Regenerate it before building Grid/Nudge (#14), or build #14
  from `OWNER_STEERING.md` + `design/tempo-bars-beats.md` + the spec table. (A new session can spawn one
  Agent to research+write it; workflow *resume* is same-session-only so the old run can't be resumed.)
- **Swarm-1 design docs are un-finalized** (clip-gain, view-flags, track-freeze-bounce, automation-engine,
  tempo-bars-beats, plugin-vst-sdk). They are solid design-stage drafts but never got the adversarial
  fact-check corrections applied (the finalize stage was stopped). Before building those features, either
  re-run a quick verify+revise pass on the doc, or just read it critically (watch for any referenced
  function that doesn't exist in `studio.html`). The 4 steering docs (sends-bussing-io, edit-modes,
  smart-tool, track-view) ARE finalized + fact-checked.
- **`studio-research/` is gitignored.** The specs live on disk on this machine. If you want them in git
  (e.g., for a teammate), ask B first before changing `.gitignore` (line 13).

---

## 7. Task board (also in the live task list)
- **#13 Bussing & Sends (OWNER #1)** — slice 1 done; **do slice 2 (audio graph) next**, then slice 3 (UI) + save/load.
- **#14 Grid + Nudge** (Bars|Beats) · **#15 Edit modes** (Shuffle/Spot/Slip/Grid) · **#16 Smart Tool**
  · **#17 Track View selector** — all have finalized design docs (except grid-nudge, §6).
- **#8 Clip essentials + Clip Gain** (Mute+Rename done; Clip Gain remains — `design/clip-gain.md`).
- **#9 View show/hide system** (`design/view-flags.md`) · **#10 Track power** (Freeze/Commit/Bounce —
  `design/track-freeze-bounce.md`) · **#11 Options modes + Window floaters** · **#12 File depth + Help + Marketplace**.
- Larger later phases (from `PRO_TOOLS_MENU_SPEC.md`): Automation engine (#6 there), Tempo/Bars|Beats
  timeline (#5), MIDI engine, Playlists/comp, Video/Timecode, and the **plugin/VST SDK**
  (`design/plugin-vst-sdk.md`) — B's eventual VST work.

---

## 8. studio.html quick map (function names; grep for exact current lines — they shift with edits)
- **Clip model:** `t.clips=[{id,buffer,start,muted?,name?}]`; `selClip`; `SEL={trackId,a,b}` (Select tool).
  `clipsOf`, `clipAt`, `bufSlice`, `syncPrimary`. Undo: `pushUndoClips(t,label)`/`undoLast`/`redoLast`/`_snapClips`.
- **Edit ops (built):** `duplicateClip`, `cutCmd`/`copyCmd`/`pasteCmd` (+`CLIPBOARD`,`_renderRange`),
  `insertSilence`, `healSeparation`, `trimToSelection`, `consolidateSelection`, `toggleClipMute`, `renameClip`.
- **Audio graph:** `buildTrackGraph(c,t,when,offset,isOffline)` — one BufferSource PER clip → `inG` → eq →
  inserts → `comp` → `pan` → `fader` → meter → dest. `playAll`/`stopSources`/`pauseAll`/`stopAll`; offline
  export uses `OfflineAudioContext`. `ensureCtx`.
- **Bussing (slice 1):** `buses[]`, `addBus`/`removeBus`/`busById`, `addAux` (creates paired bus), per-track
  `input`/`output`/`inputBus`/`sends`, `ioLabel`, `refreshAllRouting`, `BANK_AE/FJ`, `sendInSlot`, `IF_INPUTS/OUTPUTS`, `dbOf`.
- **Tracks/mixer:** `addFiles`, `makeAudioTrack`, `openNewTracksDialog`/`createTracks`, `laneUi`/`auxLaneUi`,
  `drawLane`/`drawClipWave`, `renderChannel`, `buildStrip`, `renderStripSlots`, `renderSends`, `selectTrack`, `selTrackId`.
- **Menu:** `<script src="/static/pt-menus.js">` sets `window.PT_MENUS`/`PT_CONTEXT`; the `buildMenuBar()`
  IIFE (`actionFor`/`BY_MAPSTO`/`CHECK`/`DISABLE`/`LABELFN` + the keydown dispatcher) at the end of the main script.
- **Transport/tools:** `setView('mix'|'edit')`, `setTool('grab'|'trim'|'select'|'smart')`, `tool`, `SEL`,
  `snapTime`/`gridStep`/`gridNote`/`#gridSel`/`curTempo`, `zoom`/`scrollT`/`laneH`, `pos`/`seek`/`maxDur`.
- **Save/load:** `saveProject`/`loadProject`/`openLoadMenu` (anchored, generalized), `/api/studio/projects`.

— End of handoff. Build the next slice from `design/sends-bussing-io.md`, verify in the browser, commit, repeat. Keep it Pro-Tools-exact.
