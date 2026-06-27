# DeMartinville

A **local-first creative OS.** A set of rooms — make music, beats, video, images, build apps,
stream — with AI **agents** (Tiff, Kit, and ones you build) that work *inside* them. It runs on
your own machine: a **local model**, or **your own** cloud API keys. Nothing is locked to anyone's
account, and your data never leaves your computer unless you choose a cloud feature.

> **Not technical?** Open `SETUP.txt` — it's basically one double-click.

**License:** MIT — fork it, change it, ship it. PRs welcome ([Contributing](#contributing)).

---

## The rooms

| Room | File | What it is |
|------|------|------------|
| **Main hub + chat** | `index.html` | Talk to your agents; jump to any room; your memory + sessions. |
| **DeMartin Audio Labs** | `studio.html` | A real **Web-Audio DAW** — record, edit, mix, master, bounce. Dock an agent on a track and tell it "brighter / warmer / fix it." |
| **Leon Production Labs** | `beats.html` | A beat maker — build by hand (channel rack + piano roll) or say "trap at 140" and it cooks the whole beat, in key. |
| **LePrince Visual Labs** | `editor.html` | Video + compositing, After-Effects style — timeline, effects, keyframes, masks, 3D, content-aware fill. |
| **Imagination Station** | `images.html` / `imagine-cloud.html` | Image gen — free on your own GPU (built-in FLUX), or premium image/video on your own cloud key. |
| **Berner Builder** | `build.html` | Describe an app or audio plugin → it builds it. Live preview, auto-fix. |
| **The Stream** | `stream.html` | Publish + listen/watch (Notifi = music, Cratel = video). Artists keep 100% — payout links, no middleman. |
| **Agent Forge** | `character.html` | Build + train your own agent — give it a face, a craft, a voice, and teach it your moves. |
| **Marketplace · Research Swarm · The Wall** | `market.html` · `swarm.html` · `wall.html` | Browse/deploy agents · ask many LLMs at once · sign your mark. |

The agents aren't a chat box bolted on — they **act inside the rooms**: turn the knobs, cook the
beat, apply the effect. Back a lead agent with a **crew** of other brains, dial up reasoning
**effort**, or drive the whole app from Claude Desktop via the built-in **MCP server**.

The backend is **one file, `app.py`** (FastAPI). The rooms are **vanilla HTML/CSS/JS** — no React,
no bundler, no build step. View-source and go.

---

## How it runs

```
your browser  ->  app.py (FastAPI, :7777)  ->  a local model (LM Studio :1234)
                        |                         ...or YOUR cloud key (Claude / Groq / Gemini / OpenRouter)
                        +-> built-in image engine (your GPU, on demand)
                        +-> MCP server (drive the app from Claude Desktop / any MCP client)
```

- **The brain** is either a **local model** (LM Studio serving any chat model on `localhost:1234`,
  OpenAI-compatible) **or** your own **cloud key**, added in the in-app **Keys** hub. Either way
  it's *yours* — keys are saved **encrypted** on your machine and never ship.
- **`data/`** holds all local state — sessions, saved work, agents, memory, your personal
  `owner.md`. It is **git-ignored and private**: a fresh clone starts empty. Nothing personal ships.

---

## Quick start

**Easy path (Windows):** the one-click launcher (see `SETUP.txt`) — first run detects your GPU,
installs what's missing, and opens the app.

**Manual path (any OS):**

```bash
python -m venv venv
venv\Scripts\activate                       # macOS/Linux:  source venv/bin/activate
pip install -r requirements.txt

# Brain — pick one:
#   • local + free: install LM Studio, load a chat model, start its server on :1234
#   • or none: just run it and add a cloud key in the in-app Keys hub

python -m uvicorn app:app --port 7777
# open http://localhost:7777
```

Out of the box you get every room with just Python + a brain (local or cloud). Premium image/video
and agent voices are optional, on your own keys.

---

## Make the agents know you (`data/owner.md`)

The agents ship generic. Drop a **`data/owner.md`** describing yourself — it's injected at startup
and is **git-ignored**, so your personal details never end up in the repo or a shared copy:

```
I'm Sam — I make lo-fi beats and short films. Talk to me like a collaborator,
not a help desk. I hate corporate hedging.
```

They also remember things you tell them over time (stored in `data/`, local only).

---

## Editing it

Plain **Python + plain HTML/CSS/JS**:

1. Edit `app.py` (endpoints / prompts) or a `static/*.html` (each room is self-contained).
2. Dev with reload: `venv\Scripts\python -m uvicorn app:app --port 7777 --reload`
3. Static pages reload on a browser refresh; `app.py` changes need a restart (or `--reload`).
4. **Run `python check.py`** — it syntax-checks everything and pings every room + endpoint, so you
   know in seconds if you broke something. (Read **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full map.)

---

## Requirements

- **Python 3.10+**
- A brain: **LM Studio** + any chat model (free/local), **or** a cloud API key (your own)
- `pip install -r requirements.txt`

---

## Contributing

DeMartinville is small on purpose and welcomes help. The bar:

- **Local-first.** No feature should *require* a cloud account or send user data off the machine.
- **Bring-your-own-key.** Never hardcode or ship a key — keys are the user's, saved encrypted.
- **Keep it simple.** One `app.py`, self-contained `static/*.html`, vanilla JS. Resist frameworks
  and build steps — "view source and learn" is a feature.
- **Don't commit personal data** (`data/` is private and git-ignored).

Fork → branch → change → **`python check.py`** + test in the browser → PR with what & why. Full
guide: **[CONTRIBUTING.md](CONTRIBUTING.md)**.

---

## License

[MIT](LICENSE). Do what you want with it — just keep the license notice. No warranty.
