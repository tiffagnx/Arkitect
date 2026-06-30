# Code Room (Kit) — where we're at

**One-line:** Rebuilding Kit (the in-app Code room agent) into "Claude Code but better."
Plan + research in `CODE_ROOM_IMPLEMENTATION_SPEC.md`. Phases 1-4 shipped.

## Shipped (all committed to master, newest last)
- `4145dac` Phase 1 — surgical SEARCH/REPLACE editing (`_apply_one_sr` / `_apply_edits`, ```edit blocks)
- `5953479` Phase 2 — self-correction: auto py_compile/json.loads after writes, loop back on breaks (`_validate_changed`)
- `9a205fb` Phase 3 — risk-tiered command approval: destructive cmds blocked → approval card (`_cmd_is_dangerous`)
- `e90ffe3` vision auto-route: image msgs sent to a vision key (Gemini/Claude) (`_slot_supports_vision`)
- `003c16c` fix: `nonlocal model` (vision route had killed the whole agent with UnboundLocalError)
- `cbadcf8` reliable ```search (`_code_search`), ```read line-ranges (`path.py:120-180`), JSON-drift rescue (`_normalize_drift` — DeepSeek emits OpenAI-style JSON tool calls; we convert them), MAX_ROUNDS scales 8/12/16/20 by effort
- `570082e` Phase 4 — server-authoritative session state keyed by session_id, in-memory + write-through to `data/code_agent_state.json` (gitignored). Kit remembers across turns. (`_CODE_AGENT_STATE`, `_get_agent_session`, `_record_agent_turn`)

All Code agent code is in `app.py` (`/api/code/agent`, `CODE_AGENT_SYSTEM`, helpers ~line 1750-2000) + `static/code.html` frontend. **Restart 7777 after .py changes; hard-refresh for .html.**

## Next phases (not started) — from the spec
- **Phase 5** — native tool-calling adapters (replace regex/drift-rescue with real `tools` API). Biggest remaining reliability win for DeepSeek. HIGH effort.
- **Phase 6** — context compaction + working-set scorer (Phase 4 is the foundation).
- **Phase 7** — voice tone sidecar + video frame sampler (DeMartinville's multimodal edge).
- **Phase 8** — UI polish: live diffs, harness-owned checklist, approval cards already partly there.

## How B is testing it
B uses "fix the Research button" as the live test of whether Kit works (he does NOT want us to fix research directly — Kit must do it). Research dead-end message lives at `app.py:1478` and `swarm_routes.py:760` ("every page was a wall or a dead end"). The real bug = the deep-research web fetch comes back empty.

## Known parallel-session note
Another session committed `7f476be` (desktop.py in-process engine) during this work — only touched desktop.py, not app.py. Watch for it.
