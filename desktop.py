"""
DeMartinville — native desktop app.

Runs the DeMartinville engine and shows it in its OWN native window via WebView2
(built into Windows) — no browser, no Edge icon, its own taskbar icon (your logo).

Two ways it runs:
  • as a script  (DeMartinville (app).bat → pythonw desktop.py): starts uvicorn as a
    child process WITH --reload on a git checkout, so code edits still apply live.
  • as DeMartinville.exe (PyInstaller build): a frozen exe can't shell out to
    `python -m uvicorn`, so it runs the server IN-PROCESS. The exe carries the
    icon, so the taskbar shows your logo and it pins like any real program.

static/ and data/ are always read from the folder next to the launcher, so your
projects are never bundled/locked.
"""
import os
import sys
import time
import socket
import threading
import subprocess

# A PyInstaller --windowed (no-console) build sets sys.stdout / sys.stderr to None.
# Anything that calls sys.stdout.isatty() then dies with
# "'NoneType' object has no attribute 'isatty'" — uvicorn's log formatter does exactly
# this, which crashed the .exe whenever it hosted the server itself. Give the streams a
# real sink (a log file next to the launcher, falling back to the bit-bucket) BEFORE
# importing uvicorn, so the server — and any other stdout-using code — is safe.
if sys.stdout is None or sys.stderr is None:
    try:
        _logbase = os.path.dirname(sys.executable) if getattr(sys, "frozen", False) else os.path.dirname(os.path.abspath(__file__))
        _sink = open(os.path.join(_logbase, "arkitect-run.log"), "w", buffering=1)
    except Exception:
        _sink = open(os.devnull, "w")
    if sys.stdout is None:
        sys.stdout = _sink
    if sys.stderr is None:
        sys.stderr = _sink

# Importing the engine's libraries here makes PyInstaller bundle them into the .exe.
import fastapi          # noqa: F401
import uvicorn
import httpx            # noqa: F401
import pypdf            # noqa: F401

FROZEN = getattr(sys, "frozen", False)
if FROZEN and sys.platform == "darwin":
    # Inside the .app, static/ rides in the PyInstaller unpack dir, not next to the exe
    # (which lives in Contents/MacOS/). Mirror app.py's ROOT so chdir + paths line up.
    ROOT = getattr(sys, "_MEIPASS", os.path.dirname(sys.executable))
elif FROZEN:
    ROOT = os.path.dirname(sys.executable)
else:
    ROOT = os.path.dirname(os.path.abspath(__file__))
HOST = "127.0.0.1"
PORT = 7777
URL = f"http://localhost:{PORT}"

_LOADING_HTML = """<!DOCTYPE html><html><head><meta charset="utf-8"><title>DeMartinville</title>
<style>*{margin:0;padding:0;box-sizing:border-box}
body{background:#060e17;color:#e0e0f0;font-family:Inter,system-ui,sans-serif;
  display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:18px}
.logo{font-size:30px;font-weight:800;letter-spacing:-.5px;
  background:linear-gradient(135deg,#e91e8c,#2bb6a8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.dots{display:flex;gap:7px}
.dot{width:7px;height:7px;border-radius:50%;background:#2bb6a8;animation:p 1.1s ease-in-out infinite}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes p{0%,100%{opacity:.18}50%{opacity:1}}
.hint{font-size:12px;color:#3a5060}</style></head>
<body><div class="logo">DeMartinville</div>
<div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
<div class="hint">starting up…</div></body></html>"""

