"""Build a clean ARKITECT distributable zip (excludes venv/data/.git/dev junk).

Usage:  python build_zip.py [output.zip]
        (no arg -> writes to your Desktop\\ARKITECT.zip)
"""
import os
import sys
import zipfile
import fnmatch

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.expanduser("~"), "Desktop", "ARKITECT.zip")

EXCLUDE_DIRS = {
    "venv", "data", ".git", ".claude", "studio-research", "_update",
    "build", "dist", "__pycache__", "node_modules", ".pytest_cache",
    ".idea", ".vscode",
}
EXCLUDE_GLOBS = ["*.zip", "*.pyc", "*.pyo", ".env", ".env.*", "*.log", ".DS_Store",
                 "build_zip.py", "release.ps1", "RELEASE.bat", "*.spec",  # dev/release tools
                 "make_public_seed.py",        # dev script that reads the owner's private KB
                 "kb_export.json"]             # owner's raw personal KB — belt-and-suspenders (data/ is already excluded)


def skip(rel):
    parts = rel.replace("\\", "/").split("/")
    if any(p in EXCLUDE_DIRS for p in parts):
        return True
    base = parts[-1]
    return any(fnmatch.fnmatch(base, g) for g in EXCLUDE_GLOBS)


n = 0
total = 0
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    for dp, dns, fns in os.walk(ROOT):
        dns[:] = [d for d in dns if d not in EXCLUDE_DIRS]
        for fn in fns:
            full = os.path.join(dp, fn)
            rel = os.path.relpath(full, ROOT)
            if skip(rel):
                continue
            arc = "ARKITECT/" + rel.replace("\\", "/")
            z.write(full, arc)
            n += 1
            total += os.path.getsize(full)

print(f"wrote {n} files, {total // 1024 // 1024} MB raw -> {OUT}")
print("zip size:", os.path.getsize(OUT) // 1024 // 1024, "MB")
