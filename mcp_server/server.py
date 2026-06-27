#!/usr/bin/env python3
"""
DeMartinville MCP server — lets an external AI (Claude Desktop, Claude Code, any
MCP client) drive DeMartinville's backend powers.

This is the LAYER 1 build: the "backend-complete" capabilities — the stuff that
runs fully server-side and needs no open browser tab. It's a thin, additive shim
that makes HTTP calls to the running DeMartinville app on localhost:7777. It does
NOT modify the app and does NOT touch any room's HTML/JS.

What it can drive today:
  • status / health / which models are available
  • talk to a brain (Tiff / Kit), build an app, run research
  • generate images (local + cloud), video (cloud), sound effects
  • transcribe audio
  • manage agents (list / create / train / delete / readiness)
  • list studio & editor projects and saved sessions
  • read + add personal memory
  • read The Stream and publish a finished file to it

Live-room control (turning knobs in Studio/Leon from outside) is Layer 2 — it
needs the backend→room command relay, which isn't built yet.

──────────────────────────────────────────────────────────────────────────────
SETUP
  1. Install deps into whatever Python will run this server:
       pip install -r requirements.txt        (mcp + httpx)
  2. Make sure the DeMartinville app is running (it serves on http://127.0.0.1:7777).
  3. Point your MCP client at this file. Claude Desktop config example
     (claude_desktop_config.json):

       {
         "mcpServers": {
           "demartinville": {
             "command": "C:\\\\Users\\\\koonc\\\\Desktop\\\\Projects\\\\pink-room\\\\venv\\\\Scripts\\\\python.exe",
             "args": ["C:\\\\Users\\\\koonc\\\\Desktop\\\\Projects\\\\pink-room\\\\mcp_server\\\\server.py"]
           }
         }
       }

  Override the target URL with env DEMARTINVILLE_URL, and the file output folder
  with env DEMARTINVILLE_OUT (defaults to ~/DeMartinville/mcp-out).
──────────────────────────────────────────────────────────────────────────────
"""

import os
import re
import json
import time
import base64
import mimetypes
from pathlib import Path
from typing import Optional, Any

import httpx
from mcp.server.fastmcp import FastMCP

# ── config ────────────────────────────────────────────────────────────────────
BASE = os.environ.get("DEMARTINVILLE_URL", "http://127.0.0.1:7777").rstrip("/")
OUT_DIR = Path(os.environ.get("DEMARTINVILLE_OUT", str(Path.home() / "DeMartinville" / "mcp-out")))

mcp = FastMCP("DeMartinville")


# ── http helpers ──────────────────────────────────────────────────────────────
def _client() -> httpx.AsyncClient:
    # Generous timeout: image/sfx/cloud/research can take a while; short connect
    # so "app not running" fails fast with a clear message.
    return httpx.AsyncClient(timeout=httpx.Timeout(600.0, connect=8.0))


def _unreachable() -> RuntimeError:
    return RuntimeError(f"Can't reach DeMartinville at {BASE}. Is the app running?")


async def _get(path: str, params: Optional[dict] = None) -> Any:
    try:
        async with _client() as c:
            r = await c.get(BASE + path, params=params)
            r.raise_for_status()
            return r.json()
    except httpx.ConnectError:
        raise _unreachable()


async def _post(path: str, payload: Optional[dict] = None) -> Any:
    try:
        async with _client() as c:
            r = await c.post(BASE + path, json=payload or {})
            r.raise_for_status()
            return r.json()
    except httpx.ConnectError:
        raise _unreachable()


async def _delete(path: str) -> Any:
    try:
        async with _client() as c:
            r = await c.delete(BASE + path)
            r.raise_for_status()
            return r.json()
    except httpx.ConnectError:
        raise _unreachable()


async def _drain_sse(path: str, payload: dict) -> tuple[str, list, Optional[str]]:
    """POST to an SSE endpoint (chat/build/research) and collect the final result.

    Returns (text, sources, error). `text` is every {type:delta} concatenated;
    `sources` is the {type:sources} items (research only); `error` is the first
    {type:error} text seen. Stops on {type:done}.
    """
    parts: list[str] = []
    sources: list = []
    err: Optional[str] = None
    try:
        async with _client() as c:
            async with c.stream("POST", BASE + path, json=payload) as r:
                r.raise_for_status()
                async for line in r.aiter_lines():
                    if not line or not line.startswith("data:"):
                        continue
                    raw = line[5:].strip()
                    if not raw:
                        continue
                    try:
                        ev = json.loads(raw)
                    except Exception:
                        continue
                    t = ev.get("type")
                    if t == "delta":
                        parts.append(ev.get("text", ""))
                    elif t == "sources":
                        sources = ev.get("items", []) or sources
                    elif t == "error":
                        err = err or ev.get("text", "error")
                    elif t == "done":
                        break
    except httpx.ConnectError:
        raise _unreachable()
    return "".join(parts), sources, err


