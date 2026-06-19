# ARKITECT — Studio DAW · HANDOFF (read this first, in full)

You are continuing a multi-session build of **ARKITECT**, an in-browser, **Pro-Tools-faithful** DAW
(plus a wider app: a main chat, image/video rooms, etc.). The owner ("B" / tiffagnx,
koonce47@gmail.com) drives it feature-by-feature. Read this whole doc, then keep building.
**Commit per verified slice. He is picky and wants the TRUTH, not a yes-man** — when something's
wrong, say so plainly and fix it. He talks via voice-to-text (long, sometimes garbled — read intent).

---
## ⏩ LATEST SESSION (2026-06-18, "session 2") — READ THIS FIRST

A huge session. Beyond the DAW, it spread into the **main chat + the whole-app plumbing**. Everything
below is committed on `master` + browser/curl-verified. Files touched this session span the WHOLE app,
not just studio.html: `static/studio.html`, `static/index.html` (main chat), `static/settings.js`,
`app.py`, `swarm_routes.py`, `setup-and-run.ps1`, `RESTART ARKITECT.bat` (new), `static/kit-hero.png` (new).

**What shipped this session (newest → oldest), all verified + committed:**
1. **Cloud models live-list + smarter defaults** (2c1b69d): Groq preset defaults to `meta-llama/llama-4-scout-17b-16e-instruct` (vision + tool use), Google to `gemini-3.5-flash` (newest GA — vision/tools/1M ctx). NEW `POST /api/swarm/models` fetches a provider's LIVE catalog with the user's key; settings.js **"↻ list"** button pulls the real current models into the dropdown (no stale ids). Verified pulling Groq's 17 live models via the saved key.
2. **App-wide updater** (e3fcd07): `app.py` owns `APP_VERSION` ("1.0.0") + `GET /api/version`; `settings.js` (the ⚙ gear, on EVERY room) checks GitHub Releases → badges the gear + one-click Install when a newer version exists. The updater downloads the WHOLE app ZIP (every room + backend), not one room.
3. **Dev-loop fixes** (3a442d8): `setup-and-run.ps1` adds `uvicorn --reload` when a `.git` checkout is present (auto-reload on .py edits); **`RESTART ARKITECT.bat`** = one-click clean restart (kills the 7777 listener + reloader-parent tree, relaunches); single-instance is now a safe **port check** (a mutex deadlocked relaunches); **⟳ refresh** button by the chat model picker.
4. **Chat bring-your-own cloud model** (d9d5365): main chat picker shows ☁ cloud models via the user's own key (Featherless/Z.ai-GLM/Google/Groq/xAI-Grok presets). `/api/models` returns cloud slots; `/api/chat` streams from the provider via new `swarm_routes.provider_stream` when a `cloud:<id>` model is picked. "Make ARKITECT smarter" CTA (a6e5c43) on the empty chat screen → opens Settings. **Full detail in [[chat-byo-cloud-model]].**
5. **Menu fixes** (5c0c2f6): Clip menu DE-DUPLICATED (was mirroring Edit → now clip-object ops only via a `CLIP_KEEP` allow-list); Open-Session list position fixed; **Batch Fades dialog** (Edit ▸ Fades ▸ Create — In/Crossfade/Out curve previews, shapes, ms lengths, Presets 1-5, equal-power crossfade between adjacent clips).
6. **Menu wirings** (15e8afc, be2cd4d, 6e109dd, f89e11e, 47eed8f): Strip Silence, Fades submenu, Select All, Bypass Inserts, Trim-to-cursor, File Create New / Open Recent / Close / Revert, Setup ▸ I/O, Clip/Track Cut-Copy-Paste / Duplicate. **Full detail in [[studio-menu-audit]].**
7. **Menu declutter** (5da4ee1): cut the Event menu + hide MIDI/scoring/surround/film-timecode/cloud/quantize/loop-record dead weight (wired-safety-net: a live item is never hidden). Earlier: **Vocal Doctor** (1cd5b84/161dd4c) + **DeMartin quote fix** (f47af9a) + **Kit hero** (611bbd0). Plus Phase 3/4/L&F (start of session).

