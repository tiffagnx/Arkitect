# DeMartin BEAT LAB — handoff (built 2026-06-21)

The new **beat-making room** (an FL-Studio-class step sequencer + producer DAW) lives in
**`static/beats.html`** — one self-contained file, pure Web Audio, zero samples needed.
It's a sibling of DeMartin Audio Labs (mixing) and LePrince Visual Labs (video). This is the
room a **producer makes the beat** in; the Audio Labs room is where you mix/edit a finished take.

> ⚠️ **BRAND NAME IS A PLACEHOLDER.** I named it **"DeMartin Beat Lab"** to be brand-consistent
> (it's clearly DeMartinville's production arm, sibling to "DeMartin Audio Labs") and zero
> trademark risk. Owner is strict about branding — **approve or rename it.** If LePrince's
> "pioneer surname" pattern is preferred, a beat-maker is fundamentally a *sequencer/drum
> machine*, so a name honoring **Raymond Scott** (built one of the first sequencers) or **Roger
> Linn** (invented the sample-based drum machine) would match. **To rename, change:**
> `static/beats.html` `<h1 class="lab">` + `<title>`; `static/index.html` roomlink + tips entry;
> `static/kit-helper.js` `ROOMS.beats`; `app.py` `room_labels["beats"]` + the `ROOM_HELP["beats"]`
> heading. (All the data keys are `beats`/`dmv_beats_auto` — leave those.)

---

## What works (verified in-browser 2026-06-21)

A real, playable beat maker. Loads with a default trap loop so it **bangs on the first Play**.

- **Engine** — lookahead scheduler (Chris Wilson "two clocks"), AudioContext unlock-on-gesture,
  master bus → soft limiter → analyser → out. Verified: offline render of the default beat =
  peak 0.96 / RMS 0.18 (a full, loud beat). The realtime preview clock is frozen in headless
  Chrome (no audio device) — that's an environment limit, **not** a bug; offline render proves sound.
- **Channel Rack** (main view) — step sequencer. Each row = an instrument; 16-step grid (grouped
  in 4s), click to place a hit, right-click to clear. Per-row Volume + Pan mini-knobs, Mute, Solo,
  and (melodic rows) a 🎹 piano-roll button. Click a step to audition it.
- **Velocity / Graph editor** — bottom strip, follows the selected channel; drag bars for per-step
  velocity. This + Swing = groove.
- **Instruments (all synthesized)** — Kick, Snare, Clap, Hat (closed), Hat (open), Tom, Rim,
  Cowbell, **808** (mono-ish, tuned, glide, drive — the trap bass), **Reese Bass** (subtractive),
  **Soft Keys**, **FM Bell**, and a **Sampler** (drag any audio file onto the room → it becomes a
  sampler channel; plays chromatically from the piano roll).
- **Piano Roll** — for melodic channels. Click to place, drag to move, drag right edge to resize,
  right-click to delete, scroll a note to set velocity. **Scale highlighting + snap-to-scale**
  (root + scale selectors), audition-on-place, moving playhead. A melodic channel with piano-roll
  notes plays the notes; with none, it plays its step row at the channel's root.
- **Mixer** — per-channel strips (tall fader w/ dB readout, pan, mute/solo) + **insert FX chains**
  + a **Master strip**. Routing: trigger → chIn → [inserts] → pan → fader → masterBus → [master FX]
  → masterGain → limiter → out.
- **Effects (9, extensible)** — DeMartin EQ (3-band), Compressor, Reverb (convolver IR), Delay,
  Drive (saturator), Filter, Chorus, **DeMartin Glue** (1-knob Soundgoodizer-style finisher),
  Limiter. `＋ FX` on any strip.
- **🧠 AI brain in EVERY plugin** (instruments **and** effects) — the owner's headline ask. Open a
  plugin, tap 🧠, talk in plain language ("make it hit harder", "darker", "more slide", "warmer").
  It replies like a producer **and turns its own knobs** (which visibly tween), every value clamped
  to the param's safe range. Backend: `POST /api/beatbrain` in `app.py`. **Verified live:** asking
  the 808 "make it hit harder and give it a slide" → reply + `{drive:0.8, glide:0.2}`.
- **Patterns** — `◆ Pattern` button: switch / new / duplicate. STEPS sets pattern length (4–64).
  Each pattern stores every channel's steps + piano-roll notes; all patterns share one rack (FL model).