async def _default_local_model() -> str:
    """First available local model (used for build/research, which run locally)."""
    m = await _get("/api/models")
    local = m.get("models") or []
    if local:
        return local[0]
    cloud = m.get("cloud") or []
    if cloud:
        return cloud[0].get("id")
    raise RuntimeError("No models available — open DeMartinville and set up a brain or add a cloud key.")


async def _default_chat_model() -> str:
    """Prefer a cloud brain for chat (Claude etc.), else fall back to local."""
    m = await _get("/api/models")
    cloud = m.get("cloud") or []
    if cloud:
        return cloud[0].get("id")
    local = m.get("models") or []
    if local:
        return local[0]
    raise RuntimeError("No models available — open DeMartinville and set up a brain or add a cloud key.")


def _slug(s: str) -> str:
    return re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower() or "out"


# ── status ────────────────────────────────────────────────────────────────────
@mcp.tool()
async def dmv_status() -> dict:
    """Check whether DeMartinville is up and what's available. Call this first.

    Returns brain/engine health, app version, whether a cloud API key is set, and
    the chat models you can pass as `model` to dmv_chat / dmv_build_app / dmv_research.
    """
    out: dict = {"base_url": BASE}
    try:
        out["health"] = await _get("/api/health")
    except Exception as e:
        return {"error": str(e), "base_url": BASE}
    try:
        out["version"] = (await _get("/api/version")).get("version")
    except Exception:
        pass
    try:
        out["has_cloud_key"] = (await _get("/api/capability")).get("has_cloud_key")
    except Exception:
        pass
    try:
        m = await _get("/api/models")
        out["local_models"] = m.get("models", [])
        out["cloud_models"] = [c.get("id") for c in m.get("cloud", [])]
    except Exception:
        pass
    return out


# ── brains ────────────────────────────────────────────────────────────────────
@mcp.tool()
async def dmv_chat(
    message: str,
    model: Optional[str] = None,
    character: str = "tiff",
    effort: str = "low",
    history: Optional[list] = None,
) -> str:
    """Talk to a DeMartinville brain and get the full reply.

    character: "tiff" or "kit". effort: "low" or "high". If model is omitted, a
    cloud brain is used when available, else the first local model. history is an
    optional list of prior {role, content} messages.
    """
    model = model or await _default_chat_model()
    msgs = list(history or []) + [{"role": "user", "content": message}]
    payload = {"messages": msgs, "model": model, "character": character, "effort": effort}
    text, _, err = await _drain_sse("/api/chat", payload)
    if err and not text:
        return f"[error] {err}"
    return text or "[no reply]"


@mcp.tool()
async def dmv_build_app(prompt: str, model: Optional[str] = None, previous_code: Optional[str] = None) -> str:
    """Generate (or evolve) a single-file web app with the Berner Builder brain.

    Returns the generated code. Pass previous_code to refine an existing build.
    Runs on a local model.
    """
    model = model or await _default_local_model()
    payload = {"mode": "build", "model": model, "prompt": prompt}
    if previous_code:
        payload["previous_code"] = previous_code
    text, _, err = await _drain_sse("/api/build", payload)
    if err and not text:
        return f"[error] {err}"
    return text or "[no output]"


@mcp.tool()
async def dmv_research(question: str, model: Optional[str] = None, effort: str = "low") -> dict:
    """Run a web-research pass and return a synthesized answer plus sources.

    effort: "low" or "high". Runs on a local model; searches via the server's
    configured search key (Tavily) or public fallback.
    """
    model = model or await _default_local_model()
    payload = {"question": question, "model": model, "effort": effort}
    text, sources, err = await _drain_sse("/api/research", payload)
    res: dict = {"answer": text, "sources": sources}
    if err:
        res["error"] = err
    return res