_ERROR_HTML = """<!DOCTYPE html><html><head><meta charset="utf-8"><title>DeMartinville</title>
<style>*{margin:0;padding:0}body{background:#060e17;color:#e0e0f0;font-family:Inter,system-ui,sans-serif;
  display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:14px;padding:40px}
h2{color:#e91e8c;font-size:18px}p{font-size:13px;color:#6080a0;text-align:center;line-height:1.6}</style></head>
<body><h2>Couldn't start</h2>
<p>The engine didn't come up in time.<br>Check <code>arkitect-run.log</code> next to the app,<br>
or run <strong>START HERE.bat</strong> once to finish setup.</p></body></html>"""
ICON = os.path.join(ROOT, "static", "app-icon.ico")   # swap this file to change the icon
APPID = "LePrinceVisualLabs.DeMartinville"
# Persistent WebView2 profile so a one-time "Allow microphone" STICKS. The default profile is
# ephemeral (a fresh temp dir every launch) → the mic grant is forgotten and re-prompts each time.
# Prefer %APPDATA% (writable even if the app is installed under Program Files); fall back to a
# local dir in a dev checkout.
WEBVIEW_PROFILE = os.path.join(os.environ.get("APPDATA") or ROOT, "DeMartinville", "webview-profile")


def _port_open(host=HOST, port=PORT):
    s = socket.socket()
    s.settimeout(0.5)
    try:
        s.connect((host, port))
        return True
    except Exception:
        return False
    finally:
        try:
            s.close()
        except Exception:
            pass


def start_server():
    """Returns a Popen (script mode), a uvicorn.Server (frozen/in-process), or None
    if a server is already running on the port."""
    if _port_open():
        return None
    os.chdir(ROOT)
    if FROZEN:
        sys.path.insert(0, ROOT)
        import app as _appmod
        cfg = uvicorn.Config(_appmod.app, host=HOST, port=PORT, log_level="warning")
        server = uvicorn.Server(cfg)

        def _run():
            try:
                server.run()
            except Exception:
                import traceback
                traceback.print_exc()   # lands in arkitect-run.log via the stdout sink

        threading.Thread(target=_run, daemon=True).start()
        return server
    args = [sys.executable, "-m", "uvicorn", "app:app", "--host", HOST, "--port", str(PORT)]
    if os.path.isdir(os.path.join(ROOT, ".git")):
        args += ["--reload"]
    CREATE_NO_WINDOW = 0x08000000
    flags = CREATE_NO_WINDOW if sys.platform == "win32" else 0
    return subprocess.Popen(args, cwd=ROOT, creationflags=flags)


_PERMISSION_HANDLERS = []  # keep the .NET delegates alive for the process


def wire_auto_permissions():
    """Stop the 'Allow' nag for good.

    DeMartinville runs inside WebView2 (Edge's engine). WebView2 treats our own localhost UI
    like a random website, so every launch it re-asks 'Allow microphone?' and pops an 'allow
    clipboard' bar at the top the first time anything reads the clipboard (right-click Paste,
    paste-your-key, paste a screenshot). The mic env-var flag in main() doesn't help — pywebview
    sets its OWN AdditionalBrowserArguments, which makes WebView2 ignore that env var.

    The real fix is the documented one: handle CoreWebView2.PermissionRequested and auto-Allow.
    It's the user's own machine + our own UI, so granting mic / camera / clipboard-read silently
    is correct. Fully guarded — if anything here fails, the app just falls back to the old prompts,
    it never blocks startup. Takes effect when run as a script (the .bat); the .exe picks it up on
    its next rebuild.

    Runs in a background thread: WebView2's core is created asynchronously, so we poll until it
    exists, then marshal onto the UI thread (WinForms property access must happen there) to subscribe.
    """
    if sys.platform != "win32":
        return

    def _worker():
        try:
            from webview.platforms.winforms import BrowserView
            from Microsoft.Web.WebView2.Core import CoreWebView2PermissionState
            from System import Action
        except Exception:
            return

        def _grant(sender, args):
            try:
                args.State = CoreWebView2PermissionState.Allow
                args.Handled = True
            except Exception:
                pass

        for _ in range(200):                       # ~60s of grace while the window comes up
            try:
                insts = list(BrowserView.instances.values())
                if insts:
                    bv = insts[0]
                    core = getattr(bv.browser.webview, "CoreWebView2", None)
                    if core is not None:
                        def _subscribe():
                            core.PermissionRequested += _grant
                            _PERMISSION_HANDLERS.append(_grant)
                        bv.browser.webview.Invoke(Action(_subscribe))
                        return
            except Exception:
                pass
            time.sleep(0.3)

    threading.Thread(target=_worker, daemon=True).start()


