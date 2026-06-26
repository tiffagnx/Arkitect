# Agent Training + Per-Agent Models — session handoff

**Date:** 2026-06-25 · **Status:** all 3 features BUILT, verified live, and ALREADY COMMITTED (swept into the parallel session's v2.x `Agent Forge` release line; `git show HEAD` == working tree for every symbol below). Version is **2.1.0** (after a parallel session's `v2.2.1` tag was corrected back to 2.1.0).

> ⚠️ **Multi-session tree.** A parallel session was committing/releasing the whole time (The Kitchen, The Stream, Cloud Port, Notifi Payments). The remaining uncommitted changes — `app.py` (~10 lines), `static/index.html`, `static/join.html`, `static/stream-*.js`, `static/studio.html`, `static/cloud-*.js`, the `*_PAYMENTS/_PORT_HANDOFF.md` files — are **THEIRS, not mine**. Don't touch/commit them. Never `git add -A` here.

---

## What shipped this session (all in HEAD)

### 1. Agent training system — agents that actually learn you
Engine = a **server-side per-agent knowledge pack** that genuinely grows; the brain reads it every turn so the agent answers more like the user over time.
- **Storage:** `data/agents/{sanitizedId}.json` (gitignored, local). Shape: `{id,name,craft,craftLabel,ts,entries:[{id,text,source,kind,evidence,room,ts}]}`. `source` ∈ `work|watch|feed`. Trained score is DERIVED from entries, never stored.
- **Endpoints (app.py):** `GET /api/agents`, `GET /api/agents/{aid}`, `POST /api/agents` (upsert metadata, merges entries), `DELETE /api/agents/{aid}`, `POST /api/agents/{aid}/train` (kind+raw → distill+append), `GET /api/agents/{aid}/readiness`.
- **Distiller:** `_distill_rules()` runs the LOCAL model (LM Studio) via `lm_once` at **temperature 0.15**, parses each `{...}` object individually (survives ```json fences + truncated arrays), line-fallback, and **retries up to 3×** (a 4B model is inconsistent at JSON; first call often returns junk). HONEST: no model / nothing durable → `added:0`, nothing written, bar doesn't move.
- **`lm_once`** gained an optional `temperature=` param (default 0.4 unchanged) so the distiller can run cold.
- **`/api/kit` injection:** for "mine" agents (agentId present) it loads the pack and injects a "LEARNED FROM REAL SESSIONS" block ADDITIVELY after the existing persona/knowledge.
- **Readiness:** build score 0–80 (existing form formula, unchanged) + **trained 0–20** (1pt/rule cap16 + 2pt/distinct-method cap4). Combined 0–100. The bar can now cross 80.
- **Forge UI (`static/character.html`):** Step 06 "Train them" — 3 modes (watch/feed/work) + a live training-log rendered from REAL pack entries only (honest empty-state, no fakes). Locked panel rewritten "Final 20 — earned, not bought" (padlock → ▲).
- **In-room (`static/kit-helper.js`):** `⏺ watch` + `📌 teach` toolbar buttons next to 👁 (lit only for mine-agents); learns-as-you-work auto-fire after substantive turns (provenance fixed: distills the USER turn + ROOM STATE only, NOT the agent's own reply; gated to q≥25 chars).
- **Verified live:** fed a real mixing corpus → 4 rules distilled → bar **75→81%**, log showed real rules tagged `FED from: <source>`.

### 2. 👁 LOOK button fix
`/api/screenshot` does `PIL.ImageGrab.grab()` server-side. It **only 500'd in the frozen `DeMartinville.exe`** ("cannot import name 'ImageGrab' from 'PIL'") because PyInstaller missed the lazy import. Patched **`DeMartinville.spec`** (`hiddenimports += ['PIL.ImageGrab']`) so the next exe build has it. Dev/venv already works (grabbed 1920×1080 fine). ⚠️ Needs an exe **rebuild** to land in the shipped app.

### 3. Per-agent model picker (in-room agents)
Each draggable agent's window now has its **own model dropdown** (replaced the abstract Local→Max tier lever). Each agent remembers its own pick INDEPENDENTLY — and the **main chat is untouched**.
- **Frontend (`static/kit-helper.js`):** `#ktModel` select in the `.kit-tier` row, populated from `GET /api/models` (local ids + `cloud:<slot>` entries when keys exist). No cloud key → local + a "➕ add a cloud model" item that opens the key flow. **NEVER fabricates a model.** Per-agent storage: built-ins use `localStorage["dmv_agent_model_"+id]`; mine-agents store a `.model` field in `dmv_characters` (mirrors `persistTrained`). `setActive` reloads the per-agent model. Glow: `.tier-max` gold/pink fires only when the selected model label matches `/claude|opus/i`.
- **Backend (`app.py` `/api/kit`):** reads a `model` field. `cloud:<slot>` → looks up that ONE slot via `_enabled_slots()` and routes to it (byte-mirrors the `/api/chat` cloud branch); bare local id → forces local with that id (new `model=` param on `_kit_local`); absent/`auto` → legacy local-default + tier fallback (UNCHANGED). Main chat key is `pinkroom-model` — zero overlap.
- **Verified live:** set Tiff→Groq, switched to Kit (stayed `auto`/local), back to Tiff (held Groq); main chat key untouched. Owner has Groq + Google Gemini keys set (no Anthropic key → glow stays off until he adds one).

---

## Operational gotchas (READ before debugging)
- **Dev server vs exe:** `static/*` is live-on-refresh; `app.py` is FROZEN into `DeMartinville.exe`. For a build/test session run **`DeMartinville (app).bat`** (or `venv\Scripts\python -m uvicorn app:app --port 7777`). The frozen exe does NOT carry this session's backend until rebuilt.
- **The Studio "self-restart":** loading `studio.html` can call `POST /api/studio/update/restart` (its updater applying a staged update). On the real `.exe`/`.bat` this **relaunches itself and self-heals**; a bare `uvicorn` started by hand may or may not relaunch — if the app seems to "die," it's this, not a crash. Don't whack-a-mole restart it.
- **Distillation needs the LOCAL LLM loaded** (LM Studio at :1234). No model → training honestly adds nothing.
- **`uvicorn --reload` lags on this heavy `app.py`** — tests can hit STALE code in the reload window. Prefer a plain restart (no --reload) and wait ~10s, or test against a fresh process.

## Open / next
- **God Particle = run agents ON Claude:** the picker already routes a selected cloud model per-agent (pick a Claude slot → that turn runs on it). The deeper follow-up is the TRUE native effort/adaptive-thinking dial via `/v1/messages` (see memory `claude-god-mode-vision`).
- **Optional hardening:** the dropdown builds `<option>` markup by string-concat from server labels — escape cloud-slot names (same trust boundary as the existing chat picker; not a regression).
- **Owner test list (live, with HIS agents/keys):** (1) build a real agent + train it, watch the bar; (2) set two agents to different models, confirm isolation; (3) fire a live cloud round-trip on a Groq/Gemini key to prove backend routing end-to-end (I did NOT spend his key — left it for him).

## Memory touched
`agent-training-tiers-and-capture.md` updated with the BUILT+VERIFIED status, the in-room toolbar placement, the 4B-JSON gotcha, and the dev-loop/exe lesson.
