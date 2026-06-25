# THE KITCHEN — handoff

## ⏩ LATEST — Session 2 (2026-06-25 eve): clarity fix + SONG MODE + generators + MIDI

Owner's ask: "go in the Kitchen, research what the big places are doing, and overkill it —
make it undeniably powerful." PLUS a real usability report from him (the target user, a Pro
Tools mixing engineer who is NOT a beatmaker): he was confused how the **Channel Rack steps**
and the **Piano Roll** connect for the 808 — *"if I play something on the piano roll, where do
I put it on the 808? Do I click the 808 buttons?"* He'd deduced (correctly) that once you put
piano-roll notes on, the steps stop mattering. That confusion was the #1 thing to fix.

Ran a research workflow (FL Studio 21 / Ableton 12 / Maschine / Logic / BandLab+Soundtrap /
Serato+Koala / Splice). Verdict: **song/arrangement was the gaping "toy vs pro" hole**, then
automation, sampling-record, per-step graph editor, and targeted AI generators. Built the top of
that list this pass. **All verified in Chrome (offline render + DOM + MIDI byte-parse), zero
console errors. Uncommitted** (parallel Stream session live; owner batches — see
[[parallel-session-coordination]]).

**Shipped this pass (all `static/beats.html`):**
1. **Piano-roll ⇄ Channel-rack clarity (the reported confusion).** The engine already did the
   right thing (a melodic channel with notes plays the notes, ignoring its steps — `scheduleStep`
   line ~1455). Now it's VISIBLE: when a melodic channel has notes, its rack row flips to a
   **locked melody-preview** (`.melody-locked` — dimmed step cells, lit cells where notes start
   with a pitch tick), sub-label shows `🎹 melody · N notes`, the 🎹 button lights, and an `↺`
   appears to clear the melody back to step mode (the old steps are preserved). The Piano Roll
   has a plain-English **banner** ("This *is* the 808's part — every note you draw here plays the
   808… left→right time, up→down pitch… while a melody lives here the steps switch off"). Velocity
   lane now shows NOTE velocities for a melody-driven channel.
2. **🎼 SONG / ARRANGEMENT MODE (the #1 gap — the Playlist is real now).** `project.song =
   {clips:[{pat,bar}], lenBars}`. A pattern-matrix timeline (rows = patterns, cols = bars); click
   a cell to drop a pattern's clip; stack rows to LAYER patterns; multi-bar patterns span bars.
   PAT/SONG toggle switches playback; `▶ Play song`; `⤓ Export song`; live playhead. Engine
   refactored to a shared `triggerPatternStep(pat,li,base)` used by **live PAT, live SONG, and the
   offline bounce** — so what you hear == what exports. **Verified:** an 8-bar arrangement bounced
   sample-accurate (audio only where clips are, silence where they aren't, 0 clipped samples).
   Persists in save/load + undo.
3. **✨ Generative "stuck-buster" tools** (for a non-beatmaker). Piano-roll **✨ Gen** pill →
   Chords / Melody / Arp (in the current key, fully editable, regenerate freely). Tools menu adds
   **Euclidean fill** for drum channels (2–11 hits spread evenly). Reuses the Cook composer's
   theory tables (`degMidi`/`triadAt`/`PROGRESSIONS`/`mulberry32`).
4. **🎼 MIDI export (.mid) → Pro Tools.** File/Tools menu. Drums → GM ch.10, melodic → own ch.
   Exports the current pattern, or the whole arrangement in song mode. **Verified:** valid SMF
   (format 0, TPQ 480, balanced note-on/off, correct tempo meta, end-of-track). This is the
   bridge that makes the Kitchen a sketchpad that feeds his real session.
5. **🎚 STEM export (drums / bass / melody / loops).** File/Tools menu. Bounces each group as a
   SEPARATE WAV via a `_renderOnly` channel filter on the offline render. Renders **dry** (master
   volume only, no master limiter/safety) so stems sum back cleanly in Pro Tools. **Verified:**
   clean isolation — the drums stem is dead-silent where only melody plays and vice-versa.
6. **📊 Per-step GRAPH EDITOR (the FL drum-programming superpower).** The velocity lane now has a
   **VEL / PITCH / CHANCE** toggle. **PITCH** = tune each hit ±12 semitones (bipolar bars + a
   center "no-change" line; works on tonal sounds — 808s/toms/melodic-on-steps — pure kick/snare
   ignore note, by design). **CHANCE** = per-step probability → evolving, un-robotic patterns
   (gated in `triggerPatternStep` via `stepFires()`). Per-step `pitch`/`chance` live on the step
   object → auto-saved + undoable. **Verified:** chance 30%→31% over 2000 rolls, 0%/100% exact;
   +12st on the 808 = +39% zero-crossings; clean offline bounce.

7. **🎚 AUTOMATION lanes (the "movement over time" piece).** The graph editor toggle gains
   **🎚FLT** and **🔊VOL** — draw a curve (one point per step) for the selected channel's filter
   cutoff or volume, ramped through the bar in playback AND the bounce. Filter = the classic
   build/drop sweep; volume = swells/ducks. Rides DEDICATED chain nodes (`ch._filter` lowpass +
   `ch._autoGain`, inserted `_choke → _filter → _autoGain → _pan → _fader`) so automation never
   fights the mixer fader; both default transparent so un-drawn channels are untouched. Stored as
   `pat.autos = { 'chcut:<id>'|'chvol:<id>': [pts 0..1] }` (`applyAutomation()` / `autoMap()` /
   `autoParam()`; reset via `resetAutomationNodes()` on play start/stop). Saved + undoable.
   **Verified:** isolated-hat filter sweep goes bright→silent across the bar; kick volume ride
   0.197→0.050; default bounce unchanged (peak 0.914).

Engine note: live playback + every bounce (full / song / stems) share `triggerPatternStep` +
`applyAutomation`, so per-step pitch/chance/humanize, the arrangement, AND the drawn automation
all render identically to what you hear.

**Seams to extend (unchanged):** instrument = 1 `INSTRUMENTS` entry · FX = 1 `R({...})` · genre =
1 `GENRES` entry · **song clip logic = `triggerPatternStep` + `activeClipsAtBar`** (live + bounce
share these) · generators reuse `degMidi`/`triadAt`/`PROGRESSIONS`.

**NOT done — next (from the research gap list, priority order):**
1. **Audio RECORD** (mic/line capture + resample-through-FX) — the sampling workflow's missing half.
   (Mic auto-grant already shipped in v1.9.1.) Can't be verified headless — needs a live mic.
2. **Groove templates** (steal swing+velocity off a loop, stamp it everywhere).
3. **AI stem separation** (flip any song) — HIGH wow but needs an ML model (not pure Web Audio).
4. Automation niceties: more targets (pan, master, per-insert-FX param), song-length automation
   curves (current automation is per-pattern), a pan lane in the graph editor.
5. Song-mode polish: drag clips, clip resize, copy/paste bars, the rack auto-following the playing
   pattern. MIDI/stem niceties: multi-track MIDI (one track per instrument).

The core research gap list is now CLOSED — clarity, song mode, generators, MIDI, stems, per-step
graph editor, and automation all shipped this pass. What remains is recording (needs a mic),
groove-steal, AI stem-sep (needs ML), and polish.

---

# THE KITCHEN — all-night "soup it up" pass (2026-06-25)

The Kitchen (`static/beats.html`) — DeMartinville's beat maker — got a big upgrade pass aimed at
making it "the best parts of every beat program combined" and a thing **Boogie** says *holy fuck* to.
Everything below is BUILT + verified in Chrome (offline-render smoke tests; realtime clock is frozen
headless, that's an env limit not a bug). Zero console errors. Owner was asleep; built autonomously
on his standing "work all night, keep going, don't ask" instruction.

> Cold start: this file + `BEAT_LAB_HANDOFF.md` (older, the room's origin). The room is now branded
> **"The Kitchen."** One self-contained file, pure Web Audio, no samples needed.

## What shipped this pass (all in `static/beats.html`)

1. **8 new effects → 18 total.** All on the same `TIFF_PLUGINS.register` contract (knobs + AI brain
   + mixer slots free), each with a knowledge card so the in-plugin brain works automatically:
   **DeMartin Pump** (sidechain — scheduler-driven, ducks on the grid, phase-locked; in playback + bounce),
   **Bitcrusher**, **Phaser**, **Flanger**, **Stereo Width** (M/S with mono-below), **Auto-Pan/Tremolo**,
   **Ping-Pong** (BPM-synced note divisions), **Tape** (lo-fi sat + wow/flutter + age), **Transient** (punch/sustain shaper).
2. **Hi-hat rolls / ratchets.** Scroll any lit step to cycle roll count (1·2·3·4·6·8); sub-hits
   retrigger inside the step with a crescendo. Works in playback AND the WAV bounce. `rollHits()` +
   `triggerStepHits()`/`triggerSliceHits()`; visual markers via `paintStepCell()`. Persists in save/undo.
3. **Choke groups + per-channel humanize.** Closed hat chokes the open hat out of the box (a `_choke`
   gain node in the channel chain; `applyChoke()`). Humanize = live timing+velocity drift (re-rolled
   each loop, kept OFF the kick). Both have controls in every instrument window + persist in save/load.
4. **🍳 THE AI COMPOSER ("Cook a Beat") — the headline.** Type a vibe → a whole beat in key
   (drums w/ rolls+choke+humanize, an 808 that follows the chords, a diatonic chord progression, an
   in-key melody). **Deterministic music-theory engine = the floor, so it works identically on ANY
   model tier** (a 4B local model or Claude — the craft lives in the tables, not the model). 12 genres
   (`GENRES` table), `PROGRESSIONS`, `parseVibe()` keyword parser, `composeBeat()` orchestrator, seeded
   melody walk. Toolbar **🍳 Cook** button + Tools menu. Exposed to Kit/agents via **`window.RoomAPI`**
   (`cook/groove/setTempo/setKey/humanize/randomize/play/stop`) — coarse verbs so weak models stay useful.
5. **Master soft-clip safety ceiling.** New final master stage (`masterSafetyCurve()`, both live +
   bounce). Transparent below 0.7, tanh knee capping just under 1.0 → stacked AI-composed beats never
   hard-clip. Cooked beats now bounce at ~0.93 peak, **0 clipped samples**, across every genre.
6. **Wavetable engine + 23 new browser instruments → 105 library / 24 engines.** `wt` = morphing
   PeriodicWave (saw→square→tri→formant, crossfades over the note). Plus 909/808 drum-machine voices,
   congas/bongo/clave/tambourine, hypersaw, wavetable presets — all in the Browser.
7. **Live mixer meters.** Post-fader `AnalyserNode` tap per channel, animated in `uiTick` only while
   the Mixer is open (`ch._meter`/`ch._meterEl`).
8. **True 808 slides.** Legato 808 notes in the piano roll glide FROM the previous note (`noteGlideFrom()`
   + the 808 trigger takes `ch._glideFrom`). Drill/plugg/phonk cooks set glide, so their 808s slide automatically.
9. **De-purple polish.** The Kitchen was the only purple room (owner flagged it). Swept all hardcoded
   purples (knobs/faders/velocity bars/menus/windows/scrollbar) to the teal/cyan family. Now cohesive.

## How to extend (unchanged seams)
- **New instrument** = one `INSTRUMENTS` entry (+ optional `PRESETS[type]`, `BRAIN_CARDS[type]`, type in
  `DRUM_TYPES`/`MELO_TYPES`, `LIBRARY` rows). Knobs/brain/mixer/save all automatic.
- **New effect** = one `R({name,icon,knowledge,params,create})` block.
- **New genre** = one `GENRES` entry (chips + parser auto-pick it up) + a `parseVibe` keyword row.

## NOT done — next session (priority order)
1. **Song / arrangement mode.** The Playlist window is still a placeholder. Needs `project.chain`
   (cheap win) → full timeline. Deferred because realtime scheduler changes can't be verified headless
   (no audio device) and I won't ship unverifiable playback. The offline `renderPatternWav` could be
   extended to bounce a chain (that IS verifiable). This is the #1 gap.
2. **Kit truly "trained" to run the room.** `window.RoomAPI` is the hook; wiring Kit's brain to emit
   `action` blocks that call it needs `app.py` (`/api/kit` ROOM_ACTIONS for beats) + `kit-helper.js` —
   both touched by parallel sessions tonight, so I left them alone. Mirror the `images`/`character` pattern.
3. Per-step pitch/pan automation; drawn automation lanes; aux/return sends; Web-MIDI / keyboard recording.

## ⚠️ Coordination note
Built alongside a **parallel "Stream/Notifi" session** (it owns `app.py`, `stream.html`,
`stream-publish.js`, `STREAM_HANDOFF.md`). I committed **`static/beats.html` ONLY** and touched nothing
of theirs. The one non-mine line in beats.html — `publishBeatToNotifi()` (their stream publish hook) —
was preserved intact. **Did NOT** deploy the website or cut a release (those await the owner's "go").
