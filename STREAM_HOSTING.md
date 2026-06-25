# The Stream — going live (shared / public)

The Stream (Notifi = music, Cratel = video) is **cloud-ready but not live**. Today it runs
**local + private** on each person's machine. This doc is the ~2-minute flip to make it a
**shared scene** where everyone with the link sees + publishes to ONE feed.

Nothing here is required for normal local use — local stays the default and stays private.

---

## How it works

- The Stream room (`static/stream.html`) talks to a `/api/stream` API (in `app.py`).
- A **source switch** lives in the room: the **chip in the top-right** (🏠 Local) → opens
  *Stream settings* → **This machine** (private) or **Shared server** (paste a URL).
- Identity is a **handle** (a name, no password) — set once in the same settings panel,
  remembered locally, and auto-filled when you publish.
- The server only becomes reachable by *other* people when you run it with the env var
  **`DMV_SHARED=1`** — that's the single switch that opens CORS. Without it, no cross-origin
  access, nothing exposed.

So "going live" = run the DeMartinville server **somewhere public, with `DMV_SHARED=1`**, then
point people's Stream room at that URL.

---

## The flip (when you've picked a host)

1. **Host the server.** Put this repo on a host that runs Python (Render / Fly.io / Railway /
   a VPS). Start command:
   ```
   DMV_SHARED=1 python -m uvicorn app:app --host 0.0.0.0 --port $PORT
   ```
   You get a public URL, e.g. `https://demartin-stream.onrender.com`.

2. **Give it a persistent disk.** Published media + the feed manifest live in `data/stream/`
   (`media/` + `feed.json`). On hosts with ephemeral disks, attach a persistent volume mounted
   at `data/` (or point `DATA` there) so drops survive restarts/deploys.

3. **Join it.** Anyone visits **`https://<your-host>/static/stream.html`**, sets a handle, and
   they're in the shared scene — or, from their *local* DeMartinville, they open The Stream →
   the top-right chip → **Shared server** → paste the URL. Same feed either way.

That's it. The local app, the labs' `📡 To Notifi` / `📡 To Cratel` buttons, and the hosted
page all read the same config and publish to the same place.

---

## Before you open it to the public — known gaps (none block a private/friends launch)

These are deliberately deferred (the build is "cloud-ready," not "hardened public service"):

- **No real auth yet.** A handle is trust-based — anyone can type any name. Add real sign-in
  (the "Real accounts" option) before it's truly open to strangers.
- **No upload limits / moderation.** Publishing accepts audio/video; a wide-open public host
  has no size cap or abuse protection yet. Fine for you + invited creators; add limits before
  a public link.
- **Media is sent inline** (base64 in the publish request) for browser/Beat-Lab uploads. Big
  videos are heavy over the network — Studio/editor publishes use a server-side path/job-id and
  are efficient. A direct-to-storage upload (e.g. S3/Supabase Storage) is the scale step.
- **One shared feed.** No per-user spaces, follows, or playlists across users yet — that's the
  next product layer once it's live.

When you're ready to harden it, the natural path is a managed backend (Supabase: Postgres +
Storage + Auth) behind the same `/api/stream` shape — the room won't need to change.
