# Leon Production Labs — AI Production Suite (cold-start handoff)

**Shipped in v2.7.0 (2026-06-26).** The owner's ask: *"go to the production hub and add every AI capability you can, like we did the audio labs… use vocals to make instruments, generate instruments, add sound effects, the works. Compatible with the audio labs, seamless, MCP-ready, and Tiff & Kit can drive everything."*

Done. `static/beats.html` (Leon Production Labs) now has the same agent-driven AI layer the Studio got — mirroring `static/agent-dock.js` + the `window.studio*` suite.

## Architecture (one source of truth)
- **`window.RoomAPI`** (in beats.html) — the single documented command surface. 23 verbs. `RoomAPI.describe()` returns a self-manifest an MCP introspects; `RoomAPI.state()` returns live beat state. **Local-first**: the music engine is deterministic theory, so every verb works with NO model. An MCP or the in-room agent calls the same verbs.
- **`static/beat-dock.js`** (NEW, twin of `agent-dock.js`) — natural-language front door. Exposes `window.DMV_DOCK_FIX(text, agentId)` — the hook `kit-helper.js` calls FIRST on every send (line ~864 of kit-helper.js). If the text is a production command it acts and returns `{handled:true, reply}`; otherwise `{handled:false}` → the brain answers. Per-agent taste (Kit = precise/technical, Tiff = loose/vibey). Defers real questions ("how do I…") to the brain.
- **`window.beat*` aliases** mirror studio's `window.studio*` (beatCook/beatAddInstrument/beatDesign/beatGenerate/beatVocalToInstrument/beatSfx/beatShape/beatMix/beatRecord).
- **`window.dmvSessionSnapshot()`** — hands the brain the real beat state (session-aware chat, like the Studio).

## What got built (all in beats.html, new block just before the pinkroom-nav loader)
- 🎤→🎹 **Vocal→instrument** `vocalToInstrument({mode:'synth'|'chop', riff?})` — turns a loaded/recorded voice into a playable, in-tune sampler (autocorrelation pitch-detect → `root`) or a chopped Slicer. Source = selected/last sample channel, or the last mic recording.
- 🔊 **SFX** `sfx(promptOrKind)` — free synth bank (OfflineAudioContext): riser, downlifter, impact, braam, subdrop, whoosh, sweep, reverse, vinyl, buildup, zap, blip, boom. Anything else → ElevenLabs (`/api/sfx`, BYO-key). Drops a sample channel + fires it on the downbeat.
- 🎹 **More instruments** — NEW `vox`/choir engine (formant-filtered saw ensemble) + **Vocal** & **World** library categories + more bass/keys/leads/drums. **147 library instruments** total. `addInstrument(name)` (fuzzy + family aliases), `designInstrument(desc)` (adds a base + sculpts knobs to a vibe).
- 🎼 `generate(part, target?)` — drums / bassline / chords / melody / hats / arp (wraps the existing genChords/genMelodyPart/genArp/genEuclid/generateGroove).
- 🎚️ `shape(target, direction)` — punchier/brighter/darker/fatter/wider/longer/tighter/dirtier (sculpts an existing channel's knobs, clamped).
- 🎛️ `mix(move)` — sidechain/pump, glue, saturate, widen, lofi, reverb (probes the dynamic FX bank from `/api/plugins/bundle.js` by candidate name).
- 🎙 `record(seconds?)` — mic → sampler channel. Wired the previously-dead ⏺ (#bRec) button.
- Transport/tempo/key/swing/humanize/randomize, bounce/exportStems/exportMidi (existing, now in RoomAPI + dock).

## Cross-compat with DeMartin Audio Labs (seamless — automatic)
The Studio embeds beats via `<iframe src="/static/beats.html?host=studio">` and "⤓ Send to Studio" calls the frame's own `renderPatternWav(4)` + `wavBase64()` (studio.html ~line 4748). **Everything the AI builds is a standard channel that flows through `renderPatternWav` — so it already rides into the Studio with zero new code.**

## Verification (port 7799, `editor-preview` in .claude/launch.json)
35/35 functional checks passed, ZERO console errors: cook a full 7-channel beat, addInstrument/designInstrument, generate ×4, shape ×2, vocalToInstrument synth (tuned a 220Hz test voice → A3) + chop, 5 SFX synth kinds, all 6 mix moves, dock NLU ×9 incl. the question-guard deferral.
⚠️ **Do NOT re-verify by repeatedly offline-rendering big projects in a headless browser — it crashed the owner's machine.** Test light or let him test in the real app. (memory: `headless-audio-render-crashes-machine`)

## Not done / next
- Full WAV bounce (`renderPatternWav` end-to-end) only confirmed via the existing production path, not re-rendered in headless (too heavy). It's unchanged pre-existing code.
- An actual MCP server that calls `RoomAPI` is the owner's vision — the surface is now MCP-ready (describe()/run()/state()); the server itself is a separate build.
- Could expose `RoomAPI` to the parent across the iframe (postMessage) so the Studio's agent drives the embedded beat live (today it's cook-then-Send-to-Studio).
