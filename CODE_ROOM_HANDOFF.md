# Code Room — handoff (2026-06-28)

**What:** a new in-app agentic **coding room** — the thin slice of the "coding control center inside DeMartinville" vision (see memory `coding-room-inside-demartinville`). Code lives in a sandbox; an agent (any brain you have) edits files directly. This is the seed that grows into the plugin-builder + marketplace later.

**Status:** BUILT + **VERIFIED LIVE** (on preview port 7793), UNCOMMITTED. `app.py` compiles; path-jail escape tests pass at unit AND HTTP layer (`../../app.py` → 400 "path escapes workspace"). Full pipeline proven: write→tree→read byte-exact; one real agent round on the local gemma model emitted a ```write block → backend wrote the file (`applied:{changed:[...]}`). No console errors. To use in the REAL app (7777), restart it — uvicorn has no `--reload`.

**Round 1 "feel like Claude Code" features (DONE + verified):**
- **Effort/God dial** (Faster/Balanced/Smarter/🔱) — sends `effort`; backend ALREADY routes Claude→native effort (god mode) + others→provider reasoning. 🔱 enables only on cloud; clamps to high on local. Shares `localStorage.dmv-effort`.
- **Stop button** — Send toggles to ■ during a run; AbortController cancels, keeps the convo + any written files (writes apply at stream end, so a stop writes nothing half-done).
- **🔑 Keys** — opens the app-wide `window.openKeys("brain")` hub (local LM Studio + any cloud key feed the picker).
- **🎤 Talk-to-type** — continuous `webkitSpeechRecognition`, auto-restarts across pauses (resumable), never auto-sends.

## Round 2 — consistency/polish pass (DONE + verified live on 7793)
Owner saw it on the preview and said it felt like a different site. Fixed to feel native:
- **Retheme** — was literal hot-pink; now the app palette (steel-cyan `#3E9CB8` + gold, graphite radial-gradient bg, Inter/Oxanium/Space-Mono). The app's `--pink` is itself teal — "no pink" per its own root comment.
- **Effort buttons → the real LEVER** — ported the exact `.elever` drag component + JS from `index.html` (Faster↔Smarter, 🔱 God on cloud/Claude, writes `localStorage.dmv-effort` + `#think`). `getEffort()` reads `#think.value`.
- **Killed the whacky wordmark** — removed "⌨ Code · DeMartinville" brand text (brand-law: never font-render the wordmark); replaced with a clean `← home` link.
- **Removed Summon agent + "?"** in THIS room only — pre-empt the pinkroom-nav guards (`<span data-summon hidden>` + `<script data-help>`) + a backup strip. Did NOT touch the shared injector (parallel-safe).
- **In the menu** — added `⌨ Code` roomlink to `static/index.html` rail (after Berner Builder). Static file → shows on next hub load, no restart.
- **Resizable panels** — `.gutter` drag handles; drag to resize, dbl-click to reset, widths persist.

## Round 4 — Claude-Code-style relayout (DONE + verified live on 7793)
Owner showed Claude Code's UI as the target and said my IDE layout was "the exact same thing, you didn't change it." Rebuilt to match:
- **New order: files (left, 220px) · CHAT (center, main) · code editor (right, 40%).** Swapped editor↔chat — the conversation is now the big middle, code on the right (the "HTML on the right side"). Verified: tree 220 / chat 481 / editor 607 at 1320px, all full height.
- **Controls UNDER the input** (was above): a `.toolbar` row beneath `#ask` — `＋` attach · 🎤 mic · model picker · effort button · ➤ send.
- **Effort lever + Keys → a popup** (`.effortpop`) that opens when you press the effort button (shows current stop, e.g. "⚡ Quick"). Mirrors Claude Code's Max→popup. Verified: opens, lever + keys inside.
- **Image upload** — `＋` button → file picker → thumbnails → sent as `images[]`; backend `/api/code/agent` folds them into vision content parts (gemma-vision + Claude). Needs the 7777 restart to process images there.
- **Model dedup** — collapses LM Studio's `:2`/`:3` duplicate instances in the picker.
- Agent loop re-verified after the restructure (wrote `layout-ok.txt`, no regression).

## Round 5 — polish + the model bug (DONE + verified live on 7793)
- **🔴 BUG FIXED: only Gemma was showing.** `/api/models` returns `{models:[local], cloud:[{id,label}]}` — the room read only `models` and dropped `cloud`. Now merges both (cloud first); his 5 cloud-key models show (Groq, Gemini, OpenRouter ×2, Claude). MODELS is now `{id,label,cloud}` objects; `isClaudeish` checks the label.
- **Send + mic moved INSIDE the input box** (bottom-right, `.inbtns`/`.inbtn`); `+` / model / effort stay in the toolbar below.
- **In-app modals** replace native `prompt()`/`confirm()` (no more "localhost:7777 says"). `dmvPrompt`/`dmvConfirm`.
- **Markdown in agent replies** — `mdToHtml`: clickable links, **bold**, `inline code`, JSON/code blocks. Write-blocks collapse to "〈✍ wrote X〉".
- **Paste / drop a screenshot** into the composer → attaches as an image.
- **Model advisor (slice 1)** — reads `/api/capability` (real GPU/VRAM) + `has_cloud_key`, shows an honest banner atop the model menu (his 2060 SUPER 8GB → "small local models, 32B won't fit, use cloud for hard code"). NO fabricated specs. → owner wants this expanded (best-local-for-coding + cheapest-API-for-the-task); see memory `coding-room-inside-demartinville`.

