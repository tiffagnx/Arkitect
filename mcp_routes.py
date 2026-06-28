"""
mcp_routes.py — in-app "Connect to Claude Desktop" endpoints.

Lets a user DISCOVER + one-click SET UP the MCP connection from inside DeMartinville
(Settings → Connect to Claude Desktop) instead of hand-editing Claude's config file.

  GET  /api/mcp/status  — read-only: is python/the mcp package ready, is our entry in
                          Claude Desktop's config, and does it match what we'd write?
                          Drives the honest status dot (none / stale / configured).
  POST /api/mcp/setup   — backup-then-merge: add the `demartinville` MCP server to
                          %APPDATA%/Claude/claude_desktop_config.json. Backs up first,
                          NEVER clobbers other servers, atomic write.

Honest by design: we can read the local config file, so we can say "it's in your
config" — we CANNOT see whether Claude Desktop actually loaded it (only Claude's own
Connectors panel confirms that), so the UI never fakes a live "connected".

Wired into app.py with: app.include_router(mcp_routes.router)
"""
import os
import sys
import json
import time
import shutil
import importlib.util

from fastapi import APIRouter

router = APIRouter()

_ROOT = os.path.dirname(os.path.abspath(__file__))
_SERVER = os.path.abspath(os.path.join(_ROOT, "mcp_server", "server.py"))


def _config_path():
    appdata = os.environ.get("APPDATA") or os.path.join(os.path.expanduser("~"), "AppData", "Roaming")
    return os.path.join(appdata, "Claude", "claude_desktop_config.json")


def _have_mcp():
    try:
        return importlib.util.find_spec("mcp") is not None
    except Exception:
        return False


def _read_config(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def _same_path(a, b):
    try:
        return os.path.normcase(os.path.abspath(a)) == os.path.normcase(os.path.abspath(b))
    except Exception:
        return False


def _detect():
    frozen = bool(getattr(sys, "frozen", False))
    py = sys.executable
    cfg_path = _config_path()
    cfg = _read_config(cfg_path)
    entry = None
    if isinstance(cfg, dict) and isinstance(cfg.get("mcpServers"), dict):
        entry = cfg["mcpServers"].get("demartinville")
    present = isinstance(entry, dict)
    matches = False
    if present:
        args = entry.get("args") or []
        matches = (entry.get("command") == py and len(args) >= 1 and _same_path(args[0], _SERVER))
    state = "none" if not present else ("configured" if matches else "stale")
    return {
        "app_ok": True,
        "mcp_pkg": _have_mcp(),
        "frozen": frozen,
        "python": py,
        "server": _SERVER,
        "config_path": cfg_path,
        "config_present": present,
        "config_matches": matches,
        "state": state,   # none = not set up · stale = present but mismatched · configured = good
    }


@router.get("/api/mcp/status")
async def mcp_status():
    return _detect()


@router.post("/api/mcp/setup")
async def mcp_setup():
    d = _detect()
    # the two cases we must NOT auto-write — return the reason so the UI explains it + offers manual
    if not d["mcp_pkg"]:
        return {"ok": False, "reason": "mcp_package_missing", "pip": "pip install mcp",
                "python": d["python"], "server": d["server"], "config_path": d["config_path"]}
    if d["frozen"]:
        return {"ok": False, "reason": "needs_manual",
                "python": d["python"], "server": d["server"], "config_path": d["config_path"]}
    if d["config_present"] and d["config_matches"]:
        return {"ok": True, "already_set": True, **d}

    cfg_path, server, py = d["config_path"], d["server"], d["python"]
    if len(server) >= 240:
        return {"ok": False, "reason": "path_too_long", "server": server, "config_path": cfg_path}
    try:
        os.makedirs(os.path.dirname(cfg_path), exist_ok=True)
        cfg = _read_config(cfg_path)
        if cfg is None and os.path.exists(cfg_path):
            return {"ok": False, "reason": "config_malformed", "config_path": cfg_path}   # don't overwrite a corrupt config
        if not isinstance(cfg, dict):
            cfg = {}
        # back up the existing config FIRST (nothing of theirs is overwritten without a copy)
        backup = None
        if os.path.exists(cfg_path):
            backup = os.path.splitext(cfg_path)[0] + ".backup-" + time.strftime("%Y%m%d-%H%M%S") + ".json"
            try:
                shutil.copy2(cfg_path, backup)
            except Exception:
                backup = None
        servers = cfg.get("mcpServers")
        if not isinstance(servers, dict):
            servers = {}
        servers["demartinville"] = {"command": py, "args": [server]}   # merge: only our key, keep the rest
        cfg["mcpServers"] = servers
        tmp = cfg_path + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(cfg, f, ensure_ascii=False, indent=2)
        os.replace(tmp, cfg_path)   # atomic
        out = _detect()
        out["ok"] = True
        out["backup"] = backup
        return out
    except Exception as e:
        return {"ok": False, "reason": "write_failed", "error": str(e),
                "python": py, "server": server, "config_path": cfg_path}