**🔴 CURRENT LIVE STATE — where we left off:** The owner is **setting up his cloud keys in chat Settings ⚙**. He'd saved **Groq · llama-3.3-70b** but is switching to **Llama 4 Scout** (delete + re-add, or ↻ list + pick); next he'll add **Google gemini-3.5-flash** and **Featherless** (`moonshotai/Kimi-K2.6` — he has a paid Featherless sub for ~a week, then moving to Z.ai GLM). I restarted his **live 7777 server several times** onto the latest code (last background launch = a detached `uvicorn app:app --port 7777`); **he still needs to RELOAD his browser window once** to pick up the newest `static/settings.js` (the ↻ button + Gemini-3.5 default). The **real cloud-chat end-to-end has NOT been live-tested with his key** — that's his next move (paste Featherless key → pick ☁ model → send).

**⚙ DEV-LOOP GOTCHA (cost real time — don't repeat):** Python does NOT hot-reload, so editing `.py` does NOT change the owner's RUNNING server. Symptom: "owner sees old code / new presets missing." Diagnose by curling the LIVE server: `curl localhost:7777/api/version` and `/api/swarm/presets` — that shows what it ACTUALLY serves. Fixes now in place: launcher uses `--reload` on a `.git` checkout (auto-reload), and **`RESTART ARKITECT.bat`** one-click restarts cleanly. If stuck, `Stop-Process` the 7777 listener + its parent, then restart. A fresh DOWNLOAD never hits this (clean first launch loads current code). NOTE the single-instance port-check means **a relaunch while the old server is still up will just focus it** — you must free the port first (RESTART.bat does).

**⚠ DIRTY TREE = the PARALLEL editor session's WIP (not yours):** `git status` shows `app.py` (e.g. a new `_clip_kind`) + `static/editor.html` (~430 lines) as uncommitted — that's the **video-NLE session's** in-progress work. **Leave it alone — don't commit or revert it.** Only `git add` the specific files YOU change (studio.html / index.html / settings.js / swarm_routes.py / your own app.py edits / setup-and-run.ps1). All of THIS session's work is already committed (HEAD = `9594ea0`).

**📦 RELEASE PROCESS (how updates reach users):** commits alone don't update anyone. To ship: **tag `vX.Y.Z` on GitHub `tiffagnx/Arkitect` + upload the distributable ZIP as the release asset, and bump `APP_VERSION` in `app.py`** (also the hardcoded copy in `static/studio.html`'s updater until unified). Then every user's ⚙ gear shows "Update available" → one click pulls the whole new app ZIP, applied on relaunch (zip-slip-safe, ARKITECT-sanity-checked, backs up, preserves `data/`+`venv/`). **Owner wants to cut his FIRST release WITH you present** — and pass-2's live restart needs one real on-his-machine test.

**▶ WHAT'S NEXT (owner's call — the 3 gated audio features + polish):** #18 **Auto-Tune as its OWN plugin** (his stated #1 "hugest question"; SEPARATE from Melodyne/openTune; key + strength natural→hard — but HIGHEST risk to nail in-browser, don't build blind/rushed); #19 **FX-Throw bar** + note-division render-FX (reuses the proven tempo-synced clipFx — lower risk); #20 polish (aux→`laneUi` unify per [[studio-aux-and-pt-track-reference]], dB-tapered fader throw). He picked Vocal Doctor first off this list last time; ASK which is next. Verification this session: Claude_Preview MCP on **7791** (`arkitect-studio` launch config; restart it when the screenshot renderer wedges — it wedges a lot, use `preview_eval` DOM-inspection instead), `curl` the live 7777, `node`/`py_compile` syntax checks per slice.

---
## WHO HE IS + HOW TO WORK WITH HIM
- **Vocal / post-production engineer**, ~30 yrs in Pro Tools. He records vocals OVER an already-made
  beat, then mixes (post-production). He does NOT make beats. **Build it the way HE edits.**