def wait_up(timeout=60):
    end = time.time() + timeout
    while time.time() < end:
        if _port_open():
            return True
        time.sleep(0.3)
    return False


def set_window_icon():
    """Stamp the .ico onto the native window so the TASKBAR shows our logo."""
    if sys.platform != "win32" or not os.path.exists(ICON):
        return
    import ctypes
    user32 = ctypes.windll.user32
    hwnd = 0
    for _ in range(80):
        hwnd = user32.FindWindowW(None, "DeMartinville")
        if hwnd:
            break
        time.sleep(0.25)
    if not hwnd:
        return
    IMAGE_ICON, LR_LOADFROMFILE, LR_DEFAULTSIZE, WM_SETICON = 1, 0x10, 0x40, 0x80
    big = user32.LoadImageW(0, ICON, IMAGE_ICON, 0, 0, LR_LOADFROMFILE | LR_DEFAULTSIZE)
    small = user32.LoadImageW(0, ICON, IMAGE_ICON, 16, 16, LR_LOADFROMFILE)
    if big:
        user32.SendMessageW(hwnd, WM_SETICON, 1, big)
    if small:
        user32.SendMessageW(hwnd, WM_SETICON, 0, small)


def _fatal(msg):
    """Surface a startup failure visibly (windowed apps have no console to print to)."""
    try:
        print("FATAL:", msg)
    except Exception:
        pass
    if sys.platform == "win32":
        try:
            import ctypes
            ctypes.windll.user32.MessageBoxW(0, msg, "DeMartinville", 0x10)  # MB_ICONERROR
        except Exception:
            pass


_SINGLETON_HANDLE = None  # keep the mutex handle alive for the whole process


def create_desktop_shortcut():
    """Place a DeMartinville.lnk on the Desktop — first launch only.
    Uses WScript.Shell COM via a hidden PowerShell call; no pywin32 needed."""
    if sys.platform != "win32":
        return
    flag = os.path.join(ROOT, "data", ".shortcut_created")
    if os.path.exists(flag):
        return
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    lnk = os.path.join(desktop, "DeMartinville.lnk")
    exe = sys.executable if getattr(sys, "frozen", False) else os.path.abspath(__file__)
    icon = os.path.join(ROOT, "static", "app-icon.ico")
    # single-quoted here-string avoids PS escaping headaches with backslashes in paths
    ps = (
        "$s = New-Object -ComObject WScript.Shell; "
        f"$l = $s.CreateShortcut('{lnk}'); "
        f"$l.TargetPath = '{exe}'; "
        f"$l.WorkingDirectory = '{ROOT}'; "
        "$l.Description = 'DeMartinville'; "
        f"$l.IconLocation = '{icon}'; "
        "$l.Save()"
    )
    try:
        subprocess.run(
            ["powershell", "-NoProfile", "-NonInteractive", "-Command", ps],
            capture_output=True, timeout=8,
            creationflags=0x08000000  # CREATE_NO_WINDOW
        )
        os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)
        open(flag, "w").close()
    except Exception:
        pass


def _acquire_single_instance() -> bool:
    """True if we're the FIRST instance. A named mutex is atomic, so a double-click that
    fires two launches still resolves to ONE window — the 2nd launch sees the mutex and
    bows out (after focusing the window the 1st launch opened)."""
    global _SINGLETON_HANDLE
    if sys.platform != "win32":
        return True
    import ctypes
    k32 = ctypes.windll.kernel32
    ERROR_ALREADY_EXISTS = 183
    _SINGLETON_HANDLE = k32.CreateMutexW(None, False, "DeMartinville_single_instance")
    return k32.GetLastError() != ERROR_ALREADY_EXISTS


