# KIT'S BRAIN — Handoff

> ⏩ **READ THE 2026-06-20 SECTION FIRST.** The deep "how to mix" binder + Tiff
> wiring landed on top of V1. The V1 section (dated 2026-06-18, further down) is
> still accurate for the architecture, but where it says "not committed" or uses
> "sidechain" as an example of something Kit DOESN'T know, that's now outdated —
> committed in `56c9c34`, and sidechain (+ 300 other techniques) is now in the KB.

---

## ⏩ 2026-06-20 — Mixing brain + Tiff wired + INTEGRATION NOTES (4-worker merge)

**Context for integrators:** B has ~4 people/agents working in parallel branches;
he merges everything at the end and cuts ONE new version that ships it all together.
This section is what you need so this work survives the merge and ships correctly.

### What landed
- **Deep mixing binder** → `data/kit_kb/studio/` — **28 cards, 347 `##` chunks, ~242 KB.**
  Every mixing/production/creative-FX technique: gain staging, cleanup, editing, phase,
  EQ (fundamentals/by-source/surgical), compression (fundamentals/by-source/parallel-
  sidechain/advanced), reverb (incl. **reverse-reverb, gated, shimmer, throws**), delay
  (incl. **throws, dub, Haas**), modulation, saturation, width/depth, **full vocal
  production**, **the trick box** (stutters/drops/risers/tape-stop/telephone/pitch-FX/
  half-time), bus glue, mastering, metering, mix workflow, troubleshooting, genre notes,
  mistakes. Each move maps to the DAW's REAL tools and was fact-checked by a 2nd agent pass.
- **Multi-file-per-room loader** (`kit_kb.py`): now `rglob`s the KB dir and a file's room
  = its top subfolder, so `data/kit_kb/<room>/*.md` ALL load as `<room>`. One room's binder
  can span many files (top-level `studio.md` still works too). Also: expanded `_SYNONYMS`
  with mixing/creative-FX vocabulary, and a new `min_terms` relevance floor on `retrieve()`.
- **Tiff (main chat) is now wired into the binder** — `app.py` `craft_kb_block()`:
  cross-room retrieval (unknown room → ALL chunks) appended to the last user message
  (keeps the cacheable persona prefix stable, same trick as `memory_block`), gated
  `min_terms=2` so casual chat doesn't pull craft notes. So **both Kit (in-room, floor 1)
  and Tiff (cross-room, floor 2) read the same brain.** NOTE: this is only the KB-binder
  half of "give Tiff knowledge" — her *personal* Supabase memory (V1 Phase 1) is still open.