- North star: **look/feel/work like Pro Tools 12.5** now. He'll re-skin it later ("PT vibe without
  being PT") — structure first, restyle is the cheap last step. Don't copy PT art; match the layout.
- "**Build the whole car**": rough out the whole thing, then carve/polish. He **won't test-record
  until it's a finished DAW** — don't make "go try recording" a milestone.
- He wants **blunt honesty** ("I'd rather you tell me it sucks so I can fix it"). Give your real read.
- He communicates with **screenshots + voice-to-text** (long, sometimes garbled — read the intent).
  Screenshots don't carry across sessions (why he hates handoffs). Make this one count.
- Cadence: he gives a concrete fix → you implement → **verify in the real browser** → commit → he
  reviews the next screenshot. Small verified slices. When he says "go" he means keep going.

## WHAT IT IS / FILES / HOW TO RUN
- Front-end: **`static/studio.html`** — ONE big file, inline `<script>`, Web Audio engine + Canvas
  waveforms (~390KB). ~all DAW work happens here. Edit with exact-string edits (emoji-heavy UTF-8).
- Backend: **`app.py`** (FastAPI). Studio APIs: `/api/studio/projects` (server save/load);
  `/api/studio/session/{pick-folder,pick-file,save-to-folder,read-file}` (disk session folders via a
  tkinter child process — same recipe as `/api/editor/pick`).
- **Server: 127.0.0.1:7777, NO `--reload`.** It dies intermittently — just restart (background):
  `./venv/Scripts/python.exe -m uvicorn app:app --host 127.0.0.1 --port 7777`
  app.py changes need a restart; studio.html changes need only a browser reload (no-cache is on).
- **DO NOT TOUCH `static/editor.html`** — a PARALLEL Claude session owns it (runs on :7788). For DAW
  work only commit `static/studio.html` (+ `app.py` for studio backend). Crew commits on **master**.
- `data/` is gitignored secrets — never commit it.

## HOW TO VERIFY (every slice)
> 2026-06-18: the **Claude_Preview MCP** is the smoothest path now — `.claude/launch.json` has an
> `arkitect-studio` config on **port 7791** (a 2nd uvicorn of the same app, so it never fights B's own
> 7777 server). `preview_start` it once, then `preview_eval` (build a synthetic track + `setView('mix')`),
> `preview_console_logs`(level error), `preview_screenshot`. Reload past the guard with
> `tracks.length=0; window.onbeforeunload=null; location.reload()`. Chrome MCP on 7777 still works too.
1. **Syntax-check** the inline script: regex `<script>` blocks out of studio.html, `node --check` each
   (a tiny extractor that writes each inline block to a temp .js + `node --check`s it). Must be 0 errors.
2. **Chrome MCP** (`mcp__Claude_in_Chrome__*`) on the tab at `localhost:7777/static/studio.html`.
   - `beforeunload` guard fires when tracks exist; to reload, first `javascript_tool`:
     `tracks.length=0; window.onbeforeunload=null;` then `navigate`.
   - Build a synthetic track in-page to test: `ensureCtx()`, `createBuffer`, push a track object,
     `laneUi(t)`. Globals on window: `tracks, ensureCtx, laneUi, clipsOf, rid, seek, pos, playAll,
     buildTrackGraph, fitContent, drawLane, viewDur, maxDur, contentDur, gdbStr`, etc.
   - If exec returns `undefined` / `location "/"` / `chrome-error://` → **the server is down** → restart.
3. `read_console_messages` (onlyErrors) clean; screenshot/zoom to confirm visually. Then commit.

## HARD RULES — DO NOT UNDO (each was an explicit owner correction this session)
1. **NO right-hand panel in the Edit view.** Tracks run edge-to-edge like PT. `#chan` is hidden
   (`display:none`) on purpose — never show it. Mixing lives in the MIX view + the track strip.