# ── generation ────────────────────────────────────────────────────────────────
@mcp.tool()
async def dmv_generate_image(
    prompt: str,
    size: str = "768x768",
    mode: str = "photo",
    seed: Optional[int] = None,
    realism: bool = True,
    ref: Optional[str] = None,
) -> dict:
    """Generate an image on the LOCAL engine (free, no key — needs the local image
    engine running). mode: photo | draft | edit | zimage. ref is an optional
    `data:image/...;base64,...` reference for img2img/edit. Returns a URL.
    """
    payload: dict = {"prompt": prompt, "size": size, "mode": mode, "realism": realism}
    if seed is not None:
        payload["seed"] = seed
    if ref:
        payload["ref"] = ref
    j = await _post("/api/image", payload)
    if isinstance(j, dict) and j.get("error"):
        return j
    fn = j.get("filename")
    return {"ok": True, "url": f"{BASE}/api/image/file/{fn}", "seed": j.get("seed"),
            "mode": j.get("mode"), "note": j.get("note")}


@mcp.tool()
async def dmv_generate_image_cloud(
    prompt: str,
    model: str = "flux-pro",
    aspect: Optional[str] = None,
    count: int = 1,
    ref_image: Optional[str] = None,
) -> dict:
    """Generate an image via the cloud (Atlas; uses the saved cloud key). Returns
    output URLs. NOTE: `model` default is a guess — pass the cloud image model you
    actually have access to. ref_image is an optional data URL for image-to-image.
    """
    options: dict = {}
    if aspect:
        options["aspect"] = aspect
    if count and count != 1:
        options["count"] = count
    payload: dict = {"provider": "atlascloud", "kind": "image", "model": model, "prompt": prompt}
    if options:
        payload["options"] = options
    if ref_image:
        payload["media"] = {"image": ref_image}
    return await _post("/api/cloud/generate", payload)


@mcp.tool()
async def dmv_generate_video(
    prompt: str,
    model: str = "wan-2.5",
    seconds: Optional[float] = None,
    ref_image: Optional[str] = None,
) -> dict:
    """Generate a video via the cloud (Atlas; uses the saved cloud key). Returns
    output URLs. NOTE: `model` default is a guess — pass the cloud video model you
    actually have. ref_image is an optional data URL for image-to-video.
    """
    options: dict = {}
    if seconds:
        options["seconds"] = seconds
    payload: dict = {"provider": "atlascloud", "kind": "video", "model": model, "prompt": prompt}
    if options:
        payload["options"] = options
    if ref_image:
        payload["media"] = {"image": ref_image}
    return await _post("/api/cloud/generate", payload)


@mcp.tool()
async def dmv_generate_sfx(
    text: str,
    duration_seconds: Optional[float] = None,
    prompt_influence: Optional[float] = None,
) -> dict:
    """Generate a sound effect (ElevenLabs; uses the saved key). Saves an .mp3 to
    the output folder and returns its path. duration_seconds 0.5–30, prompt_influence 0–1.
    """
    payload: dict = {"text": text}
    if duration_seconds is not None:
        payload["duration_seconds"] = duration_seconds
    if prompt_influence is not None:
        payload["prompt_influence"] = prompt_influence
    j = await _post("/api/sfx", payload)
    if isinstance(j, dict) and j.get("error"):
        return j
    data = j.get("audio", "")
    b64 = data.split(",", 1)[1] if "," in data else data
    raw = base64.b64decode(b64)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    p = OUT_DIR / f"{_slug(text)[:40]}-{int(time.time())}.mp3"
    p.write_bytes(raw)
    return {"ok": True, "path": str(p), "bytes": len(raw)}


@mcp.tool()
async def dmv_transcribe(audio_path: str) -> dict:
    """Transcribe a local audio file (Whisper via the saved Groq key). Returns the text."""
    p = Path(audio_path)
    if not p.exists():
        return {"error": f"file not found: {audio_path}"}
    mime = mimetypes.guess_type(str(p))[0] or "audio/wav"
    b64 = base64.b64encode(p.read_bytes()).decode("ascii")
    payload = {"audio": f"data:{mime};base64,{b64}", "audio_name": p.name}
    return await _post("/api/transcribe", payload)


# ── agents ────────────────────────────────────────────────────────────────────
@mcp.tool()
async def dmv_list_agents() -> dict:
    """List the trained agents (id, name, craft, entry/trained counts)."""
    return await _get("/api/agents")


@mcp.tool()
async def dmv_create_agent(
    name: str,
    craft: Optional[str] = None,
    craft_label: Optional[str] = None,
    id: Optional[str] = None,
) -> dict:
    """Create/seed an agent pack. Returns the new agent id."""
    payload: dict = {"name": name}
    if craft:
        payload["craft"] = craft
    if craft_label:
        payload["craftLabel"] = craft_label
    if id:
        payload["id"] = id
    return await _post("/api/agents", payload)


