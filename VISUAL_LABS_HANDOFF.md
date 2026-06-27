# Visual Labs (LePrince / editor.html) — Handoff

**Date:** 2026-06-26
**Session scope:** import fix + the choppy-playback / broken-split fixes + a small feature pass in **Visual Labs** (`static/editor.html`, backend bits in `app.py`).
**Status:** ✅ all committed + **pushed to master**. Needs an **app restart** to take effect.

> ⚠️ **Parallel sessions are live in this repo.** This session only touched `static/editor.html` and **its own hunks** of `app.py`. Other sessions' uncommitted work is still in the tree and was left untouched: **`gen_tts` / Fish Audio voice** (app.py), **`room_relay` MCP relay** (app.py + `room_relay.py` + `static/mcp-bridge.js`), and `static/character.html` / `static/studio.html`. **Do not commit those — they're not mine.**

---

## 🔴 FIRST: restart the app
The running app (port 7777) loaded the OLD code. **Close DeMartinville and reopen it** — there is no hot-reload. Nothing below will be true until you do.

---

## What shipped this session (all on master)
| Commit | What |
|---|---|
| `33bea43` | **Import fixed** — native Windows file picker + drag-drop onto the Media bin (the old tkinter dialog can't run in the packaged .exe). |
| `146ef6e` | **Clip can't be stretched past its own footage** into black anymore. |
| `9143916` | **Choppy playback + split-looks-broken fixed; Time-Stretch, PNG button, click-timecode duration, timeline file-drop; proxy/back-end hardening.** |

**Root causes (for reference):** choppy playback = the player force-seeking a *playing* video several times a second; "split shows the end/repeats" = the picture drawing *before* the video finished seeking (the split itself was always correct). Both fixed.

---

## ✅ CHECKLIST — what to test after restarting
Go down this list. Each is a thing I changed but **could not click-test myself** (the WebView2 UI isn't scriptable here). Backend bits I *did* test end-to-end are marked ✓tested.

**Playback / editing (the main fixes):**
1. Drop a video on the timeline, press **Space** → plays **smooth**, no strobing/skip-jump.
2. **Scrub** the playhead slowly across a clip → the picture matches the playhead (no lag, no "stuck on the end").
3. Put the playhead mid-clip, press **C** (razor) and click, or **Ctrl+Shift+D** → clip splits; **both halves show the correct frames** (the right half is NOT the end of the video repeating).
4. Drag a clip's **right edge** outward → it **stops at the end of the footage** (no black tail).

**New features:**
5. **📷 button** on the monitor (top-right, next to the grid ▦ button) → downloads a PNG of the current frame.
6. Click the **total timecode** (the `/ 00:00:00:00` on the right of the transport) → Composition Settings opens; change **Duration**.
7. **Drag a video file from Explorer straight onto the timeline** (not the bin) → it imports and drops a clip where you let go.
8. **Time-Stretch:** select a video clip → **Layer ▸ Time ▸ Time Stretch…** → type e.g. `50` (slow-mo) or `200` (2× faster). Clip shows a **⏱ badge**, plays + exports at that speed. (Allowed range 25–400%.)

**Backend (already ✓tested by me, but sanity-check after import):**
9. ✓tested — Import a fresh clip; the preview proxy builds in ~2s (30fps, fast scrubbing). Just confirm a newly imported clip scrubs smoothly.

---

## Known-deferred (not bugs from this session)
- **~18 menu shortcuts that do nothing** (Reload Footage, Quick Apply, Edit Original, Pre-compose, Enable Time Remapping, Set Poster Time Shift+P, Easy Ease In Shift+F9, etc.) — advertised in `static/ae-menus.js` but unwired. **A background task chip was spawned** for this cleanup (click it to spin off, or ignore).
- **"Clip looks a little weird" on the timeline** — the filmstrip thumbnail is stretched (cosmetic only, doesn't affect playback). Deferred.
- **Time-stretch on audio** changes pitch (no pitch-correction yet) — that's why Time-Stretch is gated to **video** layers only.

---

## Orientation for a cold start
- Live app = **port 7777** (`app.py` FastAPI + `static/*.html`). uvicorn has **no --reload** → restart to load `.py`/`.html` changes.
- Visual Labs = `static/editor.html` (one ~366KB inline script). Playback loop: `tick → syncPlay → drawFrame → drawOneClip`. Source-frame mapping: `clipSrcFrame`. Split: `doSplit`. Backend proxy: `_gen_proxy` + `/api/editor/media/<id>/proxy` in `app.py`.
- Scope gotcha: the top-level `keydown` handler can't see `splitSel`/`saveFrameAs`/`timeStretchSel` — those live in a nested block (wire UI for them near the `#gridBtn` wiring, ~line 5194).
- Full detail in auto-memory: `visual-labs-playback-split-fix.md` (indexed in `MEMORY.md`).
