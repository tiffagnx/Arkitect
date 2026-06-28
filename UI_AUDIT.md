# UI Audit — one consolidated list (2026-06-27)

## Status (updated 2026-06-27)
- ✅ **Done:** #1 wordmark (resolved by decision — keep lockup), #2 editor tools rail (Hand/Zoom/Shape wired + verified), #3 help "?" mount (help.js, verified), #5 convert-text (wired to focusInspector), #8 stream crowding (CSS shrink).
- ⏸️ **Held — active parallel AUDIO session owns these rooms (don't clobber):** #4 Studio FX-throw float, #6 Studio duplicate @keyframes, #7 Beats playlist placeholder. Hand to that session or do when it pauses.
- 🔽 **Deferred (low value / rename risk):** #9 asset rename `arkitect-logo.png` (public-site raster only).

---


Machine audit of the 9 active in-app rooms against the house rules: **no floating UI over the work canvas**, **no dead/fake buttons** (wire them, don't delete), **ARKITECT→DeMartinville brand** (one canonical logo, never font-render the wordmark), **no broken UX**. 9 parallel read-only agents. **This is the list — no fixes applied yet**, per the "one audit before reactive fixes" rule.

Clean rooms (zero findings): **Character roster**, **Imagination Station**.
Not yet audited this pass (no silent caps): `profile.html`, `imagine-cloud.html`, `swarm.html`.

---

## 🔴 HIGH

### 1. Brand — wordmark is font-rendered  ✅ RESOLVED (owner decision, 2026-06-27)
- **Decision:** the coded `.dmv` font lockup IS the official in-app wordmark — *keep it*. Font-rendering it is correct, NOT a violation. The raster `arkitect-logo.png` stays only for the public `join.html`. The real law is consistency (same lockup every room), which the audit confirms is already the case.
- **Was flagged because** the brand memory's top-level "LAW" still described the old raster-as-canonical rule; that stale framing has been corrected so it won't false-flag again. **No code change — this is a non-issue.**

### 2. Editor — Tools rail is mostly dead / "coming soon" buttons
- **Where:** `editor.html` toolAction()/buildTools() lines 4966-5004; only Selection/Type/Pen/Rotation are wired (4998). The other ~10 (Hand, Zoom, Camera Orbit/Pan/Dolly, Anchor, Shape, Brush, Clone, Eraser, Roto, Puppet) are dimmed `.soon` buttons whose onclick only fires a toast (4972-4974).
- **Fix (wire, don't delete):** Hand→monitor view-offset pan; Zoom→existing fitScreen/zoom on `#screen`; Shape→`newShape()`; Brush/Eraser→the editor-inpaint paint path. Wire the buildable ones; the rest get a clearer label.

### 3. Berner Builder — shared help "?" floats over the chat area + overlaps the back arrow
- **Where:** `build.html` `.topbar` (232-247) has no `.kit-mount`/`.top` element, so `help.js:146` can't dock the "?" → it falls back to `position:fixed; left:14px; top:10px` (help.js:90), landing on the chat pane *and* the `.pr-back` arrow.
- **Fix (do it ONCE, not whack-a-mole):** this is the shared-injector pattern you flagged before. Best fix = make `help.js` also recognize `.topbar` as a mount target (covers every room that uses `.topbar`), rather than patching build.html alone. Then sweep which other rooms lack the hook.

---

## 🟠 MEDIUM

### 4. Studio — FX Throw bar floats over the timeline
- **Where:** `studio.html` `.throw-bar` (CSS :1397) opens at `position:fixed; top:104px` centered — directly over the top of the lanes/clips. It's draggable + dismissible, but only its *trigger* lives in the top bar; the panel itself violates the no-float rule.
- **Fix:** dock it into the top-bar/zoombar chrome or pin it as a non-overlapping strip below `.menubar`.

### 5. Editor — "Convert to Editable Text" menu item is an alert-only stub
- **Where:** `editor.html:5199` — resolves to a function that only toasts "text layers are already editable," does nothing.
- **Fix:** grey it out (drop from actionFor → buildPanel marks it disabled) or wire to focusInspector() on the selected text layer.

---

## 🟡 LOW

### 6. Studio — duplicate `@keyframes recpulse` silently overrides
- `studio.html:32` and `:35` share the name; the later (expanding-ring) wins for *both* the track-arm and live-record states, so track-arm gets the wrong pulse. **Fix:** rename one (`recpulse-ring`) and point `.tbtn.rec.live` at it.

### 7. Beats — Playlist window shows stale "Coming in the next pass" for a built feature
- `beats.html:557` static `.soon` placeholder flashes before `renderSong()` (the real, fully-built arranger at :3604) draws over it. **Fix:** replace the stub with an empty container.

### 8. Stream — now-playing right cluster can clip when a Support link shows
- `stream.html` `.nb-right` (fixed 248px) holding the Support pill + 🔊 + 110px volume slider can overflow with a long pay label. **Fix:** `flex-wrap` or clamp the slider min-width.

### 9. Brand (low) — canonical asset still named `arkitect-logo.png`
- Under change-once-everywhere, rename to `demartinville-logo.png` and update references (pairs with #1).

---

## Cross-cutting takeaway
Two of the three HIGH items are the **shared-injector / change-once** patterns you already care about: the wordmark (#1, fix once → every room) and the help "?" mount (#3, fix `help.js` once → every `.topbar` room). Fixing those two *at the source* clears the most surface with the least churn.
