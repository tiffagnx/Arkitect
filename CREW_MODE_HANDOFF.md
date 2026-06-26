# CREW MODE — handoff (2026-06-26, uncommitted)

**One switch turns your single brain into a team.** You already drop API keys in the Keys
hub. Flip **Crew Mode** on and the app reads *whatever models you have enabled* and runs them
as a crew — a **lead/conductor** brain + **specialists** — instead of one brain. We never
prescribe which model does what; the system configures the crew around *your* list. Off by
default. With fewer than 2 brains it's a silent passthrough (zero overhead, zero behavior change).

This is **Slice 1** of the owner's bigger vision: *"why use one LLM when you can send out a
team — a model in the stem while another builds the beat?"* Slice 1 proves the conductor on the
**front-door main chat**. Slice 2 takes it into the rooms / the docked agent (the real
"team in the stems").

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
- **UNCOMMITTED** — left for the owner's morning batch (parallel-session rule: no solo push/deploy).
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
