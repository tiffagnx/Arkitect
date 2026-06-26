# LePrince Visual Labs — Effect Audit (ZERO-FAKE)

**Rule (owner, 2026-06-26):** nothing fake. If an effect can't truly do what its name promises on a flat-2D, single-frame canvas → **delete it** (don't ship a grayed stub or a lookalike), document **why**, and propose **our own LePrince-native version** of the idea to build later.

Audited all **289** effects (23-agent workflow + adversarial zero-fake verifier).

| Verdict | Count | Meaning |
|---|---|---|
| **keep** | ~86 | already real & faithful |
| **build** | ~141 | genuinely buildable now on the canvas engine |
| **build-hard** | ~20 | buildable but needs an engine extension (frame buffer / 2nd-layer sampling / projection module / particle state) |
| **delete** | **56** | cannot be faithful — erased from the menu (below, with our alternative) |
| **live lies** | ~15 | currently shipping as a fake alias — must fix or unmap |

DONE: the 56 deletes + 5 now-empty categories (Audio, Expression Controls, 3D Channel, 3D, planar tracker) are pruned from the menu (`LP_KILL` in editor.html). Verified in Chrome.

---

## 🗑️ DELETED — can't be faithful (with our LePrince-native alternative to build)

### 3D Channel (whole category) — needs Z-depth / object-ID / normal channels flat video has none of
- **3D Channel Extract / 3D Channel** → **Channel Combiner** (remap/extract the real RGBA channels we DO have).
- **ID Matte** → **Magic-Wand Matte** (matte by clicked color + tolerance flood-fill).
- **Depth Matte** → **Luma Depth Matte** (threshold a user-imported grayscale depth-map clip).
- **Depth of Field** → **Tilt-Shift / Gradient Focus Blur** (user-painted focus mask drives variable lens-blur).
- **Fog 3D** → **Gradient Fog** (colored fog driven by a user gradient or imported depth map).
- **Material Edge** → **Edge Detect / Outline** (Sobel/DoG contour stroking on real pixels).

### Audio (whole category) — audio samples aren't in the visual render pass
- **Backwards** → **Reverse Clip** (timeline op that reverses frame order — a true visual "backwards").
- **Bass & Treble** → **Shadows/Highlights Tone** (lift/cut dark vs bright tonal bands).
- **Delay** → **Echo (Visual Trails)** (frame-buffer echo of past frames).
- **Flange & Chorus** → **Wave Warp (LFO Displacement)** (time-animated sine displacement shimmer).
- **High-Low Pass** → **Detail/Smooth Frequency Split** (blur = low-pass, original−blur = high-pass detail).
- **Modulator** → **Flicker/Tremolo** (brightness/hue LFO).
- **Parametric EQ** → **Curves (per-channel)** (multi-point tonal shaping).
- **Reverb** → **Bloom/Glow Diffusion** (spreading spatial wash).
- **Stereo Mixer** → **Channel Mixer (RGB)**.
- **Tone** → **Waveform Generator** (procedural sine/square/saw shapes drawn into the frame).

