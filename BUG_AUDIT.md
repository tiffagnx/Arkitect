# Bug Audit — ARKITECT

**49 confirmed bugs** — Critical: 2 · High: 27 · Medium: 15 · Low: 5. (Read-only audit; fixes below are one-line summaries.)

## Critical

- [ ] **build.html:744** — DOM-based XSS via unsanitized plugin name/subtitle in `innerHTML`. **Fix:** Build the row with `createElement` + `textContent` instead of `innerHTML` template literal.
- [ ] **build.html:752** — DOM-based XSS via unsanitized build title in `innerHTML`. **Fix:** Render `b.title` via `textContent`, not an `innerHTML` template literal.

## High

- [ ] **app.py:2135** — IndexError when `ref` data URI has no comma; misleading "engine" error returned. **Fix:** Guard `if ',' not in ref_b64: return 400` before `split(",",1)[1]`.
- [ ] **app.py:2502-2525** — Data race in `_build_cache` on `EDIT_MEDIA` dict (concurrent import orphans cache writes). **Fix:** Wrap read-modify-write of `EDIT_MEDIA` in an `asyncio.Lock`.
- [ ] **app.py:2358-2359** — Hardcoded `C:\Users\koonc\...` FFmpeg/FFprobe fallback breaks every other machine. **Fix:** Drop the path; require ffmpeg on PATH or raise a clear "ffmpeg not found" error.
- [ ] **app.py:1751-1755** — ComfyUI `Popen` launched with no handle/output capture; 90s wait on a dead process, possible double-launch. **Fix:** Store the proc in a module var, check it's alive before relaunching, clear on exit.
- [ ] **app.py:2829-2862** — `_run_export` leaves a zombie process if cancelled mid-read (proc terminated, never `wait()`ed). **Fix:** `await proc.wait()` after `terminate()`, drain stderr even on non-zero exit.
- [ ] **swarm_routes.py:352-361** — SSE disconnect leaves research tasks running (burns API quota). **Fix:** Wrap `gen()` task loop in try/finally that cancels and awaits all tasks.
- [ ] **swarm_routes.py:190-205** — `_PAGE_CACHE` leaks: stale entries only evicted on >200 write, never on TTL. **Fix:** Proactively delete entries older than `_PAGE_TTL` at the top of `_cached_fetch`.
- [ ] **swarm_routes.py:523** — `asyncio.gather()` without `return_exceptions=True` drops all results on one agent's network exception. **Fix:** Add `return_exceptions=True` and filter to `isinstance(b, dict) and b.get("digest")`.
- [ ] **index.html:448** — Race: loading a session while sending drops the new message into the orphaned `messages` array. **Fix:** Add a `sessionLoading` flag; block/abort `send()` while a session load is in flight.
- [ ] **index.html:383-409** — No `res.ok` check before `getReader()`; error responses silently produce empty replies. **Fix:** After fetch, `if (!res.ok) throw new Error(...)` before reading the body.
- [ ] **studio.html:3146-3151** — `playAll()` calls `c.resume()` without `await`; sources scheduled on a still-suspended context. **Fix:** `await c.resume()` before building the graph.
- [ ] **studio.html:3164-3165** — Master insert nodes from offline export never stored, never disposed (AudioNode leak across exports). **Fix:** Store `master._ins = nodes` in offline mode too (or `oc.close()` after render).
- [ ] **studio.html:2043-2048** — Clip-move reads `playing` at drag-end, not drag-start; can wrongly restart playback. **Fix:** Capture `const wasPlaying = playing` at mousedown; gate `restartPlayback()` on it.
- [ ] **build.html:721-722** — Unhandled rejection on `POST /api/builds`; `r.id` throws on undefined. **Fix:** Add `.catch(()=>({}))` and guard `if (r.id) {...}`.
- [ ] **build.html:746** — Unhandled rejection loading a plugin; `full` undefined corrupts `currentId`/`code`. **Fix:** Add `.catch(()=>({}))` and guard `if (full.code) {...}`.
- [ ] **build.html:754** — Unhandled rejection loading a build; `rehydrate(undefined)` corrupts state. **Fix:** Add `.catch(()=>({}))` and guard `if (full.code) {...}`.
- [ ] **editor.html:997-1000** — Ruler drag calls `setPointerCapture` but never `releasePointerCapture`; blocks later pointer events. **Fix:** Call `ruler.releasePointerCapture(e.pointerId)` in the `up()` handler.
- [ ] **editor.html:1122-1156** — WebSocket in `exportViaFrameServer` never closed on error/timeout paths (connection leak). **Fix:** Add `ws.close()` in the `finally` block.
- [ ] **editor.html:1157-1178** — `expGo` export handler leaks the WebSocket on error throws (same root as 1122-1156). **Fix:** Ensure `ws.close()` runs in `finally` before errors propagate. (x2 with editor.html:1122-1156 — shared WS-leak)
- [ ] **bit16.html:621-625** — Audio `captureStream()` failure swallowed; user records silent video with no warning. **Fix:** In `catch`, `console.warn` and show a "recording silent" UI indicator.
- [ ] **bit16.html:241,402,407,629** — Object URLs (`createObjectURL`) never revoked; memory grows with each sprite/song/recording. **Fix:** Revoke the prior URL before creating a new one and on `endGame()`.
- [ ] **talk.html:442** — Aborting a streaming reply returns early without resetting `streaming`/`thinking`/button/caption (UI stuck). **Fix:** Reset all UI state before the early `return` after `abortCtl.abort()`.
- [ ] **talk.html:432-438** — TTS blob URL leaks on error/interrupt (only revoked in `onended`). **Fix:** Revoke `audioEl.src` before assigning a new one and in the `onerror` handler.
- [ ] **swarm.html:238-252** — SSE reader never `cancel()`ed on error (stream/resource leak). **Fix:** Add `finally { reader?.cancel().catch(()=>{}) }`.
- [ ] **swarm.html:161-164** — XSS: `p.key_url`/`p.free`/`p.models_hint` interpolated into `innerHTML` unsanitized. **Fix:** Build the hint with `textContent` + `createElement('a')` for the link.
- [ ] **pinkroom-nav.js:60** — Document click listener never removed; duplicates accumulate on re-mount/re-inject. **Fix:** Store the handler as a named fn and `removeEventListener` on unmount (or guard re-registration).
- [ ] **pinkroom-nav.js:75** — `setInterval` ID never stored/cleared; duplicate health-poll intervals on re-inject. **Fix:** Store the interval id and `clearInterval` before re-creating.

