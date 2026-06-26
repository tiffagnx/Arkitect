# DeMartin Studio — Agent Mixing/Production Suite · HANDOFF (2026-06-26)

Built after the owner studied **Mixstein** (a YouTube "AI mixes for you" demo = Claude + an Ableton MCP + a taste-prompt) and **ACE Studio** (AI vocal workstation). Goal: do all that **inside our own DAW**, agent-driven, mostly **key-free DSP**, and **honest** (measured, not claimed). Owner said "go down the list A→Z." All four fronts shipped + browser-verified.

> ⚠️ **UNCOMMITTED.** Files: `static/studio.html`, `static/agent-dock.js`, `app.py` (one new endpoint). Parallel sessions also touch app.py — commit only these three (explicit paths), don't `git add -A`. **app.py change = restart the server to load it** (no --reload).

## What shipped — agent commands (snap an agent into the studio, then TELL it)
All wired in `agent-dock.js` `DMV_DOCK_FIX` (regex → a `window.studio*` function in `studio.html`). Each returns a chat reply.

**Earlier (already shipped this session):** session **gain-stage** (`studioGainStage` — trims every track, re-renders the master to prove headroom) and **recipes** (`studioRecipe` — 90s Dimension / Boom-Bap Glue / Modern Wide, roll-aware per-track/bus). Roll classifier `_ssRole` + helpers `_ssAudioTracks`/`_ssTrackClips`/`_ssSelClipBuf`/`_ssSelTrack`/`_newBufTrack`.

**Front A — AI-vocal (the ACE lane, our way; pure DSP, no key):**
- `studioHarmonize(set)` — pitched copies (safe 5th+8va / triad / minor / octave / thick) → harmony tracks, panned + tucked −7 dB. Cmd: "harmonize / add harmonies / third and fifth".
- `studioChoir()` — 6 detuned + time-offset voices spread stereo + octaves → one stereo "Choir" track. Cmd: "make a choir / gang vocal".
- `studioVocoder()` — 12-band offline vocoder (carrier sawtooth, modulator = the voice) → "Vocal Synth" track, peak-normalized. Cmd: "turn my voice into an instrument / vocoder / talkbox".

**Front B — mixing tricks:**
- `studioPultec()` — NEW master plugin **"Pultec Punch"** (low-shelf boost @60 + peaking scoop @~200) added to the master. Cmd: "pultec the master / thicken the low end".
- `studioParallel(flavor)` — new aux "P-Sat/Drum Smash Bus" (EQ-6 HPF → DeMartin Drive) + a pre-fader send (0.28) from the selected/role tracks. Cmd: "parallel-sat the vocal / smash the drum room".
- `studioPump()` — bakes a tempo-synced gain duck onto the bass (sidechain-pump feel; honest: beat-locked, not kick-transient-keyed). Cmd: "duck the bass / sidechain / pump the bass".

**Front C — creative FX (operate on the selected clip):**
- `studioStutter(opts)` — beat-repeat: capture a slice, re-stamp N× with shrink+pitch+decay → rebuilds the clip buffer. Cmd: "stutter / beat-repeat / glitch it".
- `studioDrop()` — build-to-a-drop: LP-sweep + duck the source, overlay a rising noise riser, end on a breath of silence. Cmd: "build to a drop / build up".
- `divSec(beats)` helper added near `curTempo()` (tempo-locks the above).

**Front D — AI sound-FX (BYO-key):**
- NEW `app.py` `POST /api/sfx` — proxies **ElevenLabs** `v1/sound-generation` on the user's own key (read from `_gen_keys_load().get("elevenlabs")`), returns base64 mp3. Clean error when no key.
- `studioGenSfx(prompt)` — fetch /api/sfx → decode → drop a clip at the playhead. Cmd: "drop a whoosh/riser/braam / generate a sound / sfx: <prompt>".
- **TO LIGHT IT UP:** the owner adds an **ElevenLabs key** in the keys hub under provider `elevenlabs` (paid plan = owns the output; don't resell raw sounds as a pack). Keys-hub UI may need an `elevenlabs` field added (the endpoint already reads that slot).

## Verified (port 7799, throwaway tracks, owner's autosave "Lead Vox" untouched)
Gain-stage (master → −5 dB measured), recipe (roll-aware, bass skipped), harmony (2 tracks), choir (stereo, 6 voices), vocoder (real audio, peak 0.69), Pultec (master insert), parallel-sat (aux+send, sendHitsAux), pump (bass onset ducked 0.08 vs mid 0.18), stutter (clip rebuilt), drop (riser + end-silence), SFX (no-key error clean + mocked decode→drop). Console clean throughout.

## Gotchas
- **Preview caches `agent-dock.js?v=N`** — the version bump + reload often races, so the browser holds the old agent code. VERIFY by calling the `window.studio*` functions DIRECTLY (studio.html reloads fine); the agent regexes are confirmed on disk + `regexTest`. Real app loads fresh.
- Never `save()`/autosave over the owner's project; tests clear tracks + reload.
- `studioPump` is a baked tempo-pump (not a live kick-keyed dynamic EQ — that needs the `buildTrackGraph` two-pass sidechain wiring; the Compressor already has a working `sidechainInput`, see the 15-tricks research). Next-level upgrade.
- Vocoder envelope scale (`env.gain=10`) + Pultec defaults are tuned blind — owner's ears may want tweaks.

## Next (researched, not built)
HPF/darken reverb sends (touches the shared verb graph + bounce parity), reverse-reverb intro PRE-ROLL mode (extend `clipFx_revReverb` with `divSec`), cinematic SFX stacker (extend `generateSfx` w/ reverse-cymbal/boom/sub), diatonic harmony (use the existing per-note MIDI detection), true kick-keyed sidechain dynamic EQ. Full plans in the three research agent reports (this session) + `3d-and-fill-build-spec.md` sibling.
