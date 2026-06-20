# The Wall — shared backend plan (Cloudflare, free tier)

**Status:** NOT built yet. The Wall (`static/wall.html`) ships **local-first** today — every signature lives in the
signer's own `localStorage`, so it's *their* wall (them + whoever's on that machine). This doc is the drop-in plan to make
it **global** — every user sees everyone's signatures — on Cloudflare's **free tier** (no Supabase, $0 until it's genuinely big).

## Why Cloudflare (not Supabase)
- **Workers free:** 100,000 requests/day. A signature wall is read-heavy + tiny — this is plenty for a long time.
- **KV free:** 100k reads/day, 1k writes/day, 1GB. Writes = new signatures (rare); reads = viewing the wall (cacheable).
- **R2 free:** 10GB storage, no egress fees — the right home for the signature PNGs (each ~5–30KB).
- You already use GitHub for releases; Cloudflare is the same "free infra you don't babysit" vibe. **You pay nothing until thousands of people are signing — which is the good problem.**

## Data shape
- **R2** holds the drawings: key `sig/<wallN>/<id>.png` → the transparent PNG.
- **KV** holds the metadata (small, fast to list): key `sig:<wallN>:<id>` → `{ id, handle, x, y, ts, userId }`.
  - plus `meta:current` → the active wall number, and `meta:count:<wallN>` → tag count (to know when a wall's full → roll N+1).

## Worker endpoints (one small Worker)
- `GET  /wall/:n` → list KV by prefix `sig:<n>:` → return `[{id,handle,x,y,ts, png:"<R2 public url>"}]`. **Cache 30–60s** (CDN) so reads barely touch KV.
- `POST /sign` → body `{ wall, handle, png(dataURL), x, y, userId }`.
  - validate: PNG size ≤ ~60KB; handle ≤ 24 chars, stripped; x/y inside bounds; **server-side overlap check** (no stacking); **rate-limit** per `userId`+IP (e.g. 1 sign / 30s, few / day) to kill spam.
  - store PNG → R2, metadata → KV, bump count; if count ≥ CAP roll a new wall.
- `POST /report` → `{ id, reason }` → write `report:<id>` (+ increment a counter). Auto-hide at N reports pending review.
- `DELETE /sig/:id` → **admin only** (secret header `X-Wall-Key`), you/Kit wipe a tag.

## Client change (small, already structured for it)
`wall.html` is built so this is a swap, not a rewrite:
- Add `const WALL_API = "<your-worker-url>" || null;`
- `load()/save()/place` → if `WALL_API` set, `fetch` the Worker; else fall back to today's `localStorage` (offline still works).
- Add a per-install `userId` (random uuid in localStorage) + the chosen handle. **No login needed for v1.**
- Poll `GET /wall/:n` every ~20–30s (or on focus) so new tags from other people appear.

## Moderation (must exist day one of the shared version)
A public freehand canvas WILL get something gross drawn on it — freehand can't be auto-filtered reliably, so:
- **Report button** on every tag → `/report` → auto-hide past a threshold.
- **Admin wipe** (your secret key) → instant remove. Kit could surface a review queue.
- Keep the `userId` on each sig so a bad actor's tags can be bulk-wiped + their id soft-banned.

## Rollout
1. Local v1 (DONE) — nail the feel.
2. Stand up the Worker + KV + R2 (free), set `WALL_API`.
3. Ship report/wipe with it.
4. Only revisit paid tiers if it blows up (great problem).
