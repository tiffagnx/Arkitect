# Making Kit sound BUILT — robot-voice research (cited)

*Deep-research run 2026-06-26: 5 angles → 24 sources → 94 claims. The auto-verify step got
rate-limited (votes errored/abstained, NOT refuted), so these claims were hand-vetted against
their sources + known DSP. Sources rated primary/secondary/blog below.*

## The thesis (unchanged — this is the whole play)

> **Kit = Fish clone (the VOICE) → our hand-built robot-DSP chain (the CRAFT) → playback.**

Fish gives the timbre. The "damn, they BUILT that" feeling comes from a tuned chain *we* own.
Every iconic robot voice below is a deliberate signal chain, not a one-click filter — that's
exactly the work you're talking about putting in.

## 1. The robot-voice toolkit — what each does, real params, intelligibility cost

| Technique | What it does | Starting params | Intelligibility cost |
|---|---|---|---|
| **Ring modulation** | Voice × a sine carrier → metallic, inharmonic "Dalek" edge. THE classic robot move. | Sine carrier **~30 Hz** (usable 20–80 Hz; Daleks 20–50, some prefer 80), 100% amount | **High if full-wet** — blend dry/wet to keep words |
| **Bitcrush (bit-depth)** | Quantizes samples → digital grit/noise; extreme = clicks/buzz | step = `0.5^bitDepth`; **bitDepth 12** default (range 1–16; 32→1 overall) | Low at 8–12 bits, harsh below ~6 |
| **Bitcrush (sample-rate)** | Sample-and-hold downsampling → aliasing = "digital/metallic" | `frequencyReduction 0.5` (0–1); noisehack `normfreq 0.1` | Medium; severe = very metallic |
| **Vocoder** | Splits voice into N bands, drives a synth carrier → discards pitch, keeps the "shape" | **band count = the lever:** ~32 = clear, 16 = vintage/heavier character | Tunable — more bands = more intelligible |
| **Formant shift** | Moves vocal-tract resonances independent of pitch → the GLaDOS "computer" quality | Small shift; the digital artifacts ARE the robot quality | **Low** — best intelligibility-to-robot ratio |
| **Pitch quantize / flat affect** | Snap pitch to semitones + flatten the natural pitch wiggle → monotone machine | Quantize to chromatic; reduce pitch variance | Low (words intact, just flat) |
| **Comb filter** | Short feedback delay → hollow tin-can / small-metal-body resonance | Delay ~5–20 ms + feedback ~0.3–0.6 | Low-medium |
| **WaveShaper distortion** | Adds edge/grit | mild curve | Medium if heavy |
| **Metallic/convolution reverb** | Small metal-room space → "inside a machine" | short, bright IR | Low if subtle |

## 2. How the icons were ACTUALLY engineered (what makes each read "machine")

- **Daleks (Doctor Who)** — **ring modulation**, sine carrier **~20–80 Hz**, 100%. Official voice actor Nicholas Briggs uses a **Moog Moogerfooger MF-102** ring modulator live. The metallic clang = the inharmonic sidebands ring-mod creates. *(secondary/blog)*
- **Daft Punk** — NOT one filter. Across albums: **DigiTech Talker** (an **LPC**-based talkbox — different from a filterbank vocoder), **Auto-Tune**, **DigiTech Vocalist** harmonizer, physical talkboxes (Keeley Framptone), and vocoders (Roland SVC-350, Sennheiser VSM201). The "we used real gear and layered it" is literally why it sounds crafted. *(bjango, blog — strong)*
- **Cylons (Battlestar Galactica)** — **EMS Vocoder 1000** with an **ARP 2500** carrier (PWM square + sine + triangle, synced). Two design tricks: the carrier and voice **share no common frequencies** (→ unpredictable/alien), and the actor performed **flat monotone** to preserve intelligibility through the vocoder. *(secondary)*
- **GLaDOS / Portal** — primarily **formant shifting** (independent of pitch); the **digital artifacts** from heavy formant/pitch shifting are what sound computerised. Tools: SoundToys Little AlterBoy, Melodyne, Auto-Tune. *(blog)* — this is the most intelligible robot path.

**Takeaway for Kit:** the iconic ones combine **a carrier-based effect (ring mod / vocoder) + a flat/processed pitch + deliberate timbre choices**. Kid-Bender = lighter, brighter, faster than a Dalek — so lean ring-mod *light*, keep him bright, add digital grit, not full menace.

## 3. Build Path A — Web Audio (browser) ⭐ RECOMMENDED

Chain pattern: `source.connect(a).connect(b)…connect(destination)` *(MDN, primary)*. Build a
`kit-voice-fx.js` graph the TTS audio runs through before playback:

- **Ring mod:** `OscillatorNode(type:'sine'|'square', freq:~30)` → `GainNode.gain`; voice → that GainNode → out. (MDN shows a 30 Hz square LFO into a gain param as the AM/ring-mod basis. *primary*)
- **Bitcrush:** an `AudioWorkletProcessor` with params `bitDepth` (def 12, 1–16) + `frequencyReduction` (def 0.5) — quantize via `step*floor(sample/step+0.5)`, downsample via a sample-and-hold phase accumulator. (Chrome's official bit-crusher worklet — *primary*; noisehack's ScriptProcessor version, `step=(1/2)^bits`, is the simpler legacy path.)
- **Distortion grit:** `createWaveShaper()` with a curve. *(web.dev/MDN, primary)*
- **Comb (tin-can body):** `DelayNode(~0.008–0.02s)` + feedback `GainNode(~0.4)` loop.
- **Metallic space:** `ConvolverNode` with a short bright IR.