2. **Recording = cursor-based, NO take selector.** Click the timeline → blinking cyan edit cursor
   drops there; recording lands AT the cursor (`startOffset`). Recordings are just clips on the lane;
   they coexist, all visible. He REJECTED take 1/2/3 playlists ("not real"). **Never re-add a take/
   playlist selector.** (loop-record is therefore deprioritized — it's take-stacking.)
3. **Transport order = ■ Stop · ▶ Play · ● Record**, then nav row ⏮ ⏪ ⏩ ⏭. **No Loop button** in the
   transport (`#loop` kept hidden for the var). Top **Record ARMS** (pulses red, silent); **Play/Space
   rolls & records** when armed + a track is record-enabled; **Stop** disarms.
4. **Count-in click OFF by default**, toggled by the **♪ CLICK** button. Never force it.
5. **Toolbar = grouped bordered boxes** (COUNTER · TRANSPORT · CLICK · VIEW · TOOLS · ZOOM·GRID),
   small square transport icons, big green LED counter, ~60px tall. Keep tight + PT-like.
6. **Track strip tight (~108px)** cut at the buttons: Track-Color strip · centered name · ●/S/M ·
   tall meter; then columns Inserts A-E/F-J · Sends A-E/F-J · I/O (input/output/**dB** VOL/PAN).
   Names truncate — that's fine (PT does it).
7. **Timeline = real ~20-min session** (`maxDur()` floors at 1200s) with empty space to record into;
   `contentDur()` = true material end (drives playback-stop, Go-to-End, bounce). Fit frames material.
8. Volume reads in **dB** (`gdbStr`); new tracks default to unity (0.0 dB). "Everything is little for
   a reason" — match PT density, don't enlarge controls.

## STATUS — done / next
- **Phase 0 — Data safety: DONE.** session spine (bpm/grid/snap/loop/time-sig/markers) + per-clip
  gain & fades persist; **autosave** every 5 min + after each take; **save/open a session as a real
  FOLDER on disk** (`<dir>/<Name>/<Name>.ark` + Audio Files/ · Bounced Files/ · Session File Backups/);
  Ctrl+S writes to that folder once chosen. `loadProject` refactored → shared `applyProjectPayload`.
- **Phase 1 — Navigate: DONE.** time ruler (Bars|Beats + Min:Secs, adaptive, click-to-seek, playhead
  marker); Bars|Beats counter; markers (Enter drop / click recall / dbl-click remove); transport keys
  Home/End + playhead auto-scroll; **time signature** control. Deep zoom: H +/- + dynamic cap drill to
  ~2 ms (`zoomAround` anchors on playhead); bottom readout shows the visible span.
- **Phase 2 — Finish a vocal: edit set DONE.** clip gain (drag the dB badge) · nudge (`,`/`.` by grid)
  · fades & crossfades (drag a clip's top corners; engine ramps the per-clip gain node). Comping/take-
  playlists + loop-record intentionally NOT built (owner rejected take-stacking).
- **Phase 3 — Mix: DONE 2026-06-18.** MIX strips now: read dB on the fader (`gdbStr`) + show the full
  A–J send banks; per-insert bypass-dot + remove (✕); a built-in EQ/Dyn knob row (LO/MID/HI/CMP) + an
  ✨ Auto-mix button (Auto-mix now also analyzes a clip-track's longest clip, not just `t.buffer`;
  reasoning shows in a floating card in MIX view). Master strip got a real **Master FX rack** (mastering
  plugins first, bypass/remove) + a draggable **CEIL** knob (limiter ceiling). And a track **Input can now
  be a real hardware device** (`dev:<id>` in the I/O picker's "hardware in" group, renamable like
  "BRYANS MIC"): arming that track records FROM that device (transportGo routes capture to it, falling
  back to global `#inDev`); `IF_NAMES` now travels in the saved project. NOTE: `dev:` is excluded from
  the bus-input path in `buildTrackGraph`/`wouldFeedback`, so a hardware-input track still plays its clips.
- **Phase 4 — Deliver: DONE 2026-06-18.** **Bounce to Disk dialog** over the offline render (repurposed
  `#exportBtn`; File ▸ Bounce to ▸ Disk maps here): Source (Main Mix / per-track stem / per-bus), File
  Type WAV+MP3, Bit Depth 16/24 (`bufferToWavBlob` does 24-bit now), Sample Rate (project/48k/44.1k),
  Range (whole / SEL), file name, Destination (Download / session Bounced Files/ / Choose folder…).
  `renderBounce({source,startT,endT,sampleRate,tap})` reuses setupBusNodes+buildTrackGraph+buildMasterChain
  so a bounce == playback. Backend `/api/studio/session/bounce` writes the WAV + ffmpeg→MP3 320k. Track ops
  wired (top Track menu via `actionFor` + right-click): **Bounce** (stem), **Commit** (print inserts/EQ/comp
  to a clip, tap:'pre'), **Freeze** (reversible Commit, stash in `t._frozen`), **Make Inactive** (silent+grey
  via the applyTrackTo gate), **Hide** (+ Show all tracks). All verified in the browser.
- Deferred: rename desktop folder pink-room→arkitect (cwd/server lock); Sessions Dashboard "New
  Session" modal/templates (design in `studio-research/design/sessions-dashboard.md`).

**This session (2026-06-18): owner said "go down the list — Phase 3, Phase 4, then a look-and-feel
pass." ALL THREE DONE + committed/verified (commits 20dd6d1 … a5d70a8). The look-and-feel pass tightened
the MIX view: capped the sends region so the FADER is always in view, + PT section dividers on the strips.
The big reskin ("PT vibe without being PT") is still the owner's to drive — show him screenshots and ask.
Open follow-ups: aux lane still uses `auxLaneUi` (unify → `laneUi`); the fader THROW is linear (the readout
is dB, which was the ask — a dB-tapered throw is more PT-exact); Sessions Dashboard; rename folder
pink-room→arkitect.**

**Post-handoff fixes (same session, from owner screenshots):**
- **Fades are DRAG-ONLY** (commit 2d86d4c): drag a clip's top-corner square handle inward — left = fade-in,
  right = fade-out (visible white handles on the selected clip + a `col-resize` cursor cue). Removed the
  destructive right-click "Fade in/Fade out" items (`clipFx_fade` now unused) and the #chan cf-fi/cf-fo
  buttons; added PT-style **"Delete fades."**
- **The fade now tapers the actual WAVEFORM** (commit 0586eb1): `drawWaveBand`/`drawClipWave` take fi/fo/dur
  and scale each column by the linear fade gain, so the wave shrinks to zero across the fade like PT — was
  only an overlay line over a full-height wave. The dark fade fill was lightened so the taper shows.
- **LIVE record waveform** (commit 231adca): `beginCapture` tags the armed track; `onaudioprocess` feeds
  `REC.livePeaks`; `drawLiveTake` (called from `drawLane`) draws a growing RED wave + record-head on the
  armed lane every frame while capturing — was blank until Stop. Drawing verified in-browser via simulated
  capture state; the real-mic path is wired but only the owner can confirm live (headless has no mic).
- **Verify method note:** the Claude_Preview screenshot pipeline can wedge after a 30s timeout — if
  screenshots hang while `preview_eval` still responds, `preview_stop`+`preview_start` the `arkitect-studio`
  config (port 7791) for a fresh renderer.

**Autonomous batch (2026-06-18, owner napping — explicit "keep working down the road"):** all browser-verified, committed:
- **Opaque clips** (df3af88): clip body now paints a solid base (`#0d0e13`) + a track-color tint in `drawLane`
  (was `hexA(color,0.10)` see-through) → overlapping stems fully cover, no bleed.
- **Overlap = overwrite** (751f7ea): `resolveOverlaps(t, moved)` runs on clip-drop (grab/move up handler) — the
  covered audio of lower clips is trimmed/split/removed (PT overwrite). Recording still COEXISTS (not overwritten).
- **TEMPO · KEY on the top bar** (115fc45): new `.tgroup` after COUNTER — typeable BPM + TAP + AUTO + key DETECT;
  `syncTopTempoKey()` mirrors the formerly-hidden `#recBpm`/`#keyVal`; forwards to existing `#tapBtn`/`#autoBpmBtn`/`#autoKeyBtn` (ONE source of truth).
- **Fade shapes** (c6ddab6): `_shapeCurve`/`_fadeGain` (lin/pow/scv) drive the audio ramp (`setValueCurveAtTime`,
  linear fallback in try/catch), the waveform taper (`drawWaveBand`), AND the drawn fade line — all matched. Right-click
  ▸ "Fade shape" cycles Standard→Equal-Power→S-Curve; serialized as `fadeInShape`/`fadeOutShape`.

**Blank-slate + Updater (2026-06-18, owner napping — built & verified, committed):**
- **Blank slate reworked** (676a5d6 + 611bbd0): killed "what's up — let's make something" → **rotating real quotes**
  (`QUOTES` array, attributed — hip-hop/rock/punk artists + top producers/engineers + DeMartin house lines; `rollQuote`/
  `startQuotes`, 9 s crossfade). The ◆ diamond is now **Kit** the mascot — `static/kit-hero.png` is the WHOLE transparent
  "little guy" (NOT the launcher icon/tile; owner corrected this twice — ships in `static/` so every download gets it),
  floating via `@keyframes kitFloat`. The oversized top-bar "Yo, Kit" button was shrunk to match the Visual Lab
  (`.menubar .kit-fab.in-bar canvas{19px}`).
- **AUTO-UPDATER — both passes DONE.** Owner spec: rename Help → **Updates**, blink when a new build is out, click →
  save → download → restart; ships as a ZIP via **GitHub Releases** (`tiffagnx/Arkitect`), users need no git.
  - *Pass 1* (548a049, `static/studio.html` `arkUpdater` IIFE): `APP_VERSION="1.0.0"` (bump per release tag), CORS-safe
    fetch of `releases/latest`, semver `cmpVer`, **404/no-release = silently up-to-date** (no nag), background check every
    6 h (localStorage-throttled + cached so a reload keeps the badge). A newer tag → the **Updates** menu pulses amber with
    a dot (`.upd-avail`); clicking opens the **Updates dialog** (vX → vY + release notes + Download). All paths verified in
    the preview (real 404 path + simulated-update blink/dialog).
  - *Pass 2* (9a4ed10, `app.py` + `setup-and-run.ps1` + `.gitignore`): **stage-then-apply-on-relaunch** so the running
    process never overwrites itself. Backend `POST /api/studio/update/stage {url,version}` downloads the ZIP (httpx,
    follows GitHub redirects) → `_stage_update_from_zip` extracts to `_update/staged/` with a **zip-slip guard** + an
    **"is this ARKITECT?" sanity check** (needs app.py + static/) + writes `_update/pending.json`. `GET …/status`,
    `POST …/restart` (detached PS waits for port 7777 to free, runs START HERE.bat, then `os._exit`). The **launcher**
    applies the staged update at startup: zips a **rollback backup** (excludes venv/data/_update/.git), `robocopy /E /XD`
    merges new files over the install (**never touches data/ or venv/**), clears the marker, then `pip install -r
    requirements.txt` if a release changed deps. Front-end `stageUpdate()` does autosave → stage → "Restart now / Later".
    `_update/` is gitignored. **Verified:** staging helper unit-tested (nested zipball + flat ZIP + zip-slip + bad-payload
    all correct); launcher apply invariants proven on a temp install (code merges in place, data + venv survive, no
    clobber, backup made, cleanup). NOT exercised live (no published release yet; `/restart` would kill the running
    server) — but apply-on-relaunch is safe-by-design and "close & reopen ARKITECT" is always the fallback.
  - **To cut a release:** tag `vX.Y.Z` on GitHub + upload the distributable ZIP as the release asset, and bump
    `APP_VERSION` in `static/studio.html` to match. *Pass-2 follow-up to do WITH the owner present:* one real end-to-end
    update against a live test release on his machine (confirm the detached restart lands cleanly; tidy the leftover
    old console window).

**VOCAL DOCTOR — BUILT 2026-06-18 (owner picked it first off the gated list; commits 1cd5b84 + 161dd4c, browser-verified).**
One 🩺 button on each MIX strip (next to ✨ Auto-mix) → analyzes the selected vocal (reuses `measure()`/`detectType()`)
and builds a full **ready chain**, then opens a draggable **"Your Edge"** panel. Chain (corrective-first, idempotent):
**EQ-6** (HPF + mud cut + presence + air, from the measured tilt/bands) → **De-Ess** (freq = measured sib peak) →
**Compressor** (crest-driven, parallel mix) → **Saturator** (light tube) → **Slap** (a NEW native parallel-mix slap-delay
plugin — also in the insert picker for everyone) + a tasteful **global reverb send** (`t.send`). The "Your Edge" panel has
6 macro sliders — **Bright / Warm / Smooth / De-Ess / Space / Throw** — each CLAMPED to a safe band around the Doctor's
setting (center = baseline), so the owner can shape it but "can't wreck it." Honest readout card explains what was measured
+ built. **Idempotent across re-run AND save/load** via a `params.__doc` tag (rides in params, so no serialization change;
re-running replaces only Doctor inserts and never touches the user's own). Engine reuse map: `vdPlan`/`vdBuildChain`/
`vdApplyMacro`/`vdOpenPanel`/`runVocalDoctor` live right after `showFloatingSummary` (~line 4420+); `VDOC_CHAIN` +
`VDOC_MACROS` drive it. **Follow-ups if owner wants:** route slap/verb as real aux sends (currently slap is a parallel
insert, verb is the global send); an Edit-view / right-click entry (today it's MIX-strip only). NOTE: screenshots of the
panel kept wedging the preview renderer (environmental) — verified instead by DOM-inspection eval (button present, 5→6
inserts, 6 bounded macros, idempotency, user-insert preservation) + 0 console errors.

**MENU-BAR AUDIT + DECLUTTER (2026-06-18, owner: "audit it, don't do anything backwards"; commits 5da4ee1 + 47eed8f).**
Audited all 11 menus (multi-agent workflow `arkitect-menu-audit-v2`; ground-truth extracted deterministically into
`studio-research/menu-*.json` — gitignored). **Done:** CUT the whole **Event** menu + a hide-filter in `buildMenuBar`
(`MENU_HIDE_GLOBAL` regex list + `MENU_HIDE_BY` per-menu) applied in `buildPanel` via `isHiddenItem()` with a
**wired-safety-net** (`menuItemWired` — a live item is NEVER hidden) + trailing-separator cleanup → hides MIDI, scoring,
surround, film-timecode, Avid-cloud, quantize/elastic, punch/loop-record, window-layout, DSP-accounting (verified: 0 wired
items hidden). Fixed a latent `actionFor` bug (Edit Automation submenu's Cut/Copy/Paste hijacked the clip commands — now
`!parentLabel`-scoped). **Wired (safe reuse):** Clip Cut/Copy/Paste (→ `cutCmd/copyCmd/pasteCmd`) + Track Duplicate (→
`duplicateTrack`). **WIRE-NEXT roadmap (ranked, NOT built):** Strip Silence (new DSP) · Fades submenu (reuses the per-clip
fade engine; needs a selected-clip target + Ctrl+F) · Select All · Trim Start/End to cursor · Bypass Inserts (All/EQ/Dyn) ·
Setup I/O dialog · File Create New / Open Recent. **RISKS (heed):** dispatch keys off the visible label (don't relabel a
wired item — silently un-wires); don't rebuild Melodyne; double-check Track Delete before touching; Click items must point
at the existing ♪ toolbar toggle; never re-add loop-record; Commit/Render must route to the existing Bounce/Commit. Full
detail in the [[studio-menu-audit]] memory. **Asset self-containment: PASS** — every image/sprite/icon/JS is git-tracked
(0 missing/untracked); only optional gap = fonts via Google CDN (offline falls back to system fonts; bundling touches
several room HTMLs incl. the PARALLEL-session editor.html — leave that one alone). **DeMartin quotes fixed** (f47af9a):
re-bylined the made-up "DeMartin" lines to "DeMartin Audio Labs" + added a namesake nod (Édouard-Léon Scott de Martinville,
first recorded voice 1860).

**Big discoveries (so we don't rebuild):** **Auto-Tune ALREADY EXISTS** — `openTune` (5533) is a real Melodyne-style
pitch editor (detectPitchTrack→segmentNotes→piano-roll→snap-to-key→`fxPitchBuf` retune→print). **Auto-mix** already
FFT-analyzes + applies bounded EQ/comp/de-ess (the seed for "Vocal Doctor"). `clipFx_chop` (1/16 stutter) + `clipFx_bpmDelay`
are ALREADY tempo-synced (read `curTempo()`).

**RESEARCHED, awaiting owner green-light (3 workflows ran; full plans in the run task-outputs):**
(1) **FX-Throw bar** — contextual one-tap beat-locked throws on a selection (reuse `separateAtSelection` + the clip
render-FX + `placePopup`/`armPopupClickaway`), + a Stutter Painter. (2) **Tempo-synced render-FX engine** — generalize
`clipFx_chop`/`clipFx_bpmDelay` with a NOTE-DIVISION picker (`FX_DIVS` + `divSec(div)`); keep the old fns as wrappers.
(3) **Auto-Tune as its OWN plugin** (key + a strength knob natural→hard; SEPARATE from Melodyne — owner insisted they're
different tools). (4) ~~**Vocal Doctor**~~ — **DONE 2026-06-18** (see the VOCAL DOCTOR section above). (5) **drag-the-curve custom fade +
Batch-Fades dialog** (owner was mid-explaining the PT dialog). Owner wants all of it but hasn't approved builds — PRESENT
the plan first, build one slice at a time.

## ENGINE MAP (grep for current line numbers — they shift)
- `buildTrackGraph(c,t,when,offset,isOffline)`: per clip → **per-clip GainNode (cl.gain + fade ramps)**
  → `inG` → eq(lo/mid/hi) → inserts → comp → pan → fader → meter → dest; sends tap comp(pre)/fader(post)
  → bus nodes (`setupBusNodes`). Same helper for live + offline bounce.
- `laneUi(t)` builds a lane; `drawLane(t)` draws clips (stereo dual waveform · name bar · dB badge ·
  fade tapers · selection). `tickUi` = rAF loop (playhead/edit-cursor + meters + `drawRuler`).
- Recording: top Record = `setRecArm`/`transportGo`; `armAndRecord` (count-in gated by `metroOn`) →
  `beginCapture`/`stopRecording` (take lands as a clip at `startOffset`, latency-compensated).
- Zoom: `setZoom`/`zoomAround`/`zMax()` (dynamic, MIN_VIEW=2ms)/`fitContent`/`fitSession`.

## REFERENCE
- **Real Pro Tools 12.5 manuals on disk:** `C:\Users\koonc\Downloads\bryans files\mine\Documentation\`
  (Reference Guide.pdf — **Ch.13 Tracks** = track anatomy). Read with **pypdf** (no pdftoppm):
  `python -c "from pypdf import PdfReader; r=PdfReader(path); print(r.pages[N].extract_text())"`
  (`$env:PYTHONIOENCODING='utf-8'`). The install is a compiled MSI — NO source code; the PDFs are the gold.
- **Memory files auto-load each session** and carry these rules: `studio-daw-roadmap`,
  `studio-no-right-panel`, `studio-aux-and-pt-track-reference`, `protools-reference-docs`,
  `studio-daw-protools-build`. Keep `studio-daw-roadmap` current as you finish phases.
- `studio-research/design/*.md` = older build-ready specs (edit-modes, smart-tool, sends-bussing-io,
  EDITING_MASTER_PLAN, sessions-dashboard). Gitignored/local. Read critically (some pre-date this work).

## NOT THE DAW (separate tracks, ignore unless asked)
- Kit RAG brain shipped (`kit_kb.py`, wired in app.py); future: Tiff Supabase memory ingest, Kit god-mode.
- `static/editor.html` is the parallel video-editor session — don't touch.

— End of handoff. Pick the next phase (ask), build the slice, verify in the browser, commit. Keep it Pro-Tools-exact, keep it honest.
