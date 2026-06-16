# Tiff's Pink Room

A **fully local** AI creative studio. Everything runs on your own PC — your machine,
your model, nothing leaves the computer, no API keys, no cloud bill. **Tiff** is the
AI you chat, write, build, and make with.

> **Not technical? Don't read this — open `SETUP.txt` instead.** It's basically one
> double-click.

**License:** MIT — fork it, change it, ship it, sell it. PRs welcome. See
[Contributing](#contributing).

---

## What's in it

| Wing | File | What it does |
|------|------|--------------|
| **Chat** | `static/index.html` | Talk to Tiff. Chat / Write / Research modes. Streaming, voice-to-text, attach images/PDFs/docs. |
| **The Builder** | `static/build.html` | Vibe-code single-file web apps with her. Talk it out, hit Build, keep stacking. Attach images/video (embedded as data-URIs), live preview, device frames, auto-fix runtime errors. |
| **The Studio** | `static/studio.html` | A real **Web-Audio DAW** — see below. |
| **Images** | `static/images.html` | Local image gen via ComfyUI + FLUX (optional). |
| **Deep Research** | (in Chat) | She writes the queries, searches the web free (DuckDuckGo), reads pages, and synthesizes — every step visible. |
| **Bit16 / Talk** | `static/bit16.html`, `talk.html` | A 16-bit game + a talking-avatar voice toy. |

### The Studio (`static/studio.html`) — a browser DAW, zero dependencies

One self-contained HTML file, pure Web Audio API:

- **Clip timeline** — drop stems, separate clips **in place** (nothing ripples, BPM stays sacred), drag them, zoom, snap to the grid, resize lane height.
- **Per-clip FX** — Reverse, Reverse-Reverb, BPM Delay, Chop, Fades — printed onto one clip.
- **AudioSuite** — offline render of Gain / Normalize / Pitch-shift / Time-stretch onto a clip.
- **Channel strip** — VOL / PAN / 3-band EQ / Comp / a send, all knobs with numbers.
- **Plugins** — a chain of inserts, each opening a draggable knob **faceplate**. Includes a convolution reverb (TIFF VERB). Write your own: `TIFF_PLUGINS.register({...})`.
- **FX buses + sends + output routing** — route any track through a bus.
- **Mix window** — a full Pro-Tools-style console: vertical channel strips + a red Master fader, live VU meters.
- **Export** to WAV (offline render), save/load projects locally.

The whole backend is **one file, `app.py`** (FastAPI). No framework maze, no build
step. Search `@app.` to find every endpoint. The front-end wings are **vanilla
HTML/CSS/JS** — no React, no bundler, view-source and go.

---

## How it runs

```
your browser  ->  app.py (FastAPI, :7777)  ->  LM Studio (:1234)  ->  your model
                        |
                        +-> ComfyUI / FLUX  (optional — local images)
                        +-> XTTS voice server (optional — local TTS)
```

- **The brain** is **LM Studio** serving any GGUF chat model on `localhost:1234`
  (OpenAI-compatible API). `google/gemma-4-e4b` is a good small default; any chat
  model works and the app auto-loads whatever you have installed.
- **`data/`** holds all local state — chat sessions, saved builds, Tiff's memory,
  and your personal `owner.md`. It is **git-ignored and private**: a fresh clone
  starts empty. Nothing personal ships in the repo.

---

## Quick start

**Easy path (Windows):** double-click **`START HERE.bat`**. First run auto-detects
your GPU, installs Python + LM Studio if missing, downloads a model, and opens the
browser. See `SETUP.txt`.

**Manual path (any OS):**

```bash
python -m venv venv
venv/Scripts/activate            # Windows:  venv\Scripts\activate
pip install -r requirements.txt
# start LM Studio, load a chat model, start its server on :1234
python -m uvicorn app:app --port 7777
# open http://localhost:7777
```

Out of the box you get **Chat, the Builder, the Studio, and Research** with just
Python + LM Studio + a model. Images and Voice are optional add-ons.

---

## Make her yours (`data/owner.md`)

Tiff ships with a generic owner persona. To make her know *you*, drop a
**`data/owner.md`** file describing yourself — it's injected into her persona at
startup and is **git-ignored**, so your personal details never end up in the repo
or a shared copy. Example:

```
I'm Sam — I make lo-fi beats and short films. Talk to me like a collaborator,
not a help desk. I hate corporate hedging. My dog's name is Biscuit.
```

She also remembers things you tell her over time (stored in `data/`, local only).

---

## Editing it

Plain **Python + plain HTML/CSS/JS**:

1. Edit `app.py` (endpoints / persona / prompts) or a `static/*.html` (each wing is
   self-contained).
2. Restart the launcher, or dev with reload:
   `venv\Scripts\python -m uvicorn app:app --port 7777 --reload`
3. Static pages reload on browser refresh; `app.py` changes need a restart (or
   `--reload`).

Tiff's personality + the Builder prompts live near the top of `app.py` (`PERSONA`,
`WRITER_PERSONA`, `BUILD_SYSTEM`, `BUILD_CHAT_SYSTEM`).

---

## Optional add-ons (env overrides)

| Feature | How |
|---------|-----|
| **Local images** | Install ComfyUI + a FLUX GGUF, set `COMFY_DIR` to its folder (defaults to `D:\tiff-images\...`). Degrades gracefully if absent. |
| **Local voice** | A local XTTS server; point `TIFF_VOICE_PY` / `TIFF_VOICE_SERVER` at it. Off unless set up. |
| **Better web search** | Set `TAVILY_API_KEY` to use Tavily instead of scraping DuckDuckGo. |

---

## Requirements

- **Python 3.10+** (check "Add to PATH" on Windows)
- **LM Studio** + any GGUF chat model
- `pip install -r requirements.txt` (the launcher does this automatically)

---

## Contributing

This started as one person's tool and is now open for anyone to grow. The bar:

- **Local-first.** No feature should require a cloud account or send user data off
  the machine. Optional, env-gated integrations are fine.
- **Keep it simple.** One `app.py`, self-contained `static/*.html`, vanilla JS.
  Resist frameworks and build steps — readability and "view source and learn" are
  features.
- **Don't commit personal data.** Anything under `data/` is private and git-ignored.

To contribute: fork → branch → make the change → test it in the browser → open a PR
describing what and why. Bug reports and ideas as issues are just as welcome.

---

## License

[MIT](LICENSE). Do whatever you want with it — just keep the license notice. No
warranty.
