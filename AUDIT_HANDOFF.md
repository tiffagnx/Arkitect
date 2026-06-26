# Full Project Audit — DeMartinville (2026-06-25)

Audit (6 parallel auditors + live Chrome walk). Two other sessions are live-editing `app.py`, `studio.html`, `beats.html`, `editor.html`, `ae-menus.js`, `index.html` — so **no menu items were deleted** (owner's call: fix bugs only, decide the buttons later). Only 3 surgical bug-fixes were applied this session (below).

> ⚠️ **OWNER DIRECTIVE on the dead buttons (2026-06-25):** Do **NOT** just delete the fake/dead buttons. For each one, first confirm whether **we can make it actually work — or put a similar thing in its place** — and only kill it if we truly can't. The "fakes" represent features he genuinely wants (recording, time-stretch, MIDI tracks). Kill is the last resort, not the default.

## ✅ FIXES APPLIED THIS SESSION (3 — verified)
1. **Seed corruption** — `make_public_seed.py:65-66` regex now uses `(?<![&\w])` lookbehind so "R&B" survives; patched the already-shipped `static/seed/public_seed.json` (`R&the artist` → `R&B`, JSON re-validated). *Root + artifact both fixed.*
2. **`index.html` NUL bytes** — the `md()` code-fence sentinel used literal `\x00` bytes (4 of them, offsets 49376–50142), which made grep/ripgrep treat the whole file as **binary and silently skip it** (this caused a false "tec-mascot.js is orphaned" finding mid-audit). Swapped to the safe ` B<n> ` space sentinel that `build.html`/`kit-helper.js` already use. Verified live: code-block formatting, bold, and copy-block all still work; 0 NUL bytes remain; grep now reads the file as text.
3. **Swarm provider rotation** — `swarm_routes.py:489` only caught `RateLimited`/`ProviderError`, so a raw network blip (`httpx.ConnectError`/timeout) escaped the loop and sank the whole swarm/research turn. Now catches any exception and rotates to the next slot, matching the function's own docstring. *(Takes effect on next backend restart.)*

> These 3 touch files some parallel sessions also have open (`make_public_seed.py`, `public_seed.json`, `index.html`) — edits are surgical/line-scoped so the morning merge should auto-resolve, but flag them in the batch. `swarm_routes.py` is not parallel-edited (conflict-free).

> **⚠️ Two things the merge needs to know:**
> 1. **Master shipped v2.4.0 (Crew Mode) DURING this audit** — HEAD moved `244be87`→`f0144f7` while I worked (a parallel session committed/pushed). I re-checked: **all 3 bugs still exist in committed v2.4.0**, so these fixes are current, not stale. The whole audit (security, dead buttons) still applies to v2.4.0 — Crew Mode only added `crew.js`, it didn't touch the menu/effect files.
> 2. **`index.html` has a CRLF-vs-LF divergence from HEAD** (pre-existing, not from me). `git diff HEAD` shows ~2970 lines but `git diff --ignore-all-space HEAD` shows the real change is **just 2 lines** (the NUL→space sentinel). Review with `--ignore-all-space`, or normalize line endings, so the actual fix is visible. I did NOT normalize it myself to avoid fighting a parallel session that may have the file open.

## TL;DR
- **Live check: every room loads with ZERO JS runtime errors** (Studio, LePrince, Leon/Kitchen, Agent Forge, Stream, Build, Market, Swarm, Images, Imagine-Cloud, Profile, Wall). Nothing is crashing on load.
- **Old `BUG_AUDIT.md` is mostly STALE** — ~all 49 items are already fixed in current code. Don't work off it.
- **Backend is clean for local single-user use.** The real security exposure is entirely behind the `DMV_SHARED=1` hosting switch — which every handoff is pushing toward. **Do not flip it for public hosting until auth + a path/origin allowlist land.**
- The "doesn't work" menu surface is mostly **intentional After-Effects/Pro-Tools silhouette placeholders** (greyed or "coming soon" toasts), not crashes. Deleting them is a product call, not a bug fix.

---

## 🔐 SECURITY (priority order)

### Latent-Critical — all gated behind `DMV_SHARED=1` (app.py:86 → `allow_origins=["*"]`, no auth)
The going-live switch opens wildcard CORS and adds **zero** authentication. These unauthenticated endpoints then become remotely reachable:
1. **`/api/studio/update/stage` (app.py:3819) — SSRF → unsigned-ZIP RCE.** Takes a caller-supplied `url`, validates only `http(s)://` (no host/IP allowlist → SSRF to localhost / `169.254.169.254`), downloads it, and `_stage_update_from_zip` (3783) installs it on next launch with **no signature/origin check** (only zip-slip + "has app.py/static"). Any ZIP containing those two = code execution on next start. **Fix:** pin the host to the real GitHub releases org, verify a signature/known hash, require a confirm token. Harden this regardless of hosting.
2. **`/api/stream/publish` (app.py:5357) — arbitrary file read.** Accepts a client `path`, `read_bytes()`, re-serves it. Remote file exfiltration (e.g. `data/swarm_keys.json`). **Fix:** only accept server-issued export-job ids (the `editor_jid` branch already does this safely); confine `path` under an allowlisted root.
3. **`/api/editor/import` (3897) + `/api/editor/media/{mid}/src` (3957) — arbitrary file read** of any path on disk.
4. **`/api/screenshot` (4768)** — full host-desktop capture, unauthenticated.
5. **Studio file pickers / read-file / save-to-folder / bounce (app.py:3457–3593)** — arbitrary disk read/write + native dialogs from a request body.
6. **`fetch_page` (1117) SSRF** in the research path — fetches arbitrary URLs, no private-IP/scheme filter (semi-trusted: model-generated queries → crawled URLs).

**The single most important takeaway:** before The Stream goes multi-user, add a token/session gate on every state-changing/file/system endpoint and replace `allow_origins=["*"]` with the real front-end origin.

### Medium
- **Plugin code injection / stored XSS (app.py:2107, `_valid_plugin` 2137).** Saved plugin JS is still concatenated into `bundle.js` and `eval`'d in every Studio browser. The new validator is a **shape check, not a sandbox** — arbitrary JS inside a well-formed `create(){…}` passes. Local = fine; hosted/multi-user = stored XSS across users. **Fix:** sandbox in an iframe/worker, or scope plugins per-user.
- **Self-XSS via `innerHTML` of the user's own provider store:** `swarm.html:193`, `settings.js:227`, `keys.js:74`. Self-scope today (your own machine/keys); becomes real stored-XSS if a shared server ever returns these. **Fix:** escape with the existing `esc()` / build with `textContent`.

### Clean (verified)
- **No leaked API keys** anywhere. Keys are encrypted at rest (DPAPI vault, swarm_routes.py:100), masked in UI, sent only to the user's own chosen provider origin. The "your key stays in your browser" claim holds.
- **No command injection** — all ffmpeg calls are list-form argv, `drawtext` font/text are escaped + allowlisted (`_safe_font` app.py:4075). No `eval`/`exec`/`pickle` on the server.
- The reported "leaked Supabase service-role key" is **NOT in this repo or its git history** — it lives in the separate `tiff-studio-access` project. Rotate it there.

---

## 🐞 REAL BUGS still present (most of BUG_AUDIT.md is already fixed)

- **Shipped data corruption:** the seed scrubber `re.sub(r"\bB\b", "the artist", …)` (make_public_seed.py:66) eats the "B" in "R&B" → `static/seed/public_seed.json` literally ships **`R&the artist`**. **Fix:** anchor on possessive/owner contexts, not a bare-letter match, and exclude `R&B`.
- **NUL bytes in `index.html`** (4 of them — intentional `md()` code-fence sentinels at lines 599/611). They make grep/ripgrep/the search tools treat the whole file as **binary and silently skip it** — this already caused a *false* "tec-mascot.js is orphaned, delete it" conclusion during this audit (that file IS loaded at index.html:1418). **Fix:** switch to the space-delimited text sentinels (`" B0 "`) that `build.html` and `kit-helper.js` already use.
- **Research mode 404s on the hosted site:** `/api/research` + `/api/research-swarm` (index.html:850) and `/api/research-for-build` (build.html:633) aren't bridged in `cloud-bridge.js`, so on demartinlabs.com they silently fail. **Fix:** bridge them, or hide the Research toggle in `CLOUD_MODE`.
- Minor: `_drain_err` task can leak on an export error path (app.py:4264, cosmetic — proc is killed); `/api/image` ComfyUI upload has no status check before `.json()` (app.py:2823); swarm `_call_with_fallback` only catches RateLimited/ProviderError, a raw `httpx.ConnectError` kills the whole turn instead of rotating slots (swarm_routes.py:484); a few un-revoked object URLs (cover-art previews).

---

## 🗑️ DEAD / FAKE MENU ITEMS

### Tier 1 — clickable fakes / dead code. **DECIDE per item: BUILD it, REPLACE it, or kill it.** (Don't default to kill.)
| Room | Item | file:line | Make it work / replace? |
|---|---|---|---|
| Kitchen | `#bRec` record button → toast "Live record is coming" | beats.html:462 + 2527 | **BUILD** — live mic/line record is the handoffs' #1 Kitchen ask. Keep the button; wire `getUserMedia` → record-through-FX. Don't kill. |
| Studio | **Flex · time-stretch** menu (sets `t.flexMode`, never reaches audio) | studio.html:2025/2054 | **BUILD or REPLACE** — real wanted feature. Either wire a clip time-stretch DSP, or replace with the existing Spindown varispeed as the "stretch" stand-in until then. |
| Studio | **New Tracks** VCA/MIDI/Instrument/Video → "not built yet" flash | studio.html:4006–4009 / 3983 | **REPLACE/HIDE** — keep audio/aux/master; hide the 4 unbuilt types from the dialog until built (better than a dead option), or map MIDI/Instrument to a Kitchen-style channel. |
| Kitchen | `#songView` stale "Coming in the next pass" copy (Playlist IS built; `renderSong()` overwrites it) | beats.html:554 | **JUST FIX COPY** — the feature exists; only the initial placeholder text lies. Safe to delete the stale copy outright. |
| Studio | Dead `#punchBtn` onclick (button already `display:none`, commented "hidden until REAL") | studio.html:8038 | **BUILD then un-hide, or delete dead handler** — punch-in is a real DAW feature; either build auto-drop record + un-hide, or remove the orphan handler. Already hidden so no user sees a fake. |
| LePrince | ~10 toolbar tools → `toast('… not in this build yet')`: Hand, Zoom, Camera/Orbit/Pan/Dolly, Anchor Point, Shape, Brush, Clone Stamp, Eraser, Roto Brush, Puppet | editor.html:4239–4241; ae-menus.js:7878–8035 | **MIXED** — *buildable now:* Hand (pan monitor), Zoom, Shape, Anchor Point. *Hard/maybe-skip:* Brush/Clone/Eraser (need a raster paint surface), Roto Brush (needs a segmentation engine). Build the easy ones; for the rest, either a "similar thing" or remove the tool icon rather than toast. |
| Studio | Dead `pt-menus.js` config never read by any code: `PT_CONTEXT` (5766–7207, ~1440 ln), `event`/`marketplace`/static `audiosuite` blocks | pt-menus.js | **SAFE DELETE** — pure dead config that never renders (real menus are hand-built / regenerated). No user-facing feature lost. Confirm filter lines `studio.html:8302,8332,8355` stay consistent. |

### Tier 2 — PRODUCT CALL (greyed, not broken — intentional AE/PT silhouette)
- LePrince: ~40 menu rows labeled "buildable-now/exists" that `actionFor()` never wires → render **greyed/disabled** (View ▸ guides/grid, Window ▸ workspaces, Edit ▸ Preferences, several File/Layer rows). Clearest mislabel: **`animation | Separate Dimensions`** (`feasibility:"exists"`, `mapsTo:"None"`).
- LePrince: 262 `skip` + 325 `buildable-later` effect/menu items — all grey out correctly, kept on purpose for AE-silhouette fidelity.
- Studio: long tail of greyed-but-visible PT menu rows (Edit ▸ Selection, Repeat/Shift, most of Track/Clip/View/Window).
- **Decision needed:** delete-all-greyed (literal "if it doesn't work, kill it") **vs** keep the pro-app silhouette shell. The fake **punch-in is already hidden** and the **take-comping "doubles up" bug is fixed** — your team is already trending toward "hide what isn't real."

### NOT fake (verified, leave alone)
- LePrince effect registry (`leprince-fx.js`): all ~118 effects have real bodies; **every old "LIVE LIE" is genuinely fixed** (Remove Grain, Spotlight, Median, Match Grain, the 4 VR effects).
- The Kitchen (`beats.html`): fully wired — every menu/toolbar/instrument/generator/export action resolves to a real function.
- `market.html` / `character.html` / `join.html`: **no fabricated people** — only built-in hardcoded entry is the owner himself (B. Koonce, commented as such); shelves hide when empty. No-fake rule is being honored.
- `profile.html:226/263` "200+ signatures" — owner's own career-showcase page; verify it's owner-only (not a reusable template) since the live Wall is empty.

---

## 📋 TOP HANDOFF TODOs (from 27 docs)
1. **Resolve GPLv3 `pedalboard` licensing** — gates native-plugins distribution (legal call).
2. **Replace the stale README** (says ARKITECT, lists removed `bit16.html`, "no cloud/keys" is wrong).
3. **Stream go-live blockers:** host + real accounts + upload limits/moderation + DMCA agent ($6) + real Terms — AND the security gate above.
4. **Agent-dock moonshot blocked:** `RoomAPI.run()` + `.room` missing from beats.html (kit-helper.js:746 calls it).
5. **Kit mixing brain ships wrong:** `data/kit_kb/*.md` is gitignored; `build_zip.py` must bundle it or the binder never reaches users.
6. **Version drift:** CHANGELOG stops at v1.6.0 while code is v2.2.0; keep `APP_VERSION` synced in app.py + studio.html; backfill the changelog.
7. **Mac:** universal2 build for the Intel button (currently 404s) + code-signing decision.
8. **Live-test the keyed features** with real keys: Claude/Grok/GPT-5/Gemini effort dials + Atlas cloud-gen.
9. ~30 LePrince effects still need an engine piece (frame buffer / projection / particle-state / mask-path).
10. Kitchen: audio RECORD + hi-hat rolls (Song mode + generators already shipped).

### Contradictions to reconcile
- BEAT_LAB_HANDOFF (old) vs KITCHEN_HANDOFF (new): Song mode + hi-hat rolls listed open in the old doc, shipped in the new. BEAT_LAB is superseded.
- NULL byte in index.html: VOCAL_SUITE calls it a merge blocker; CLOUD_PORT calls it harmless. (It's harmless to rendering but breaks search tooling — fix it.)
