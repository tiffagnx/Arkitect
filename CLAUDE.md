# DeMartinville — project instructions

*Orientation for a cold start: read `MEMORY.md` (auto-memory) + the newest `*_HANDOFF.md` / `START_HERE.md`.*

---

## 🚢 "Ship it" — the end-of-night routine

When the owner says **"it's the end of the night," "ship it," "lock it up," "that's the night,"** or anything clearly meaning *wrap up and ship* — that's the trigger to run this WHOLE routine **without him reciting the steps**. The whole point: he says two words and the agent already knows the drill.

Run it top to bottom and report as you go in one scannable block.

**Steps 1–4 run automatically** (safe + local):
1. **Save** — session-worthy facts → memory (`MEMORY.md` index + a memory file). Convert relative dates to absolute.
2. **Handoff** — write/update a handoff `.md` so a cold session knows where things stand. **Don't overwrite a parallel session's `START_HERE.md`** — write your own `<AREA>_HANDOFF.md`.
3. **Check for parallel sessions FIRST** — the owner runs **multiple agents in this same repo at once**. `git log -3` + `git status`. If another session already committed / released / wrote a handoff, **don't double-cut a release or clobber their files**. Commit only **your** files (explicit paths — never a blind `git add -A`).
4. **Commit + push to master** — the session's own work, to `master`. End the commit message with the `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` line.

**Steps 5–6 are public + irreversible — do the prep, then confirm the specifics in ONE shot before the push.** (A single "deploying the site + cutting v1.X.Y — go?" — NOT a recited checklist. He stays in the loop on what goes public; he just never has to *remember the steps*.)

5. **Deploy the website** — if `static/join.html` or site assets changed: rebuild `index.html` from `static/join.html`, force-push the **gh-pages** branch of `tiffagnx/Arkitect`. ⚠️ **Always include `CNAME` (`demartinlabs.com`) + `kit-hero.png` + `static/shots/*`** every time, or the domain breaks / the showcase images 404. `gh` is on the **PowerShell** PATH (a plain `git push` to gh-pages works from either shell).
6. **Cut a release** — only if app code changed, a version ship is wanted, AND no parallel session already cut it: `release.ps1 <ver>` bumps `APP_VERSION` (`app.py` + mirror it in `static/studio.html`), builds `ARKITECT.zip` (`build_zip.py`), tags `vX.Y.Z`. The **tag auto-triggers the free Mac build** (`.github/workflows/mac-build.yml` → Intel + arm64 `.app`s, attached to the release) and the website "download latest" serves the new ZIP. **Mac is automatic — never a manual step.** (`release.ps1` ends on a `Read-Host` that hangs a non-interactive shell — run the steps by hand or background it.) ⚠️ **The version has TWO homes that must ALWAYS match: `APP_VERSION` in `app.py` AND `const APP_VERSION` in `static/studio.html`** (the Studio's in-browser updater keeps its own copy). Bump BOTH every time — `release.ps1` now does (fixed 2026-06-22); doing it by hand, change both — or the Studio shows a stale "jumped up" version. ⚠️ **Don't blind-rebuild `ARKITECT.exe` in a headless/non-GUI session** — you can't launch-test it, and a broken launcher shipped to waiting users is worse than the known-working one (whose only flaw is the "ARKITECT" title bar pending a verified rebuild). Ship the existing exe + the current code; Mac rebuilds fresh on the tag regardless.

7. **Report + rest** — what shipped + what's pending, one tight block, then tell him to go rest. If he's fried or spiraling, lock what's good and call the break instead of grinding (memory: `owner-spiral-is-the-stop-signal`).

**The goal: he never recites the checklist again.** He says "ship it" → the agent runs 1–4 on its own, then asks one "deploy + release — go?" before anything public.
