# LePrince Visual Labs — Editor Handoff (READ THIS FIRST)

**What it is:** `static/editor.html` — a single-file browser NLE / motion-graphics compositor ("LePrince Visual Labs", inside the ARKITECT app). Goal: look & feel like **Adobe After Effects**. Owner = B (tiffagnx).

**Boundary:** This is a DIFFERENT app from the Pro Tools DAW in `static/studio.html` (someone else owns that, and `app.py` has unrelated in-progress "cloud memory / HeyTiff" work — leave both alone). **For editor work, you touch `static/editor.html` and the editor endpoints in `app.py` only.**

**IP rule:** Clean-room. Effects are given **house names** (not Adobe trademarks) — e.g. "Soft Focus", "Lift & Punch", "Dream Glow". Keep doing that. Don't ship copyrighted assets.

---

## ⏩⏩ HANDOFF — v1.3.0 (2026-06-20) — READ THIS FIRST

**Where we are:** `static/editor.html` is now a genuinely capable AE-style compositor. The full spine is in and working, end to end (preview + export). App is at **v1.3.0** (canonical `APP_VERSION` in `app.py`; editor About `LP_VERSION` matches). Everything below is **committed + pushed to `tiffagnx/Arkitect` master** and **pixel/functionally verified in real Chrome on port 7788**.