### Blur — need a motion-vector map / blind deconvolution
- **Camera-Shake Deblur** → **Deconvolution Sharpen** (manual angle+length kernel, honest, no auto-estimate).
- **Vector Blur** → **Field Blur (Map-Driven)** (length/angle from a chosen control layer's luma/hue).

### 3D / Tracking — need a 3D scene or a multi-frame track solve
- **3D Link** (Cineware) → **3D Render Import** (composite a pre-rendered 3D image/PNG sequence as a real layer).
- **planar tracker** (Mocha) → **Corner Pin (manual)** (4 keyframeable corners = hand-pinned perspective; honest, no auto-track).
- **Color Stabilizer** → **LePrince Color Match** (pull frame avg/black/white toward fixed targets, single-frame).
- **Rolling Shutter Repair** → **Row Skew Corrector** (manual top-vs-bottom shear ramp).
- **Warp Stabilizer VFX** → **Locked-Shot Smoother** (keyframe an anti-motion path; manual stabilization).
- **Detail-preserving Upscale** → **Edge-Aware Resample** (Lanczos + edge-sharpen, honestly labeled as resampling, NOT AI detail recovery).

### Expression Controls (whole category) — render no pixels; only feed expressions (we have no expression engine)
- **3D Point / Angle / Checkbox / Color / Dropdown / Layer / Point / Slider Control** → fold their *real* uses into actual effects: a **Rotate** effect's angle, a per-effect **Bypass** toggle, a **Solid Fill** color, a draggable **center point** baked into Twirl/Ripple/Lens-Flare, a **layer picker** on Set-Matte/Displacement, etc.

### Generate — need real audio FFT
- **Audio Spectrum** → **Frequency Bars Generator** (synthetic, keyframed amplitude — honest visualizer).
- **Audio Waveform** → **Waveform Generator** (procedural oscilloscope line).

### Matte / Perspective — need track solve / facing-normal / back-face
- **tracked shape** → **Keyframed Spline Mask** (hand-keyframeable bezier, no auto-track claim).
- **3D Camera** → **Perspective Corner-Pin** (animatable 4-corner quad).
- **Sided** → **Card Flip** (keyframeable horizontal-scale flip + edge shade, optional back-clip swap).
- **Basic Text** (Obsolete) → **already superseded by our real editable Text Clip** (re-adding baked text would be a worse duplicate).

### Simulation — need persistent particle state + true 3D
- **Card Dance** → **Grid Shuffle** (per-tile 2D offset/scale/opacity reveal).
- **Ball Action** → **Bulge Tiles** (per-cell spherize warp).
- **Hair** → **Fur Combing** (stateless flow-angle strands).
- **Mr. Mercury** → **Liquid Chrome** (stateless metaball field).
- **Pixel Polly** → **Crumble Burst** (Voronoi shards slide+fade by one progress param).
- **Shatter** → **2D Explode** (in-plane shard burst, honest flat disintegration).
- **Wave World** → **Wave Texture** (procedural animated height/normal map for our Caustics/Drizzle to sample).

### Time — need optical flow / deep multi-frame access
- **Wide Time** → **Trail Blur** (spatial multi-sample echo of the current frame).
- **Pixel Motion Blur** → **Force Motion Blur** (vector shutter blur from keyframed transform velocity — already a build).
- **Time Displacement** → **Displacement Map** (spatial map-driven warp of the current frame — already a build).
- **Timewarp** → **Speed Remap** (resample to nearest real frame; no fake interpolation).

### Utility — need HDR/float buffers or ICC/OCIO colour management we don't have
- **Overbrights** → **Blown-Highlight Zebra** (camera-style clipped-white warning stripes).
- **Color Profile Converter** → **Gamut Map** (fixed sRGB↔P3-ish matrix + gamma).
- **Grow Bounds** → **Edge Padding / Canvas Extend** (transparent margin so later glow/blur isn't hard-cut).
- **HDR Compander / HDR Highlight Compression** → **Tone Compress / Highlight Rolloff** (soft-knee curve on in-range pixels).
- **OpenColorIO** → **Film Look Transform** (curated creative-LUT looks via our Apply-Color-LUT engine).

---

## ⚠️ LIVE LIES — currently shipping as a fake alias; FIX or UNMAP (high priority)
- **Remove Grain** — wired to the *add-grain* code (it ADDS grain). Backwards. → unmap, build real bilateral denoise.
- **LePrince Spotlight** — aliases to a vignette (can't be aimed). → rebuild as a positioned/angled radial-gradient light cone.
- **Radial Shadow** — aliases to the directional drop-shadow. → add a light-position param (offset + shadow-alpha scale).
- **VR Chromatic Aberrations / VR Fractal Noise / VR Glow / VR Sharpen** — marked "live" but are unwired stubs that do **nothing**. → actually build them (verifier flipped keep→build).
- **Match Grain** — generic grain tile; doesn't analyze a source clip. → build-hard (needs 2nd-layer grain analysis) or rename honestly.
- **Tint** — single-color wash, not the two-color map-black/map-white. → wire through the gradient-map LUT.
- **Median / Noise / Turbulent Noise / Noise HLS Auto / Cell Pattern** — verify each runs its real distinct pass (sort-window median; per-pixel random; abs-fold turbulence; frame-advancing seed; true Worley/Voronoi) and isn't collapsed to the grain tile / plain fBm. Fix any that are.
- **Camera Lens Blur / Compound Blur** — faithful as *looks* but don't market as depth-driven / external-map-driven (no z-channel / no map layer).

---

## 🔧 BUILD-HARD — needs an engine extension first
- **Frame ring-buffer** (store last N rendered frames): Echo, Time Difference.
- **2nd-layer sampling** exposed to effects: Displacement Map, Difference Matte*, Calculations, Compound Arithmetic, Set Channels, Blend, Set Matte, 3D Glasses*, Color Link, Texturize, Mr. Smoothie, Match Grain. (*verifier says these are actually plain *build* — the 2nd layer is already available via `vis[i+1]`.)
- **Projection-math module** (equirect↔rectilinear/sphere): VR Converter, VR Plane↔Sphere, VR Rotate Sphere, VR Sphere↔Plane, LePrince Environment.
- **Particle-state system** (ring buffer or closed-form seed trajectories): Particle Systems II, Particle World, Foam, Particle Playground.
- **Heavy / misc**: Reshape (MLS deformation), Refine Soft Matte (edge color-unmix), Caustics, Card Wipe, LePrince Twister (per-column squash).

---

## ✅ BUILD — real, doable now (~141, by category)
Distort, Generate, Channel, Color Correction, Stylize, Transition, Keying, Matte, Perspective, Noise & Grain, Obsolete, Text, Simulation (stateless overlays: Bubbles, Drizzle, Rainfall, Snowfall, Star Burst), Immersive (VR Digital Glitch, VR Blur, VR De-Noise, VR Color Gradients). Each agent gave a concrete real Canvas2D algorithm — implemented in waves via the `LP_FX` plugin registry, **each screenshot-verified in Chrome** before it counts as done.

Full per-effect algorithms: workflow result `wf_9295a451-00f`.
