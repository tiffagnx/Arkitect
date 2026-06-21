# ARKITECT — First-Run Plan (the "download it and it just works" map)

**This file is the single source of truth for shipping ARKITECT to the public.**
When the hallway feels long, open this. It shows the whole flow, what's done, and what's left.
We build it **one piece at a time.** Nobody has to hold it all in their head.

---

## The whole flow, on one screen

A stranger downloads ARKITECT. Here is everything that should happen, start to finish:

1. **Unzip** the folder.
2. **Double-click START HERE.** (one action — that's all they ever do)
3. **It checks their computer** — how much graphics power (VRAM), how much RAM.
4. **It shows them the models their PC can actually run** — and recommends the best one.
   They pick one (or just take the recommendation).
5. **It downloads everything needed, automatically:**
   - Python · LM Studio · ffmpeg  (the plumbing)
   - the **chat/vision/reasoning model** they picked  (Tiff's brain)
   - the **builder model**  (the coder brain for Blueprint Builds)
   - **ComfyUI + an image model**  (the engine for Imagination Station)  ← *the big missing piece*
6. **ARKITECT opens** in its own window. It works. They never touched a setting.

That's the door at the end of the hallway. Six steps. Finite.

---

## Status — what's already built vs what's left

| Piece | State |
|---|---|
| Unzip + one-click START HERE | ✅ **done** (`START HERE.bat` → `setup-and-run.ps1`) |
| Detect GPU / VRAM / RAM | ✅ **done** (already reads the specs) |
| Auto-install Python | ✅ **done** |
| Auto-install LM Studio + start its server | ✅ **done** (server auto-start just fixed) |
| Auto-install ffmpeg (video/audio) | ✅ **done** |
| Auto-download a chat model | ✅ **done** — but it's the SAME one for everyone |
| Open in its own native window | ✅ **done** (`ARKITECT.exe`) |
| **Pick the BEST model for THIS computer** | ❌ **gap** — detects the PC, then ignores it. *Highest value.* |
| **Show a "pick a different model" list** | ❌ **gap** — the manual override screen |
| **Verify vision actually works, or fall back to text** | ❌ **gap** — the safety net that stops support calls |
| **Auto-download the builder/coder model** | ❌ **gap** — Blueprint Builds needs it; not pulled today |
| **Auto-install ComfyUI + an image model** | ❌ **gap** — Imagination Station. Currently hardcoded to your PC's path. *Biggest chunk.* |

**Plain version:** the LLM half of the chain is mostly built. The two real jobs left are
(A) make the model choice *smart per-PC*, and (B) make the **image engine (ComfyUI)** install itself
like everything else instead of assuming it's already on the machine.

---

## The model ladder (verified — what to auto-pick per PC)

🔧 tools · 👁 sees images · 🧠 reasons. Every 👁 below is confirmed to actually work in LM Studio.

| Their PC | Model | `lms get` key | Does |
|---|---|---|---|
| No GPU (CPU) | IBM Granite 4.0 H Tiny | `ibm/granite-4-h-tiny` | 🔧🧠 (no 👁 — can't on CPU) |
| 4–6GB | Ministral 3 3B Reasoning | `mistralai/ministral-3-3b-reasoning` | 🔧👁🧠 |
| 8GB | Gemma 4 E2B | `google/gemma-4-e2b` | 🔧👁🧠 |
| 12GB | GLM-4.6V-Flash | `zai-org/glm-4.6v-flash` | 🔧👁🧠 |
| 16GB | Magistral Small 1.2 | `mistralai/magistral-small-2509` | 🔧👁🧠 |
| 24GB+ | Magistral Small 1.2 (safe) / Gemma 4 31B (bigger) | `mistralai/magistral-small-2509` | 🔧👁🧠 |
| 32GB+ | Nemotron 3 Nano Omni | `nvidia/nemotron-3-nano-omni` | 🔧👁🧠 |

**The one hard rule for any 👁 model:** after download, confirm the image part loaded.
If it didn't, drop to text and tell the user — never fail silently. This is what prevents the "it doesn't work" calls.

> Keys still need a quick live-catalog check before shipping (most models are newer than Claude's training).

---

## Build order (one piece at a time — no need to do it all at once)

1. **Smart per-PC model pick** — use the VRAM it already detects to choose from the ladder above. *(small, highest value)*
2. **Vision safety net** — verify the image model loaded, else fall back to text. *(small, ships the trust)*
3. **Builder model auto-download** — pull the coder brain so Blueprint Builds works on a fresh machine.
4. **Manual "pick another model" screen** — the override, so nobody's ever stuck.
5. **ComfyUI auto-install** — the big one: make Imagination Station's engine install itself + grab an image model, instead of assuming your path. *(largest chunk — do last, on its own)*

Each line is its own small job. We knock them out in order. After each one, ARKITECT is more shippable than before — there's no "all or nothing."

---

## Notes / open questions (park them here so they're not in your head)

- Download size vs. all-in-one installer — decided per-tier; model is pulled on first run with a progress bar.
- Cloud-only users — should be able to skip the big local download entirely (a "just use cloud" path).
- Code-sign the .exe eventually (stops Windows SmartScreen warnings).