### What shipped (this multi-session run, ~30 commits)
- **36 effects** — the 15→35 batch + **Curves** (#36). Marquee custom UIs: **Keylight-grade chroma key** (`fxKey`: Screen Colour/Balance/Gain, Clip B/W, Shrink-Grow+Softness, Despill, View Final/Matte/Status), **Levels** (LUT card), **Curves** (draggable spline editor → 256-LUT), Colour/Luma Key, Directional/Radial blur, Warp. All auto-flow into the +Effect picker / stem tree / inspector / export via `FX_DEFS`.
- **Beautiful Effect Controls panel** — per-effect plugin cards (category accent, ◉ bypass / ⟲ reset / × remove, gradient sliders + keyframe stopwatches, hue track, swatches, Duotone gradient, segmented selectors). Add a control via `FX_EXTRA[field]` (kind `swatch|slider|seg|curve`).
- **Compositor foundations (all DONE + adversarially reviewed):** **Adjustment Layers**, **Track Mattes** (alpha/luma ±inv), **Parenting + Null Objects**, **Motion Blur** (sub-frame accumulation, `lighter`/1-N true mean), **Multi-select**, **Mask keyframing — scalar (feather/opacity/expansion) AND path** (box + pen-vertex morph; `mk.<id>.path` object interpolator `pathInterp`; lane diamonds; edit upserts). Mask-path was designed via a map+design+critique workflow (6 load-bearing bugs caught before coding) and reviewed clean.
- **Resizable panels**, **central hotkey dispatcher** (52 hotkeys, derived from the menu data), **real Purge**, **property column doubled** + **FX list open by default**.
- **Menu/hotkey completion (fan-out → curate → batch):** a 10-worker per-menu audit → ~18 items wired + 5 hotkeys; a buildSmall design fan-out → integrated **Help dialogs** (5, incl. a 36-effect reference), **Sequence Layers**, **Add Footage to Comp**, **bin Find/filter**, **Panel Background Color**, **Info readout panel**, **Pen tool un-dimmed**. Honest greyed list documented (15 clusters that need real foundations).

### Process / working model (owner-set, important)
- **Fan out the THINKING (research/design/review) in parallel** (Workflow, 5–12 agents/phase). **BATCH the same-file edits** (many edits → ONE verify → ONE commit). **Never parallel-write `editor.html`** (one file → workers would overwrite). **Keep load-bearing render/export work solo + per-feature verified** — that per-feature check is the net that keeps catching real bugs.
- **CURATE worker output, never blind-paste** — every batch this run caught a real bug (wrong fn signatures, a trademark leak in dialog text, Panel-BG painting the wrong surface, Info referencing `screen` before it existed). Verify each design's assumptions against the live code first.
- Owner's words: **"if you have even an inkling doing it by itself is the right call, ALWAYS do that… I'm looking to do it fast but RIGHT."**

### ⏩ NIGHT RUN 2026-06-21 (this session — editor.html only, committed to master, pixel-verified on 7788)
Owner said "finish everything" then went to sleep, asking me to work in Chrome for full-res viewing. **Chrome MCP was unusable unattended** (it requires an interactive browser pick, and the tab would suspend on sleep), and the **7788 preview tab was contended by the parallel AUDIO session** (kept getting navigated to studio.html/character.html), so verification was done via atomic pixel-sampling evals (re-grabbing the tab each time). **A full-resolution Chrome visual pass is the FIRST thing for the owner's eyes — see the report's checklist.**
Shipped + verified + committed (`864257c`, `26b29be`, `0ae6c96`):
1. **Reveal Properties** — `U` twirls open only ANIMATED (keyframed) props on selected layers; `UU` (double-tap) reveals all MODIFIED (non-default) props. `applyReveal(mode)` sets per-clip `_tw`/`_open` only (no data touched); wired to the Animation menu items. Both former buildSmall flags CLEARED.
2. **Rotation tool (W)** — drag a layer in the monitor to rotate about its anchor (`layerCenter` pivot, frame-aware); Shift = 45° steps. `startRotate` + a `vdrag.mode==='rotate'` branch; **Select move/scale/pen/razor paths byte-unchanged** (rotate branch returns before the `tool!=='select'` guard). Verified 0°→90° drag = rotation 90; no select/drag regression.
3. **Gradient Map** (fxGradMap) + **Fractal Noise** (fxNoise) → **38 effects.** Gradient Map = 3-stop luminance→colour ramp (Shadows/Mid/Highlights card); Fractal Noise = hash-seeded fBm (deterministic, no per-frame shimmer) overlay-blended with a Scale control. Both flow through `withLayerFX`+`hasLayerBufferFX` so they render AND export; verified pixel-exact.
4. **Draggable mask + scalar lane diamonds** — new `attachLaneKeyDrag(d,c,t0,fields)`; mask `mk.*` keys (incl. the mask-path object key) are now draggable in the lane (were ease-only). Also fixed a latent bug where lane diamonds positioned at `nt*ppf`, dropping the clip start offset (now `(c.start+nt)*ppf`). The clip-body `keyLane` still correctly uses `attachKeyDrag` (clip-relative).

### WHAT'S LEFT (next, in priority order)
- **Bezier handles on pen masks** (owner explicitly asked). **DESIGNED, NOT BUILT — deliberately deferred**: it's load-bearing (`_maskShapePath` runs in preview + export + overlay) and the payoff is curve *aesthetics* (needs the owner's eyes), so it was too risky to do unattended. **Safe build plan:** make it strictly ADDITIVE (no handles ⇒ byte-identical to today). Per pen point add optional absolute-comp tangents `ho`/`hi`. RENDER: in `_maskShapePath`, when a pen mask has any handles, emit `bezierCurveTo` per segment (cp1=`P[i].ho||P[i]`, cp2=`P[i+1].hi||P[i+1]`), closing last→first; else keep the current straight/`m.smooth` path. EDIT (monitor): **Alt-drag a vertex** pulls out symmetric handles (convert-to-smooth); **drag a handle dot** adjusts that tangent (mirror the opposite unless Alt breaks); **plain vertex drag** moves point+handles rigidly. OVERLAY: in `drawMaskOverlay`, for the active pen mask draw handle lines+dots for points that HAVE handles. KEYFRAMES: `pathInterp`/`pathStatic` must deep-copy `ho`/`hi` and lerp them when vertex counts match (mismatch ⇒ HOLD, as today). Layer-space is free (handles map through `clipMatrix` like points). Add a handle-drag `vdrag.mode` + hit-test alongside `penVertexAt`. **Verify additivity FIRST** (existing mask render byte-identical), then run an adversarial review (the mask render path is the documented "crashes every masked render" hazard).
- **Graph Editor** (draggable value/speed keyframe curves) — the next big foundation; would make the lane diamonds *value*-draggable (vertical), not just time-draggable. Big UI; benefits from the owner's eyes on the feel.
- **Then:** Precompose/nested comps, Shape layers, a WebGL render pass.
- **Greyed-on-purpose (need real foundations, correctly NOT wired):** 3D/Camera/lights, expression engine, audio DSP, paint/Roto/Puppet, vector/path shape layers, color management, render-queue panel, tracker. See the menu-audit keep-greyed list.
- **Known nuance:** mask lane diamonds are ease-editable but not draggable yet (Graph Editor fixes this). Many AE_TOOLS tooltips are stale (e.g. Pen says "no mask engine" though pen masks work) — cosmetic.

