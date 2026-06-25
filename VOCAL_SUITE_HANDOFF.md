# SESSION HANDOFF — Vocal Suite + In-Room Agent Vision (for the release wrap)

*Written by the "audio + agent-AI" session (2026-06-25). A parallel session worked the repo at the same
time; a coordinating session will fold both into the next update. This lists EXACTLY what I changed so you
can confirm nothing got clobbered and commit the combined tree.*

---

## ⚠️ How to "wrap both together"
All my changes are **UNCOMMITTED in the shared working tree** (no branch). They already coexist with the
other session's edits in the same files on disk — there's nothing to *merge*, just **verify + commit**.
- Commit with **explicit paths** (never `git add -A`).
- Two files I edited were ALSO in the parallel session's modified set: **`static/studio.html`** and
  **`static/kit-helper.js`** → `git diff` both and confirm BOTH sessions' edits survived (we worked
  different regions, so they should).

---

## WHAT I BUILT (all verified by offline render / live test)

**1. DeMartin vocal plugin suite — 7 new insert plugins in `static/studio.html`** (real Web-Audio DSP,
all OfflineAudioContext-verified = bounce==monitor). Register into `window.TIFF_PLUGINS.list`:
- **DeMartin Air** — harmonic exciter (native)
- **DeMartin Doubler** — 4-voice hard-pan doubles (native; verified real stereo spread)
- **DeMartin Drive** — 5-style saturation, gain-compensated (native)
- **DeMartin Vocal Verb** — ducked + tempo-synced reverb (reuses `tiff-compressor` worklet + `makeIR`)
- **DeMartin Opto** — LA-2A leveler (NEW worklet `demartin-opto`; verified ~15 dB program-dep GR)
- **DeMartin FET-76** — 1176 comp (NEW worklet `demartin-fet76`; verified compresses 0.21→0.009)
- **DeMartin Spectra** — 4-band dynamic EQ (NEW worklet `spectra-dyneq`; verified −6 dB on the band's
  own tone, off-band passes)
- 3 new worklet processors appended to `WORKLET_SRC`. ⚠️ **LESSON: NO backticks inside `WORKLET_SRC`**
  (it's a template literal — a stray `` `drive` `` in a comment closed the string and broke the parse).

**2. AI vocal assistant ("TALK TO IT")**
- `app.py` `/api/vocalassist` — clone of `/api/beatbrain`; clamps every macro to **0..1**; `_vocal_macro_heuristic`
  keyword fallback works with **no model**. Cloud OR local brain.
- `static/studio.html` `vdOpenPanel` — a text box that drives the existing safe Vocal-Doctor macros via
  `vdApplyMacro` (double-clamped → can't wreck a mix) and animates the sliders.
- Verified end-to-end: local model read "make it brighter" → moved the Bright slider 0.5→0.9.

**3. In-room agent window — `static/kit-helper.js`**
- Composer restructured: **input on its own row, tools below** (`📎 👁 + [spacer] 🎙 ➤`); roster/tier tightened.
- **👁 LOOK**: hides the window → grabs the screen server-side (`/api/screenshot`, PIL ImageGrab, downscaled
  JPEG, no browser "Allow") → opens an **annotator** (arrows/freehand/colors/undo → "Send to <agent>"). Generic.
- **"+" dropdown** (`MORE_TOOLS`: Copy last reply, Clear chat — extensible).

**4. Session awareness** — `window.dmvSessionSnapshot()` (studio.html) → `payload.session` (kit-helper.js) →
injected into the system prompt in `app.py` `/api/kit`. Agents now see live tracks/inserts/tempo (free, text).

**5. Both-brain vision** — `swarm_routes.py` `provider_once` + `_call_with_fallback` take an optional `image`
(cloud vision, `image_url` format). `app.py` `kit_help` routes an image turn to cloud (tier=cloud) else local,
with a local-eyes fallback.

**6. Earlier-session fixes**
- `static/index.html` (⚠️ **NULL BYTE** — use `grep -a` + a Python byte-replace, not Edit/Grep): Tiff/Kit
  crew-shelf sprites feet-aligned (`.cstile.tiff img{transform:translateY(-1.4px)}`, Kit unchanged).
- `static/copy-anywhere.js`: right-click Paste handles screenshots (image) + no false "pasted ✓".
- `desktop.py`: WebView2 auto-grants mic/camera/clipboard (kills the "Allow" nag) via
  `CoreWebView2.PermissionRequested`. Fully guarded; can't break startup.

---

## FILES TO COMMIT (explicit paths)
```
static/studio.html       static/kit-helper.js     app.py     swarm_routes.py
static/index.html        static/copy-anywhere.js  desktop.py
```

## VERIFY
- **Plugins:** Audio Lab → MIX → `+fx` → the 7 DeMartin plugins appear, open, have working knobs. (Offline-tested.)
- **AI assistant:** run 🩺 Vocal Doctor on a vocal → "Talk to it" → "make it brighter" moves the Bright slider.
- **Static = live on refresh** (plugins, window, sprite, paste).
- **BACKEND = needs the engine reloaded** (`DeMartinville (app).bat` / restart / exe rebuild):
  `/api/screenshot` (👁), `/api/vocalassist`, session injection, both-brain vision, the WebView2 permission grant.

## RELEASE NOTES
- Per CLAUDE.md, bump `APP_VERSION` in **BOTH** `app.py` AND `const APP_VERSION` in `static/studio.html`.
- Don't blind-rebuild the `.exe` in a headless session (can't launch-test it). Mac builds free on the tag.

## NOT DONE / NEXT
- Crop the 👁 grab to just the app window (currently the full primary screen).
- Ace-Studio lyrics→sung synth (deferred — needs a BYO-key cloud model; no offline path).
