# Beat Lab — the MOAT roadmap

Buggy's idea (the producer who actually uses these): every DAW has **one signature strength
its competitors can't touch — its "moat."** Take the best moat from each and put them all in
Beat Lab, but each moat must be UNIQUE (if two DAWs share a strength, the best one owns it and
the other gets a different moat). Researched 2026-06-21 (workflow wf_b64237c8-000).

## The de-duplicated MOAT MAP
| DAW | Its unique moat | What we build |
|---|---|---|
| **Ableton** | **Auto-Warp** — drop any audio, it auto-syncs to tempo & grid | **DeMartin Warp Sampler** (BUILDING — v1) |
| **FL Studio** | The **Piano Roll** + pattern→playlist workflow | Have it; upgrade: chord stamps, ghost notes, strum, slide |
| **Akai MPC** | The **swing groove** (Roger Linn's invention) | Finish the swing engine + per-channel swing + 16-Levels |
| **NI Maschine** | **Smart-Play pads** — every pad guaranteed in-key | 4×4 pad window mapped to the scale + one-pad chords |
| **Serato** | **Auto-KEY detect + project-wide Scale-Lock** | Detect key on drop → Project Key → everything plays in key |
| **Reason** | **Patch cables** — visible modular routing | Flip-rack cable view over the Web Audio graph |
| **Logic** | **AI Drummer** — direct a human-feel drummer with an X/Y pad | Session Drummer window writing grooves into the pattern |

**Overlap rulings:** stretch→Ableton (Serato demoted to KEY). swing→MPC (Maschine demoted to in-key pads).
in-key playing split by surface: FL owns it in the roll, Maschine on the pads, Serato project-wide.
chopping→MPC (one-shots chop to pads); warping→Ableton (loops warp). Same 4×4 grid, MPC=feel, Maschine=in-key.

## Build order (impact × feasibility)
1. **Ableton Auto-Warp Sampler** ← owner's pick, building now (v1 = Re-Pitch + BPM detect)
2. **MPC Swing** (easy — scaffold already in `stepTime()`)
3. **Serato Auto-Key + Scale-Lock** (moderate — chroma + Krumhansl, ~100 lines, no deps)
4. **Maschine Smart-Play pads** (easy — scale arrays + the Project Key from #3)
5. **FL piano-roll upgrades** (easy — chords/ghost/strum/slide on the existing note model)
6. **Logic AI Drummer** (moderate — weighted pattern blending, no ML)
7. **Reason patch-cables** (hard — SVG cables = `connect()`/`disconnect()`; last)

## Warp Sampler — the plan
Drop any audio → auto-detect BPM → time-stretch to the project tempo → loops locked to the bar grid
as a channel. **v1 (Re-Pitch):** `playbackRate = projBPM/clipBPM` (native, artifact-free; pitch moves
with tempo — a real Ableton mode). **v2 (Keep-Pitch):** add `signalsmith-stretch` (MIT WASM, transient-aware
— the ONE dependency worth adding) + draggable warp markers + bake committed warps through OfflineAudioContext.
**v3:** auto-key label + Key-Follow + chop-to-pads handoff.

**Self-contained constraint:** the app is one offline HTML file, so v1 BPM detection is implemented
INLINE (autocorrelation on an onset envelope — no library). signalsmith (v2) gets inline-base64'd/bundled,
not CDN-loaded, when we add Keep-Pitch.

**Gotchas:** never `setTimeout` to play audio (use the lookahead scheduler). Re-Pitch has zero artifacts;
time-domain stretchers smear drums → Keep-Pitch must be transient-aware. BPM detect is statistical
(half/double errors) → always expose ×2/÷2 + tap-tempo. Decode/analyze once on drop, off the audio thread.

*Hooks into: `INSTRUMENTS` registry, `newChannel`/`addCh`, the lookahead `scheduler()` (swing in `stepTime()`),
`loadSampleFile`/drop handler, the piano roll + `SCALES`/`inScale()`, `OfflineAudioContext` bounce, and the
`flMakeWindow` floating-window shell — no architectural rewrites.*
