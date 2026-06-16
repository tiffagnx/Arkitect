# Contributing to Tiff's Pink Room

This started as one person's local AI station and is now open for anyone to grow.
Thanks for being here. The whole project is small on purpose — you can read all of
it in an afternoon.

## The philosophy (please keep it)

1. **Local-first, always.** Nothing should *require* a cloud account, an API key, or
   sending the user's data off their machine. Optional, environment-gated
   integrations (a paid search key, a remote model) are fine — but the default
   experience must run entirely offline on the user's own hardware.
2. **Keep it simple and readable.** The backend is one file (`app.py`). Each
   front-end wing is one self-contained `static/*.html` in **vanilla HTML/CSS/JS** —
   no React, no bundler, no build step. "View source and learn" is a feature. Resist
   adding a framework.
3. **Never commit personal data.** Everything under `data/` is private and
   git-ignored (chat history, memory, and `owner.md` — the user's personal persona
   block). Don't add personal details to tracked files; put them in `data/owner.md`.

## Running it locally

```bash
python -m venv venv
venv/Scripts/activate            # Windows:  venv\Scripts\activate
pip install -r requirements.txt
# start LM Studio, load any GGUF chat model, start its server on :1234
python -m uvicorn app:app --port 7777 --reload
# open http://localhost:7777
```

`--reload` restarts the server on `app.py` edits. Static pages just need a browser
refresh.

## Where things live

| You want to change... | Edit |
|-----------------------|------|
| An endpoint / backend logic | `app.py` (search `@app.`) |
| Tiff's personality / prompts | `app.py` top: `PERSONA`, `WRITER_PERSONA`, `BUILD_SYSTEM`, `BUILD_CHAT_SYSTEM` |
| A wing's UI | the matching `static/*.html` (self-contained) |
| The audio engine / DAW | `static/studio.html` (one file, Web Audio API) |
| A Studio plugin | `static/studio.html` — `TIFF_PLUGINS.register({ name, params, create(ctx){...} })` |

## Submitting a change

1. Fork the repo and branch off `main`.
2. Make the change. **Test it in the browser** — load the page that mounts what you
   touched and make sure it actually works (there's no type-checker safety net here).
3. Open a PR describing **what** changed and **why**. Screenshots help for UI work.

Bug reports, ideas, and questions as GitHub issues are just as welcome as code.

## Code style

- Match the surrounding style; no formatter is enforced.
- Comments explain *why*, not *what* — the existing code leans on short "here's the
  gotcha" notes. Keep that.
- Small, focused PRs beat giant ones.
