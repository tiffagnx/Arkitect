# AGENTS HEAR AUDIO — handoff (2026-06-26 night, autonomous)

**Status: BUILT + syntax-clean. UNCOMMITTED + UNVERIFIED-live.** Do NOT call it done or ship it
until a real song runs the whole loop (the only running server tonight was the *Visual Labs*
session's — I did not cross it, so I couldn't verify). See ⚠️ at the bottom.

---

## What it is
The front-line agents (Tiff, Kit, user-built agents — in rooms AND the main chat; NOT the text-only
crew backups) can now **hear an uploaded song and break it down.** Same **📎 paperclip** — it just
takes audio now, not only images (owner: "the paperclip IS the attach thing, why add 30 buttons").

**Main chat is proactive:** drop a song, type nothing → she listens, breaks it down, asks what you want.

## How it works (local-first)
- **The SOUND = FREE, in-browser.** `static/audio-ear.js` (`window.DMV_EAR.analyze(file)`) decodes any
  audio (Web Audio) and measures loudness (peak/RMS), dynamics (crest), brightness (spectral centroid),
  and spectral balance (sub/low/mid/hi/air %) with an in-house FFT. No model, no key. It also emits a
  **compact 16 kHz-mono WAV** (`whisperWav`) for transcription — keeps the upload tiny + under Whisper's
  25 MB cap on any real song (a full 37 MB WAV would otherwise be rejected).
- **The WORDS = Whisper** on the user's OWN key. `swarm_routes.transcribe()` + `_whisper_slot()` →
  Groq `whisper-large-v3` (large-v3, NOT turbo — lyrics over a music bed need the accuracy).
- **Folded as TEXT** into the agent's context, so ANY brain (even a local Gemma) can break it down —
  it does not need to be an audio model.

## Files
- `static/audio-ear.js` — NEW. Browser DSP + 16k WAV encoder.
- `swarm_routes.py` — `_whisper_slot()` + `transcribe()` (OpenAI-compat `/audio/transcriptions`).
- `app.py` — `/api/kit` audio block (rooms) · `/api/transcribe` (main chat) · `_fmt_audio_meta()`.
- `static/kit-helper.js` — 📎 accepts audio, analyzes, sends `audio`/`audio_meta`/`audio_name`.
- `static/index.html` — 📎 accepts audio, transcribe-via-`/api/transcribe` + fold-into-text, proactive,
  loads `audio-ear.js`.
- `static/pinkroom-nav.js` — loads `audio-ear.js` in every room.
- `static/keys.js` — NEW **"🧭 What you need for each thing"** guide at the top of the keys hub.

## ⚠️ BYO-KEY (owner's cost worry — non-negotiable)
Transcription + every cloud feature runs on **each user's OWN key, never the owner's account.**
Verified tonight: **zero hardcoded keys** in any shipping file; `data/` (encrypted keys) is **excluded
from the release zip**; `_whisper_slot` only reads the user's `_enabled_slots`. No key? She still reads
the SOUND for free and tells the user a free Groq key unlocks the lyrics.

## The "What powers what" guide (keys.js, top of the keys hub)
Capability → what to get, free/local vs paid (from research, cited in the workflow output):
- 💬 Chat → any LLM key (Groq free / OpenRouter / Gemini free / Claude / OpenAI) OR free+offline (LM Studio + a GGUF).
- 👁 Vision → a vision model (Gemini free / Claude / GPT / Grok).
- 🎧 Hear the SOUND → FREE, built in (audio-ear.js DSP).
- 📝 Hear the LYRICS → Groq key (free Whisper `large-v3`). Tip: transcribe the isolated vocal for cleaner lyrics.
- 🎨 Image gen → free on the user's GPU (built-in FLUX/ComfyUI) OR a media key (Atlas cheapest / FAL / KIE), pennies.
- 🎬 Video gen → media key only (no local). The one capability that genuinely costs (~$0.02-0.10/sec).
- 🔱 God Mode → paid Claude key; free-ish alt = Groq `gpt-oss-120b`.

## Research findings worth keeping (workflow `capability-requirements-research`)
- **Groq Whisper**: OpenAI-compatible `/audio/transcriptions`; FREE tier, no card (~30 req/min, ~2k/day,
  25 MB free cap); `whisper-large-v3` ($0.111/hr, ~10.3% WER, best for lyrics) vs `-turbo` ($0.04/hr).
- **Lyrics are hard** for general ASR. Two wins to add later: (1) transcribe the **isolated vocal stem**
  (the studio already has vocal isolation) — big accuracy jump; (2) Whisper's `prompt` param (224 tok)
  to steer spelling (song title/artist). Bleeding edge: **Qwen3-ASR** (full-song + music bed) — future.
- **Local transcription**: `whisper.cpp` (prebuilt `whisper-bin-x64.zip`, no Python — shell out to
  `whisper-cli.exe -m ggml-base.bin -f a.wav`) is the cleanest Windows bundle; or `faster-whisper`
  (`pip install` + ffmpeg, large-v3/small). **LM Studio "Transcribe" was still "coming soon" (June 2026)**
  — don't depend on it for local STT.
- **Local audio understanding** (hear the vibe with a model): still bleeding edge; Gemma 3n audio isn't
  fed audio by LM Studio yet. We don't need it — DSP + transcript cover it. Gemini (native audio) is the
  optional cloud "vibe ear."

## Known limits / next
- Audio rides as a base64 data URL in the POST (the compact 16k WAV, ~6-8 MB) — fine, but a future
  FormData/multipart upload would be lighter.
- VIBE-from-a-model (Gemini native audio) not wired yet — DSP + transcript is the current "hearing."
- Video hearing = next rung (frames for the eyes + the audio track).
- Stem-isolation-before-transcription = the biggest lyric-accuracy win, not done.

## ⚠️⚠️ COORDINATION
- A **parallel session is on Visual Labs.** Do NOT touch `static/editor.html`, `static/leprince-fx.js`,
  `static/vendor/`, or its preview (`editor-preview` :7799). Its uncommitted work is in the shared tree.
- **Left UNCOMMITTED on purpose:** committing shared files (`app.py`) could absorb the Visual Labs
  session's uncommitted changes from the shared working tree. Per the parallel-session rule, leave it
  for the owner's batch. When committing, use EXPLICIT paths for the audio files only:
  `static/audio-ear.js swarm_routes.py app.py static/kit-helper.js static/index.html
  static/pinkroom-nav.js static/keys.js static/wall.html AUDIO_HEARING_HANDOFF.md` — and verify `git diff`
  on `app.py` shows ONLY audio/wall/crew changes (no Visual Labs code) before staging it.

## Verify before trusting (the gate)
Fire up the owner's app, then on the front door (main chat) OR any room's agent window:
1. Confirm `window.DMV_EAR` exists + `audio-ear.js` loaded (console).
2. Drop **`C:\Users\koonc\Downloads\Ed Gear Swimwear.wav`** on the 📎.
3. Watch: browser numbers appear instantly; with a Groq key, lyrics come back; the agent breaks it down
   (loudness/brightness/dynamics/low-end + the words). In main chat with no message typed → it self-starts.
4. Reference numbers I measured off that file by hand: peak −3.9, RMS −15.8, crest 11.9, centroid 4577 Hz,
   bands sub14/low11/mid19/hi30/air26. The browser FFT should land close to these.
