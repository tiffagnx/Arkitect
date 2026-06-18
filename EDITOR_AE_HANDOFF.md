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

## Next up (priority order, from `00-critique.md`)
**High-leverage, mostly wiring or one small feature each:**
1. Apply the critique's tag corrections in the config (then re-run `gen_ae_menus.py`).
2. Wire **Open Recent** (we already `GET /api/editor/projects`), **Select All**, and a live "Undo X / Redo Y" label.
3. **Guides / Grid / Rulers / safe-margins** overlay on the monitor — unlocks ~12 View-menu items at once.
4. **Label colors** (`clip.label` + tint) — unlocks the whole Edit>Label block.
5. **Solid / Adjustment / Null** layer type (`solid` clip kind drawn as a color fill) — unlocks Layer>New + much of Effect usefulness.
6. **Real Render Queue** (turn the single export job into a list reusing the export backend).
7. **Convert Audio to Keyframes** — peaks are already cached (`m.cache.peaks`); near-free, demos great.

**Honest gaps to keep greyed** (touch deep subsystems): masks/pen/shapes/paint/roto/puppet, real effect stack, precompose/nesting, 3D, Start Timecode / non-square pixels / drop-frame, ProRes/alpha export. Show them for fidelity; don't fake them.

## Gotchas
- editor functions are top-level in the inline script; the `aeChrome()` IIFE runs after them and after `ae-menus.js` loads (script tag is placed before the inline script).
- `addText`/`addVid`/`addAud` are inline `onclick` handlers, not functions — menu calls use `$('#addText').click()` etc.
- `newProject()` only returns an object; the real "new" flow is the hidden `#btnNew` handler.
- Don't test against the owner's live project without restoring it (use undo) — 7788 shares the data dir with 7777.
