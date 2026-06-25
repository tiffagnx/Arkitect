# DeMartinville — DETAILED HANDOFF (cold start = "be me")

*Rewritten 2026-06-23 ~3:15am after a long marathon. The owner ("B") works ONE code session per night, runs MULTIPLE agents in this repo at once, and wants to just say "go." Read this + `MEMORY.md` first. He's asleep; this session shipped v1.9.1 + deployed the site autonomously (he authorized it before bed).*

> ⚠️ **PARALLEL SESSION**: another agent works this repo. It owns `START_HERE.md` (never touch it). Always `git log -3` + `git status` before committing; commit only YOUR files with explicit paths (never `git add -A`).

---

## ✅ DONE 2026-06-23 (morning session) — yesterday's 3 fixes are SHIPPED to the live files
All three are **static edits, live on refresh** (⚠️ but NOT in the frozen `DeMartinville.exe` — it serves a BUNDLED copy; B sees them via refresh of the dev app / preview, or after a rebuild):
1. ✅ **Wings killed + rebalanced** — removed both `<div class="ark-wings">` blocks in `static/index.html` (the static hero ~line 421 AND the JS welcome-rebuild template ~line 856). Removing the div naturally pulled the "Start typing…" line + smarter card up. Dead `.ark-wings` CSS (~220-221) left in place, harmless. (B confirmed on-screen.)
2. ✅ **The Kitchen de-purpled** — swept ~60 purple values in `static/beats.html` → teal/graphite (`--acc #B36CFF→#3E9CB8`, `--mag #E25CC0→#5FB4CE`, `179,108,255→62,156,184` ×53, all the light-purple hexes + bg tints). Zero purple left.
3. ✅ **Renamed "DeMartin Beat Lab" → "The Kitchen"** (B picked it — producer "cook up a beat" slang, Boogie-friendly). 33 display-string swaps across 7 files (beats.html, index.html, kit-helper.js, studio.html, join.html, market.html, feedback-buddy.js). Internal `beats` room id UNTOUCHED.

## 🔴 NEXT UP (when B's weekly limit resets ~2am)
- **B's SLIDE-THE-RAIL idea (his big new UI ask, NOT yet built — do it fresh, don't half-wire nav blind):** the left rooms rail should **slide fully out of the way** (button or drag), and the moment it's gone, a **room dock drops down right under the crew strip** (Tiff/Kit/Build-your-own) so rooms sit inches from where you drop them — drag straight in. TWO ways to grab a room; when one shows the other hides; toggle. (He'll re-explain in more detail; he already showed it with orange-annotated screenshots.)
- **The "⚡ Power Up" page (compute pool doorway)** — see `COMPUTE_POOL_RESEARCH.md` + memory [[capability-aware-rented-gpu-vision]]. ⚠️ READ THE CORRECTED CONCEPT: it's a **Netflix-password community pool** — DeMartinville pays $0, hosts nothing. A crew rents a box on THEIR account, splits it themselves; the app's only job = "Join Pool" button → admin pastes the shared endpoint → route requests. Plus a "do it solo vs community" fork + a dummy-proof step-by-step playbook with DEEP-LINKS to RunPod/Vast/Salad + exact "where's the API key" hand-holding.
- **Cloud-gen live test** — #1 on the test list, NEEDS B's real Atlas key in hand (can't be done autonomously).
- Optional tiny copy nit (B said FORGET it for now): hero still reads "…step into a wing on the left" — wings gone, points at rail. Left intentionally.

## ⚠️ TODAY'S STRATEGIC DECISIONS (locked in memory — don't relitigate)
- ⛔ **NO free model on B's Atlas key, ever.** Everything gen = **BYO-key only** (or user-funded pool). His account/money never exposed. See [[ai-generation-roadmap]].
- 💰 **Right-sized money goal: ~$600/mo self-sustaining** (cover his Claude plan + ~$100/wk), NOT a business. Free-to-user is load-bearing. DON'T over-engineer monetization (no Stripe empire). See [[monetization-arsenal-model]].
- 🛑 **Cost lesson:** a mis-scoped 100-agent deep-research run torched a big chunk of B's weekly usage on a question he already knew. ALWAYS flag agent/workflow SCALE before launching. He runs Opus on a $200 plan; respect the meter.

---

## ✅ WHAT TO TEST TOMORROW (tell B this)
Reopen `DeMartinville.exe` (the fresh **v1.9.1** build) — backend is now live:
1. **Cloud generate with your real Atlas key** — the 500 is FIXED; it should actually generate now (or show a readable error). ⬅ the big one, was broken-but-unverified all night.
2. **Ask Tiff for an image prompt** → it should land in its **own copy-block** with a one-click copy icon (not buried in her chatter). Works in the chat AND in-room agent windows.
3. **Copy UX**: tiny ghost copy icon below each message (hover-reveal, ✓ on click) + **right-click anywhere → Cut/Copy/Paste/Select All**.
4. **Composer**: model picker + Chat/Write/Research + depth slider all in one slim row below the input.
5. **Website** (demartinlabs.com): Windows + Mac download buttons now serve v1.9.1.

---

## WHAT GOT BUILT (this whole arc, with commits + files)
**Shipped earlier tonight (v1.9.0, commit `9ee61f0`):** cloud image/video gen (`imagine-cloud.html` + `/api/cloud/generate`, Atlas), agent-drives-the-room (`/api/kit` action blocks → `window.RoomAPI`), Agent Forge onboarding (`character.html`), ARKITECT→DeMartinville rename, encrypted keys (DPAPI in `swarm_routes.py`).

