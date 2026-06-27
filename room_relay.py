"""
room_relay.py — backend command relay for MCP-driven LIVE room control (Layer 2).

The actual room actions live in browser-side window.* functions (window.RoomAPI,
window.studio*). The backend can't call them directly. This relay bridges that gap so
an external MCP client (Claude Desktop) can operate an open room:

    MCP ──POST /api/room/command──▶ queue ──(long-poll)──▶ open room (browser)
                                                              │ runs the window.* fn
       result ◀──POST /api/room/result── open room ◀─────────┘

Endpoints (all localhost, in-memory, single-process):
    POST /api/room/hello     — a room announces itself (room name + client id)
    GET  /api/room/poll      — a room long-polls for the next command (≤25s)
    POST /api/room/result    — a room reports a command's result
    POST /api/room/command   — MCP enqueues a command for a room, waits for the result
    GET  /api/room/clients    — list currently-connected rooms ("what's open")

Wired into app.py with: app.include_router(room_relay.router)
The browser side is static/mcp-bridge.js (include it in a room to make it drivable).
"""
import asyncio
import time
import uuid

from fastapi import APIRouter, Request

router = APIRouter()

POLL_TIMEOUT = 25.0   # how long a room's poll waits before returning empty
CMD_TIMEOUT = 45.0    # default how long an MCP command waits for a result
CLIENT_TTL = 40.0     # a client counts as "present" if seen within this many seconds


class _Client:
    __slots__ = ("client_id", "room", "queue", "last_seen")

    def __init__(self, client_id, room):
        self.client_id = client_id
        self.room = room
        self.queue = asyncio.Queue()
        self.last_seen = time.time()


_CLIENTS = {}   # client_id -> _Client
_PENDING = {}   # command id -> asyncio.Future (resolved with the room's result)


def _prune():
    cutoff = time.time() - CLIENT_TTL * 3
    for cid in [k for k, c in _CLIENTS.items() if c.last_seen < cutoff]:
        _CLIENTS.pop(cid, None)


def _touch(client_id, room):
    c = _CLIENTS.get(client_id)
    if c is None:
        c = _Client(client_id, room)
        _CLIENTS[client_id] = c
    else:
        if room:
            c.room = room
        c.last_seen = time.time()
    return c


def _live_clients():
    cutoff = time.time() - CLIENT_TTL
    return [c for c in _CLIENTS.values() if c.last_seen >= cutoff]


def _pick_client(room):
    """Freshest live client that has `room` open."""
    cands = sorted(
        [c for c in _live_clients() if c.room == room],
        key=lambda c: c.last_seen,
        reverse=True,
    )
    return cands[0] if cands else None


@router.post("/api/room/hello")
async def room_hello(req: Request):
    b = await req.json()
    client_id = (b.get("client_id") or "").strip() or uuid.uuid4().hex
    room = (b.get("room") or "").strip()
    _prune()
    _touch(client_id, room)
    return {"ok": True, "client_id": client_id, "room": room}


@router.get("/api/room/poll")
async def room_poll(client_id: str = "", room: str = ""):
    if not client_id:
        return {"error": "client_id required"}
    c = _touch(client_id, room)
    try:
        cmd = await asyncio.wait_for(c.queue.get(), timeout=POLL_TIMEOUT)
        return {"commands": [cmd]}
    except asyncio.TimeoutError:
        return {"commands": []}


@router.post("/api/room/result")
async def room_result(req: Request):
    b = await req.json()
    cid = (b.get("id") or "").strip()
    fut = _PENDING.get(cid)
    if fut is not None and not fut.done():
        fut.set_result({
            "ok": bool(b.get("ok", True)),
            "result": b.get("result"),
            "error": b.get("error"),
        })
    return {"ok": True}


@router.post("/api/room/command")
async def room_command(req: Request):
    b = await req.json()
    room = (b.get("room") or "").strip()
    action = (b.get("action") or "").strip()
    args = b.get("args")
    if not room or not action:
        return {"ok": False, "error": "room and action required"}
    c = _pick_client(room)
    if c is None:
        return {
            "ok": False,
            "status": "no_client",
            "error": f"room '{room}' is not open in any browser tab connected to the app — open it first (dmv_rooms_open lists what's connected)",
        }
    try:
        timeout = float(b.get("timeout") or CMD_TIMEOUT)
    except (TypeError, ValueError):
        timeout = CMD_TIMEOUT
    cmd_id = uuid.uuid4().hex
    fut = asyncio.get_running_loop().create_future()
    _PENDING[cmd_id] = fut
    await c.queue.put({"id": cmd_id, "action": action, "args": args})
    try:
        res = await asyncio.wait_for(fut, timeout=timeout)
        return {"ok": res.get("ok", True), "id": cmd_id, "result": res.get("result"), "error": res.get("error")}
    except asyncio.TimeoutError:
        return {"ok": False, "id": cmd_id, "status": "timeout", "error": f"room did not return a result within {timeout:.0f}s"}
    finally:
        _PENDING.pop(cmd_id, None)


@router.get("/api/room/clients")
async def room_clients():
    now = time.time()
    _prune()
    return {"clients": [
        {"room": c.room, "client_id": c.client_id, "age": round(now - c.last_seen, 1)}
        for c in _live_clients()
    ]}
