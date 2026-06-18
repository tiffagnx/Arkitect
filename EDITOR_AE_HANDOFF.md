# LePrince Visual Labs — After Effects Overhaul (Handoff)

Goal (owner B): make `static/editor.html` — the LePrince Visual Labs browser NLE/compositor — **look and feel like Adobe After Effects**. This is separate from the Pro Tools DAW build in `static/studio.html` (someone else owns that). **Only touch `editor.html` for this work.**

How the owner wants it built: open it in a **real full-screen browser** (not the downscaled embedded preview) and make it look right. Dev preview server: `arkitect-preview` launch config on **port 7788** → `http://127.0.0.1:7788/static/editor.html` (the owner's own app runs on 7777; leave it alone). Drive/verify via the Chrome MCP for true-resolution screenshots.

## The Method (mirror it)
Same pipeline the Studio used: **research → spec markdown → JSON config → generated JS global → data-driven renderer in the HTML.**
- Research output lives in `studio-research/video-editor/ae-spec/*.md` (one deep-dive per AE menu + `tools.md`, `workspaces.md`, `dialogs.md`, and **`00-critique.md`** = the reviewer punch-list).
- Structured config: `studio-research/video-editor/ae-config/*.json`.
- Regenerate the runtime file: `python studio-research/video-editor/gen_ae_menus.py` → writes `static/ae-menus.js` (`window.AE_MENUS / AE_TOOLS / AE_WORKSPACES / AE_DIALOGS`). It reads the workflow `.output`; update the `OUTPUT` path in the script if you re-run the research workflow.
- The renderer is an IIFE at the **end of the inline `<script>` in editor.html** (`aeChrome()`): `buildMenuBar`/`buildPanel`/`openAt`, `buildTools`, `buildWorkspaces`, and `actionFor` + the `ACT` map. **Only items with a wired action are live; everything else renders greyed — the full AE silhouette, on purpose.**

## Shipped & verified (2026-06-17)
1. **Monitor-overflow bug fixed** — `#screen` was rendering at full 1280×720 (the `max-height:100%` didn't resolve inside the grid/flex stage), spilling over the transport + timeline. Now absolute-centered (`top/left:50% + translate(-50%,-50%)`, `max-width/height:calc(100% - 28px)`).
2. **Undo/redo engine** — checkpoint stack (`HIST`/`HPTR`), one checkpoint per committed save; `Ctrl+Z` / `Ctrl+Shift+Z` / `Ctrl+Y`.
3. **Composition Settings dialog** (`Ctrl+K` or the Inspector button / Composition menu) — Basic·Advanced·3D-Renderer tabs, Preset, Width/Height + Lock Aspect, Frame Rate, Resolution (`project.previewRes`), Duration (`project.duration`), Background Color (`project.bg`).
4. **AE menu bar** — File · Edit · Composition · Layer · Effect · Animation · View · Window · Help (9 menus, full submenus incl. the whole Effect category tree; real dividers/shortcuts/greying).
5. **Tools rail** — 14 AE tools (Selection, Hand, Zoom, Rotation, Anchor/Pan-behind, Shape, Pen, Type, Brush, Clone, Eraser, Roto, Puppet). Selection + Type are wired; the rest are present (AE fidelity) and toast “not in this build yet.”
6. **Workspaces** — Editing / Effects / Color / Audio / Minimal / Review; switch density + show/hide bin/inspector/timeline. Persists to localStorage. (Fixed a CSS-grid auto-placement bug by pinning `.col.bin/.mon/.insp` to explicit `grid-column`.)

Wired menu actions: File New/Open/Save/Save As/Increment & Save/Revert/Export · Edit Undo/Redo/Cut/Copy/Paste/Duplicate/Clear/Split Layer/Keyboard Shortcuts · Composition New/Settings/Add to Render Queue · Layer New>Text/Reset/Blending Mode (+Next/Prev) · Effect Gaussian Blur·Brightness & Contrast·Hue/Saturation·Remove All · Animation Add Keyframe·Toggle Hold·Easy Ease (In/Out) · View Zoom In/Out·Go to Time · Window panel toggles.

## Shipped in session 2 (overnight, all verified)
- **Solid layers** (Layer/right-click New > Solid; color picker in Inspector); **right-click context menus** (New on empty comp/timeline; full Layer menu on a clip) with the **full Effect category tree** (Gaussian Blur / Brightness & Contrast / Hue-Saturation / Remove All live, rest greyed).
- **Viewer manipulation**: select box + 8 handles + anchor crosshair; drag-to-move; corner = uniform scale, **edges = non-uniform X/Y scale**; mouse-wheel **view zoom** (separate from layer scale) + %, double-click reset; drop media on the viewer = add layer. Works for video, solid, AND text (text box measured + pivoted at its real center).
- **Timeline twirl-down properties**: ▸ on every clip → Transform (Position/Scale/Rotation/Opacity) + Audio (Audio Levels/Waveform) rows with stopwatches + keyframe dot-lanes; heads & lanes grow together (dynamic `trackHeight`).
- **Per-keyframe easing**: right-click a keyframe diamond → Linear / Easy Ease / In / Out / Hold.
- **Layer actions**: Center In View, Flip Horizontal/Vertical (negative X/Y scale), Time-Reverse Layer (↺) + Freeze Frame (❄) (centralized `clipSrcFrame`, export byte-identical for default clips), Rename (`c.name`), Duplicate, Arrange (move across video tracks = z-order).
- **Keyframable audio levels** (`volume` in KEYABLE; preview honors `pval(volume)`; default unchanged) + **Convert Audio to Keyframes** (Animation>Keyframe Assistant — beat-reactive scale from cached peaks; needs audio on the timeline to exercise).
- **Overlays reworked**: AE's 5 separate toggles (Title/Action Safe, Proportional Grid, Grid, Guides, Rulers), ALL OFF by default, via the monitor ▦ dropdown. Plus earlier session-1 items (undo/redo, Composition Settings, label colors, Open Recent, Resolution, menu bar/tools/workspaces).
- **Bug fix**: submenu-overlap in the menu renderer (`clearFly(level)` not `level+1`).

## Shipped since (2026-06-18, all verified)
- **Frame-level timeline zoom** (commit `0aaa8fe`) — the headline cut-accuracy fix. Zoom slider now `1–120 px/frame` (was 2–60); `applyPpf(centerFrame)` keeps the playhead centered; **Ctrl/Alt + wheel** zooms toward the cursor (`tlWheelZoom`); **`+` / `−`** keys zoom on the playhead. `renderRuler` is frame-aware: picks a "nice" major interval (`1,2,5,10,fps,fps·2…`) so the first tick ≥72px wins, and draws a **per-frame subtick** on every frame once `ppf≥7` (capped at ≤2600 frames on screen). At high zoom one second spreads across the whole timeline → land a cut on any single frame. Verified: ppf=24 → 720 subticks + 181 majors; ppf=4 → 0 subticks. Visually confirmed on 7777 (ruler showed `00:00:00:00·:02·:04…` = frame-level).
- **Monochrome tool-rail icons** (commit `c4887f7`) — replaced the colorful emoji glyphs with one-color line SVGs (`currentColor`, graphite/steel-cyan scheme). `TOOL_ICONS` map keyed by exact tool name; `buildTools` sets `innerHTML` from it; fixed the boot bug (`setActiveTool('Selection')`, was `'Selection Tool'`). Verified: 14 tools, all SVG, no emoji, Selection active.
- **Layer right-click menu starts at Mask** (commit `3b405f3`) + **Inspector Scale X / Scale Y fields** (commit `5929dfc`) — non-uniform scale is now editable by number, not just edge-drag.

## Still open (next session)
1. **Draggable anchor point** + non-uniform edge scale on rotated layers — needs the `drawClip` pivot-matrix rewrite + position compensation (interaction-model.md §1.10). Crosshair is a read-only indicator today.
2. **Export AUDIO volume automation** — preview honors keyed `volume`; the server muxer (`app.py`, the OTHER track's file) reads scalar volume. Coordinate with that owner.
3. **Optional polish**: swap the precise researched `context-comp`/`context-layer` ordering in (configs in `ae-config/`); live "Undo X / Redo Y" labels; tune the zoom *feel* if the owner wants (slider range/speed, zoom-to-playhead vs zoom-to-cursor).
4. **Bigger build-outs** (still greyed, honest): real Effect *stack* (vs the 5 fixed filters), Solid/Adjustment/Null beyond Solid, masks/pen/shapes/paint/roto/puppet, precompose/nesting, real Render Queue, 3D. Show them for fidelity; don't fake them.

## Gotchas
- editor functions are top-level in the inline script; the `aeChrome()` IIFE runs after them and after `ae-menus.js` loads (script tag is placed before the inline script).
- `addText`/`addVid`/`addAud` are inline `onclick` handlers, not functions — menu calls use `$('#addText').click()` etc.
- `newProject()` only returns an object; the real "new" flow is the hidden `#btnNew` handler.
- Don't test against the owner's live project without restoring it (use undo) — 7788 shares the data dir with 7777.
