# LePrince Visual Labs — 3D + Shape Layers + Content-Aware Fill · HANDOFF

**Built 2026-06-26 (overnight, owner asleep, "max" autonomous run).** Owner pointed at After Effects' **New Layer** menu (Text / Solid / Light / Camera / Null / Shape / Adjustment / Content-Aware Fill) and said "I need all that, and 3D capabilities — do the research, make the best calls, finish everything you can." This session built the pieces that prior sessions had deliberately **skipped**: Shape Layers, a real **3D system** (camera + lights + 3D layers, Three.js), and **Content-Aware Fill**. Text / Solid / Null / Adjustment already existed.

> ⚠️ **UNCOMMITTED** — parallel sessions are in this tree (app.py, swarm_routes.py, kit-helper.js, wall.html). Everything here is **editor-only** and left uncommitted for the owner's morning batch. Do NOT `git add -A`. My files are listed under "Files" below — commit only those if shipping.

---

## What shipped (all built + browser-verified on port 7799)

### 1. Shape Layers  ✅
New clip `kind:'shape'` — parametric vector shapes: **Rect, Rounded Rect, Ellipse, Polygon, Star, Line**, each with fill (solid color, toggleable), stroke (color + width), all sizes. Fully transformable + keyframeable (reuses the shared transform/effects/masks/blend pipeline), exports via the frame-server. Inspector "Shape" group (type chips + W/H/corner/points/inner%/fill/stroke). New ▸ Shape Layer wired.

### 2. 3D system  ✅ (the headline)
- **3D Layer toggle** on any visual layer (`c.threeD`) → adds **Pos Z**, **X/Y Rotation** (Z rotation = the existing "Rotate"), and material options **Accepts Lights / Casts Shadows / Accepts Shadows**.
- **Camera layer** (`kind:'camera'`) — Zoom, Position X/Y/Z, Point of Interest X/Y/Z. Keyframe them to fly through the scene.
- **Light layers** (`kind:'light'`) — Ambient / Point / Spot / Parallel, Color, Intensity, Cone Angle + Feather (spot), Position + POI, Casts Shadows.
- Renders via **Three.js r160** (vendored offline at `static/vendor/three.min.js`). AE **Classic-3D** model: contiguous runs of 3D layers render through the perspective camera + lights and composite onto the 2D output; 2D layers break the run (screen space, unaffected by camera/lights). No lights in comp ⇒ 3D layers are full-bright (matches AE).
- Verified: a 3D layer at z=0 fills the comp exactly like its 2D self; pushing it back in Z shrinks it (real perspective); camera Zoom changes FOV; lights illuminate by intensity (dim=137, bright=255 measured); Y-rotation turns the plane edge-on. Showcase screenshot taken (3 lit cards in depth + star + title).
- Exports for free (it all runs inside `drawFrameInto`, which the frame-server uses).

### 3. Content-Aware Fill  ✅
Pure-client, offline, **no API key**. Mask the object to remove → Layer ▸ New ▸ Content-Aware Fill Layer → it synthesizes the hole from surrounding pixels and drops a feathered **"Fill N"** patch layer above the source (non-destructive; hide/delete to compare). Two engines in `static/editor-inpaint.js` (written from the papers, no GPL code):
- **Telea FMM** — fast, smooth; default for small/thin holes (scratches, blemishes, small objects).
- **Criminisi exemplar** — copies real patches for texture; auto-picked for larger object removal, run downscaled (≤360px) with a **3.5s wall-clock guard** so it can never hang (leftover gets Telea-cleaned).
- Honest by design: it samples real pixels, can't invent unseen content. Great for clean/textured backgrounds; a diffusion model wins for large holes over complex structure.

### 4. Auto-trace + Create ▸ menu  ✅ (added after owner feedback: "I need auto trace too")
New engine `static/editor-trace.js` (`window.LPTrace`) — marching-squares contour extraction + Douglas-Peucker simplify. Turns a layer's alpha/luma into vector mask paths, with **holes** handled via even-odd containment (outer = add mask, hole = subtract). Wired:
- **Layer ▸ Auto-trace…** → traces the selected layer → pen masks on it. Auto-picks alpha vs luma channel. Verified: star → 1 path (12 pts), stroked ring → 2 paths, text "AB" → 5 paths, and an "O" renders as a filled ring with a real transparent hole.
- **Create ▸ Create Masks from Text** → trace masks onto the layer. **Create Shapes from Text / from Vector Layer** → a new solid carrying the traced masks = a filled custom outline shape (e.g. filled text). **Create 3D Layer Instance** → makes the selected layer 3D (now that 3D exists). **Convert to Editable Text** → toast (our text is already editable).

