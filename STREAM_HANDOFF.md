# THE STREAM — handoff (2026-06-25)

DeMartinville's in-app **Spotify + YouTube** got built end-to-end this session. It's
**done, verified, and UNCOMMITTED on purpose** (a parallel session shares `app.py` —
see "Git / release" below). Fold it into the combined **v2.0.1 / v2.1** GitHub update.

---

## What it is

**The Stream** = a new room where finished work gets heard + watched. Two services:
- **Notifi** = music (the "not‑Spotify"; wordplay on *"Not if I"* → slogan **"Listen to Spotify? Not if I can help it."**)
- **Cratel** = video (the "not‑YouTube"; from *create*)

(Names are owner-chosen and locked. "The Stream" is the umbrella.)

## What got built (all owner-requested, all Chrome-verified)

1. **Killed the Sketch Pad** — removed `draw.html` + its room-rail link + the kit-helper / feedback-buddy registries + Kit's help text in `app.py`.
2. **The room** (`static/stream.html`) — LISTEN (Spotify-style: latest-drop hero, track list, persistent now-playing bar) + WATCH (YouTube-style: thumbnail grid → theater + up-next). Honest empty states, **no fake content**.
3. **Backend** (`app.py`, before the static mount): `GET /api/stream`, `POST /api/stream/publish` (media via `file` data-URI, `path` disk-path, or `editor_jid` → resolves a Visual-Labs export job), `GET /api/stream/media/{name}` (FileResponse = HTTP Range/scrubbing), `DELETE /api/stream/{id}`. Storage = `data/stream/` (`media/` + `feed.json`, atomic write, gitignored).
4. **Three ways in** — featured card on the home screen (`index.html`) + pinned top of the room rail (`.streampin`) + one-click `📡 To Notifi` / `📡 To Cratel` inside Audio Labs / The Kitchen / Visual Labs.
5. **Shared publish helper** (`static/stream-publish.js`) — `window.publishToStream` + `window.streamPublishDialog`; auto-loaded into every room by `pinkroom-nav.js`.
6. **Cover art** for music (in-room modal + lab dialog) → album art in hero/rows/now-bar.
7. **Player** — 🔀 shuffle, 🔁/🔂 repeat, volume persists (localStorage `dmv_stream_vol`).
8. **Scene features** — creator **channels** (click any name → their work across both tabs, "✕ All" to clear), **search**, **sort** (Newest/Oldest/A–Z), **queue-aware playback** (next/prev/shuffle follow the current view), **theater auto-advance**.
9. **Cloud-ready to go shared** (owner picked "cloud-ready now, go live later" + handle identity, no passwords): a **source switch** (top-right chip → settings: 🏠 Local/private default vs 🌐 Shared = paste a hosted URL; `localStorage dmv_stream_cfg`). `base()` routes `api`/`media()` + the lab helper to the chosen server. Handle = `localStorage dmv_creator`, auto-fills publish. Backend CORS is **env-gated** — only opens with `DMV_SHARED=1`. **Go-live recipe = `STREAM_HOSTING.md`** (repo root).

## Files changed this session

**New (mine, safe):** `static/stream.html`, `static/stream-publish.js`, `STREAM_HOSTING.md`
**Deleted (mine):** `static/draw.html`
**Edited — mine only (clean at session start):** `static/index.html`, `static/feedback-buddy.js`, `static/pinkroom-nav.js`, `static/editor.html`, `static/beats.html`, `static/studio.html`, `.claude/launch.json` (added a `stream-preview` config on :7795)
**Edited — SHARED with the parallel session (⚠️ contain other work too):** `app.py` (my stream routes + gated CORS), `static/kit-helper.js` (removed draw / added stream to the room registry)
**Modified but NOT mine (parallel session):** `static/character.html`, `DeMartinville.spec`

## Git / release — why it's uncommitted

A parallel agent session was editing `app.py` (and others) at the same time (one Edit hit
"file modified on disk since you last read it"; the preview kept getting navigated to
`studio.html`). So `app.py` / `kit-helper.js` carry **both** sessions' work. A blanket
`git add` would commit the other session's half-done changes; a partial commit would leave
the Stream frontend calling `/api/stream` routes that aren't in the commit. Both are wrong.

**→ Cut it as part of the combined update**, once the parallel session has landed:
- ⚠️ **Version lives in TWO homes that must match:** `APP_VERSION` in `app.py:53` AND
  `const APP_VERSION` in `static/studio.html:8617`. Both are currently **`"2.0.0"`** — bump
  BOTH to `2.0.1` (or `2.1.0`) together.
- `release.ps1 <ver>` does the bump + builds `ARKITECT.zip` + tags `vX.Y.Z` (the tag
  auto-triggers the free Mac build). It ends on a `Read-Host` that hangs a non-interactive
  shell — run by hand or background it.
- **Don't blind-rebuild `ARKITECT.exe` in a headless session** — ship the existing exe + the code.
- Site deploy is **not needed** for The Stream — `static/join.html` (demartinlabs.com) was NOT
  touched this session.

## Verified

Publish (file / path / editor_jid) · feed · **HTTP 206 Range streaming** · delete · cover art
renders · shuffle/repeat/volume · creator channels · search · sort · **queue stays within the
filtered view** · theater auto-advance · source switch Local↔Shared (base routing follows) ·
handle prefill · empty states · **no console errors** · local publish round-trips after the
refactor. All test media was published then **deleted — the feed is empty, no fake data.**

## Go down the list from here (next session)

1. **Pick a host** and flip it live (`STREAM_HOSTING.md`) — recommend Supabase (Storage + Auth + Postgres) for the hardened version.
2. **Real accounts** (email/password sign-in) before opening to strangers — handle is trust-based today.
3. **Upload limits / moderation** + **direct-to-storage** (S3/Supabase) instead of inline base64 for big videos.
4. The `/api/stream` shape can stay — the room won't need changes when the backend hardens.

See memory: `[[stream-notifi-kratel]]`.
