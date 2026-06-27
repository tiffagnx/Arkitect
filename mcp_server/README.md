# DeMartinville MCP server

Lets Claude (Desktop / Code / any MCP client) drive DeMartinville's **backend
powers** — talk to a brain, generate images/video/SFX, transcribe audio, manage
agents/projects/memory, and publish to The Stream.

This is **Layer 1** of the MCP plan: the "backend-complete" capabilities — the
stuff that runs fully server-side and needs no open browser tab. It's a thin,
**additive** shim that makes HTTP calls to the running app on
`http://127.0.0.1:7777`. It does **not** modify `app.py` and does **not** touch
any room's HTML/JS, so it can't collide with work happening inside the rooms.

## Setup

1. Install deps into whatever Python will run the server (easiest: the app's venv):
   ```
   venv\Scripts\python.exe -m pip install -r mcp_server\requirements.txt
   ```
2. Start DeMartinville (serves on port **7777**).
3. Point your MCP client at `server.py`. Claude Desktop
   (`%APPDATA%\Claude\claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "demartinville": {
         "command": "C:\\Users\\koonc\\Desktop\\Projects\\pink-room\\venv\\Scripts\\python.exe",
         "args": ["C:\\Users\\koonc\\Desktop\\Projects\\pink-room\\mcp_server\\server.py"]
       }
     }
   }
   ```
   Restart Claude Desktop — the `demartinville` tools show up. Call `dmv_status` first.

## Env overrides

- `DEMARTINVILLE_URL` — target app URL (default `http://127.0.0.1:7777`)
- `DEMARTINVILLE_OUT` — folder for generated SFX files (default `~/DeMartinville/mcp-out`)

## Tools

| Tool | What it does |
|------|--------------|
| `dmv_status` | Health, version, cloud-key status, available models. **Call first.** |
| `dmv_chat` | Talk to a brain (Tiff/Kit), get the full reply |
| `dmv_build_app` | Generate/evolve a single-file web app (Berner Builder) |
| `dmv_research` | Web-research pass → synthesized answer + sources |
| `dmv_generate_image` | Local image gen (free, needs local engine) → URL |
| `dmv_generate_image_cloud` | Cloud image gen (Atlas key) → URLs |
| `dmv_generate_video` | Cloud video gen (Atlas key) → URLs |
| `dmv_generate_sfx` | Sound effect (ElevenLabs key) → saved .mp3 path |
| `dmv_transcribe` | Transcribe a local audio file (Groq Whisper) → text |
| `dmv_list_agents` / `dmv_create_agent` / `dmv_train_agent` / `dmv_agent_readiness` / `dmv_delete_agent` | Manage agent packs |
| `dmv_list_studio_projects` / `dmv_list_editor_projects` / `dmv_list_sessions` | Read saved work |
| `dmv_list_memory` / `dmv_add_memory` | Read + add personal memory |
| `dmv_list_stream` / `dmv_publish_to_stream` | Read The Stream + publish a finished file |

Note: `dmv_generate_image_cloud` / `dmv_generate_video` default `model` values are
guesses — pass the cloud model you actually have access to.

## What's NOT here yet (Layers 2 & 3)

**Live-room control** — turning the actual knobs in Studio/Leon/LePrince from
outside (cook a beat, apply a recipe, master the mix) — isn't here. That needs:

- **Layer 2 — the command relay:** a backend→room channel so MCP can push a
  command into an open room, which runs the same `window.RoomAPI` / `window.studio*`
  dispatch the in-app agents already use, and reports the result back.
- **Layer 3 — RoomAPI coverage:** Leon/beats already exposes `window.RoomAPI`;
  LePrince/editor, Builder, and Stream need one. Each room that exposes a
  `window.RoomAPI` becomes drivable for free once the relay exists.
