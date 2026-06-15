# Tiff's Pink Room

A private, **local** AI creative studio. Everything runs on your own PC — your
own machine, your own model, nothing leaves the computer. Tiff is the AI you
chat with, build with, and create with.

> **Not technical? Don't read this — open `SETUP.txt` instead.** It's 3 steps.

---

## What's in it

| Wing | File | What it does |
|------|------|--------------|
| **Chat** | `static/index.html` | Talk to Tiff. Chat / Write / Research modes. |
| **The Builder** | `static/build.html` | Vibe-code single-file web apps with her. Talk it out, hit Build, keep stacking. Attach images/video, live preview, device frames, auto-fix runtime errors. |
| **The Studio** | `static/studio.html` | Web-audio mixing console. |
| **Images** | `static/images.html` | Local image gen (needs ComfyUI — see below). |
| **Bit16 / Talk** | `static/bit16.html`, `talk.html` | Game + voice toys. |

The whole backend is **one file: `app.py`** (FastAPI). No framework maze, no
build step. Search for `@app.` to find every endpoint.

---

## How it runs

```
your browser  ->  app.py (FastAPI, port 7777)  ->  LM Studio (port 1234)  ->  the model
                        |
                        +-> ComfyUI / FLUX (optional, for images)
```

- **The brain** is **LM Studio** serving a GGUF model on `localhost:1234` over the
  OpenAI-compatible API. Any chat model works; `google/gemma-4-e4b` is the default.
- **`data/`** holds local runtime state (chat sessions, saved builds, Tiff's
  memory). It is **per-machine and private** — it's git-ignored and starts empty
  on a fresh copy.

---

## Editing it

It's plain **Python + plain HTML/CSS/JS**. To change something:

1. Edit `app.py` (backend / endpoints / Tiff's persona + prompts) or a
   `static/*.html` (a wing's UI — they're self-contained).
2. Restart: close the launcher window and double-click **START HERE.bat** again
   (or, while developing, run `venv\Scripts\python -m uvicorn app:app --port 7777 --reload`).
3. The static pages reload on browser refresh; `app.py` changes need a restart
   (use `--reload` to skip that).

Tiff's personality + the Builder's system prompts live in `app.py` near the top
(`PERSONA`, `WRITER_PERSONA`, `BUILD_SYSTEM`, `BUILD_CHAT_SYSTEM`).

---

## Requirements

- **Python 3.10+** (with "Add to PATH" checked on install)
- **LM Studio** + a GGUF chat model
- `pip install -r requirements.txt` — the launcher does this automatically on
  first run.

---

## Portability notes (reading this on a 2nd machine)

- **Model:** `DEFAULT_MODEL` in `app.py` is the original author's model. On any
  other machine the app auto-loads **whatever chat model you have downloaded**, so
  it boots regardless.
- **Images:** the ComfyUI path (`COMFY_DIR` in `app.py`) is hardcoded to the
  author's `D:\tiff-images\...`. It **degrades gracefully** if missing — image gen
  just won't start until you install ComfyUI + FLUX and point `COMFY_DIR` at it.
- **Voice:** same idea — optional local server, off unless set up.
- **Memory:** starts empty on a fresh machine (privacy — the author's personal
  knowledge base is not shared).

So out of the box on a new machine you get: **Chat, the Builder, and Research**,
fully working with just Python + LM Studio + a model.