- **Export** — `⬇ Export` bounces 4 bars of the current pattern to **.wav** via OfflineAudioContext
  (bit-identical to playback, +3s tail for reverb/delay).
- **Save / Load** — `💾`: Save to file (`.dmvbeat` JSON, includes sample audio as base64), Open,
  New. **Autosaves** to localStorage every 9s + on unload, and **auto-restores** on next open.
- **Wired in** — front-door nav link (index.html), Kit is room-aware here (kit-helper `ROOMS.beats`,
  `ROOM_HELP["beats"]` gives Kit a full map of the room), feedback buddy + back-pill via pinkroom-nav.

---

## ⭐ Instrument suite + Browser (2026-06-21, pass 4)

Owner wanted "a suite of plugins, guitars/pianos/all that, at least a hundred, not basic bullshit."
(Reminder he raised + I held the line on: we do NOT use Image-Line's plugins/names — native code
can't run in a browser anyway. This is all our own engines.)
- **Fixed the preset dropdown bug** — picking a preset now *stays* showing its name (e.g. "Boom-Bap")
  and saves to `ch.presetName`; reopening the window reselects it. (Was resetting to "pick a sound".)
- **3 new sound engines**: `string` = **Karplus-Strong physical model** (real plucked-string character —
  this is what makes the guitars/harp/koto actually sound like strings), `organ` = additive drawbars,
  `piano` = layered inharmonic partials + hammer noise. (Acoustic-grand realism is the one thing
  synthesis can't fully nail — the brain card + handoff say "drop a sample on the Sampler for a true grand".)
- **`LIBRARY`** = **82 named instruments** across 11 categories (Drums, Bass, Pianos & Keys, Guitars,
  Synth Leads, Pads, Strings, Brass, Bells & Mallets, Plucks, Organs). Each entry is `{n,c,e,p,r}`
  (name, category, engine, params, root) — pure data over the engines. `addFromLibrary()` spawns a
  channel from one. **Add more = append rows to `LIBRARY`.**
- **Browser window** (`win-browser`, `renderBrowser()`) — a searchable, categorized grid of the whole
  library; click an instrument to add it. Toggle via the 🗂 Browser toolbar button, View menu, or
  Add ▸ "Browse all instruments…". It's the FL-style Browser.

## ⭐ Sound-design pass (2026-06-21, pass 3)

Owner asked to pour work into the **synthesis engine + sound design** ("as good as FLEX"):
- **Upgraded DSP** on the core voices: **kick** (sub-octave for weight + pitched beater click + HP-noise transient + saturation), **snare** (dual detuned tonal body + a bright crack band + a body-rattle noise band), **closed hat** (metallic inharmonic square-oscillator bank — the real 808/909 hi-hat technique — blended with noise via `metalBank()`), **808** (soft-clip harmonics + a 2nd-harmonic layer so it reads on phone speakers). Render RMS went 0.18 → 0.24 — it hits noticeably harder.
- **5 new instruments** (now 18 total): **Shaker, Crash** (drums), **Pluck, Supersaw Lead** (7-voice `unison()`), **Warm Pad** (drums use `metalBank`, synths use `unison`).
- **42 presets across 12 instruments** (`PRESETS` map) — the FLEX-style value: curated sound banks (e.g. 808 → Clean Sub / Distorted / Hard / Glide; Kick → Trap Boom / Boom-Bap / Punchy / Sub). A **preset picker dropdown** sits at the top of every instrument window (`applyPreset()` clamps + repaints knobs + auditions).
- New helpers: `metalBank()` (square-osc cymbal/hat engine), `unison()` (detuned-saw supersaw/pad engine).
- **Add an instrument = one `INSTRUMENTS` entry + (optional) a `PRESETS[type]` array + a `BRAIN_CARDS[type]` line + its type in `DRUM_TYPES`/`MELO_TYPES`.** Everything else (knobs, presets, AI brain, mixer, save/load) is automatic.

## ⭐ The shell is an FL-style floating-window workspace (reworked 2026-06-21, pass 2)

Owner feedback after pass 1: tabs felt nothing like FL. **Rebuilt the shell** so it matches how FL
actually works — and it does now:
- **Menu bar** — `File · Edit · Add · Patterns · View · Options · Tools · Help` with real categorized
  dropdowns (Add groups instruments by DRUMS / BASS / KEYS & SYNTH; View toggles windows; etc.).
- **Floating windows** — Channel Rack, Mixer, Piano Roll, Playlist are each their own window on a
  gridded "desk": **drag** the title bar, **resize** from the corner, **▢ maximize / — minimize /
  ✕ close**, and **click one to bring it to front** (z-order). Toolbar has window-toggle buttons.
- **Original names everywhere** — deliberately mirrors FL's *layout/feel* but uses ZERO of their
  names (no FPC/Sytrus/Harmor/3xOsc/FLEX, no lifted menu text). Same plugin-naming law as the rest
  of the app. **Keep it that way.**

Window-manager code: `flMakeWindow()`, `showWin/hideWin/toggleWin/frontWin`, `layoutDefault()`,
`toggleMax()`. Menu bar: `openMenuBar()` + `STATIC_MENUS` + `menuItems()`. The view renderers
(`renderRack/renderMixer/renderPiano/renderSong`) fill the same element IDs as before, now housed
inside window bodies — so the engine + renderers were untouched.

## Architecture (where things are in `beats.html`)

- **`INSTRUMENTS`** registry — each entry: `{name, kind, melodic, color, root, params:[…],
  trigger(out, when, vel, note, params, ch)}`. **Add an instrument = add one object.** `params`
  drives the knob UI + the AI brain automatically.
- **`BRAIN_CARDS`** — the per-instrument knowledge string the AI brain reads.
- **`TIFF_PLUGINS.register({name, icon, knowledge, params, create(ctx)→{input,output,set,dispose}})`**
  — the FX contract. **Same contract as `studio.html` and the Builder**, so Builder-made plugins
  load too (boot fetches `/api/plugins/bundle.js`; `＋ FX ▸ Load plugin (.js)` loads a file).
- **Scheduler** — `scheduler()` / `scheduleStep()` / `startPlay()` / `uiTick()`.
- **Routing** — `ensureMaster()`, `rebuildChannel()`, `rebuildMaster()`, `applyChannelLive()`.
- **Piano roll** — `renderPiano()` / `prNoteEl()` / `SCALES`.
- **Mixer** — `renderMixer()` / `mixStrip()` / `openFxWindow()` / `bindFader()`.
- **AI brain** — `runBrain()` (shared by instruments + FX), `brainAsk()`, `fxBrainAsk()`,
  `tweenKnob()` (animates a knob to the AI's value, with an optional live audio-node setter).
- **Export/Save** — `renderPatternWav()`, `encodeWav()`, `serialize()/deserialize()`, `autosave()/bootProject()`.

The whole thing is data-driven off two registries (`INSTRUMENTS`, `TIFF_PLUGINS`) + the flat param
schema, which is exactly what makes it "keep adding features" friendly — knobs, the AI brain,
mixer slots, and save/load all work the moment you register a new instrument or effect.

---

## Next up (in rough priority — "keep adding to it")

1. **Playlist / Song mode** — the 4th tab is still a placeholder. Arrange pattern blocks on a
   timeline (intro→verse→hook) + a PAT/SONG toggle. Data model already supports it (patterns are
   self-contained); needs the UI + a song-aware scheduler path + song-aware export.
2. **Hi-hat rolls** — sub-step retrigger w/ velocity ramp (right-click a step → roll). The single
   biggest "this feels pro" drum detail still missing.
3. **Kick→808 sidechain "duck"** — one-knob pump (envelope-follower or kick-triggered gain dips).
4. **BPM-synced delay** — Delay time as note divisions (1/8, dotted, triplet) off `project.bpm`.
5. **Per-channel mixer meters** — tap each fader with an analyser, animate in `uiTick` when Mixer is open.
6. **Third-party *instruments*** — extend the register pattern to generators (today: drag-drop
   samples + load FX `.js`); long-term **WAM2** host for real browser VSTs.
7. **Stems export** + a bars/loops chooser in the Export dialog.
8. **More instruments via the registry** — 909/808 kits, pluck/lead, supersaw, multi-osc, an FPC-style
   drum-pad grid. Each is one `INSTRUMENTS` entry.

## Files touched
- `static/beats.html` (new — the whole room)
- `static/index.html` (nav link + tip)
- `static/kit-helper.js` (`ROOMS.beats`)
- `app.py` (`/api/beatbrain` endpoint, `ROOM_HELP["beats"]`, `room_labels["beats"]`)

> `app.py` changed → **restart the app once** to pick up `/api/beatbrain` (it's purely additive).
> `beats.html` is served fresh per load.
