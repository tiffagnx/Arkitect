# CREW MODE — handoff (2026-06-26, SHIPPED v2.5.0 — IN-ROOM)

> **Status: SHIPPED v2.5.0.** The feature now lives WHERE THE OWNER WANTED IT — **inside the docked
> agent's window**, not the front door. The original front-door "Crew Mode" toggle (v2.4.0) was the
> wrong read and has been **REMOVED** (`static/crew.js` deleted; front-door + pinkroom-nav includes
> gone). GitHub + zip only; **website (gh-pages) NOT deployed** — owner is reworking demartinlabs.com,
> and he's the only user right now, so releases are kept lean (no fuss on notes/versioning).
> ⚠️ The architecture sections further down describe the OLD front-door `/api/chat` build — now removed,
> kept only as history. The live feature is the in-room one described here.

**The in-room crew (the real version).** You drag an agent (Tiff / Kit / your own) into a room → open
their window → hit **"+ crew"** (in the Brain row, next to model + effort) → a checklist of EVERY brain
you have keys for (Grok, Gemini, Claude, GPT, local — pick ANY combo). The agent stays the **lead/voice**
and still drives the room; your picked crew weighs in behind it and the agent **synthesizes** the best
of it. Per-agent, opt-in, saved. **God Mode (depth on Claude) + crew (breadth across models) STACK.**

Files: `static/kit-helper.js` — the "+ crew" button + picker popover + per-agent storage
(`dmv_agent_crew_<id>` for built-ins, `dmv_characters[].crew` for user agents) + a `crew:[modelIds]`
field on the `/api/kit` payload. `app.py` `kit_help` — gathers each picked brain's take in parallel,
folds them into the LEAD's `system` so the agent synthesizes in its own voice (action-driving + Claude
god-layer preserved); logs `[crew] N/M brain(s) backed …`. Verified live: button, picker, per-agent
save, payload. Backend is syntax-clean but only fires after an app restart (dev server doesn't
hot-reload) — live for everyone on the v2.5.0 update.

---

## What shipped (all verified live in Chrome against the owner's real Groq + Gemini keys)

- **`static/crew.js`** — NEW, self-contained (~390 lines). The whole feature: the classifier,
  the conductor, the synthetic SSE stream, and the UI (toggle button + live "here's your crew"
  panel).
- **`static/pinkroom-nav.js`** — ONE line added: injects `crew.js` right after `cloud-bridge.js`
  (so the rooms get it). Inside the existing `data-dmvai` injection block.
- **`static/index.html`** — ONE `<script src="/static/crew.js">` added right after the direct
  `cloud-bridge.js` tag (line ~1416). The front door loads cloud-ai/bridge **directly** and does
  **not** use pinkroom-nav, so it needs its own include. This is the Slice-1 surface.

### Verified
- Loads with no console error; `window.__dmvCrew`, `window.DMV_CREW` live; **off by default**.
- Button mounts in the front-door topbar ("CREW", gold glow when on). Panel renders a **live
  lineup from the actual configured keys** (🎖️ Lead, specialists with chairs, bench note, cost line).
- Toggle persists `dmv_crew_mode` ('0'|'1').
- **ON, end-to-end:** Groq (lead) + Gemini (specialist) → step narration (`🎬 / ⚡ / ✓ / 🧩`) →
  one synthesized streamed answer. No error.
- **OFF:** `0` crew steps, normal single-brain reply. True passthrough.

---

## How it works (architecture)

- Captures the **current** `window.fetch` (already cloud-bridge's override on the hosted site,
  native on desktop) as `prevFetch` and wraps it. Wraps **POST `/api/chat` ONLY**; everything
  else delegates straight through.
