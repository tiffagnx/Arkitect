# Session handoff — MCP control + agent-work glow + the master guide

*Built 2026-06-26. Everything below is **verified** and **UNCOMMITTED** (left for the owner's
batch — multiple sessions run in this repo, so don't blind-commit). The live app on **7777** was
never touched; all testing was on a throwaway server (7798). App runs uvicorn with **no `--reload`**,
so a **restart loads the new `.py` + includes.*

## 1. MCP — Claude can control the app

- **Layer 1 (backend powers):** `mcp_server/` (`server.py` = FastMCP stdio server, **24 tools**;
  `README.md`; `requirements.txt`). `mcp` is installed in the venv. Wired into **Claude Desktop**
  (`%APPDATA%\Claude\claude_desktop_config.json` → `mcpServers.demartinville`; a `.bak` is saved).
  **Live-verified on 7777** (reads + `dmv_chat` through a cloud brain).
- **Layer 2 (live-room relay):** `room_relay.py` (`/api/room/*` long-poll queue; **+1 include** in
  `app.py` by the swarm-router) + `static/mcp-bridge.js` (included in `studio.html` + `character.html`).
  MCP tools: `dmv_rooms_open`, `dmv_room_describe`, `dmv_room_command`. **Verified end-to-end in a real
  browser** (an external command ran `fill_agent` and filled the live form).
- Full detail → **`MCP_SERVER_HANDOFF.md`**.
- ⚠️ Real port = **7777** (NOT 7799 — that + 7788 are preview ports). Beats/editor not bridged yet
  (their sessions own those files); they just need the `mcp-bridge.js` + `room-glow.js` includes.

## 2. Agent-work glow (Slice 1)

- `static/room-glow.js` — `roomGlow(target, {agent, label, state, progress})`: the exact element an
  agent works lights up + breathes with a WHO·WHAT pill. **Compositor-only (opacity/transform), never
  box-shadow in a keyframe** (research-killed — janks weak machines); seizure-safe; self-shipped
  reduced-motion; per-agent hue; self-erasing done state + watchdog.
- Wired into `static/studio.html` (script include) + `static/agent-dock.js` (the `DMV_DOCK_FIX` loop
  ~line 426 — guarded + try/catch, can't break an action). **Verified in a real browser.**
- Detail → memory `agent-work-glow-vision.md`. **NEXT slices:** room + plugin scope (DMV_DOCK_FIX
  session verbs), the real bounce sweep, the clip overlay, the universal `mcp-bridge.js` wire,
  beats/editor includes. **5 taste decisions pending the owner** (Tiff's hue, indeterminate honesty,
  whole-room loudness, clip-scope in v1, error color).

## 3. The master guide + in-app help

- **`GUIDE.md`** (repo root) — the whole site explained from a real source read: every room
  (what it is / how to use it / where it lives / how it hooks up) + the architecture (backend, brains,
  keys, MCP, run/deploy) + a quick-reference cheatsheet. The canonical orientation doc.
- `static/help.js` — a quiet on-demand **`?`** in every room (per-room how-to, **never auto-opens**),
  injected app-wide by `static/pinkroom-nav.js` (+1 line). **Verified in a real browser.** *(Placement
  of the `?` was tweaked after the build — leave as-is.)*

## Files this session (all uncommitted)

- **NEW:** `mcp_server/`, `room_relay.py`, `static/mcp-bridge.js`, `static/room-glow.js`,
  `static/help.js`, `GUIDE.md`, `MCP_SERVER_HANDOFF.md`, `MCP_GLOW_GUIDE_HANDOFF.md`
- **EDITED (additive, guarded):** `app.py` (relay include), `static/agent-dock.js` (glow hook),
  `static/studio.html` (room-glow + mcp-bridge includes), `static/character.html` (mcp-bridge include),
  `static/pinkroom-nav.js` (help include)
- ⚠️ **NOT this session:** `static/keys.js` + `static/kit-helper.js` are modified by another
  session/source — **leave them.**

## To light it all up

1. **Restart the app** (no `--reload`) → loads `room_relay` + the new room includes (glow, help, bridge).
2. **Fully quit + reopen Claude Desktop** → loads the MCP server. Call `dmv_status` first.
3. Then: drive rooms from Claude Desktop (`dmv_rooms_open` → `dmv_room_command`); the glow fires when a
   docked agent works a stem; the `?` guide is in every room.

## Parallel-session rule

Left uncommitted for the owner's batch. **No push / deploy / release.** Never `git add -A` — commit only
this session's files by explicit path, and only when asked.
