# Code Room — Implementation Spec (compiled from the research)

> Two independent models (a 4.6-class model + Gemini) researched the brief separately and
> **converged on the same answers**. Where they agree, it's settled. This is the build plan,
> tailored to DeMartinville's real architecture (`app.py` FastAPI + SSE + pywebview).

---

## The settled decisions (both sources agreed)

| # | Question | Settled answer |
|---|----------|----------------|
| 1 | Tool protocol | **Native function-calling** where supported (Anthropic/OpenAI/OpenRouter), **strict structured fallback** for local models. One internal `ToolSpec` schema → 3 adapters. |
| 2 | Edit primitive | **Exact SEARCH/REPLACE string blocks** (Aider-style). NOT unified diffs (LLMs botch the math/whitespace). Fuzzy-recovery on failed match. |
| 3 | Loop | Harness-driven `plan → act → observe → validate → correct`. **Don't trust "no tool call = done"** — add explicit `finish`. Thrash detector: same error 2-3× → stop & ask. |
| 4 | Context | Working-set of hot files + background **compaction** (cheap model summarizes old turns) + truncate stale tool output. |
| 5 | Voice/tone | **Two-track**: Whisper transcript + separate prosody/emotion classifier → inject `Detected state: frustrated/urgent/calm` → agent changes behavior (frustrated = skip pleasantries, just fix it). |
| 6 | Video | FFmpeg `fps=1` → frames as base64 array. ~10-15 frames max. Manual trigger only (token-heavy). |
| 7 | Toolset | `search_codebase`, `read_file` (with line numbers), `read_lines`, `edit_file` (search/replace), `write_file` (new only), `run_command`, `get_diagnostics`, `update_plan`, `finish`. |
| 8 | UI | Drive UI from **harness events**, not model prose. Step chips, live diffs, harness-owned checklist, validation badges, approval cards. |
| 9 | Safety | **Risk-tiered approvals**: green (read/search) auto, yellow (workspace edits) auto+flash, red (rm/git push/__repo__) → pause loop, approval card, resume. |
| 10 | State | **Backend becomes session-authoritative** (keyed by session_id). Required for prompt caching, working sets, and background compaction to even work. |

---

## #2 — The edit primitive (HIGHEST LEVERAGE, build first)

This is the single biggest upgrade and it's **self-contained** — drops into the existing loop
next to ` ```write ` without ripping anything out.

### The block Kit emits
````
```edit path="src/app.py"
<<<<<<< SEARCH
def calculate_total(items):
    return sum(items)
=======
def calculate_total(items, tax_rate=0):
    total = sum(items)
    return total + (total * tax_rate)
>>>>>>> REPLACE
```
````

### Apply algorithm (backend)
1. Read file.
2. **Exact match** of SEARCH block. Must match **exactly once**.
3. If 0 matches → **fuzzy recovery**: strip leading whitespace + blank lines from both sides, retry.
4. If still 0, or >1 match → return tool error to Kit: *"SEARCH block not found uniquely — add more context lines"* (the model naturally retries with a bigger chunk).
5. On success: replace, re-parse for syntax (py_compile / AST), atomic write (temp + rename), emit diff.
6. **Multi-edit = atomic**: validate ALL blocks first, apply none if any fail.

### Why it wins
- Token-cheap (no full-file rewrites)
- Safe on big files
- Deterministic to validate
- Both research sources independently named it the winner

---

## #1 — Tool-calling adapter (the foundation)

One internal schema, three transports:

| Provider | Transport | Fallback |
|----------|-----------|----------|
| Anthropic | native `tools` / `tool_use` blocks | — |
| OpenAI/OpenRouter | OpenAI-style `tools` / `tool_calls` | — |
| LM Studio (local) | try OpenAI-compatible tools | **strict XML/JSON envelope** if model is weak |

Local fallback (when no native tools):
````
<tool_call>
<name>read_file</name>
<arguments>{"path": "src/main.py"}</arguments>
</tool_call>
````
Backend intercepts native `function_call` OR the `<tool_call>` tag → executes → appends
`{"role":"tool",...}` → re-triggers. Keep the legacy ` ```write `/` ```read `/` ```run ` regex
parser as the LAST-resort fallback only.

---

## #10 — State authority — DECISION MADE

**Recommendation: hybrid, backend-authoritative session state, in-memory + JSON persistence.**

For a **single-user desktop app**, SQLite is overkill. Here's the call:

- **Live state = in-memory dict keyed by `session_id`** (fast, holds the growing message tree,
  working set, plan, tool ledger).
- **Persistence = the `data/code_sessions.json` you already have** — write-through on each turn.
  Survives restart; reloads into memory on boot.
- Frontend keeps **UX state only** (panes, optimistic chat render). Backend owns **agent working
  state**.

**Why not pure in-memory:** loses everything on server restart (and `.py` changes restart 7777).
**Why not SQLite:** single user, no concurrency pressure — JSON write-through is simpler and you're
already doing it.

### Server-side session shape
```python
class AgentSession(BaseModel):
    session_id: str
    workspace_id: str
    messages: list[dict]          # full growing tree (enables prompt caching)
    summary: str = ""             # compacted older turns
    working_set: list[str] = []   # hot file paths
    plan_items: list[dict] = []
    turn_index: int = 0
    stuck_counter: int = 0
    status: str = "idle"          # idle|running|awaiting_approval|error
```

This unlocks #3 (cross-turn self-correction), #4 (compaction), and Anthropic prompt caching —
none of which work with the current stateless rebuild-from-6-turns design.

---

## Migration phases (safe order)

| Phase | What | Risk | Why this order |
|-------|------|------|----------------|
| **1** | `edit_file` SEARCH/REPLACE block in the existing loop | LOW | Self-contained, huge win, ships now |
| **2** | `get_diagnostics` + post-edit validation (py_compile/lint) → feed errors back | LOW | Self-correction with current loop |
| **3** | Risk-tiered approval (red-tier pause/resume) | MED | Safety before more autonomy |
| **4** | Backend session-authority (in-memory + JSON write-through) | MED | Foundation for caching/compaction |
| **5** | Native tool-calling adapters (replace regex) | HIGH | Big refactor; do once state is solid |
| **6** | Context compaction + working-set scorer | MED | Needs Phase 4 |
| **7** | Voice tone sidecar + video frame sampler | MED | The DeMartinville edge |
| **8** | UI polish: live diffs, harness checklist, approval cards | MED | Layer on top |

---

## Separate bug noted: the Research room hit dead ends

B reported the in-app **Research** feature (`dmv_research` / the Research button in main chat)
returned *"every page was a wall or a dead end"* even on max/deep setting. This is a **separate
issue** from the Code room — likely the web-search/fetch backend failing or being blocked. Flagged
for its own look; not part of this Code room spec.