@mcp.tool()
async def dmv_train_agent(
    agent_id: str,
    kind: str,
    raw: str,
    context: Optional[str] = None,
    craft: Optional[str] = None,
    name: Optional[str] = None,
) -> dict:
    """Add training evidence to an agent's pack. kind must be one of: work | watch | feed.
    raw is the evidence text; context is optional room/topic.
    """
    payload: dict = {"kind": kind, "raw": raw}
    if context:
        payload["context"] = context
    if craft:
        payload["craft"] = craft
    if name:
        payload["name"] = name
    return await _post(f"/api/agents/{agent_id}/train", payload)


@mcp.tool()
async def dmv_agent_readiness(agent_id: str) -> dict:
    """How trained an agent is (trained count + total entries)."""
    return await _get(f"/api/agents/{agent_id}/readiness")


@mcp.tool()
async def dmv_delete_agent(agent_id: str) -> dict:
    """Delete an agent pack (idempotent)."""
    return await _delete(f"/api/agents/{agent_id}")


# ── projects & sessions (read) ────────────────────────────────────────────────
@mcp.tool()
async def dmv_list_studio_projects() -> dict:
    """List saved Studio (DeMartin Audio) projects."""
    return await _get("/api/studio/projects")


@mcp.tool()
async def dmv_list_editor_projects() -> dict:
    """List saved LePrince (visual editor) projects."""
    return await _get("/api/editor/projects")


@mcp.tool()
async def dmv_list_sessions() -> dict:
    """List saved chat/work sessions."""
    return await _get("/api/sessions")


# ── memory ────────────────────────────────────────────────────────────────────
@mcp.tool()
async def dmv_list_memory() -> dict:
    """List the user's saved personal memory notes."""
    return await _get("/api/memory")


@mcp.tool()
async def dmv_add_memory(title: str, text: str) -> dict:
    """Save a personal memory note (title ≤120 chars, text ≤6000)."""
    return await _post("/api/memory", {"title": title, "text": text})


# ── stream ────────────────────────────────────────────────────────────────────
@mcp.tool()
async def dmv_list_stream() -> dict:
    """Read The Stream feed (music + video items)."""
    return await _get("/api/stream")


@mcp.tool()
async def dmv_publish_to_stream(
    kind: str,
    title: str,
    path: str,
    creator: str = "Anonymous",
    desc: Optional[str] = None,
    pay: Optional[str] = None,
    owns: bool = False,
) -> dict:
    """Publish a finished file to The Stream by local disk path.

    kind: "music" or "video". path is the disk path to the rendered file. pay is an
    optional https:// payout link (artist keeps 100%). owns attests ownership.
    """
    payload: dict = {"kind": kind, "title": title, "creator": creator, "path": path, "owns": owns}
    if desc:
        payload["desc"] = desc
    if pay:
        payload["pay"] = pay
    return await _post("/api/stream/publish", payload)


# ── live room control (Layer 2 — needs the room open in a browser tab) ──────────
@mcp.tool()
async def dmv_rooms_open() -> dict:
    """List rooms currently open in a browser tab and connected to the app — these
    are the rooms you can drive live with dmv_room_command. Empty means open the
    room in the DeMartinville app first.
    """
    return await _get("/api/room/clients")


@mcp.tool()
async def dmv_room_describe(room: str) -> dict:
    """Ask an OPEN room what actions you can drive — its RoomAPI methods and relevant
    window functions. The room must be open in a browser tab (see dmv_rooms_open).
    """
    return await _post("/api/room/command", {"room": room, "action": "__describe", "timeout": 15})


@mcp.tool()
async def dmv_room_command(room: str, action: str, args: Optional[dict] = None) -> dict:
    """Drive a LIVE room: run one action against an open room's control surface and
    return the result.

    room   — the open room, e.g. "studio", "character", "beats" (lowercase page name)
    action — a RoomAPI method name, "run" (with an action object as args), or a global
             window function name (e.g. "studioRecipe"); "__ping" tests the connection
    args   — value passed to the function (object/dict)

    The room must be open in a browser tab connected to the app — check dmv_rooms_open
    first, and dmv_room_describe to see what's callable.
    """
    return await _post("/api/room/command", {"room": room, "action": action, "args": args})


if __name__ == "__main__":
    mcp.run()
