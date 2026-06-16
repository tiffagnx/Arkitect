# THE STUDIO — Project Plan & Progress Log

The master doc for the long build. This is the studio's brain — vision, design
rules, roadmap, and a running log so the work stays coherent across many sessions.
Read this first when picking the project back up.

> B's directive (2026-06-16): "Studios don't take five minutes." This is a
> continuous, long project. Expect hiccups. Keep going, ship working increments,
> verify in the browser, commit each step. Don't break what works — fix forward.

---

## 1. THE VISION

A **professional, masculine, fully-local** audio studio in the browser (`static/studio.html`)
that stands next to the big tools — not a toy. The pillars:

1. **A real DAW** — clips, edit + mix windows, plugins, routing, export. *(done — see log)*
2. **Custom plugins, each with its own face** — and exportable as real **VST3** so they
   work in any DAW (Pro Tools via a VST wrapper, AAX later). *(Faust port started — `vst/`)*
3. **A "supreme Melodyne"** — load a vocal, see the notes, drag to retune, snap to key,
   pitch it. Instant, easy, better-or-equal to the big ones. *(next big build)*
4. **Generate sounds on the fly** — highlight an empty spot, type the SFX you want, it
   drops in place. *(queued)*
5. **A Tiff "mix assistant"** — Neutron-style: she listens, classifies, suggests moves,
   and shows her thinking. Foundation already exists (Auto-mix). *(evolve)*

The bar B set: **research how the big ones do it, build it, test it, A/B it against
the big ones, make sure ours is better or equal.**

---

## 2. DESIGN SYSTEM  (locked 2026-06-16 — B: "make it a man's UI, kill the pink")

Pink/girly is OUT. Pro graphite + steel. Research-backed (Material dark theme; dark-UI
best practices — dark gray not black, desaturated accents, 4.5:1 contrast).

**Palette (CSS vars in `studio.html :root`):**
- Backgrounds (elevation grays): `--bg0 #0C0D10`, `--bg1 #15161A`, panels `rgba(24,25,30,.86)`, surfaces ~#1E1E23 / #26262C.
- Hairline: `rgba(255,255,255,.07)`. Text `#E9EAED`, dim `rgba(198,201,208,.52)`.
- **Primary accent = desaturated steel-cyan `#3E9CB8`** (was hot pink `#E91E8C`). Reads "control/pro," easy on the eyes for long sessions.
- Functional-only color: **amber** `#D9A441` (meter mids/warnings), **red** `#E5565B` (record/mute/peaks). Never candy.
- **Per-plugin faceplates carry their OWN hue** (cohesive desaturated set) so each plugin feels custom and is ID-able at a glance — EQ=blue, Comp=green, Saturator=amber, Verb=steel/violet, Delay=cyan, etc. *(TODO — see roadmap)*

**Rules:** dark gray surfaces (not black); ONE restrained accent + functional amber/red;
high contrast text; structured, user-friendly, feels like pro gear, not makeup.

---

## 3. ROADMAP

**Phase A — DAW core.** ✅ DONE. Clip model, edit/mix windows, plugins+faceplates, FX
buses + sends + output routing, AudioSuite, zoom/snap/resize, tap/auto-tempo, key detect.

**Phase B — Pro re-skin.** ✅ graphite+steel + per-plugin colors done.