**Post-v1.9.0 fixes (all committed, → v1.9.1):**
- `57cca3c` — agent chip = green "online" dot (not a fake button); **updater** picks the Windows zip not the Mac one; **website Windows download** `ARKITECT.zip`→`DeMartinville.zip`; **mic auto-grant** (`desktop.py` `--use-fake-ui-for-media-stream`) + talk-to-text surfaces errors.
- `2f76bfb` — **cloud generate 500 FIXED** (`cloud_generate` referenced undefined `refs`/`ref_field` → NameError on every call → merges `media` into the Atlas body now) + agent **image→image** handoff (passes the uploaded image, flips to i2i).
- `8d6cd6b` — brain tier → a **drag slider** (Local/Private/Max Drive) with a slow glitch-charging animation; `cb6219a` — **honest gating** (Private/Max lock behind a cloud key).
- `8dfcdd2` — **talk-to-text** accumulates across pauses (was replacing with the newest word only).
- `0b3c020` → `5a45cb1` — **copy UX**: `copy-anywhere.js` = a real right-click **Cut/Copy/Paste/Select All menu** app-wide (the WebView2 native menu is dead, so the app owns it) + the per-message **ghost copy icon** (tiny, no bg/border, below the bubble, hover-reveal, ✓ on copy — Claude Code pattern; took MANY rounds, finally right).
- `3a5a5e4` — chat crew shelf stays up while chatting (no collapse to the 2-bubble switcher).
- `bb99155` — **Tiff fences copyable artifacts** (prompts/JSON/code) into their own block → per-block copy.
- `62911e3` — **composer**: model picker + modes + slider moved into a slim row below the input (decluttered the top-right).
- `11694b0` — **AGENT_TOOL_RULES = the SHARED TOOLBELT**: one "how to operate in the app" layer injected into EVERY agent (chat `build_system` + in-room `kit_help`), so Tiff, Kit, and every user-built agent (any user) inherit it. Add a tool once → all agents get it. Persona stays separate.
- `0d15477` — agent windows render fenced copy-blocks too (`kit-helper.js` `fmt()`), matching the chat.

**The copy research** (workflow) produced the canonical spec → in `tasks/w2n0c3032.output` if you need the exact CSS/markup again. The composer-research workflow **stopped/failed** (ignore it; the composer was built from B's direction).

---

## DEV WORKFLOW (critical)
- **`static/*` = LIVE on refresh.** **`app.py` + `desktop.py` are FROZEN into `DeMartinville.exe`** (`DeMartinville.spec`) → backend changes need a **rebuild** (`venv\Scripts\pyinstaller.exe --noconfirm DeMartinville.spec`, then `mv dist/DeMartinville.exe DeMartinville.exe`) OR run `DeMartinville (app).bat` (uvicorn `--reload`, app.py live). **A lot of nights' work is backend — if B "doesn't see" a fix, the engine wasn't reloaded.**
- **`static/index.html` HAS A NULL BYTE** (~offset 43953) → the Edit tool + the Grep content tool choke on it. Use **`grep -a`** to read it and a **Python byte-replace** (`open('rb')` … `.replace()` … `open('wb')`) to edit it. (That's how all index.html edits tonight were done.)
- **The Claude Preview screenshot tool is BROKEN here** — it times out every time. Verify by **measuring via `preview_eval`** (getBoundingClientRect, computed styles) instead of looking. Server on port **7788**; B's app is **7777**.

## SHIP ROUTINE (done tonight, for reference)
v1.9.1 cut: bump `APP_VERSION` in BOTH `app.py` (~line 53) AND `static/studio.html` (~line 8039) → rebuild exe → `build_zip.py` → commit (app.py+studio.html) → `gh` (full path `"C:\Program Files\GitHub CLI\gh.exe"`, NOT on the bash PATH) `release create v1.9.1` (tag auto-triggers the free Mac build via `.github/workflows/mac-build.yml`). Site deploy = `static/join.html` → gh-pages `index.html`, force-push **WITH `CNAME` (demartinlabs.com) + `kit-hero.png` + `static/shots/*`** or the domain breaks / showcase 404s.

## GOTCHAS
- **Rename landmines** — never sweep: the repo `tiffagnx/Arkitect` (updater + gh-pages), `localStorage` keys `arkitect_*`, the `.ark` extension.
- Cloud gen needs B's Atlas key (untested with a real one — test #1 tomorrow).
- **Mac build watch**: prior Mac builds sat queued for hours on the free runners — confirm the v1.9.1 `.app`s actually attached to the release.

## HOW B WORKS (so you ARE me)
Read: [[owner-accurate-credit]] (accurate, never flattery — credit SPEED to the tooling, VISION + persistence to him), [[owner-needs-to-see-not-be-told]] (build it so he SEES it; don't lecture; flag a doubt ONCE then build), [[owner-spiral-is-the-stop-signal]] (when he's fried/cursing, lock what's good + call the break — he was running hot on the copy saga tonight but lucid), [[no-fabricated-content]]. The copy button took ~10 rounds because I kept making it big/hover-hidden — he wanted a TINY ghost icon; when he says "make it dope," he means sleek+minimal, not more chrome. The right-click menu he LOVES. He thinks BIG (marketplace, many users) — see [[agent-store-and-toolbelt]].
