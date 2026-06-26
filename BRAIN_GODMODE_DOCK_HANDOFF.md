# BRAIN / GOD-MODE / DOCK / ESCORT — session handoff (2026-06-26)

> Cold-start orientation for the next session. This covers ONE session's arc (the cloud-brain / API-key /
> agent-dock / room-escort system). Other parallel sessions own the Stream/Notifi, LePrince effects,
> Kitchen, character, and welcome-tips work — **do not touch their files.**
> ⚠️ **Version is `2.2.0` and I did NOT change it.** The owner is bumping it from a *different* session
> (the "last one"). Do not bump `APP_VERSION` here.

---

## TL;DR — what this session shipped (all verified)

1. **Multi-model per API key** (`settings.js`) — one key → as many models as you want, each becomes its own brain (chip multi-picker, "＋ add", "↻ all" live catalog). One Anthropic key → Sonnet + Opus + Haiku, etc.
2. **Capable-models-only** (`swarm_routes.py` `/api/swarm/models` + `settings.js` + `keys.js`) — the "↻ all" pull filters the live catalog to models that can SEE (vision) + use TOOLS (the agent needs tool-calling). Live test: 339 OpenRouter models → 140 agent-ready. OpenRouter ids corrected (dots, not dashes: `anthropic/claude-opus-4.8`), default = `google/gemini-3.5-flash` (capable). Owner chose "keep capable, make the copy honest" about free-vs-paid.
3. **12-bug adversarial review** (Workflow) of the whole brain arc → **11 fixed + verified**, 1 product decision (the `:free` default, resolved above). Two were real reachable breaks: a DETERMINISTIC native-Claude 400 on long chats (the `messages[-12:]` window could open on an assistant turn) and the Test button failing valid Claude keys. See `[[brain-system-adversarial-review]]` in memory.
4. **God Mode for ALL brains** (`swarm_routes.py` + `app.py` + `cloud-ai.js`) — the reasoning/effort dial now works for Grok 4.3 / GPT-5.x / Gemini 3.5, not just Claude. They take `reasoning_effort` as a top-level field on their OpenAI-compat door, gated per-model with a SAFE-DEFAULT (send nothing when unsure). Also killed a **latent bug**: GPT-5 reasoning models hard-400 on `temperature`, which we always sent — now stripped. Persona stays Claude-only; only the dial is universal.
5. **Studio dock = vocal-engineer vocabulary** (`agent-dock.js` + `studio.html` `VDOC_MACROS`) — 2 NEW moves (de-mud, tighten/high-pass), INTENSITY ("a touch" vs "way"), and a wide vocabulary. See `[[dock-vocal-vocabulary-intensity]]`.
6. **Room escort** (`index.html`) — the front-page agent offers a one-click "take me to [Room]" chip when your message belongs in a room, carrying the warm-handoff context. See `[[room-escort]]`.

---

## What I COMMITTED in this session's commit (cleanly mine, no parallel entanglement)

- `swarm_routes.py` — native Anthropic door (`anthropic_native_stream`/`_once` + converters), `/api/swarm/models` capability `capable` list, `/api/swarm/test` Claude branch, `_load_providers` read-dedup, the leading-assistant trim (`_oa_to_anthropic`), AND the multi-brain reasoning layer (`_provider_of`, `_gpt5_reasoning`/`_grok_reasoning`/`_gemini_thinking`, `_effort_field`, `_sanitize_body`; `provider_stream`/`provider_once`/`_call_with_fallback` take `effort=""`).
- `static/cloud-ai.js` (new) — browser-direct native Claude stream + the reasoning-gate mirror (`_providerOf`/`_effortField`) + the SSE trailing-flush + guarded `deleteProvider`.
- `static/cloud-bridge.js` (new) — cloud-mode fetch interceptor, `godLayer`, handleChat/handleKit effort + handoff, char-aware system.
- `static/cloud-prompts.json` (new).
- `static/agent-dock.js` (new) — the whole Studio dock (parent stems → hears + acts + measured receipts + taste) PLUS this session's vocabulary/intensity/de-mud/tighten layer. **NOTE: this file was referenced by `studio.html` but had NEVER been committed (it was untracked) — committing it finally makes the dock exist in the tree.**
- `static/settings.js` — multi-model chip picker + capability filter + OpenRouter dot-id fix.
- `static/keys.js` — OpenRouter hero + capability default + honest free-vs-paid copy.
- `static/kit-helper.js` — the agent-window EFFORT LEVER (`#ktEffort`, God unlocks on Claude), the warm-handoff PICKUP, and the laid-back persona intros.

These are all backward-compatible/additive, so they're safe alongside the still-old committed `app.py`/`studio.html`/`index.html` (no breakage between commits — e.g. `provider_stream`'s new `effort` arg defaults to "").

---

## ⚠️ What is NOT in my commit (entangled with parallel sessions — DO NOT blind-commit)