### v1.3.0 RELEASE NOTES (what changed since 1.2.0)
Curves effect (draggable curve editor) · Mask **scalar + path** keyframing (animate shape, feather, opacity, expansion; lane diamonds) · roomier timeline property column + FX list open by default · a full **Help menu** (Help / What's New / Effect Reference / About / Compatibility) · **Add Footage to Comp**, bin **Find** filter, **Sequence Layers**, **Panel Background Color**, an **Info** readout panel (frame/timecode/cursor/pixel) · ~18 menu items wired + correct hotkeys (52 bound) · Pen tool no longer rendered disabled · review fixes to Parenting/Motion-Blur/Multi-select.

> **Release mechanics:** editor code ships via `static/` (read from disk by the launcher — desktop.py), so features apply to all installs. `ARKITECT.exe` is a stable launcher; a fresh exe (so the bundled `APP_VERSION` advances for `.exe`-run installs) comes from running `RELEASE.bat <ver>` on the owner's machine. The zip (`build_zip.py`) packages current disk state. NOTE: at handoff time the tree also carried the **parallel audio session's uncommitted WIP** (`static/index.html`, `kit-helper.js`, `join.html`) — those are NOT this session's and were left for that session to commit; a zip built from disk includes them. `static/studio.html` keeps its OWN `APP_VERSION` (the DAW session manages it).

---

## ⏩ LATEST SESSION (2026-06-19) — read this first

Owner B asked: "go through the effects list and make them ALL, make every plugin UI **beautiful**, and work in **real Chrome** so you can see it." He runs **parallel agents on AUDIO + another**; this session owns **VISUAL only (`static/editor.html`)**. Everything below is shipped + pixel-verified in real Chrome on **port 7788** and is **NOT committed** (the working tree carries a parallel session's WIP — leave git alone).

- **34 working effects now** (was 15). New: Exposure, Gamma, Warmth, Vibrance, Threshold, Solarize, Duotone, Sharpen, Emboss, Find Edges, RGB Split, Halftone, Light Leak, Scanlines, **Color Key, Luma Key, Directional Blur, Radial Blur, Warp**. All auto-flow into the +Effect picker / stem tree / inspector / export via `FX_DEFS`.
- **BEAUTIFUL EFFECT CONTROLS PANEL** — the inspector "Effects" group is now `#efxMount`, a stack of per-effect **plugin cards** (category accent, ◉ bypass / ⟲ reset / × remove, gradient-fill sliders with keyframe stopwatches, rainbow hue track, colour swatches, two-colour Duotone gradient, segmented Warp/Radial selectors, second sliders for angle/softness). Builders: `mountEffectControls / efxCard / efxControl / efxSlider / efxColorRow / efxDuotoneRow / efxExtra / efxSeg`; tables `FX_CAT / FX_RANGE / FX_EXTRA`; CSS `.efx-*`. **Add a custom control via `FX_EXTRA[field]` (kind `swatch|slider|seg`).**
- **Per-effect bypass** = `effClip(c)` (render clone, bypassed fields → KDEF default), wrapped around every clip in `drawFrameInto`.
- **`projectNeedsFrameServer` refactored** to `clipFilter!=='none' || hasOverlayFX(c,0) || hasLayerBufferFX(c,0)` — so a new effect that's in those helpers exports automatically. Blur passes use the **`1/(j+1)` running-mean** (constant `1/N` left opaque interiors ~63% alpha). Keying writes alpha **before** the mask blit.
- **Scrub extended** to third-party marks (Boris FX/Mocha/Keylight/Lumetri/Cineware/Cryptomatte/EXtractoR/Frame.io) before the `\bAE\b` rule.
- **Menu wires:** Composition▸Save Frame As (PNG at comp res), Layer▸Mask▸New Mask / Remove All Masks, Layer▸Transform▸Fit to Comp / Width / Height. Effect menu now lights ~62 items.
- **Verified in Chrome** via Chrome MCP (`tabs_context` → navigate 7788 → `javascript_tool`/screenshot). Owner's `pym3odm` untouched (pixel tests run in-memory with `save` stubbed). Two adversarial-review workflows run; all confirmed bugs fixed.
- **NEXT (audit roadmap, don't redo done work):** Levels (multi-param card), Adjustment Layers, Track Mattes, Parenting, Motion Blur, Mask keyframing, noise generator, WebGL path. **SKIP per owner:** perspective/3D/Camera, simulation, Mocha, precompose, shape layers, paint/roto/puppet.

**Later same day (owner iterating, NOW COMMITTED + PUSHED to master — `8703e6f`, `2a2c92a`, `af5219c`):**
- **Resizable panels** — draggable gutters (`#gBin/#gInsp/#gTL`, `initGutters()`) resize Media / Inspector / Timeline via CSS vars `--bin-w/--insp-w/--tl-h`, persisted to localStorage, dbl-click resets. Inspector widened to 336px + more padding (owner: cramped).
- **ELITE CHROMA KEY** (`fxKey`, replaced the weak Color Key) — Keylight-grade colour-difference keyer: Screen Colour / Balance / Gain, Clip Black/White, Shrink-Grow + Softness (`morphMatte`/`blurMatte`), Despill, and **View: Final / Matte / Status** (the pro matte-tuning workflow). Verified on a synthetic green screen.
- **Levels** (`fxLevels`) — Input/Gamma/Output LUT, multi-slider card. **35 effects total.**
- `ARKITECT.exe` (25MB) + `*.log` added to `.gitignore` (exe ships via release.ps1 as a Release asset, not git).
- NEXT foundation: **Adjustment Layers**, then Track Mattes / Parenting / Motion Blur.

Full detail in the auto-memory `editor-ae-overhaul.md` (SESSION 2026-06-19 blocks).

---

## 0. HOW TO RUN & VERIFY (do this exactly)

- **Preview server:** launch config **`arkitect-preview`** on **port 7788** → `http://127.0.0.1:7788/static/editor.html`. The owner's live app runs on **7777** — never touch it. (7788 shares the same `data/` dir as 7777, which is why cleanup below matters.)
- **`preview_screenshot` is FLAKY** on these instances (it times out). **Verify with pixel-sampling** instead: `preview_eval` → draw a frame, read `#screen` canvas pixels with `getImageData`. Map a comp point to canvas with:
  ```js
  const k=Math.min(W/project.width,H/project.height), ox=(W-project.width*k)/2, oy=(H-project.height*k)/2;
  // comp (px,py) → canvas (ox+px*k, oy+py*k)
  ```
  Deselect (`sel=null`) before sampling so the selection crosshair doesn't pollute the centre pixel.
- **PROTECT THE OWNER'S PROJECT.** His project is **`pym3odm`** (`data/editor/projects/pym3odm.json`) — its V1 clip references media `cac4f1f9fdeec79c`. **Never overwrite or delete it.**
  - Many actions call `save(true)` (debounced) / `reallySave()` and persist the in-memory `project` to `/api/editor/projects`. If a test reassigned `project = newProject()` first, the save creates a **new** project file. Boot loads `projects[0]` = most-recent project **that has clips** (boot IIFE near the end of the inline script), so a test save becomes the default the owner sees.
  - **After any test that saves:** delete the test project file(s) in `data/editor/projects/` **by exact name** (a wildcard delete is correctly blocked), then restore pym3odm as the boot default by loading + re-saving it:
    ```js
    const p=await fetch('/api/editor/projects/pym3odm').then(r=>r.json()); loadProject(p); await reallySave();
    ```
    Confirm only `pym3odm.json` remains, and `project.id==='pym3odm'` after a reload.
  - Prefer tests that DON'T save: build state with `project = newProject(); ...; drawFrame()` and avoid `addMask`/`finishPenMask`/`rippleDeleteSel`/`reallySave` (those save).
- **Note:** the owner's media source file (`cac4f1f9…`) is **absent on disk** in this environment (his media bin loads empty). Pre-existing, NOT a regression — his clip + edits are preserved; it just can't preview the actual frame until the source is present.

---

## 1. CURRENT STATE (what works, as of 2026-06-19)

The editor is **genuinely usable for a real edit** — import → cut/trim → transform/effects/masks/titles → export both verified end-to-end with a real synthetic clip (ffmpeg `testsrc2`+tone → import → native export AND frame-server export → valid h264+aac mp4, mask cut confirmed in the exported frame).

Shipped & pixel-verified this session:
- **Blank start.** `newProject()` returns `tracks:[]`. Add tracks with **＋ Track**, or drop media (auto-creates a track). Dropping on empty lane space also makes a track.
- **Type-agnostic tracks.** A track is a generic container; the **clip** carries its kind (`c.kind` ∈ `video|image|audio|solid|text`). One track can hold video AND audio. `clipKind(c)` is the single source of truth (back-compat: infers kind for old clips lacking `c.kind`).
- **Per-stem AE property tree** on the track header (the "stem"): **Masks ▸ / Effects ▸ / Transform ▸ (Anchor Point·Position·Scale·Rotation·Opacity) / Audio ▸**, nested twirls, keyframe stopwatches, a **+ Effect** picker and **+ Mask**, per-effect/per-mask remove (×). Smaller rows (`LANE_H=46`).
- **15 working, house-named effects** (`FX_DEFS`): Soft Focus, Lift & Punch, Crush Contrast, Color Boost, Hue Shift, Mono, Old Film, Negative, Cast Shadow (all `ctx.filter`); Edge Burn (vignette), Color Wash (tint), Grain (overlays); Pixelate, Dream Glow, Posterize (layer-buffer pixel ops). All render in preview AND export, and auto-appear in +Effect / tree / inspector via `FX_DEFS`.
- **Masks** — box (rect/ellipse), free-form **pen** (click points, click first to close, Backspace pops a point, Esc cancels), **smooth** pen (closed Catmull-Rom spline toggle), with **Add/Subtract, Feather, Opacity, Expansion, Inverted**. Editable three ways: stem tree, inspector (numeric incl. box X/Y/W/H), and **drag on the monitor** (box handles or pen vertices). **Layer-space** — masks track the layer's position/scale/rotation/anchor (text masks track too, pivoting about the text base).
- **AE-exact Anchor Point** (pivot for rotation/scale; Position pins it). Anchor 0,0 = identical to before, so old projects don't move.
- **Ripple delete** — `Shift+Delete` (or Shift-click the trash button) removes a clip and slides later clips on that track left to close the gap. Plain `Delete` lifts (leaves the gap).
- Plus everything from prior sessions: the AE menu bar / tools rail / workspaces (`ae-menus.js`), undo/redo, Composition Settings (Ctrl+K), frame-level timeline zoom, monochrome tool icons, solids, right-click menus, viewer move/scale/zoom, per-keyframe easing, label colors, Open Recent, Resolution, overlays (grid/guides/safe), Time-Reverse/Freeze/Flip/Arrange/Center-In-View, keyframable audio + Convert-Audio-to-Keyframes.

---

## 2. ARCHITECTURE MAP (where everything lives)

All editor code is in `static/editor.html`. Functions are **top-level in the inline `<script>`**; the menu/tools/workspaces renderer is an IIFE (`aeChrome()`) at the END of that script (runs after the top-level fns and after `ae-menus.js` loads). Reference things by **function name** — line numbers shift.

### Data model
- `project = {id,title,fps,width,height,tracks:[], previewRes?, duration?, bg?}`. `newProject()` → blank.
- **Track** = `{id, name, clips:[]}` — **no fixed kind** (old saves may still carry `track.kind`; the client ignores it, the server uses it only as a fallback).
- **Clip**: always has (or infers) a kind. Common fields: `start, in, dur`. Visual clips add `opacity, posX, posY, scale, rotation, anchorX, anchorY` (keyable), `scaleX, scaleY, blend, fx* effect fields, masks[], reversed, freeze, label, name, _open, _tw`. Audio: `volume, audioFadeIn, audioFadeOut`. Solid: `solid:true, color`. Text: `text, size, color, x, y`.
- **`clipKind(c)`** — THE kind resolver. Returns `c.kind` or infers from `c.text`/`c.solid`/`MEDIA[c.mediaId].kind`. Use it everywhere instead of `track.kind`.
- **Keyframes:** `KDEF` = default values for every keyable field; `KEYABLE = Object.keys(KDEF)`. A keyed field is `{k:[{t,v,e}]}` (t=frame within clip, v=value, e=easing). **`pval(c,field,fr,def)`** reads a scalar or interpolated keyed value. `isKeyed`, `toggleAnim`, `writeProp`, `setAnimValue`, `upsertKey`, `gotoKey`.

### Coordinate system (critical)
- **Comp space** = `project.width × project.height`. **`stageK(W,H)`** = uniform scale to fit the canvas (letterboxed, never anamorphic). `ox,oy` = letterbox offsets. Comp `(px,py)` → canvas `(ox+px*k, oy+py*k)`.
- **`applyClipTransform(g,c,f,W,H,k)`** — applies the clip's transform (pos/rot/scale/anchor) to a canvas ctx. Shared by `drawClip`, `drawSolidClip`, and the mask renderer. **Identity when the layer is untransformed.** Text branch pivots about `textBase(c,…)` (default bottom-centre); others about comp centre.
- **`clipMatrix(c,f,W,H)`** — the SAME transform as a `DOMMatrix` mapping comp→canvas, for the on-monitor overlay & editing. **Must stay byte-identical in op order to `applyClipTransform`** or handles drift from the cut. `safeInverse(M)` returns `null` for a singular (scale-0) matrix (callers then skip mask editing — guards a NaN-corruption bug).

### Render pipeline (preview + export share it)
`drawFrame()` → `drawFrameInto(sctx, screenW, screenH, playhead)` + `drawOverlays` + `drawSelOverlay` + `drawMaskOverlay`.
- **`drawFrameInto(ctx,W,H,f,srcOverride?)`** — fills bg; `activeVideoClips(f)` (visual clips, z-order = track index) → `drawSolidClip` / `drawClip`; `activeTexts(f)` → `drawTextClip`. (Export passes a real `OffscreenCanvas` + a `srcMap` of pre-seeked `<video>`s.)
- **`drawClip` / `drawSolidClip` / `drawTextClip`** — compute alpha; if `needsLayerBuffer(c,f)` (clip has masks OR pixelate/glow/posterize) → `withLayerFX(ctx,c,f,W,H,drawInner)`, else `drawInner(ctx)`. `drawInner` sets `ctx.filter = clipFilter(...)`, calls `applyClipTransform`, draws the content, then `clipOverlayFX` (vignette/tint/grain).
- **`withLayerFX`** — renders `drawInner` into offscreen `L`, applies **pixelate → glow → posterize**, then **masks** (`buildMaskAlpha` into `M`, `destination-in` onto `L`), then blits `L` to `ctx` with the clip's blend mode. Uses 3 reusable offscreen canvases (`_mkL/_mkM/_mkS`).

### Effects
- **`clipFilter(c,f,kpx)`** → a CSS `ctx.filter` string from fields `fxBlur/fxBright/fxContrast/fxSat/fxHue/fxGray/fxSepia/fxInvert/fxShadow`. (drop-shadow last.)
- **`clipOverlayFX(ctx,c,f,rect)`** → post-draw overlays clipped to the drawn image rect: `fxTint` (multiply), `fxVignette` (radial), `fxGrain` (noise pattern). `hasOverlayFX` reports them.
- **`withLayerFX` pixel passes** → `fxPixel` (shrink+nearest upscale), `fxGlow` (blurred-bright screen), `fxPosterize` (getImageData level-quantise). `hasLayerBufferFX` reports them.
- **`FX_DEFS`** = `[[field, houseName, default, paramLabel, addValue], …]` — the single list that drives the +Effect picker (`openAddFx`), the stem-tree Effects group, and the inspector Effects group. **Add an effect here and it auto-appears in all three.**
- `applyEffect(field,val,label)` sets the field + reveals it in the tree. `removeEffect`, `clearEffects`. Top **Effect** menu items are matched to house effects in `actionFor` (so AE labels like "Gaussian Blur"/"Invert"/"Drop Shadow" light up).

### Masks
- `c.masks[]` = `{id,name, shape:'rect'|'ellipse'|'pen', mode:'add'|'subtract', inverted, feather, opacity, expansion, box:{x,y,w,h}, points?:[{x,y}], smooth?}` (comp coords).
- `clipMasks(c)` (visible masks), `newMask`, `addMask`, `deleteMask`, `isPenMask` (≥3 points), `penBBox`.
- **`buildMaskAlpha(M,S,c,f,W,H)`** — composites the combined alpha into `M`: each mask shape via `_maskShapePath` (rect/ellipse/polygon/smooth-spline), feathered (blur), `add`=source-over / `subtract`=destination-out, `inverted`=xor flip; **`applyClipTransform` is applied so masks are layer-space.**
- **Pen tool:** `tool==='pen'` (wired in `toolAction` /pen/ + `setTool`). `penDraft = {clipId,points}`. `penClick` drops comp-space points (inverse-mapped through `clipMatrix`); `finishPenMask` closes; `cancelPenDraft`. Vertex editing: `penVertexAt(m,x,y,M)`, `startVertexDrag`, the `vertexdrag` branch in the `screen` pointermove.
- **Monitor editing:** `drawMaskOverlay` draws outlines under `applyClipTransform` and handles via `clipMatrix.transformPoint`. Box: `maskScreenQuad`/`maskBoxHandlesComp` + `hitHandle`/`pointInQuad`. Drags inverse-map the pointer to comp space via `safeInverse(clipMatrix)` and store `Minv`; `startMaskMove`/`startMaskScale` + the `maskmove`/`maskscale` pointermove branches.

### Stem property tree (the header)
- **`clipPropGroups(track,c)`** → a **FLAT list of row-nodes** (`{type:'group'|'effect'|'prop'|'mask'|'maskprop'|'add', …}`). Collapse state is per-clip in **`c._tw`** (`twOpen`/`twSet`). Effects rows are DERIVED from which `FX_DEFS` fields are active. Masks rows list each mask + its sub-props.
- `clipRowCount = clipPropGroups(...).length`; `trackHeight(t) = LANE_H + rows*PROP_H`. **Heads and lanes must iterate the same node list** so keyframe diamonds line up: `buildHeadProps` (header column) and `buildLaneProps` (lane keyframe column) mirror each other 1:1; `renderHeads` adds the header twirl.

### Export (TWO paths — this trips people up)
- **`projectNeedsFrameServer(p)`** decides. Returns true if ANY clip has: keyframes, pos/scale/rotation, scaleX/scaleY (flip), anchor, a solid, a mask, reverse/freeze, any effect (`clipFilter!=='none'` or vignette/tint/grain/pixel/glow/posterize), or a non-normal blend.
- **Frame-server path** (`exportViaFrameServer`, used when the above is true): the browser renders every frame via the SAME `drawFrameInto` into an `OffscreenCanvas`, streams JPEGs over a WebSocket to `/api/editor/export_frames`, server encodes + muxes audio. **This is the only path that honors effects/masks/motion.**
- **Native path** (`/api/editor/export`, used for plain cuts): server `_build_export_cmd` builds an ffmpeg `filter_complex` — trim/scale/pad/fade/opacity + drawtext only. **No effects, no masks, no flip, no solids, no reverse/freeze** (that's why they all force the frame-server).
- `$('#expGo').onclick` is the run handler; `pollExport` polls the native job.

### Backend (`app.py`, editor section only)
- **`_clip_kind(c, track_kind)`** — server mirror of JS `clipKind` (fallback `"video"`; intentionally NOT track_kind, so preview==export). Used by **`_build_export_cmd`** (native video/audio/text classification, video sorted by `_ti` = track index for z-order) and **`_build_audio_cmd`** (frame-server audio submix). **If you change the clip kind model, update both.**
- Endpoints: `/api/editor/pick` (native file dialog), `/api/editor/import`, `/api/editor/media[/{id}/status|src|proxy|poster|strip|peaks]`, `/api/editor/projects[/{id}]`, `/api/editor/export` (native + status/cancel/file), `/api/editor/export_frames` (WS frame-server). Media → `data/editor/{media.json, cache/, projects/, exports/}`.

---

## 3. INVARIANTS & GOTCHAS (don't break these)

1. **`applyClipTransform` (ctx) and `clipMatrix` (DOMMatrix) must match** in operation and order. Both are identity for an untransformed layer (keeps old projects byte-identical). Test any transform change on a SCALED+ROTATED layer, not just a default one.
2. **A new visual effect must be added in ALL of these** or it half-works: `KDEF`; `FX_DEFS`; the renderer (`clipFilter` OR `clipOverlayFX` OR a `withLayerFX` pixel pass); `isIdentity` (so it isn't fast-pathed away); `hasOverlayFX`/`hasLayerBufferFX`+`needsLayerBuffer` as appropriate; and **`projectNeedsFrameServer`** (so it EXPORTS — the native ffmpeg path can't do it). **Forgetting `projectNeedsFrameServer` = renders in preview, silently dropped on export.** (That class of bug hit flip, solids, reverse/freeze, and every new effect.)
3. **`save(true)` persists `project`.** Don't let tests pollute the project list; clean up (see §0).
4. **Beware broad `replace_all`.** A global replace of `const masks=clipMasks(c);` once appended `,buf=needsLayerBuffer(c,f)` into `buildMaskAlpha` (which has no `f` param) → ReferenceError crashed every masked render. After any `replace_all`, **re-grep the pattern and run the exact code path it touched** (e.g. actually add a mask, don't just test an unmasked clip).
5. **Singular matrices.** A scale-0 layer makes `clipMatrix().inverse()` return all-NaN (doesn't throw). Always go through `safeInverse`.
6. **`addText`/`addVid` are inline `onclick` handlers**, not standalone fns — menu code calls `$('#addText').click()`. `newProject()` only returns an object; the real "new" flow is the hidden `#btnNew` handler.
7. **HARD UI rules the owner cares about:** blank start; tracks are generic (any clip type); the property menu lives ON the stem/header; rows are compact; effects are house-named (no trademarks).

---

## 4. VERIFICATION DISCIPLINE (this caught real bugs every time)

After any non-trivial or cross-cutting change: build the change → **pixel-verify the exact path** in the browser (not screenshots) → then run an **adversarial review** with the `Workflow` tool (2-3 finder agents over the diff + a verify stage that re-reads the code and confirms `real:true`). It found, every round: the `buildMaskAlpha` ReferenceError blocker; flip/solid/reverse/freeze export drops; the scale-0 NaN matrix corruption; pen "finish onto a stale clip" + "Backspace deletes the clip" + tool-rail desync. **Fix what it confirms, re-verify, then ship.** Don't skip it on the matrix/compositor changes.

---

## 5. WHAT'S NEXT (pick one; enough detail to start)

1. **Draggable bezier handles on pen masks** (owner asked for this). Today pen points are straight segments or an auto-smooth spline (`m.smooth`). For true AE pen: give each point optional in/out tangents; pen-creation **click-drag** sets the out tangent (mirror to in); `_maskShapePath` uses `bezierCurveTo` between points with handles (else `lineTo`); `drawMaskOverlay` draws the handle lines + dots; vertex drag moves point+handles rigidly, handle drag adjusts the tangent (mirror unless Alt to break). Contained to the pen-mask code; all goes through the existing `clipMatrix` so it's layer-space for free.
2. **Adjustment layers** (very on-theme). A clip flagged `adjustment:true` with no content that applies its effects/masks to **everything beneath it**. In `drawFrameInto`, when you reach the adjustment in z-order: snapshot the current canvas to an offscreen, apply the adjustment's `clipFilter`/`clipOverlayFX`/posterize/masks to it, draw it back. Medium risk (touches `drawFrameInto` + the export frame loop). Add a Layer ▸ New ▸ Adjustment Layer entry like `newSolid`.
3. **Mask keyframing** — animate box/points/feather/opacity over time (per-frame interpolation of the points array). Bigger.
4. **Reskin** — owner wants a visual restyle; **needs his aesthetic direction first**. CSS custom properties live at the top of the `<style>` block in editor.html (`--bg0/--bg1/--cy/--panel/…`).
5. **Text-mask uniform-scale exactness** — text masks now track pos/rot/scaleX/scaleY; the uniform `scale` is applied as a transform scale on the mask but baked into font-size for the glyphs. Geometrically matches in practice; revisit only if a heavily uniform-scaled masked title looks off.
6. **Big greyed AE items** still honest stubs: real Render Queue, precompose/nesting, paint/roto/puppet, 3D. Show them; don't fake them.

---

## 6. HISTORY (condensed — full detail in git log + the auto-memory `editor-ae-overhaul.md`)

- **Sessions 1–2 (2026-06-17):** AE menu bar/tools/workspaces (data-driven from `ae-menus.js`, regen via `studio-research/video-editor/gen_ae_menus.py`), undo/redo, Composition Settings, solids, right-click menus, viewer manipulation, timeline twirl-down keyframe properties, per-keyframe easing, overlays, label colors, Open Recent, Resolution.
- **2026-06-18:** frame-level timeline zoom, monochrome icons, inspector Scale X/Y.
- **2026-06-18→19 (this big push):** blank start + type-agnostic tracks (`clipKind`), the per-stem AE property tree, 15 house-named working effects, the full mask system (box/ellipse/pen/smooth/layer-space + monitor editing), AE-exact anchor, ripple delete, end-to-end import→export verification (both paths), and the backend `_clip_kind` classification. Several adversarial-review rounds; all confirmed bugs fixed.

**Files:** `static/editor.html` (the app), `static/ae-menus.js` (generated menu/tool/workspace data), `app.py` (editor endpoints + the two export builders), `studio-research/video-editor/` (research + the menu generator). Auto-memory index: `editor-ae-overhaul.md`.
