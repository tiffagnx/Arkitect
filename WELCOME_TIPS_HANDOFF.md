# Welcome-screen TIPS — agent-aware + personal — HANDOFF

**Date:** 2026-06-25 night · **Status:** BUILT + verified live · **UNCOMMITTED** (leave for the owner's batch)
**Scope:** ONE file — `static/index.html`. Frontend-only. **No `app.py` / backend touch** (other sessions are in app.py).

---

## The ask (owner, in his words)
The rotating tip line in the main chat "always says something about Tiff." He wanted it to:
1. Say tips about **whoever you're talking to** — switch to Kit → Kit tips; Tiff → Tiff tips.
2. Still cover **everything else on the whole site** (the rooms/features), regardless of agent.
3. When a user **builds their own agent**, get tips that **know their name** and feel personal.
4. "Don't just guess — go through the whole thing and tell them the right thing." → tip content was written by reading the actual rooms, not invented.

## What was the problem
`static/index.html` had a single static `ARK_TIPS` array (~line 1148) where **every tip hardcoded "Tiff"** — the `#arkTag` hero tagline that rotates every 12s on the welcome screen.

## What got built (all in `static/index.html`)
Replaced `ARK_TIPS` with three pools + a weaver (search `AGENT_TIPS` to land on it, ~line 1158):
- **`AGENT_TIPS[tiff|kit]`** — tips about the active agent. ~4 each, accurate to each one (Tiff = vibe/words/Research/Write; Kit = specialist/Berner Builder/God Particle).
- **`SITE_TIPS`** — 12 tips covering the whole site, true no matter who's active: DeMartin Audio Labs (Vocal Doctor), Leon Production Labs, LePrince Visual Labs, **The Stream (Notifi · Cratel)**, Imagination Station, Berner Builder, Memory (Local ⚡ / Knowledge 📚), Voice, Attach, Build-your-own (＋ tile), Cloud, Private.
- **`personalTips()`** — reads the user's own agents from `localStorage.dmv_characters` (built in `character.html`). If they have any, emits tips that **name them** + route them to the right room via `CRAFT_ROOM` (producer/mix→Audio Labs, beatmaker→Leon, editor→LePrince, builder→Berner, writer→Write tab). Tagged with a 🌟 `who` label vs 💡 for the rest.
- **`weaveTips([agent, personal, site])`** — round-robin so the active agent + your own people surface first/often; daily offset (`new Date().getDate()`) keeps site tips fresh.
- **Swap-on-switch:** `setChatBrain()` (~line 737) now calls `startArkTips(true)` on a real agent switch → tip flips live to the new agent (skip-intro so it's instant).
- **Rebuild-on-create:** listens for `dmv-characters-changed` → re-runs `startArkTips(true)` so a freshly built agent shows up without reload.

## Verified (Claude Preview, on `/static/index.html`)
- Tiff active → "💡 Tiff — Tiff is your all-rounder…" leads. ✅
- **Real click on the Kit tile** → `activeBrain` flips to `kit`, tip becomes "💡 Kit — Kit is the specialist…"; click back → Tiff. ✅
- Injected throwaway agent "Boogie / beatmaker" → "🌟 Boogie is your beatmaker. Drag them into Leon Production Labs…" — **test data was removed after** (no fabricated content shipped). ✅
- No console errors. Screenshot taken (💡 TIFF badge + tip).

## Known limit / clean next step (NOT done — optional, owner's call)
Custom agents are **not yet selectable in the MAIN chat switcher** — `setChatBrain()` is hard-locked to `'tiff'`/`'kit'`, and the main chat sends `character: activeBrain` as a plain string. Custom agents currently only run as a brain in the **in-room roster** (`kit-helper.js`, which passes persona/knowledge). So the personalization **names them and sends them to their room** rather than pretending you can chat them in the main window (honest).
- To make them fully selectable in the main switcher: unlock `setChatBrain`, surface `dmv_characters` in `renderShelf()`, and have `send()` pass the custom persona/knowledge to the backend — **that needs `app.py` work**, so it was deliberately left out tonight.

## ⚠️ Coordination
- `static/index.html` was **already `M`** (dirty) from the warm-handoff session before this work — this change is **additive** on top of theirs. Don't blind-`git add -A`; if committing later, the owner batches all sessions together.
- Per [[parallel-session-coordination]]: not committed, not pushed, not deployed. Pick up tomorrow.
