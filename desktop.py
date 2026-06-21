"""
ARKITECT — native desktop app.

Runs the ARKITECT engine and shows it in its OWN native window via WebView2
(built into Windows) — no browser, no Edge icon, its own taskbar icon (your logo).

Two ways it runs:
  • as a script  (ARKITECT (app).bat → pythonw desktop.py): starts uvicorn as a
    child process WITH --reload on a git checkout, so code edits still apply live.
  • as ARKITECT.exe (PyInstaller build): a frozen exe can't shell out to
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
ICON = os.path.join(ROOT, "static", "app-icon.ico")   # swap this file to change the icon
APPID = "LePrinceVisualLabs.ARKITECT"


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
    _SINGLETON_HANDLE = k32.CreateMutexW(None, False, "ARKITECT_single_instance")
    return k32.GetLastError() != ERROR_ALREADY_EXISTS


def _focus_existing_window():
    """Bring the already-open ARKITECT window to the front (run by the 2nd launch)."""
    if sys.platform != "win32":
        return
    import ctypes
    user32 = ctypes.windll.user32
    for _ in range(50):
        hwnd = user32.FindWindowW(None, "DeMartinville")
        if hwnd:
            user32.ShowWindow(hwnd, 9)            # SW_RESTORE
            user32.SetForegroundWindow(hwnd)
            return
        time.sleep(0.1)


def main():
    # A double-click (or any 2nd launch) must NOT open a second window. The mutex is
    # atomic, so even two near-simultaneous launches end up as ONE window.
    if not _acquire_single_instance():
        _focus_existing_window()
        return
    # NOTE: we deliberately do NOT set an explicit AppUserModelID. As a real .exe,
    # the window's taskbar button is ARKITECT.exe itself, so "Pin to taskbar" (from
    # the running taskbar icon) pins and relaunches correctly. A custom AUMID without
    # a registered shortcut can make the pin fail to relaunch on Win11.
    started = start_server()
    if not wait_up():
        # The engine never came up — don't open a blank "can't reach localhost" window.
        _fatal("DeMartinville's engine didn't start.\n\nSee arkitect-run.log next to the app, "
               "or run \"START HERE.bat\" once to finish setup.")
        if isinstance(started, subprocess.Popen):
            try:
                started.terminate()
            except Exception:
                pass
        return

    import webview
    threading.Thread(target=set_window_icon, daemon=True).start()
    try:
        # Pick the native web engine per-OS. Windows: WebView2 / Edge-Chromium. macOS: the
        # built-in WKWebView (cocoa). Forcing edgechromium on a Mac RAISES, and the except
        # below would then silently fall back to a browser tab — faking a "native window
        # works" pass. If the engine is genuinely missing/broken we still catch it.
        webview.create_window("DeMartinville", URL, width=1500, height=950, min_size=(1100, 700))
        _gui = "edgechromium" if sys.platform == "win32" else ("cocoa" if sys.platform == "darwin" else None)
        webview.start(gui=_gui)
    except Exception:
        import traceback
        import webbrowser
        traceback.print_exc()
        webbrowser.open(URL)   # the server is already running — keep ARKITECT usable
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