### Committed
- **`56c9c34` on `master`** — `kit_kb.py` + `app.py` ONLY. The binder markdown is gitignored
  (see #1 below). Verify: `python kit_kb.py` → should print **~347 studio chunks**.

### ⚠ INTEGRATION CHECKLIST (for whoever merges the branches + cuts the version)
1. **The binder is gitignored — it does NOT travel through a git merge.** All of `data/`
   is gitignored, so the 28 files in `data/kit_kb/studio/` (and the existing
   `data/kit_kb/*.md`) will NOT come across a clean branch merge. They live on disk in
   **THIS** working copy (B's main repo). Do the final integration **in this tree**, or
   physically copy `data/kit_kb/` across. Post-merge sanity: `python kit_kb.py` prints ~347
   studio chunks; if it's ~30, the binder didn't make it.
2. **To SHIP the mixing brain to users, edit `build_zip.py`.** It currently EXCLUDES all of
   `data/` (the EXCLUDE list, ~line 15), so the binder is NOT in the distributable yet.
   For the new version to carry it: **include `data/kit_kb/` specifically** while keeping the
   rest of `data/` (sessions, keys, personal memory) OUT. This is the "everything ships
   together" item — **no Firebase/cloud account needed; it's just a packaging include.**
   (Optional later: a Cloudflare mirror for over-the-air KB updates — B's preferred tier.)
   Safety: `data/kit_kb/` today is all PUBLIC program knowledge (safe to ship). If Tiff's
   personal Supabase memory ever gets ingested into it, keep THAT out of the zip.
3. **Bump `APP_VERSION`** (`app.py` line 40, currently `"1.1.0"`) to the new release tag and
   confirm `build_zip.py` actually included the binder, BEFORE cutting the GitHub release
   (`tiffagnx/Arkitect`) — so the in-app updater ships the engine + the knowledge together.
4. **Merge-conflict map** (only matters if another worker also touched these 2 files):
   - `kit_kb.py`: changed `_signature()` (`glob`→`rglob`), `_load()` (subfolder→room loader),
     added a block to `_SYNONYMS`, and added the `min_terms` param + floor to `retrieve()`.
     Synonyms are additive — keep BOTH sides if someone else added entries.
   - `app.py`: added the `craft_kb_block()` function (right after `memory_block`) and ONE
     line in `chat()`: `mem += craft_kb_block(messages)` right after `mem = memory_block(...)`.
5. **Staged-update note:** I synced the new loader into `_update/staged/kit_kb.py` because a
   pending v1.1.0 staged update carried the OLD top-level-only loader (would blind Kit to the
   subfolder). `_update/` is gitignored runtime — fine to discard at integration; just don't
   let a stale staged `kit_kb.py` apply over the new one.

### How to teach Kit/Tiff more (unchanged, still the payoff)
Add a `## Heading` + plain sentences to any `data/kit_kb/<room>/*.md` (or a new file in
`data/kit_kb/<room>/`) and save — live instantly, no restart, no rebuild. Headings should
read like the words a user would type.

---

## V1 — original handoff (2026-06-18, architecture still accurate)

> Pick this up cold tomorrow. V1 of Kit's knowledge brain is **built, wired, and
> verified**. It just needs the server bounced to go live. This doc says what
> shipped, how to turn it on, how to teach Kit more, and the two next phases
> (Tiff's memory from Supabase, then Kit "god-mode" control).

---

## TL;DR
- **What:** Kit (the in-room "Yo, Kit" helper) now has a RAG knowledge layer — he
  pulls the few most relevant facts from a knowledge base on demand instead of
  guessing. Free, local, no new dependencies, ~1.8K of his 16K context used.
- **Status:** code done + compiles clean + retrieval tested. **NOT yet live** — it
  loads on the next uvicorn restart (don't restart while the Studio crew is working).
- **NOT committed yet** (crew is on `master`; commit when the coast is clear).

---

## What shipped

### New file: `kit_kb.py` (the engine / librarian)
Keyword retrieval over `data/kit_kb/*.md`, scoped by room + an always-on
program-wide doc (`architect.md`). Same proven pattern as `relevant_memories()` in
`app.py` ("no database, no embeddings, no drama"). Has a synonym map so literal
gaps still match (e.g. "hiss" → the de-noise page; "lane" → "track"; "bus" →
"send/aux"). mtime cache = edit a `.md` and it goes live with **no restart and no
build step**.
- API: `retrieve(room, query, k=4, budget=2800)` → list of chunks;
  `as_prompt_block(chunks)` → the system-prompt block.
- Self-test: `venv\Scripts\python.exe kit_kb.py` (prints chunk count + sample
  retrievals). Last run: **70 chunks across 6 rooms**, all retrievals on-target.

### New knowledge base: `data/kit_kb/*.md`
One plain-English markdown file per room; each `## heading` is one retrievable
"page." **This is gitignored (`data/` is local, like memory.json).** Files:
- `architect.md` — the whole program: what ARKITECT is, every lab, Tiff vs Kit,
  settings/Swarm, privacy, the honesty rule. (Cross-room — Kit pulls from it in
  ANY room, so he can always explain the program + the other labs.)
- `studio.md` — DEEP DAW how-to (from STUDIO_DAW_HANDOFF.md): import, tracks,
  channel strip, plugins, clip editing, **buses & sends**, **Master Fader**,
  recording/arm, transport, views, zoom, edit modes/tools, save/load, export,
  shortcuts, the owner's mental model.
- `editor.md` — AE-style NLE (from EDITOR_AE_HANDOFF.md): workspaces, menu bar,
  comp settings, layers, effects, keyframing, render, + honest "not built yet" list.
- `images.md` — Imagination Station: modes, prompting, Polish, aspect, VRAM/free
  memory, gallery.
- `build.md` — Blueprint Builds: describe → build, iterate, refs, preview, library.
- `bit16.md` — Bit1Six: PLAY, REC, DIRECTOR.

### Wiring: `app.py`
- `import kit_kb as kb` (next to the swarm import, ~line 3288).
- In `kit_help()` (the `/api/kit` endpoint), right after `system = KIT_SYSTEM +
  ROOM_HELP...`: `system += kb.as_prompt_block(kb.retrieve(room, msg))`
  (best-effort try/except — retrieval can never break a reply).
- The injected block carries a hard **honesty instruction**: answer ONLY from the
  knowledge; if it's not there, say "not sure" and offer Tiff — never guess, never
  give "maybe" info. (This is B's #1 rule for Kit.)

---

## HOW TO TURN IT ON
The knowledge files are already live (mtime-cached). The `app.py` wiring needs the
server reloaded:
```
venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 7777
```
**Do NOT restart while the Studio/editor crew is working on 7777** — it'll drop
their session. Bounce it when they're done, or when you're the only one in.

## HOW TO TEST (after restart)
1. Open a room, e.g. `http://127.0.0.1:7777/static/studio.html`.
2. Click "Yo, Kit" and ask things only the KB knows: "what's a bus and how do
   sends work?", "how do I export the mix?", "how do I clean the hiss off a
   stem?", "what is this whole program?"
3. Good = grounded, specific, matches the KB. Ask something NOT in the KB ("how do
   I sidechain compress?") → he should say he's not sure + offer Tiff, NOT invent.
   (Needs LM Studio running with a chat model loaded, or a Swarm cloud key set.)

## HOW TO TEACH KIT MORE (the payoff — no hand-feeding)
Open the matching `data/kit_kb/<room>.md`, add a `## Heading` + a few plain-English
sentences, save. He knows it instantly — **no restart, no rebuild.** Keep each
section tight (~1 short paragraph). Write headings in the words a user would type.

---

## NEXT PHASE 1 — Give Tiff her memory (from Supabase)
**Goal:** B wants Tiff (main chat) to "know me" — his 5 months of stored knowledge
— and to pull the program-useful slice into the rooms too.

**Where it lives:** NOT flat files. It's in the **heytiff.ai Supabase Postgres DB**
at `C:\Users\koonc\Desktop\Projects\tiff-studio-access`.
- Live project: `wuaxiicuebejegirkukb.supabase.co` (the "NEW" one in
  `migrate-data.mjs`). Old project: `xkegfrypdrqncpzgzkak` (pre-migration).
- Schema: `tiff-studio-access/migration.sql` (~38 tables). Overview:
  `tiff-studio-access/SITE-OVERVIEW.md`, `CLAUDE.md`.

**The knowledge/memory tables (the ones worth ingesting):**
- `tiff_notes` — Tiff's saved notes / KB (the "Knowledge" admin room; confirm it's
  this table vs. `saved_prompts`).
- `saved_prompts` — reusable prompts.
- `sessions` — past chat history (distill into durable memory, don't import raw).
- `songs`, `creative_projects`, `full_projects`, `storyboards` — his creative body
  of work.
- `character_presets`, `character_references`, `style_presets`, `reference_tracks`
  — creative reference/preferences.
- `mix_analyses` — audio/mix knowledge (program-useful, could feed Studio's Kit).
- (Operational, probably skip for memory: `tiff_tasks`, `tiff_reminders`,
  `tiff_notifications`, usage/billing/auth tables.)

**Plan:**
1. Read-only pull from the live DB (Supabase MCP connector is available, or a
   small read script with the anon key). Inventory row counts per table.
2. Split **personal** (notes, sessions-distilled, songs, projects, presets →
   Tiff's `data/memory.json` and/or a Tiff KB) vs **program-useful** (mix_analyses,
   style/character presets → could also feed Kit's `data/kit_kb/`).
3. Import: personal facts → Tiff's memory (same `relevant_memories` retrieval she
   already uses); reuse the exact `kit_kb` pattern for any Tiff KB docs.
4. Keep it curated — distill, don't dump 5 months of raw chat into context.

**⚠ SECURITY (flag to B):** `tiff-studio-access/migrate-data.mjs` has a live
Supabase **service-role key** (`sb_secret_LUvK…`) hardcoded, and that repo has a
`.git`. That's full DB access in version control — **rotate that key** and move it
to `.env`. Same file also exposes the old anon key.

---

## NEXT PHASE 2 — Kit "god-mode" (the control layer)
B's endgame: Kit isn't a finished toy, he's a **build**. Eventually he CONTROLS the
rooms, not just explains them. Roadmap (the `kit_help` retrieval seam is the
foundation all of this plugs into):
1. **Compartmentalized tool-use** — Kit gets a defined set of tools that map to a
   room's own JS functions (Studio: add track, add insert, route a send, normalize,
   de-noise, etc.). You ask him to do ONE thing; he picks tool+args; the app
   executes against the live session. Consistency comes from constraining the tools,
   not model size. Incremental: every "I wish Kit could do X" = add one tool.
2. **Honest stem listening / feedback** — upload audio, Kit analyzes and gives real
   advice ("what should I do with this track?"). Must be honest — real info or
   "I don't know," never half-assed "maybe."
3. **Generation/editing** — generate audio stems, edit audio + video, etc.

**Build note:** a 4B local model is unreliable at clean tool-call JSON. Prototype
the tool-use layer on a hosted brain (already routable via the Swarm /
`_call_with_fallback` in `kit_help`), prove the wiring, then swap local back in.
Architecture is identical either way.

---

## OPEN ITEMS / NOTES
- **Kit's code is uncommitted.** `kit_kb.py` (new) + `app.py` (2 small edits). The
  `data/kit_kb/*.md` are gitignored (local). Commit `kit_kb.py` + `app.py` when the
  crew's off `master`. Suggested msg: `ARKITECT: Kit V1 brain — RAG knowledge layer
  (kit_kb.py + data/kit_kb) wired into /api/kit`.
- **Separate Tiff bug (still open):** `data/memory.json` looks like it only has ~7
  auto entries → the 56-entry `data/kb_export.json` creative seed may not be loading
  into Tiff. Worth a check during Phase 1.
- **Dead file:** `data/odysseus-archive/memory.json` is referenced nowhere — safe
  to ignore/remove.
- Full design rationale is in memory: `kit-assistant-brain-vision.md`.
```
```
— End of handoff. Tomorrow: bounce the server → test Kit in a room → then Phase 1
(Tiff's Supabase memory). Keep Kit honest and grounded.