**Phase B2 — PRO TOOLS EDIT-WINDOW LAYOUT** ✅ DONE (B's locked spec, 2 PT screenshots). The
controls go on the LEFT of each lane, inline — NOT a shared right panel (that was the
mistake; right panel = Mix-window idea). Each track = a row:
  - LEFT control strip, SAME HEIGHT as the lane (grows when you resize the lane taller):
    track NAME (dblclick rename), M/S/R, a VOLUME widget (shows the number; press → fader
    reveals, drag = live number), PAN (L/R). 
  - INSERT SLOTS A–E stacked next to it: click empty → dropdown of plugins → loads there;
    click filled → opens it; ✕ removes.
  - Then the WAVEFORM, GRIDDED (snap select 1/16, 1/32, 1/64), with horizontal zoom +
    AUDIO (vertical) zoom up top.
  - SMART TOOL (selector + grabber combined).
  - Left rail (Output etc.) → collapses to a top dropdown "Output".
  - Kill the confusing right "Channel · output master" panel.
  Bar: superior to Pro Tools but still that professional. B: "we're almost there."

**Phase C — The Melodyne.** 🔶 IN PROGRESS.
  1. ✅ Mono pitch detection (YIN) + note segmentation (median-filter + consolidation).
     Verified: synthetic melodies detected EXACTLY (note-for-note). `detectPitchTrack`,
     `segmentNotes`, `keyFromNotes`.
  2. ✅ Note blobs drawn on a piano-roll grid over the clip (key-scale shaded). "🎵 Tune"
     button in the clip panel → `openTune`/`renderTune` (#tunewin).
  3. ✅ DONE: drag a blob → retune (granular/PSOLA pitch-shift the segment), snap to key.
     Add a KEY OVERRIDE dropdown (key auto-guess leans to the relative minor on bare
     melodies — let the user set the scale, like real Melodyne).
  4. ⬜ Whole-clip pitch + formant control. Apply writes back to the clip buffer.
  5. ⬜ Push retune toward transparent; A/B vs real Melodyne.

**Phase D — Generate-a-sound.** ⬜ Highlight empty spot → right-click → type → drops a
clip. UX rides the clip model (easy). Engine fork: free-local model (Stable Audio Open /
AudioGen) vs instant cloud API (ElevenLabs SFX). B to pick (cost-sensitive).

**Phase E — VST export.** 🔶 STARTED (`vst/` Faust sources). Port every plugin to Faust →
export `.vst3`. Then JUCE for the badass custom UIs + AAX (Pro Tools).

**Phase F — Tiff Mix Assistant.** ⬜ Evolve Auto-mix into a Neutron-style assistant:
classify the track, propose a full chain, show the reasoning, let her "think."

---

## 4. ARCHITECTURE NOTES (where things live)

- Everything in `static/studio.html` (one file, vanilla Web Audio API, no deps).
- Clip model: `t.clips=[{id,buffer,start}]`; `buildTrackGraph` schedules one source/clip.
- Plugins: `TIFF_PLUGINS.register({name, subtitle, foot, params, create(ctx)})`. Faceplate
  auto-built (`openPluginWindow`) with rotary knobs.
- Tempo/key: `detectTempo` (onset autocorrelation), `detectKey` (chromagram → Krumhansl
  Pearson). Reuse `_fftRadix2`.
- VST: `vst/*.dsp` (Faust) → export at faustide.grame.fr → `.vst3`.

---

## 5. RESEARCH LOG

- **Dark UI:** dark gray not black; #121212-style base + elevation layers; desaturated
  accents (saturated = eye strain + fails WCAG 4.5:1). [Material](https://m2.material.io/design/color/dark-theme.html), [Toptal](https://www.toptal.com/designers/ui/dark-ui-design), [atmos](https://atmos.style/blog/dark-mode-ui-best-practices)
- **Per-plugin color = pro practice** (ID at a glance; blue/green=control, amber=drive). [TL Audio](https://www.tlaudio.co.uk/how-sound-and-color-work-together-in-modern-brand-identity/)
- **Neutron Mix Assistant:** listens → ML-classifies instrument → groups (voice/bass/perc/
  musical/focus) → proposes processor settings toward a target; Target Library teaches it
  your spectral goal. [iZotope](https://www.izotope.com/en/learn/behind-the-technology-of-mix-assistant)
- **Melodyne / pitch (to research deeper before Phase C):** YIN/pYIN pitch detection;
  PSOLA / WORLD vocoder for formant-preserving pitch shift.

---

## 6. PROGRESS LOG (newest first)

- **2026-06-16** — MELODYNE drag-to-retune SHIPPED: Tune notes are draggable (targetMidi),
  scale-snap to a KEY OVERRIDE dropdown, ghost+connector shows the move, Apply pitch-shifts
  each moved note's segment (fxPitchBuf granular) + crossfades back into the clip, undoable.
  Verified: dragged C->G (+7), re-detecting the rendered audio = [67,62,64] (real pitch moved).
  Plus B's plugin-loader dedupe (re-loading a plugin won't pile up duplicates).

- **2026-06-16** — Edit-window rebuild COMPLETE: MASTER lane -> strip format (VOL/CEIL
  press-drag widgets + inline mastering insert slots, bindMasterStripCtl/renderMasterSlots
  + masterinfo). SMART TOOL on the waveform: near a clip edge = TRIM that edge (sample-
  accurate bufSlice, undoable), middle = grab/move, empty = playhead; cursor feedback
  (ew-resize near edges, grab on a clip). Verified: master strip + vol drag + mastering
  slot, trim shortened 4.0->3.65s. Phase B2 (Pro Tools edit window) = DONE.

- **2026-06-16** — Edit-window cont'd (2): left rail -> a top ⚙ Setup DROPDOWN (rail is
  position:fixed, opens on the button, click-outside closes) so tracks get full width.
  Press-to-reveal FADER on the strip VOL/PAN (.ts-pop vertical fader appears on press,
  drag w/ live number). Verified. Remaining: master lane -> strip format, smart tool.

- **2026-06-16** — Edit-window cont'd: KILLED the confusing right Channel knob panel for
  stems (right side = Output + Sends + Clip tools; vol/pan/plugins live on the strip). Added
  GRID selector 1/4-1/64 (drawGrid bar/beat/sub emphasis + snapTime use gridStep) + AUDIO
  (vertical) zoom (vZoom in drawClipWave). Aux/Master lanes fixed for the flex layout.
  Next: smart tool, press-reveal fader polish, master lane -> strip format, left-rail dropdown.

- **2026-06-16** — Started the PRO TOOLS EDIT-WINDOW rebuild (B's 2 screenshots): each lane
  is now [control strip LEFT | waveform RIGHT]. Strip = name (dblclick rename), M/S, VOL +
  PAN drag widgets, and inline INSERT SLOTS A-E (click empty=dropdown, filled=open, x=remove),
  sized to the lane (grows w/ the ↕ height). Default lane height bumped to fit. Next: slim/kill
  the redundant right Channel panel, waveform GRID + audio(vertical) zoom, smart tool, fancy
  fader-reveal, master lane to match.

- **2026-06-16** — MASTER reworked into a TRACK in the edit window (B + research: the
  master bus IS a track w/ its own inserts/fader). Removed from the left rail; a gold
  MASTER lane sits at the bottom, the whole mix sums into it (master.sum → master chain
  → volume → limiter → out, real-time + export). Channel = VOLUME + CEILING KNOBS +
  a mastering insert chain. Added mastering plugins (Master EQ, Glue Comp, Maximizer)
  in pro order. Verified: Maximizer drove the full mix 0.21→0.66 RMS; sound + play intact.
- **2026-06-16** — Removed the pink nav orb from the studio (B: "should never have been
  there"). Started Phase C (Melodyne): YIN pitch detection + note segmentation (median +
  consolidation) — synthetic melodies detected exactly; piano-roll Tune view (🎵 Tune
  button) draws the notes with key-scale shading. Per-plugin faceplate colors (each plugin
  its own hue). Next: drag-to-retune + key override.
- **2026-06-16** — Pro re-skin: ripped pink out of the whole Studio → graphite + steel-cyan
  (research-backed dark UI). Removed "Plugins loaded" clutter + orphan verb button; tempo/
  count-in sliders → typed BPM + TAP + AUTO-tempo + KEY detect. Created this plan doc.
- **2026-06-15** — Zoom/scroll/snap/resizable lanes. AudioSuite. I/O routing. Mix-window
  console + red Master. Clip model + per-clip FX. Plugin faceplates. Real TIFF VERB restored.
  Open-sourced (MIT + owner.md privacy split). Started VST/Faust port (`vst/`).
