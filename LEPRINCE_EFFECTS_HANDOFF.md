# LePrince Visual Labs — Effects Build · HANDOFF (2026-06-26 night)

**Cold-start: read this, then `EFFECTS_AUDIT.md`, then the `leprince-effects-build` memory.** Everything below is **UNCOMMITTED** (parallel sessions in the tree — do NOT commit/push; owner batches in the morning).

## The mission (owner)
Make **every** effect in LePrince Visual Labs (`static/editor.html`) actually work — **zero fake**. If an effect can't truly do what its name promises on a flat-2D / single-frame canvas → **delete it** (no grayed stubs), document why + a LePrince-native alternative. Also rename all **"CC ___"** (Cycore/Adobe) effects → **"LePrince ___"**.

## Where it stands — DONE ✅
- **CC→LePrince rename** — one line in `scrub()` (`editor.html`): `.replace(/\bCC\s+(?=\S)/g,'LePrince ')`. Display-only (resolver matches raw labels). All 68 CC effects renamed.
- **Zero-fake audit** — all 289 effects ruled on (23-agent workflow + verifier). Verdicts + delete-reasons + LePrince alternatives + the "live-lies" list are in **`EFFECTS_AUDIT.md`**.
- **56 un-buildable effects DELETED** from the menu (`LP_KILL` set + `lpPruneItems()` in `editor.html` buildPanel). 5 whole categories gone (Audio, Expression Controls, 3D Channel, 3D, planar tracker). Menu: 22→17 categories.
- **117 real effects built** across 4 workflow waves + lie-fixes, in **`static/leprince-fx.js`** (a plugin registry, NEW file). **Menu now ~203 effects LIVE** (was 86). Each one Chrome-screenshot-verified.
- **Live-lies fixed** (the worst integrity issue — fake "working" effects): Remove Grain now really denoises (was the add-grain code), Spotlight is a real aimable light cone (was a vignette), Median is a real sort-window median, the 4 unwired VR stubs rebuilt. Match Grain honestly grayed (needs 2nd layer).
- **Two engine extensions** in `editor.html`: (1) buffer routing (`needsLayerBuffer` += `hasLPFX`) so registry effects render; (2) **second-layer access** — effects can read the layer above via `api.getLayer2()`.

## Architecture — the LP_FX registry
`static/leprince-fx.js` loads BEFORE editor's main script. Each effect = one `R({field,name,cat,color,def,applyVal,paramLabel,range,extra,match,render,[needs2nd]})`. **5 hooks in `editor.html`:**
1. `<script>window.LP_FX={...}</script>` + `<script src="/static/leprince-fx.js?v=1">` after ae-menus.js.
2. Integration loop after `FX_COLOR_SUBS` — folds modules into FX_DEFS/FX_CAT/FX_RANGE/FX_EXTRA/KDEF + `LP_FX.resolve`.
3. Render loop in `withLayerFX` before `// Masks` — calls `fx.render(api,val)` (api bundles lg/sg/L/M/S/W/H/c/fr/f/k + helpers pval/clamp/hex2rgb/morphMatte/blurMatte/reset/fbm/vnoise + **getLayer2()**) in try/catch. Only runs when `clip[field]!==def`.
4. Resolver consult in `actionFor` — `a.re.test(L)||a.re.test(scrub(L))` (match raw OR scrubbed label).
5. `needsLayerBuffer` += `hasLPFX`; + `clipNeeds2nd` + the 2nd-layer eager-render in `drawFrameInto`.

**Second-layer:** set `needs2nd:true`; `drawFrameInto` renders the layer ABOVE to a dedicated canvas (eager — NOT lazy, or it clobbers the shared `_mkCanvases` pool) and stashes `window.__lp2ndCanvas`; effect calls `const l2=api.getLayer2(); if(!l2)return; const above=l2.getContext('2d').getImageData(0,0,W,H).data;`. The above layer is consumed (not double-composited), like a track matte.

## How to add more effects (the proven recipe)
1. `Workflow` — agents author `R({...})` modules per the audit's per-effect algorithm (prefix fields per wave to avoid collisions; tell them the contract above).
2. `node` reads the workflow `.output` (`JSON.parse(fs.readFileSync)`, NOT require), concat `batches[].code`, splice into `leprince-fx.js` **before** `console.log('[LP_FX] registered'`. `node --check`.
3. Reload Chrome (`localhost:7788/static/editor.html`), run the auto-test: inject 2 stacked solids (test harness below), set `clip[field]=applyVal` (0.4 for wipes), `drawFrame()`, compare a monitor-canvas pixel hash to baseline, watch console for `[LP_FX]` warns. Spot-check a few visually with `preview`/Chrome screenshots.

## Chrome test harness (gotchas)
- Inject test clips into `project.tracks` (`project`/`drawFrame`/`FX_DEFS`/`clamp`/`pval` are page-reachable; most editor fns are closure-local). Solid `{kind:'solid',solid:true,color,start,dur,...transform}`; text `{text,color,size,x,y,...}`. **Apply effects by `clip.fxField=val; drawFrame()`** (pval reads clip[field]; bypasses closed applyEffect).
- **2nd-layer effects need TWO stacked VIDEO clips** (solids on V1 + Titles tracks → both go in `activeVideoClips`/`vis`, bottom→top; text clips do NOT, they're in `activeTexts`).
- **Time-driven effects** (Radio Waves, weather, Echo) show nothing at frame 0 — advance the frame with indirect eval `(0,eval)('playhead=45')` then `drawFrame()` (`window.playhead=N` does NOT reach the closure binding).
- Don't `save()` — test clips would persist to the server project.

## REMAINING ~30 (each needs one engine piece, then a wave)
- **Frame ring-buffer** → Echo, Time Difference.
- **Projection module** (equirect↔rectilinear/sphere) → VR Converter, VR Plane↔Sphere, VR Rotate Sphere, VR Sphere↔Plane.
- **Particle-state** (closed-form seed trajectories) → Particle Systems II/World, Foam, Particle Playground, Caustics.
- **Mask-path access** → Scribble, Stroke, Vegas, Write-on.
- **Simple builds just missed** → LePrince Cross Blur, Channel Blur.
- **Misc build-hard** → Reshape (MLS), Refine Soft Matte, Card Wipe, Twister, Liquify, PS Arbitrary Map.
- **Minor lies still** → Tint (single-color wash, not 2-color map), Radial Shadow (directional not point-light) — low priority.

## ⚠️ Parallel-session note
`static/leprince-fx.js` had Wave-4 batch-3 (Color Link/Texturize/Mr.Smoothie/Match Grain) already present when I went to integrate — another session may also be touching the effects, or it was a compacted-turn splice. If you re-run a wave, collision-check field names against the current file before splicing.
