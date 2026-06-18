# ARKITECT — Studio DAW · HANDOFF (read this first, in full)

You are continuing a multi-session build of **ARKITECT**, an in-browser, **Pro-Tools-faithful** DAW.
The owner ("B" / tiffagnx, koonce47@gmail.com) drives it feature-by-feature. Read this whole doc,
then keep building. **Commit per verified slice. He is picky and wants the TRUTH, not a yes-man** —
when something's wrong, say so plainly and fix it.

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
- **Phase 4 — Deliver (NEXT):** real **Bounce-to-Disk dialog** over the (already solid) offline render —
  Source (MON L/R or a bus/output/track for stems), File Type (WAV + MP3), Bit Depth (16/24), Sample
  Rate, file name + directory, bounce the SEL range; wire Track-menu Bounce/Commit/Freeze/Make-Inactive
  (dead now); add Hide to the track right-click menu.
- Deferred: rename desktop folder pink-room→arkitect (cwd/server lock); Sessions Dashboard "New
  Session" modal/templates (design in `studio-research/design/sessions-dashboard.md`).

**This session (2026-06-18): owner said "go down the list — do Phase 3, then Phase 4, then a
look-and-feel pass." Phase 3 DONE + committed. Phase 4 (Bounce-to-Disk) next, then the L&F pass.**

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