My work ALSO lives in three heavily-shared files that other in-progress sessions are editing. I did **not** commit these to avoid sweeping their unfinished work (the owner's rule: never `git add -A`, leave parallel work intact). **My changes here will ride along when the owning session commits the file, OR the owner sweeps them in the batch:**

- **`app.py`** (also has the Notifi/Stream session's work). MY uncommitted changes:
  - `_god_layer(effort, persona_set=False)` (persona-aware — keeps a room agent's own identity), `_CRAFT_RE`, `_is_claude_slot`, `TIFF_ROOM_SYSTEM`/char-aware system in `/api/kit`.
  - `/api/chat` cloud branch: Claude → `anthropic_native_stream(slot, cpay, _effort)`, everyone else → `provider_stream(slot, cpay, _effort)`; effort coerced to str; `_effort_hint` stripped on the Claude path.
  - `/api/kit` (kit_help): the god layer on a `claude_system` COPY only (local fallback gets the clean system), `_kit_effort` threaded into `_call_with_fallback`, the warm-handoff inject, the compartmentalize (work rooms drop personal memory via `_WORK_ROOMS`/`_CRAFT_RE`).
- **`index.html`** (also has welcome-tips / de-Tiff / character-shelf parallel work). MY uncommitted changes: the warm-handoff CAPTURE (capture-phase click listener + `ROOM_OF`) and the ROOM ESCORT (the `addMsg` wrap + `ROOMS` regex table + chip + CSS).
- **`studio.html`** (also has cloud-port parallel work). MY uncommitted changes: the 2 new `VDOC_MACROS` (`demud` EQ-6 mG, `tight` EQ-6 hpf) and the `agent-dock.js?v=10` bump.

If you're the session committing one of these files, **my changes above are good to ship** (all verified). If a feature looks half-wired in master, it's because one of these three files hasn't landed yet — they complete it.

---

## 🔴 MUST-DO live tests (I could NOT do these — no keys)

1. **Native Claude dial** — needs the owner's real Anthropic key. One chat through a Claude slot at each effort stop (low→God) to confirm `output_config.effort` + adaptive thinking land. Body shape is verified; the live round-trip isn't.
2. **God Mode for Grok / GPT-5 / Gemini** — needs a real key for each. Fire ONE message per brain at high/max effort and confirm no 400. The gate is safe-by-default (an unsupported model just gets no dial), so worst case is "no reasoning boost", never a crash — but verify `reasoning_effort` is actually accepted by each provider's current models. The mappings are from June-2026 docs (`x-ai/grok-4.3`, `gpt-5.5`→`xhigh`, Gemini 3 Pro rejects `medium`→clamped to `low`).
3. **Dock de-mud / tighten** — open the Studio, record/drop a vocal, parent the agent, say "de-mud it" / "tighten the lows" / "a touch brighter" / "way warmer" and confirm the EQ moves + the measured receipts. (Parser + macro wiring verified; the live-audio run was blocked by a flaky preview pane.)

---

## ➡️ NEXT BIG BUILD: MCP DOCKING (the owner's named next vision)

The owner wants users to **dock their own MCP servers** so the in-room agents can use those tools — "people be docking their MCPs inside programs." This is the big architectural one; it deserves real design before code. Starting plan:

**The hard constraint — preserve the `$0` / whitelist invariant.** Today the agent can only fire actions on the app's OWN free in-house tools, gated by `_validate_action` (app.py) — a frontier brain literally cannot run anything off the whitelist, so it can't run up the owner's bill or do something unexpected. MCP tools break that wall: a docked MCP server can do ANYTHING (files, network, money). So the model has to be: **the USER docks it (explicit consent), it runs on the USER's machine/their server (their cost, their data), and side-effectful calls get a human-in-the-loop confirm.** The app never pays and never silently runs a docked tool.

**Where it fits:**
- A new "MCP servers" section in the swarm settings (next to providers/keys) — `static/settings.js` + a `data/mcp_servers.json` store (mirror the provider store pattern in `swarm_routes.py`: metadata file + the connection details). Start with HTTP/SSE servers (URL + optional auth header); defer stdio (local process spawn — riskier, desktop-only).
- An MCP client in the backend (`mcp_routes.py`, new) — connect, `tools/list`, cache the catalog. Each tool = `{name, description, inputSchema}`.
- Expose the docked tools to the agent: inject them into the agent's tool list / system prompt (the shared toolbelt = `AGENT_TOOL_RULES`). The agent emits a tool-call; route it through a NEW validation layer (sibling of `_validate_action`) that: (a) confirms the tool is from a user-docked server, (b) for anything not marked read-only, surfaces a confirm to the user before executing.
- Result feeds back into the agent's next turn (tool-result message).

**First safe slice (build this first):** dock ONE HTTP/SSE MCP server, list its tools, let the agent call a single READ-ONLY tool, show the result. No stdio, no side-effectful tools, no money. Prove the loop, then widen.

**Research to do first (I did not get to it):** the current MCP spec's transport (Streamable HTTP vs the old SSE), the `tools/list` + `tools/call` shapes, auth, and how other apps (Claude Desktop, Cursor) present the dock + the per-tool consent UX. Memory hook: `[[mcp-docking-vision]]`.

---

## Repo notes
- Server: `uvicorn app:app` on :7788 (no `--reload` — restart the preview to pick up `app.py`/`swarm_routes.py` changes). The preview pane wedges on the heavy `studio.html` — verify logic standalone (node/python) when it does.
- Parallel-session rule: leave others' work uncommitted, never `git add -A`, the owner batches everyone. The "last" session bumps `APP_VERSION` (two homes: `app.py` AND `static/studio.html`).
- Memory index entries this session: `[[claude-god-mode-vision]]` (⏩ ALL BRAINS), `[[keys-hub-openrouter]]`, `[[brain-system-adversarial-review]]`, `[[dock-vocal-vocabulary-intensity]]`, `[[room-escort]]`.