## Medium

- [ ] **app.py:3006-3008** — Race on `EXPORT_JOBS[jid]` between WS frame loop and HTTP cancel (lost status). **Fix:** Guard `EXPORT_JOBS` access with an `asyncio.Lock`.
- [ ] **app.py:2693-2702** — ffmpeg `drawtext` font path injected unescaped (filter injection). **Fix:** Validate/whitelist the font path or `shlex.quote` it before the filter string.
- [ ] **app.py:1170-1174** — Unauthenticated plugin code concatenated into `bundle.js` and run in every browser (code injection). **Fix:** Validate the `TIFF_PLUGINS.register` contract on save, or sandbox plugin exec.
- [ ] **swarm_routes.py:450-452** — Non-atomic load-modify-save of `KEYS_FILE`; concurrent saves clobber keys (also lines 460-462). **Fix:** Serialize key writes with an `asyncio.Lock` (re-read inside the lock).
- [ ] **index.html:393** — Malformed SSE JSON silently `continue`d; corrupted events vanish with no log. **Fix:** `console.warn` the bad line in the catch (optionally surface a warning).
- [ ] **index.html:514-531** — Rapid mic taps create overlapping `SpeechRecognition` instances; stale transcripts. **Fix:** `rec.stop()`/`abort()` and null the prior instance before `new SR()`.
- [ ] **studio.html:1882-1883** — `ctx.resume()` in pointer/key listener unhandled (rejection warning). **Fix:** Append `.catch(()=>{})` to the `resume()` call.
- [ ] **studio.html:2229** — Send-level change while paused only updates the data model; jumps audibly on next play. **Fix:** Manage send gain nodes outside the live graph, or re-apply level on playback start.
- [ ] **editor.html:1149-1152** — WakeLock leaks if the export WebSocket fails before the inner try (finally never runs). **Fix:** Move WS creation inside the try, or release the wake lock in the outer error path.
- [ ] **bit16.html:558** — Platform collision tests only player center ±6, ignoring sprite width; clipping/missed landings. **Fix:** Expand the collision box to the rendered half-width (`atlas.cellW*charScale/2`).
- [ ] **bit16.html:488-495** — Broken world image (`naturalHeight===0`) yields Infinity/NaN parallax. **Fix:** Guard `world.naturalHeight > 0`; fall back to scale 1 when not finite.
- [ ] **bit16.html:372-388** — `/api/image` fetch has no timeout; "painting…" can hang forever with no cancel. **Fix:** Add an `AbortController` with a ~60s timeout and a timeout error message.
- [ ] **images.html:142-151** — Reference-image `FileReader` has no `onerror`; read failures fail silently (input still cleared). **Fix:** Add `rd.onerror` that shows a status message.
- [ ] **swarm.html:240-251** — `TextDecoder` never final-flushed; trailing multibyte char of last event can be lost. **Fix:** After the loop, `buf += dec.decode()` to flush.
- [ ] **swarm.html:238-240** — No `res.ok` check before `getReader()` on `/api/research-swarm`; HTTP errors surface as parse errors. **Fix:** `if (!res.ok) throw new Error('HTTP '+res.status)` before reading.

## Low

- [ ] **app.py:1593** — `studio_save` writes JSON without `indent=1`, inconsistent with all other save endpoints. **Fix:** `json.dumps(d, indent=1)`.
- [ ] **app.py:369-373** — `_unload_brain` `Popen` not waited/checked; VRAM may not free before FLUX loads. **Fix:** Use `subprocess.run(..., timeout=10)` and log on failure.
- [ ] **index.html:458** — `newChat()` calls `location.reload()` after already clearing state (flicker, drops in-flight requests). **Fix:** Rebuild the hello/UI in place instead of reloading.
- [ ] **images.html:265-267** — `strength` still sent in EDIT mode even though the control is hidden/meaningless. **Fix:** Only include `strength` in the body when `mode !== 'edit'`.
- [ ] **swarm.html:206-207** — `loadProviders()` not awaited in `saveProvider`; form closes before the list refreshes. **Fix:** `await loadProviders()` before closing the form.