- When ON + 2+ enabled brains: builds a synthetic SSE `Response` in the **exact** app framing
  (`data: {json}\n\n`, `{type:'delta'|'step'|'error'|'done'}`) and orchestrates **client-side**:
  1. `assemble()` reads `GET /api/swarm/providers`, classifies each slot (family + reasoning /
     code / vision / cheap heuristics), seats a **lead** (top reasoning) + up to **3 specialists**.
  2. Specialists run **in parallel**, each via `prevFetch('/api/chat', {model:'cloud:<id>'})` with
     a role frame appended to the last user message. (Reuses the full backend/bridge path → free
     persona, memory, god-layer, native-Claude effort per brain.)
  3. **Lead** synthesizes — gets the specialists' takes folded into the last user message — and
     **streams** the final answer through as deltas. Step events narrate progress above the bubble.
  - Graceful: any specialist 429/error just drops out; if the lead fails it falls back to the best
    specialist take; any setup hiccup → plain `prevFetch` (never a dead end).

## Isolation contract (honored — this is a guest in a many-session tree)
- Touches **only** `localStorage dmv_crew_mode` + global `window.DMV_CREW`. Reads (never writes)
  `/api/swarm/providers`, `dmv_characters`, `window.activeBrain`.
- **Never** touches `/api/kit`, `/api/beatbrain`, `/api/vocalassist`, `/api/build`,
  `/api/stream/*`, `/api/swarm/*`, `/api/memory`, `/api/sessions`, or the agent dock.
- No backend changes. `/api/chat` + `/api/swarm/providers` shapes unchanged.
- Reconciled against **all 9 of tonight's handoffs** before building (workflow audit): every
  verdict **clear** except DOCKED_AGENT = *proceed-with-care* (don't run crew + dock at once —
  Slice 1 sidesteps it by touching `/api/chat` only, never the dock's endpoints).

---

## Status / coordination
- **SHIPPED v2.4.0** (`feb081d`, master). Committed by EXPLICIT path (crew.js, index.html,
  pinkroom-nav.js, app.py, studio.html, this doc) — a parallel session's `AUDIT_HANDOFF.md` was in
  the tree and was deliberately **left untouched** (never `git add -A`).
- Bumped `APP_VERSION` 2.3.0 → 2.4.0 in BOTH homes (app.py + studio.html). Zip built with the
  existing exe (no rebuild); crew.js ships as a loose `static/` file, so it lands without a rebuild.
- Safe alongside cloud-port, brain/God-Mode-dock, agent-training, welcome-tips, notifi, leprince,
  launch-kit sessions (all audited; no localStorage / global / fetch-order / SSE-shape collisions).
- Files are additive: 1 new file + 2 one-line includes. Nothing clobbered.

## Known tuning / Slice-2 roadmap
- **Classifier is heuristic** (name-based) and deliberately tunable (top of `crew.js`). Lead pick
  is solid for clear tiers (Opus beats an 8b); for two same-tier cheap models the lead is a
  cosmetic tie-break (e.g. Groq-llama vs Gemini-flash). Refine `classify()` / `chairOf()` anytime.
- **Slice 2 (the owner's real vision):** crew INSIDE the rooms / docked agent — different brains
  on different stems/tools at once (a model in the vocal stem doing doctor-moves while another
  builds the beat), coordinated by a lead off **one shared song/project state**. Hook points
  already mapped: `agent-dock.js` `window.DMV_DOCK_FIX` + `kit-helper.js` `ask()` guard +
  `/api/kit` crew fields. The **shared whiteboard** (project state every brain reads/writes) is
  the hard, important part.
- **Lead "quarterbacks" (true delegation):** Slice 1 = specialists-then-synthesis. Next is a
  lead that *decides who to engage and routes subtasks* (the `/api/research-swarm` split→fan→merge
  pattern is the template). Engage the cheap **bench** brain for grunt subtasks.

## How to test
1. Front door (`/static/index.html`), have **2+ cloud brains** enabled in Keys.
2. Click **CREW** in the topbar → panel shows your lineup → flip the switch ON.
3. Chat normally. Watch the `🎬/⚡/✓/🧩` steps, then the synthesized answer.
4. Flip OFF → back to single-brain. (1 brain → toggle is a no-op + "add another brain" note.)
