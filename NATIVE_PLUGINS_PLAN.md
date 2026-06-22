# Native Plugins (Waves / VST3 / AU) — Build Plan

Boogie's ask: users pull in their own native plugins (Waves etc.) and use them. Researched
2026-06-21 (workflow wf_5f35cbed-e86). **Verdict: real and buildable — through the engine, not the browser.**

## What's true
- Native plugins **cannot** run in the browser layer (hard web-security limit, true for every web app).
- They **CAN** run in our **native Python engine** (the part on the user's own machine, where their plugins + licenses live), via **Spotify's `pedalboard`** — a JUCE-based host that loads **VST3 + AU**, exposes params, and processes audio (`plugin.process(numpy, sr)`).
- So the flow is: **send audio to the engine → run it through the real plugin → get processed audio back.**

## v1 = render/bake (the safe, shippable product)
"Add your plugin to a track/clip → it processes it → **bake/Freeze** to audio." Non-destructive (keep the dry source, allow unfreeze + re-tweak). Reuses our existing Bounce/Commit/Freeze model.
- `pedalboard` in the engine, **every load/render in a SEPARATE SUBPROCESS** + timeout (a bad plugin can segfault Python uncatchably — subprocess = one worker dies, app survives). Mandatory.
- `/api/plugins/scan` (find installed plugins), `/api/plugins/params` (enumerate → JSON), `/api/plugins/render` (load → set params → process → WAV).
- Studio UI: insert slot → pick plugin → auto-generated param panel → Apply/Freeze. Save plugin+params to the session.

**NOT v1 (be honest):** glitch-free real-time monitoring through native plugins. `pedalboard`'s live stream pops under GC, no ASIO, effects-only, binds to server audio. Render/freeze is the product; a labeled "experimental" live path is v3 at most.

## The GUI (can't show the plugin's own window in our room)
A native editor is an OS window; the browser DOM can't contain it (hard limit). Three honest moves:
1. **Our own param panel (primary)** — generate HTML knobs from the plugin's exposed params (the Vocal-Doctor flat-schema pattern we already ship).
2. **"Open plugin window" escape hatch** — pop the plugin's real native editor as a separate desktop window (`show_editor()` in the subprocess; read params back on close). What real browser-DAWs actually do.
3. **The AI-brain layer (our differentiator)** — clamped macro sliders ("Bright / Warm / Punch") over the raw params, so 47 cryptic Waves knobs become a few safe ones.

## ⚠️ The one real blocker to settle FIRST
`pedalboard` is **GPLv3**. Bundling it *inside* a closed-source exe likely triggers copyleft on our linked code. **Lower-risk route (matches what we already do):** the user pip-installs it into their own venv via `requirements.txt` (we don't redistribute the binary) — same as every other dependency in our setup. Worth a proper licensing look before making it a headline/bundled feature. Don't skip this; it gates distribution.

## Other hard limits (don't promise)
- AU is **macOS-only**; Windows is VST3-only (fine, state it).
- It's inherently a **local-app** feature (only works where the user's plugins+licenses are installed — i.e. their own machine; a cloud server has no Waves). We're local, so that's fine.
- Waves = one "WaveShell" bundle (pass `plugin_name=`), needs valid iLok/Waves activation, 10s init timeout, known crasher → clear errors, not silent hangs.
- "VST" is Steinberg's trademark — use correctly, don't imply vendor endorsement.

## Phases
- **v1:** pedalboard (crash-isolated subprocess) + our param panel + "apply real plugin → freeze." Non-destructive. Settle GPL question in parallel.
- **v2:** native-editor pop-out + AI macro layer + plugin chains + Waves polish.
- **v3:** VST3 instruments from MIDI; AU on Mac; experimental live-monitor (labeled).
- **Complementary — "Web Plugins" shelf (WAM2):** real web-native plugins that DO run in-browser live (AudioWorklet+WASM, 40+ open-source), for users with zero native plugins. Needs COOP/COEP headers. Lower priority; NOT a way to run native Waves.

*Files: `app.py` (/api/plugins/* + subprocess worker), `static/studio.html` (insert UI + param panel, reuse Vocal Doctor), `desktop.py` (the local backend that hosts pedalboard).*
