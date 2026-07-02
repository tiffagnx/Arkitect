# Animation Station — where it stands (2026-07-01, v3.2.0)

*Cold-start note: read `MEMORY.md` → `bit16-music-video-builder-direction.md` for the full narrative (direction pivots, owner feedback, every verified fix). This doc is the "what's built, what's next" summary.*

## What it is
A sprite-animation music-video builder living **inside LePrince** (`static/editor.html`) — not a standalone room. A `✨ Animate` button in the menubar opens a floating, draggable window (`window.AB`) with two tabs: **Cast** (characters) and **World** (backgrounds/foregrounds). The compositing "stage" is deliberately just LePrince's own timeline — build assets in the popup, drag them onto tracks, edit like any other clip.

Core mechanic: generate cheap images (cloud, BYO-key — no video model needed), animate them into looping sprite sheets via chained image-edits, optionally cut a foreground layer out of a world so characters can appear "between" background and foreground. All of it native-styled (steel-cyan, matches LePrince — NOT pink, that was tried and rejected).

## Built + verified today (all tested live via preview server, zero console errors)
- **Model picker** — reads the user's OWN models from `/api/cloud/providers`, no hardcoded catalog. Recommends (doesn't force) Nano Banana Pro Edit → Nano Banana 2 → Wan 2.7 Image Edit. Text→image / Image→image toggle.
- **Cast + World generation** — `AB.make()`, real `/api/cloud/generate` calls, saves to a persistent asset library (`/api/anim/assets`, new backend routes, `data/anim_assets/*.json`).
- **✂ Cut Foreground** — ported heytiff's `ForegroundCutoutPainter` + GrabCut engine verbatim. Vendored `static/vendor/opencv.js` (11MB, from heytiff's own node_modules — same build), new worker `static/as-cutout.worker.js` runs GrabCut off the main thread. AI mode (paint green/red, Extract) + Manual mode. Verified: painted a test image, GrabCut cut the exact object (7200px, 61ms).
- **▶ Animate / ＋ Longer** — turns a still into a looping sprite via sequential image-edits. Anti-drift fixes from real research (not guessed): dual-reference anchor (original frame + latest frame, not just latest — the documented #1 drift cause), verbatim trait-locking, pixel-identical/no-recompose language, one-change-per-step. `loopMode` (Loop / Ping-pong / Play-once) — only true loops try to close back to frame 1; open-ended action chains (jump→walk→smoke) don't.
- **Kit/Tiff trained** — new section in `static/kit_kb/craft/image-prompting.md` teaching the chaining protocol. Verified against the real `kit_kb.retrieve()` scorer (exact-string matching, no stemming — caught and fixed a title-wording bug that would've silently lost to unrelated docs).
- **Timeline drop** — gallery tiles drag onto LePrince tracks as real clips (goes through the editor's own `importFiles` pipeline → Media bin → export-safe, not a preview-only hack).
- **✦ Summon** — delegates to the app's real `[data-summon]` button; mounts/opens the actual docked Kit in-place (no reload, no data loss). Kit's window is z-index 9997, already floats above everything in Animation Station.
- **Settings/Kie fixes** (the other big thing today) — Kie has no model-list API (re-verified against current docs, not assumed stale). Fixed: bulk-paste (comma/newline-separated ids, or a whole pasted model-page URL → auto-extracts the slug), and three real UX bugs (saved models were invisible on reopen, typed-but-not-"+"-clicked models were silently dropped on Save, adds looked like they might replace instead of accumulate). All three verified via stubbed-network DOM testing.

## Not built yet
- **The agent recipe** — "drag Kit in, upload a photo, she builds the green-screen sprite sheet for you" conversationally. The hook exists (`window.RoomAPI.run(action)`, kit-helper.js:1161) but Animation Station doesn't define a `RoomAPI` yet. This is the next real piece.
- **The proof video** — build one real 20-30s piece end-to-end to validate the whole pipeline for real, per B's plan.
- Parallax/wide-world scroll, camera null-parenting automation (LePrince's null/parent system is confirmed to already support this — see `studio-research/ANIMATION_STATION_ADDENDUM.md` — just needs the agent-action layer wired).
- Per-asset fps control in the gallery UI; FG-drop-to-timeline convenience (auto-suggest a track above the character).

## Files
- **Read first for the full plan:** `studio-research/ANIMATION_STATION_BUILD_PLAN.md`, `ANIMATION_STATION_UI_SPEC.md`, `ANIMATION_STATION_ADDENDUM.md`
- **New:** `static/as-cutout.worker.js`, `static/vendor/opencv.js`, `static/kit_kb/craft/*.md`
- **Edited (all additive):** `static/editor.html` (the whole Animation Station lives here, ~700 new lines), `static/settings.js` (Kie fixes), `app.py` (`/api/anim/assets` CRUD, Kie `GEN_PRESETS` expansion)
- ⚠️ Restart port 7777 for the `app.py` routes to go live on B's running app.

## Bundled in this same push (not mine — pre-existing, verified coherent, syntax-clean, described in memory)
Code room reliability fixes, Keys-unified Settings modal (`pinkroom-nav.js`/`keys.js`/`index.html`), Imagine Cloud fal+Kie providers, Treatment room rebuild (`static/treatment.html`). All were sitting uncommitted since before this session — checked for merge markers, TODO/incomplete flags, and syntax errors before including; none found.
