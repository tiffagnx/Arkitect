#!/usr/bin/env python3
"""
DeMartinville health check — so the COMPUTER confirms it works, not you.

    python check.py            # default port 7777
    python check.py 7799       # custom port

Three passes:
  1. SYNTAX  — byte-compile every *.py and `node --check` every static/*.js   (no server needed)
  2. ROOMS   — GET every room page, expect 200                                 (app must be running)
  3. API     — GET read-only endpoints + 2 empty-body guard POSTs, flag any 5xx

SAFE BY DESIGN: it only hits read-only endpoints + the two text-to-* endpoints with an EMPTY
body (which return a graceful "no text" error BEFORE doing any work). It NEVER renders audio/
video, never spends a credit, never writes data. Run it after every change.

What it CAN'T do: judge if something *looks* right, or catch a runtime JS error that only shows
in the browser console. That eyeball stuff stays yours — but the "is it secretly broken / did I
crash a route" grind is now the machine's job.

Exit code 0 = all green.
"""
import sys, subprocess, json, urllib.request, urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PORT = sys.argv[1] if len(sys.argv) > 1 else "7777"
BASE = "http://127.0.0.1:" + PORT

# Windows consoles default to cp1252 and crash on Unicode — force utf-8 so output never dies.
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

fails = []
def ok(m):  print("  [ OK ] " + m)
def bad(m): print("  [ XX ] " + m); fails.append(m)
def dim(m): print("  ( -- ) " + m)
def section(t): print("\n=== " + t + " ===")

print("DeMartinville health check  ::  " + BASE)

# ---- 1. SYNTAX (no server needed) ----
section("SYNTAX - Python")
for py in sorted(ROOT.glob("*.py")):
    r = subprocess.run([sys.executable, "-m", "py_compile", str(py)], capture_output=True, text=True)
    if r.returncode == 0:
        ok(py.name)
    else:
        last = (r.stderr.strip().splitlines() or ["compile error"])[-1]
        bad(py.name + "  ->  " + last[:120])

section("SYNTAX - JavaScript")
have_node = subprocess.run(["node", "--version"], capture_output=True, shell=(sys.platform == "win32")).returncode == 0
if have_node:
    for js in sorted((ROOT / "static").glob("*.js")):
        r = subprocess.run(["node", "--check", str(js)], capture_output=True, text=True, shell=(sys.platform == "win32"))
        if r.returncode == 0:
            ok("static/" + js.name)
        else:
            last = (r.stderr.strip().splitlines() or ["syntax error"])[-1]
            bad("static/" + js.name + "  ->  " + last[:120])
else:
    dim("node not found on PATH — skipping JS syntax")

# ---- HTTP helper ----
def hit(method, path, body=None, timeout=20):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(BASE + path, data=data, method=method,
                                 headers={"Content-Type": "application/json"} if data else {})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return None

# ---- is the app running? ----
section("SERVER")
if hit("GET", "/api/version") is None:
    dim("app not reachable on " + BASE + " — start it to run the live checks")
    dim("(the SYNTAX pass above already ran and is the important one)")
else:
    ok("app responding on " + BASE)

    # ---- 2. ROOMS (expect 200) ----
    section("ROOMS - expect 200")
    rooms = ["/"] + ["/static/" + p.name for p in sorted((ROOT / "static").glob("*.html"))] + ["/editor"]
    for path in rooms:
        st = hit("GET", path)
        (ok if st == 200 else bad)(path + "  ->  " + str(st))

    # ---- 3. API read-only GETs (flag 5xx) ----
    section("API - read-only (flag 5xx)")
    for path in ["/api/version", "/api/health", "/api/capability", "/api/models", "/api/builds",
                 "/api/agents", "/api/sessions", "/api/stream", "/api/editor/media",
                 "/api/cloud/key?provider=fish_audio"]:
        st = hit("GET", path)
        (ok if (st is not None and st < 500) else bad)("GET  " + path + "  ->  " + str(st))

    # ---- 3b. safe guard POSTs: empty body must give a graceful error, never a 5xx, never side effects ----
    section("API - empty-body guards (no audio, no spend)")
    for path in ["/api/tts", "/api/sfx"]:
        st = hit("POST", path, {})
        (ok if (st is not None and st < 500) else bad)("POST " + path + " (empty)  ->  " + str(st))

# ---- summary ----
section("RESULT")
if fails:
    print("  " + str(len(fails)) + " issue(s) — fix these:")
    for f in fails[:25]:
        print("    - " + f)
    sys.exit(1)
print("  ALL GREEN")
sys.exit(0)