## Round 6 — Claude-Code integration + the agent auto-pop fix (DONE + verified live)
- **Chat / Code tabs** in the Code room top bar (replaced the `←`). Chat → main chat (`/`), Code = active. A global link handler strips bare hrefs, so Chat's nav is wired explicitly in JS. Verified: clicking Chat lands on `/`.
- **Berner Builder REMOVED from the menu** (`static/index.html`) — Code supersedes it. `build.html` kept on disk (reversible). Verified: rail shows ⌨ Code, no Berner.
- **🔴 Agent auto-pop FIXED (all rooms)** — `static/kit-helper.js`: the window auto-opened on every room load (defaulting to Tiffany via remembered `dmv_active_brain`). Added an `explicit` flag; `win.classList.add("open")` now fires ONLY on drag-in / `?summon=1` / Agent Forge (handoff self-opens). Verified on Visual Labs: 0 open windows on load, Summon opens it (0→1), no console errors. SHARED injector = fixed everywhere at once. See memory `agents-dont-autopop-in-rooms`.

## Round 7 — Sidebar redesign (DONE + verified, this commit)
- **Removed "local · private · yours"** from the brand (brand-law: just the wordmark).
- **Removed "Search rooms…"** input — owner called it pointless.
- **Added Chat / Code toggle** right under the logo (Chat = active/current, Code → `/static/code.html`) — pill switcher, app palette.
- **Sleeker "+ New chat"** button — smaller padding, tighter radius.
- **Compressed room list** — smaller icons (22px→), tighter padding, tighter gap; all rooms still accessible, just less tall.
- Verified on preview (port 7793) + screenshot confirmed.

## All owner asks: DONE
Live preview ✓ · advisor slice 2 ✓ · first-run onboarding ✓ · sidebar Chat/Code toggle ✓ · Berner Builder gone ✓ · agent auto-pop fixed ✓

Rename "Code" → still owner's call (he mused "burn your code"). Brand-law: don't invent a name.

## Files
- `static/code.html` — NEW. Three-pane mini-IDE: file tree · textarea editor (Ctrl+S saves, Tab=2sp) · coding-agent chat. App-themed; standard model picker (`/api/models`) + `pinkroom-nav.js`.
- `static/index.html` — added the `⌨ Code` roomlink (one line, in the "More" rail).
- `app.py` — added the Code Room block right after `BUILDS_DIR` (~line 1471): `CODE_ROOT`, `CODE_ADMIN`, `_ws_root`, **`_code_path`** (the jail), `_code_tree`, `_flatten_tree`, `CODE_AGENT_SYSTEM`, and endpoints `/api/code/workspaces|tree|read|write|agent`. Added a `/code` page route next to `/editor`.

## The security model (the part that matters)
- Every file op resolves through `_code_path(ws, rel)`: `.resolve()` collapses `../`+symlinks, then it REQUIRES the result to be the workspace root or under it — else raises. Verified against `../`, `..\`, `C:/...`, leading-slash, mid-path escapes.
- Workspaces are dirs under `data/code/<ws>/`. A plain user is jailed there and CANNOT touch the real repo.
- `ws="__repo__"` maps to the real project root **only** when the server is started with env `DMV_CODE_ADMIN=1`. Off by default. That's the admin-vs-user tier, slice 1.
- The agent loop is ONE round (budget-lean): brain sees the tree + open file, emits ` ```write path="..." ``` ` blocks, backend applies them jailed. No `run`-command yet (that's the next gated, dangerous step — sandbox it before building).

## Test (after restarting the app on 7777)
1. Open `http://127.0.0.1:7777/code`
2. Pick a model (top-right). Type in the agent: *"make hello.py that prints the time"* → it writes the file, a ✓ chip appears, click it to open.
3. Edit in the textarea, Ctrl+S → saved. ⟳ refreshes the tree.
4. To edit DeMartinville itself: restart with `DMV_CODE_ADMIN=1` → the "⚠ This project (repo)" workspace appears.

## Next slices (NOT built — owner wants these when he has allotment Wed)
- **📎 Image attach** — owner uploads images to Claude; reuse `_asset_manifest` + fold image_url parts into the agent's user message (gemma-4-e4b + Claude have vision). Soft ask (he wasn't sure it was needed).
- **🔊 TTS talk-back** — agent speaks its prose (NOT code blocks) via the app's voice system. He hinted at it ("not just the user doing talk-to-text").
- **🖥 Rent-a-computer / custom endpoint** — let the picker point at a rented vLLM/LM Studio box (base_url + key + model). Ties to his July GPU bridge. Needs a "custom OpenAI-compatible" provider in `swarm_routes.py`/`keys.js` (SHARED files — coordinate with parallel sessions).
- Multi-round tool-loop (read→edit→verify) · gated `run` command in a real sandbox · plugin submit→auto-check→quarantine→admin-promote pipeline · per-user workspaces · link from the nav menu (left out to avoid touching the shared injector while parallel sessions run).