Gotchas: AudioWorklet needs the worklet module loaded once (`audioWorklet.addModule`); ScriptProcessor is deprecated but dead-simple for a prototype; do ring-mod/bitcrush dry/wet so words survive.

## 4. Build Path B — Python `pedalboard` (server-side)

In `/api/tts`, post-process the audio before returning. Pedalboard ships ready-made:
`Bitcrush(bit_depth=… 0–32, fractional)`, `Distortion`, `Chorus`, `Delay`, `Reverb`, `PitchShift`,
`LadderFilter`, plus lo-fi codecs `GSMFullRateCompressor` / `MP3Compressor` (great cheap "comms/
radio robot" grit). Pattern *(primary — spotify/pedalboard)*:

```python
from pedalboard import Pedalboard, Bitcrush, Distortion, Delay, PitchShift, Reverb
board = Pedalboard([Bitcrush(bit_depth=10), Delay(delay_seconds=0.012, feedback=0.4, mix=0.3),
                    Distortion(drive_db=8), Reverb(room_size=0.15)])
out = board(audio, samplerate)   # params editable in place: board[0].bit_depth = 8
```
We already host `pedalboard` (`plugin_host.py`). No true ring-mod/vocoder built in, so for the
*signature* metallic edge, Web Audio (Path A) is better. Use pedalboard if you want heavier grit
or real VST robot plugins later.

## 5. SFX accent layer (cheap, high "they built this" payoff)

- **Servo whirs** — used raw for small precise motion, pitched/layered for bigger motors; a versatile base for "Kit moved/thought." Trigger a short one on sentence starts. *(asoundeffect, blog)*
- **Digital blips / glitch / static** on phrase boundaries (sentence-end pauses) — sells "machine processing."
- Keep them LOW under the voice; they're seasoning. Web Audio: schedule short buffers at pause gaps.

## 6. The tuning craft (the part that's easy to blow)

This is where it went wrong before — going too heavy kills BOTH words and character. The levers:
- **Vocoder band count is the master dial:** ~32 bands = intelligible, drop toward 16 for more machine. Pick by ear.
- **Lean on formant shift over ring mod** for intelligibility (the GLaDOS lesson) — formant keeps words clearest.
- **Flatten pitch** (monotone) for "machine" without hurting words (the Cylon-actor lesson).
- **Everything dry/wet, everything tunable, start subtle, A/B against the raw clone.** Make `kit-voice-fx.js` expose knobs (ringMod Hz/mix, crush bits/rate, comb ms/fb, formant amount) so we dial Kit in together by ear.

## 7. Kit's recipe + build plan (ranked by impact ÷ effort)

1. **★ Light ring mod (~25–35 Hz, ~30% wet)** — biggest "robot" payoff per line of code. Web Audio osc→gain.
2. **★ Bitcrush, gentle (bitDepth ~10, sample-rate ~0.6)** — the "digital kid" grit. Chrome worklet.
3. **Short comb (~10 ms, fb 0.4)** — small-robot body.
4. **Flatten/quantize pitch slightly** — robotic cadence (optional; Fish clone already kid-pitched).
5. **Glitch/servo blip on sentence ends** — the cherry; cheap, very convincing.
6. *(later)* formant shift / a real vocoder band for the deep cut.

**First build:** `kit-voice-fx.js` — Web Audio module, input = TTS audio, output = robotized, with
tunable params; wire into `playTTS()` in `kit-helper.js` behind a per-agent "robot FX" flag. Then
we sit and tune Kit by ear. Make it a **per-agent FX chain** so any agent can have a crafted voice
— that's the real "we built a voice engine" feature, not a one-off.

## Sources (hand-vetted; verify step was rate-limited, not refuted)
**Primary:** [Chrome Web Audio bit-crusher worklet](https://googlechromelabs.github.io/web-audio-samples/audio-worklet/basic/bit-crusher/) · [MDN — Advanced Web Audio techniques](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques) · [spotify/pedalboard](https://github.com/spotify/pedalboard) · [pedalboard API docs](https://spotify.github.io/pedalboard/reference/pedalboard.html) · [jaz303/bitcrusher](https://github.com/jaz303/bitcrusher)
**Secondary:** [Vocoder — Wikipedia](https://en.wikipedia.org/wiki/Vocoder) · [Bitcrusher — Wikipedia](https://en.wikipedia.org/wiki/Bitcrusher) · [Cylon voice — A Sound Effect](https://www.asoundeffect.com/robot-voice-battlestar-galactica/) · [nrlakin/robot_voice (numpy ring mod)](https://github.com/nrlakin/robot_voice) · [web.dev audio effects](https://web.dev/patterns/media/audio-effects)
**Blog/how-to:** [Daft Punk vocal effects — Bjango](https://bjango.com/articles/daftpunkvocaleffects/) · [Dalek ring-mod tutorial](https://www.richardloxley.com/2020/01/16/how-to-speak-like-a-dalek-a-ring-modulator-tutorial-for-audacity-on-a-mac/) · [Ring modulation primer](https://www.knobulism.com/2024/09/06/a-primer-on-ring-modulation-from-daleks-to-x-wing-pilots/) · [Portal/GLaDOS via Melodyne](https://ulethelectro.wordpress.com/2015/03/21/how-to-make-your-voice-sound-like-a-portal-style-robot-using-melodyne-editor/) · [Custom Web Audio effects — NoiseHack](https://noisehack.com/custom-audio-effects-javascript-web-audio-api/) · [Vocoder intelligibility/bands — Splice](https://splice.com/blog/what-is-a-vocoder/)