### 5. Menu wiring  ✅
Un-greyed in the Layer menu + right-click New: **Camera…, Light…, Shape Layer, Content-Aware Fill Layer, Layer ▸ 3D Layer** (toggle), plus the main-menu **Camera / Light** leaves (also create), **Auto-trace…**, and the **Create ▸** items above. Verified enabled via the real menu DOM. Still honestly greyed: Pre-compose (nesting — big), Scene Edit Detection (shot detect), Photoshop/C4D file import — out of scope for now.

---

## Files
- `static/editor.html` — all integration (shapes, 3D engine, fill orchestration, inspector, menu). **Clean baseline at session start = committed v2.3.0; all my edits are uncommitted.**
- `static/editor-inpaint.js` — **NEW.** Telea + Criminisi engines + a MinHeap. `window.LPInpaint = {telea, criminisi}`.
- `static/editor-trace.js` — **NEW.** Marching-squares contour tracing + Douglas-Peucker. `window.LPTrace = {buildBinary, trace}`. Powers Auto-trace + Create-from-Text/Vector.
- `static/vendor/three.min.js` — **NEW.** Three.js r160 UMD (~670KB, last build with global `THREE`). Vendored for offline (desktop app).
- `.claude/launch.json` — added `editor-preview` (port 7799) to avoid colliding with parallel sessions on 7788.
- `studio-research/video-editor/3d-and-fill-build-spec.md` — **NEW.** Distilled research (Three.js mappings + inpaint math) — read it if extending.
- `AUDIT_HANDOFF.md`, `static/audio-ear.js` — pre-existing untracked (NOT mine).

## Architecture map (editor.html, by function name — lines shift)
- **Shapes:** `shapePath`/`_rrPath`/`shapeDims`/`drawShapeClip`; `activeVideoClips` (shape branch) → `drawOneClip` (shape branch); `newShape`; `shapeInspector`/`bindShapeInspector`.
- **3D:** the block from `lp3dOK` … `render3DRun`. Key pieces: `lp3dRenderer` (cached WebGLRenderer, reused — keyed on letterbox size + comp dims), `lp3dGetPlane` (per-index pool of canvas+texture+two materials+mesh), `render3DLayerTexture` (renders a layer untransformed at comp res into the plane canvas; transform applied to the mesh), `build3DCamera` (zoom→FOV `2·atan(H/2/zoom)`, AE→Three Y/Z flip), `apply3DLights`, `render3DRun` (one Three render per 3D run → `drawImage` onto the 2D ctx at the letterbox offset). `drawFrameInto` now: non-3D path = old loop via extracted `render2DEntry`; 3D path = walk + group contiguous 3D runs.
- **Fill:** `contentAwareFill`/`_runContentAwareFill`; `imageFor` (now supports inline `c.dataURL`); fill output is a `kind:'image'` clip carrying a `dataURL`.
- **Export gating:** `projectNeedsFrameServer` returns true for shape / threeD / camera / light / dataURL (verified). Plain clips still take the fast native path.
- **KDEF additions (all keyframeable):** posZ, rotX, rotY, orientX/Y/Z, camZoom, poiX/Y/Z, lightIntensity, lightConeAngle, lightConeFeather.

## Verification done (port 7799, throwaway projects, `pym3odm` never saved over)
Shapes (all 6 types, fill/stroke/opacity/rotation), 3D (z-depth perspective, camera zoom, light intensity, rotation, default-ambient), inspectors (camera/light/3D groups render + bind), menu un-grey (DOM), fill engines (Telea + Criminisi remove a green blob, <300ms, no hang), full fill pipeline (mask→hole→inpaint→patch layer→composites, object gone), export gating, camera/light monitor markers. Console clean throughout (only benign Three.js r160 deprecation warnings).

