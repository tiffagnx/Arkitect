# Front Door + Website — handoff (2026-06-22)

*This session owned the **front door** (`static/index.html`), the **For Creators / website** page (`static/join.html` = demartinlabs.com), and helper tooling. A **parallel session** owned native plugins → shipped **v1.6.0** (Win+Mac) — see `START_HERE.md` for that. The two don't overlap (different files).*

## Committed to master this session
- **Front door (`index.html`)** — **click-to-switch** the main chat: click the Tiff or Kit card → header avatar + name flip (TIFF↔KIT), card highlights, and `/api/chat` gets a `character` param. Cards now say **"drag · or click."** The **Wall easter egg** is back to a faint **round dot** by the logo (reveals "sign the wall" only on hover) — NOT a visible billboard; don't re-expose it.
- **Kit personality (`app.py` /api/chat)** — when `character=kit`, a directive rides the LAST user message (cache-safe, Tiff stays the base persona) telling it to answer as Kit: a **different personality** (blunt, builder-type), **NOT** build-task-pushy ("what do you wanna build?" was the bug — nobody builds in chat).
- **`keys.js`** — one "🔑 KEYS" window (curated cloud-brain + image/video providers, deep links, paste-back, local-only). Injected app-wide via `pinkroom-nav.js`.
- **`draw.html`** — Sketch Pad (vanilla port of heytiff's NapkinPad). ⚠️ Owner wants it **renamed** (not "Sketch Pad") + it's "not ready" — leave the name for now, he'll pick a new one.
- **`market.html`** — marketplace (owner soured on it earlier but it's **no-fake-safe**: the only hardcoded entry is him, explicit "NO fabricated people" guard; everyone else loads from the real `dmv_characters` store). Currently **orphaned** (nothing links to it).
- `feedback-buddy.js` + `pinkroom-nav.js` — wired `beats`/`draw` rooms + keys.js injection.

## Deployed LIVE to demartinlabs.com (gh-pages) this session
- **Beat Lab** showcase tile (uses `static/shots/beats.png`).
- Removed a leftover **dev note** from the CTA.
- Faint **Kit watermark** behind the hero (opacity .07).
- **3-second headline** `<h1>` ("A real creative studio. On your machine. Free.") — words are a placeholder, his to own.
- **Interactive readiness bar** — click the move-chips, it fills 0→100% (a real demo now, not auto-fill decoration) + added `prefers-reduced-motion`.

⚠️ **Every gh-pages redeploy MUST ship `CNAME` + `kit-hero.png` + `static/shots/*`** or the domain breaks / images 404. (Deploy = rebuild `index.html` from `join.html`, force-push to gh-pages of tiffagnx/Arkitect.)

## Pending (the page glow-up plan — research in memory `creator-page-glowup`)
1. **Re-sequence** the page — surface the screenshots + Boogie story + "no fake counter" honesty UP front (they're buried). Biggest fix, no rewriting.
2. **Put himself on it** — name the 25-yr engineer who built it (proof-by-work). ⚠️ **HIS CALL** — he's said "I'm just a guy"; ASK first.
3. **Real-app screen-capture loop** (4–6s muted DAW) > static PNG. Needs him to record. (A before/after canvas idea was KILLED — fabricated proof.)
4. **Mobile pass** — his real traffic is phones (producer shared to IG story); hero is a wall on 380px.

## NOT touched (on purpose)
- The **v1.6.0 release / tag / Mac build** — clean, shipped by the parallel session. My front-door changes are on master but **NOT in the v1.6.0 download ZIP** (release predates them). They'll ride the next release; a fresh `release.ps1 1.6.1` would fold them into the downloadable app if wanted.
- `START_HERE.md` — the parallel session's handoff; left as-is.