def _focus_existing_window():
    """Bring the already-open DeMartinville window to the front (run by the 2nd launch).
    Polls for up to 90 s so extra clicks during a slow server startup still succeed."""
    if sys.platform != "win32":
        return
    import ctypes
    user32 = ctypes.windll.user32
    for _ in range(900):          # 900 × 0.1 s = 90 s — outlasts any startup delay
        hwnd = user32.FindWindowW(None, "DeMartinville")
        if hwnd:
            user32.ShowWindow(hwnd, 9)            # SW_RESTORE
            user32.SetForegroundWindow(hwnd)
            return
        time.sleep(0.1)


_popup_windows = []   # track every popup so main-window close kills them all


class DmvApi:
    """JS-callable Python API exposed as window.pywebview.api inside every webview window."""

    def open_code_popup(self):
        """Open the Code room as a clean native window. If already open, focus it instead."""
        try:
            import webview
            # If there's already a code popup alive, bring it to front — don't stack duplicates
            for pw in list(_popup_windows):
                try:
                    pw.show()
                    return
                except Exception:
                    _popup_windows.remove(pw)
            popup = webview.create_window(
                "Code — DeMartinville",
                url=f"http://localhost:{PORT}/static/code.html?popped=1",
                width=1120, height=800,
                min_size=(500, 400),
                text_select=True,
            )
            _popup_windows.append(popup)
        except Exception:
            pass   # JS falls back to window.open() if this fails


def main():
    # A double-click (or any 2nd launch) must NOT open a second window. The mutex is
    # atomic, so even two near-simultaneous launches end up as ONE window.
    if not _acquire_single_instance():
        _focus_existing_window()
        return
    # NOTE: we deliberately do NOT set an explicit AppUserModelID. As a real .exe,
    # the window's taskbar button is DeMartinville.exe itself, so "Pin to taskbar" (from
    # the running taskbar icon) pins and relaunches correctly. A custom AUMID without
    # a registered shortcut can make the pin fail to relaunch on Win11.
    started = start_server()
    threading.Thread(target=create_desktop_shortcut, daemon=True).start()

    os.environ.setdefault("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "--use-fake-ui-for-media-stream")

    import webview
    threading.Thread(target=set_window_icon, daemon=True).start()
    try:
        # Create the window immediately with a dark loading screen — the app appears on first
        # click instead of hanging invisibly while the server starts up.
        win = webview.create_window("DeMartinville", html=_LOADING_HTML,
                                    width=1500, height=950,
                                    min_size=(1100, 700), maximized=True, text_select=True,
                                    js_api=DmvApi())

        def _on_main_closed():
            for pw in list(_popup_windows):
                try:
                    pw.destroy()
                except Exception:
                    pass
        win.events.closed += _on_main_closed

        def _on_gui_ready():
            # Navigate to the real app once the server is up. Runs in the GUI thread,
            # so we spin a background thread for the blocking wait_up() call.
            def _nav():
                if wait_up():
                    win.load_url(URL)
                else:
                    win.load_html(_ERROR_HTML)
                    if isinstance(started, subprocess.Popen):
                        try:
                            started.terminate()
                        except Exception:
                            pass
            threading.Thread(target=_nav, daemon=True).start()

        _gui = "edgechromium" if sys.platform == "win32" else ("cocoa" if sys.platform == "darwin" else None)
        try:
            webview.settings['OPEN_DEVTOOLS_IN_DEBUG'] = False
        except Exception:
            pass
        try:
            os.makedirs(WEBVIEW_PROFILE, exist_ok=True)
        except Exception:
            pass
        wire_auto_permissions()
        webview.start(_on_gui_ready, gui=_gui, debug=True, private_mode=False, storage_path=WEBVIEW_PROFILE)
    except Exception:
        import traceback
        import webbrowser
        traceback.print_exc()
        webbrowser.open(URL)   # the server is already running — keep DeMartinville usable
        try:
            while True:
                time.sleep(3600)   # stay alive so the in-process server keeps serving the tab
        except KeyboardInterrupt:
            pass
    finally:
        if isinstance(started, subprocess.Popen):
            try:
                started.terminate()
            except Exception:
                pass


if __name__ == "__main__":
    main()