## Adversarial review (2 agents over the diff) — DONE, all confirmed bugs FIXED
1. **Guide + 3D layer leaked into export** — `is3DEntry` didn't check `c.guide`, so a layer that was both Guide and 3D rendered into the exported file. FIXED: the 3D dispatch now routes export-guides to the 2D path (which drops them). Verified: renders in preview, drops on export.
2. **Content-Aware Fill clip could become its source's track matte** — if the source layer used a Track Matte and was top-most, the same-track Fill push made it the matte. FIXED: when the source has a `trackMatte`, the Fill goes on its own new top track.
3. **Telea had no wall-clock guard** (Criminisi did) — a pathological large hole could freeze the thread. FIXED: added the same `maxMs` (5s) guard.
4. Text 3D toggle was a silent no-op — FIXED (toggle3D now rejects text).
Reviewers verified clean: the 2D path is byte-identical (extracted `render2DEntry`), run-grouping can't loop/skip/double-render, renderer lifecycle has no context leak, export compositing aligns, degrade-without-WebGL is safe, no duplicate inspector IDs, both inpaint engines terminate, all fill guards present.

**Known caveats (documented, low-risk, not fixed):** (a) Fill on a *video* layer fills the frame currently decoded in the preview `<video>` — fine in practice since the user sees that frame, but a mid-seek could use a stale frame. (b) Each Fill stores a full-frame PNG dataURL on the clip → large in the project JSON / undo history if you do many fills.

## ⚠️ Gotchas / lessons
- **Owner's project `pym3odm`** is the boot default — NEVER `save()` over it. All tests swap `project` to a throwaway and restore without saving. `window.save` is stubbable for menu-execution tests.
- **Don't run Criminisi at full res** — it's O(N·perimeter). The editor downscales to ≤360px + has a wall-clock guard. (Learned the hard way: a full-res test hung the tab; recover with preview_stop→preview_start.)
- **3D rotation signs** are `(rotX, -rotY, -(rotation))` order `YXZ` (AE→Three Y/Z flip). Looks correct; if a future tweak needs exact AE parity, that's the place.
- Three.js r160 prints one benign deprecation warning (UMD removed in r161) — harmless.
- **Owner's directive (2026-06-26):** "impossible" isn't an acceptable answer — *build the engine that makes it possible and connect it.* That's the pattern here: `vendor/three.min.js` (3D), `editor-inpaint.js` (fill), `editor-trace.js` (auto-trace) are all connectable engines wired into the editor. Keep doing this for the next "impossible" thing rather than greying it out. And **verify everything in a real browser** (he asked twice).
- **Testing gotcha:** the menu-flyout DOM automation (`.mb-panel` open via synthetic click) is flaky in `preview_eval`. Verify menu *enablement* by reading `mb-dis`, but verify the *actions* by calling the global engines (`LPTrace`/`LPInpaint`) + render fns (`drawOneClip`/`drawTextClip`/`buildMaskAlpha`) directly on a throwaway project. Stub `window.save` for any test that would persist — and **reload after**, because a test that throws before its restore line leaves `project`/`save` dirty (only in the tab; disk is safe since save was stubbed).

## What's next (honest backlog)
- **Monitor 3D gizmo** — no on-canvas 3D handles yet; you position via the inspector (keyframe-able). A drag-in-3D gizmo + an orbit "custom view" would be the next UX win.
- **Per-frame video fill** — Content-Aware Fill fills the CURRENT frame into a still patch (great for photos / held frames). Temporal video fill (track the hole across frames) is a much bigger job.
- **Criminisi quality** — current is greedy + band-restricted + downscaled (fast, good for texture). PatchMatch + EM "search & vote" + a pyramid would up the quality (spec in the research md).
- **Shadows** verified to wire (castShadow/receiveShadow + shadow map) but not visually tuned — exercise with a floor plane + spot.
- **Shape pen paths** — parametric shapes only for now; freeform vector pen-path shapes (the mask pen engine could be borrowed) would complete AE parity.
- Light/camera **monitor markers** (like the null crosshair) would make them easier to grab.

## How to run/verify
`preview_start` config **`editor-preview`** (port 7799) → `http://127.0.0.1:7799/static/editor.html`. `preview_screenshot` works here (unlike the documented 7788 flakiness). Build state with a throwaway `project`, `drawFrame()`, pixel-sample `#screen`; restore `pym3odm` WITHOUT saving.
