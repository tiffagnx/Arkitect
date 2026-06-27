# MCP server — handoff (cold-start)

**Goal (owner):** let Claude control DeMartinville *fully* — every room, every
agent — over MCP. "It's open, it's free, nobody's telling us yes or no — just add
the shit and make it really work."

## The plan — 3 layers

1. **Backend powers (Layer 1) — BUILT + live-verified.**
2. **Command relay (Layer 2) — BUILT + verified end-to-end in a real browser.**
3. **RoomAPI coverage (Layer 3) — partial:** studio + character bridged;
   beats/editor/build/stream pending.

## What's built

### Layer 1 — backend powers (`mcp_server/server.py`)
FastMCP stdio server, calls the app on `127.0.0.1:7777` via httpx. **24 tools**:
status, chat (Tiff/Kit), build app, research, image (local+cloud), video, SFX,
transcribe, agents CRUD+train, project/session lists, memory read/add, Stream
read/publish, + the 3 Layer-2 tools below. SSE endpoints (chat/build/research)
are drained to a final string. **Live-verified on 7777**: reads + `dmv_chat`
round-tripped through a cloud brain.

### Layer 2 — the command relay (the keystone)
The actual room actions live in browser `window.*` fns; the backend can't call them.
The relay bridges that so MCP can drive an OPEN room:

- `room_relay.py` — APIRouter: `/api/room/{hello,poll,result,command,clients}`.
  In-memory long-poll queue. Included in app.py (one line by the swarm-router include).
- `static/mcp-bridge.js` — browser bridge. Include it in a room → it announces, long-polls
  for commands, dispatches them to `window.RoomAPI` / `window.studio*` / global fns, posts
  the result back. Built-ins: `__ping`, `__describe`. Room name = page filename.
- Bridged into `static/studio.html` + `static/character.html` (one `<script>` line each).
  **beats/editor NOT touched** (their sessions own them).
- MCP tools (in server.py): `dmv_rooms_open`, `dmv_room_describe`, `dmv_room_command`.

**VERIFIED end-to-end (2026-06-26):** threw a fresh uvicorn on **7798**, opened
character.html in real Chrome → bridge auto-registered as room "character". Fired
commands from OUTSIDE via `/api/room/command`: `__ping` returned the live tab URL,
`__describe` returned the RoomAPI surface, and a real `fill_agent` populated the
form fields (name/tagline/knowledge) in the actual browser. Backend relay logic
also unit-proven via ASGITransport (ping + args round-trip + closed-room reject).

## How to USE Layer 2

1. **Restart the app** so it loads `room_relay` — his 7777 runs uvicorn **without
   `--reload`** (ARKITECT.exe → launch.ps1), so the new module isn't live until relaunch.
2. Open a bridged room (studio or character) in the app.
3. From Claude Desktop: `dmv_rooms_open` → `dmv_room_describe("studio")` →
   `dmv_room_command("studio", "studioRecipe", {"text": "90s boom bap"})`, etc.

## Key architectural facts

- App = FastAPI (`app.py`, ~5700 lines, ~80 endpoints) + browser-JS rooms (`static/*.html`).
- **Real port = 7777, NOT 7799.** `desktop.py`/`launch.ps1` bind 7777; **7799 + 7788 are
  parallel-session PREVIEW ports**. Many old memories say "7799" — wrong for the live app.
- Execution split: **backend-complete** (Layer 1 wraps) vs **browser-resident `window.*`**
  (Layer 2 relay drives).
- Keys (cloud/ElevenLabs/Groq/Atlas) are stored **server-side**; MCP calls don't pass keys.

## Status / next steps

- [x] Layer 1 built + live-verified (7777).
- [x] Layer 2 built + verified end-to-end in a real browser (7798 throwaway).
- [x] Claude Desktop wiring added (`%APPDATA%\Claude\claude_desktop_config.json` →
      `mcpServers.demartinville`; `.bak` saved alongside). **Pending the owner's live test**:
      restart Claude Desktop AND restart the app, open a room, call `dmv_status` then a room command.
- [ ] Confirm cloud image/video `model` defaults (`flux-pro`/`wan-2.5` are guesses) vs the
      owner's real Atlas models — fix in `server.py`.
- [ ] **Layer 3 coverage:** beats already exposes `window.RoomAPI` (beats.html:2819) — just add
      the `<script src="/static/mcp-bridge.js?v=1">` line (its session owns the file). editor/build/
      stream need a `window.RoomAPI` built first, then the include. Contract: any room that exposes
      `window.RoomAPI` + includes the bridge becomes drivable for free.

## Files (this session)

- `mcp_server/server.py`, `requirements.txt`, `README.md` — Layer 1 + the 3 relay tools
- `room_relay.py` — Layer 2 backend relay
- `static/mcp-bridge.js` — Layer 2 browser bridge
- `app.py` — +2 lines (include `room_relay.router`)
- `static/studio.html`, `static/character.html` — +1 `<script>` line each
- `%APPDATA%\Claude\claude_desktop_config.json` — added `mcpServers.demartinville` (+ `.bak`)

## Parallel-session note

New files + minimal additive edits. Did **NOT** touch `beats.html` or `editor.html` (the active
production/visual sessions). The app.py edit is safe — no `--reload`, so it won't disturb the
running app or its sessions. Left **uncommitted** for the owner's batch; **no push/deploy/release**.
