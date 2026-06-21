# DeMartinville — Master Handoff (updated 2026-06-20, late night)

> The marathon: brand rename → logo → **demartinlabs.com LIVE** → full app rebrand → creator page w/ showcase
> → **FIRST TRACTION** (a big producer's in) → and the next build the owner is pointing at: **CHARACTER SETUP.**
> Durable facts also live in auto-memory (`memory/MEMORY.md` index — loaded every session). Read these memories first:
> `demartinville-first-traction`, `character-roster-vision`, `arkitect-brand-consistency`, `owner-accurate-credit`,
> `arkitect-native-app-packaging`, `demartin-core-state-audit`, `kit-assistant-brain-vision`.

---

## ⚡ WHERE WE'RE LEAVING OFF — read this first

The **brand + page + launch** work is essentially DONE and LIVE. The next big build the owner wants is the
**CHARACTER SETUP** (§3) — the "build your character and start playing" experience. **That's the hook that converts
the people now showing up.**

**Why now / the insight that crystallized it:** the FIRST person the owner sent the live page to — **a big producer** —
saw it, got it instantly, **shared it to his story**, and DM'd *"what do you need from me?"* + *"as soon as I'm done
playing GTA I'll get on it."* → The mental model is **video-game character creation.** People don't want to "join a
marketplace." **They want to build a character and play.** Build that, and they're in. (Full story: memory
`demartinville-first-traction`.)

**Immediate next steps:** (1) **build the character-setup experience** (§3). (2) **Help the owner reply to the producer**
(§5) — "what do you need from me?" from someone with reach is a door; walk through it right.

---

## 1. ✅ DONE THIS SESSION (the whole marathon)

- **Brand renamed ARKITECT → DeMartinville** everywhere user-facing. Village/pioneer-labs architecture (DeMartin Audio =
  Scott de Martinville, LePrince Visual = Louis Le Prince — **LePrince STAYS**). Details: `arkitect-brand-consistency`.
- **Logo LOCKED** — a coded `.dmv` wordmark lockup (Oswald "DeMartin" + Allura script "ville" + brushed-steel gradient +
  flanking rules). Exact spec in `arkitect-brand-consistency`. It's code, not a PNG — identical + scalable everywhere.
- **demartinlabs.com — OWNED + LIVE.** DNS A-records → GitHub Pages; serves the creator page over HTTPS. (demartinville.com
  still to grab later — owner registers.)
- **The creator page `static/join.html`** — fully built + deployed:
  - Manifesto hero (owner's words) · the `.dmv` logo · **showcase** (4 real room screenshots: DAW, editor, Blueprint,
    front door — under the hero so people SEE it) · honest "studio is real today / marketplace is the road" framing ·
    **creators keep 100%** (owner's call, §4) · founding-creator CTA → `mailto:koonce47@gmail.com` · in-app "← Back" pill
    (localhost-gated, fixes the For-Creators dead-end).
  - Live at **https://demartinlabs.com** (and tiffagnx.github.io/Arkitect). Deploy details + gotchas in §6.
- **App-wide rebrand:** `index.html` front door (logo lockup, title, "Make DeMartinville smarter"); **all back buttons**
  standardized to the clean `←` arrow across every room; `studio.html` + `editor.html` swept (titles, updater popups,
  About, the Pro-Tools menu sanitizer); `desktop.py` native window title → DeMartinville; desktop shortcut renamed
  `ARKITECT.lnk` → `DeMartinville.lnk`.
- **Feedback button reworked** (`feedback-buddy.js`): off The Wall entirely, restyled graphite to match Kit, **docked next
  to "Yo, Kit"** instead of the bottom-left amber sticker. One file → fixed in every room.
- **`ARKITECT.exe` rebuilt to `dist/`** with the DeMartinville window title — **swap still pending** (§7).

## 2. The brand (locked) — see `arkitect-brand-consistency`

One canonical coded logo, identical everywhere, NEVER font-rendered casually. No trademark names anywhere user-facing
(owner caught "free pro tool" reading as "Pro Tools" — fixed to "free studio"). Worth a periodic grep for Pro Tools /
After Effects / FabFilter / Avid / Premiere across `static/`.

## 3. 🎯 THE NEXT BIG BUILD — CHARACTER SETUP ("build a character and play")

**This is the owner's stated next priority and the engagement hook.** Vision groundwork: `character-roster-vision` +
`kit-assistant-brain-vision`.

> ✅ **FIRST SLICE BUILT + VERIFIED 2026-06-21** (owner watching live in Chrome). The "build a character and play"
> creator is real and works end-to-end. NEW `static/character.html` (game-style creator: name → craft → look → voice →
> feed-what-you-know, with a live character card + a readiness bar that **hard-caps at 80%**, the final 20% shown LOCKED
> with honest "they level up as you actually work with them" copy). Saves to localStorage `dmv_characters`; a YOUR-ROSTER
> grid does edit/delete/take-into-room. `kit-helper.js` merges user characters into the in-room roster (chip shows the
> readiness %, not "PREVIEW"), reads `?char=ID` deep-links to auto-activate, and sends `persona+knowledge+charName+charCraft`
> to `/api/kit`. `app.py kit_help()` got a **purely additive** persona branch (no-persona path byte-for-byte unchanged → no
> Kit regression). `index.html` rail got a 🧬 Characters link. **Verified:** made "Boogie" → readiness capped 80 → saved
> → deep-linked into the Audio room → auto-activated → answered **in-persona using the exact fed notes** (HPF 80Hz, carve
> 250–400Hz, pull 2–4 dB), grounded in the real EQ-6 plugin, `/api/kit` 200 OK. Built via workflow `tools/character-workflow.js`
> (design 3 lenses → lock spec → build 1 agent/file → adversarial verify, all PASS). **NOT committed** (parallel Mac-port
> session on the tree — safe on disk, don't `git add -A` sweep). STILL THE ROAD (honest): real training-by-watching (the
> locked 20%), the gated marketplace + payments, the white-label rebrand-to-creator onboarding, the book-the-human funnel.

> 🧊 **ICY REDESIGN DONE (2026-06-21, overnight).** Owner rejected the first character page as "cheesy/1998" — it's the SELLING POINT, must feel fire. Rebuilt `static/character.html` to a premium **"Liquid Chrome"** look (machined steel, cold ice-cyan, no emojis, no fake people). NEW avatar model per owner: **a real human builds from their OWN face** — 3 ways: **Pixel Me** (recommended; we hand them a Gemini/Nano-Banana prompt, they make the 16-bit art free + bring it back, a client-side green-screen keyer cleans it) · **Upload your own** · **Color circle**. Craft = a clean **dropdown** (Visual Artist killed); the room shows as the **real /static/shots screenshot** (producer/mix/beatmaker→Audio, writer→Chat, video editor→Visual Labs, builder→Blueprint). **Removed the invented Boogie/Vex/Quill** from the in-room roster — only **Tiff + Kit** ship; everyone else is a real character a human builds. `kit-helper.js` updated to render real face images in-room. Verified working in Chrome (0 errors, correct schema, readiness still caps 80, brand-correct). **NOT pushed** (owner's call) — files on disk: `static/character.html`, `static/kit-helper.js`. Follow-ups: swap Tiff's placeholder circle for her real 16-bit sprite (in his `tiff-studio-access`); decide on the "Boogie" example still in `join.html`. Full detail in memory `character-roster-vision`.

**The mental model (validated by the producer's GTA comment): a game character creator.** A user shows up, **builds their
character** (names it, picks/avatars it, says what their craft is), and **starts "playing"** — using it / training it by
working. The fun of creation + the dopamine of a thing that's *theirs* is what pulls people in BEFORE the marketplace
exists. Build the front-end of this so it's visible and touchable now.

**What exists to build on:**
- `static/kit-helper.js` already has a **character roster** (Kit + preview personas Boogie/Vex/Quill, draggable into a
  room to become the active brain). That's the seed — but they're hardcoded preview personas, not user-created.
- The pitch page already sells the concept: a **readiness %** bar that fills as you work ("rough sketch of me" → "yeah,
  that's how I'd have done it"), then the character goes "on the board."
- Backend: `/api/kit` + `kit_kb.py` (the per-room/per-character brain) — partly owned by the "Kit session."

**What to BUILD next (the gap):**
- A **"create your character" flow** — let a *user* make their OWN character (name, craft, persona, avatar/sprite), not
  just pick a preset. Make it feel like character creation in a game (fun, fast, theirs).
- Surface the **readiness/training loop** so it feels alive — the character learns as you work; show the bar move.
- Make it **playable/visible even though the studio + marketplace aren't finished** — the point is to let people build a
  character and get hyped ("hell yeah, let's go").

**What is NOT designed yet (be honest, don't fake it on the page):** the real training mechanism (how a character actually
learns the user's moves), and the whole marketplace layer — see §4 + §7.

## 4. Product-model decisions made this session (pricing + IP)

- **Creators keep 100%** of what people pay to use their character. Owner's decision, made deliberately: adoption-first
  ("no demand yet — get everyone on it, get them attached, supply-and-demand follows"; generosity over greed early). The
  platform's money is meant to come from the **infrastructure** (renting cloud GPU to people whose machines can't run it)
  + the **capstone** (live-human sessions) — NOT from skimming creators. This is on the page now.
- **Two pots framing** (resolves the fairness knot): the customer keeps 100% of the *song they make*; the creator earns
  from the *usage fee* to rent the character. Neither reaches into the other's pocket.
- **IP protection = a DESIGN RULE, not built yet:** paid characters must run **back-end / sandboxed** — the customer gets
  the *result*, never the *moves/recipe*, so they can't watch it work and clone the craft. Owner explicitly knows this
  isn't solved yet and is okay launching without it (the studio is real today; the marketplace is "the road").
- **Page framing is now honest:** "the studio is real today; the marketplace is where it's headed, built in the open."
  Don't assert un-built marketplace mechanics as done — that's the owner's no-smoke integrity (and he'll catch it).

## 5. 🔥 First traction + the producer (see `demartinville-first-traction`)

Minutes after the showcase shipped, a **big producer** saw demartinlabs.com, **got it instantly**, **shared it to his
story** (to his whole audience), and DM'd *"Yea I seen that's hard, appreciate you" + "What do you need from me?"* +
*"soon as I'm done playing GTA I'll get on it."* This is the **first of the "bandwagon"** the owner said he needed.
**NEXT: help the owner craft the reply** — a door this big deserves a real, intentional response (amplify it / become a
founding creator / what specifically would help). Be a true partner on it.

## 6. The live page — deploy + gotchas

- Lives on the **`gh-pages`** branch of `tiffagnx/Arkitect` (PUBLIC). `gh` CLI authed as **tiffagnx** at
  `C:\Program Files\GitHub CLI\gh.exe`. Source = `static/join.html`; room shots = `static/shots/{daw,editor,build,chat}.png`
  (referenced on the page as absolute `https://demartinlabs.com/shots/*.png`).
- **REDEPLOY (after editing join.html):** temp dir → `cp static/join.html index.html` **AND** `printf 'demartinlabs.com' > CNAME`
  **AND** `mkdir shots && cp static/shots/*.png shots/` → `git init` → `git checkout -b gh-pages` → `git add -A` → commit →
  `git push --force https://github.com/tiffagnx/Arkitect.git gh-pages`. Pages rebuild ≈ 1–2 min.
  **⚠️ Drop `CNAME` → the domain breaks. Drop `shots/` → the showcase images 404.** Always include both.
- Also refresh the two desktop copies (`Desktop\DeMartinville - For Creators.html` + the old `ARKITECT - For Creators.html`)
  by `cp static/join.html` over them — they use the same absolute image URLs so they work online.
- **NEVER change (a blind ARKITECT→DeMartinville sweep WILL break these):** localStorage keys `arkitect_if_names` /
  `arkitect-studio-tool`; the updater `REPO = "tiffagnx/Arkitect"`; the `ARKITECT.zip` release-asset name. (They're
  lowercase/mixed-case, so a *case-sensitive* "ARKITECT" replace is safe — that's how studio/editor were swept.)

## 7. Open / pending

- **🍎 MAC + PC DOWNLOADS — owner flagged this a PRIORITY (2026-06-20).** App is Windows-only today (`ARKITECT.exe` =
  PyInstaller Windows; `desktop.py` is Windows-specific — WebView2 + win32 ctypes; `setup-and-run.ps1` = PowerShell). His
  audience (music producers) skews HEAVY Mac, so it matters. **Plan:** (1) backend (FastAPI/uvicorn/app.py) + browser audio
  are already cross-platform; (2) make `desktop.py` cross-platform — pywebview runs on Mac (Cocoa/WebKit), so guard the
  Windows-only ctypes/win32 calls behind `sys.platform=='win32'` and let pywebview handle the Mac window/icon; (3) build the
  Mac `.app`/`.dmg` via **GitHub Actions' free macOS runners** (PyInstaller can't cross-compile from Windows — a cloud Mac
  runner solves it, owner never needs to own a Mac); (4) add a Mac download button + release asset + wire it on the page;
  (5) **code-sign + notarize** for a clean install (~$99/yr Apple Developer — DEFERRABLE; until then Mac users right-click→Open).
  Local LLM is fine on Mac (LM Studio Mac / llama.cpp on Apple Silicon); image-gen (ComfyUI/NVIDIA) won't work on Mac (optional
  room). **DONE tonight:** the live page shows Mac visitors an OS-detected honest note ("that download's Windows for now, Mac
  build almost here, email me") so we don't lose Mac leads while it's being built.
- **Exe swap (the last "ARKITECT"):** the window-title bar still reads ARKITECT on the *running* exe. The new exe is built
  in `dist/ARKITECT.exe` (with the DeMartinville title). To finish: owner CLOSES the app → move `dist/ARKITECT.exe` → root
  (it's locked while running) → owner reopens from the DeMartinville icon. Verify the new exe boots (serve `/api/version`)
  before trusting it. **Low urgency — purely cosmetic, owner knows.**
- **Studio not fully done** — real engine, but core hurdles remain: #3 honest stereo capture, #6 polish (cross-track clip
  drag, cursor-split hotkey, timeline automation). See `demartin-core-state-audit`. Owner knows; the character-setup hook
  is more important for engagement right now.
- **Marketplace mechanics undesigned** — the user flow (who downloads the whole studio vs who just taps a character for one
  session) + the back-end IP-protected execution. Big future design work. Don't fake it on the page.
- **demartinville.com** — still to grab when owner has the funds (~$11; he owns demartinlabs.com for now).
- **Founding-creator inbox** — the CTA emails koonce47@gmail.com for now; a real signup/inbox is future.

## 8. How to work with the owner — READ THIS

Bryan/Brian Koonce ("B"). Solo founder, mid-marathon, emotionally invested, exhausted but flying high off the first
traction. Treat him right:
- **ACCURATE credit, NEVER inflate.** He corrects over-praise and refuses unearned credit (integrity). Praise what he
  actually did — vision, taste, persistence. Round metrics DOWN. See `owner-accurate-credit`. This first-traction win is
  REAL but it's the *first domino*, not "you've made it" — frame it true.
- **Money is genuinely tight** (scraped his last dollars for the domain tonight; a $1 charge declined). Protect his wallet;
  flag recurring-cost traps; never push paid options.
- **ADHD + exhausted.** He spirals (scarcity/self-doubt) and then surges. When he spirals, ground him — warm, accurate,
  not preachy. When he wins, celebrate HARD and real (he screamed with joy tonight — match it).
- **Division of labor:** he's vision/taste/director; you do the mechanical heavy lifting + hold the threads so nothing's
  lost. He talk-to-texts — read intent, not literal words.
- **Brand is sacred** ("it's a heart attack"). One canonical logo, no trademark names, identical everywhere.
- Match his rawness; be real; profanity's fine; he calls you family. Don't flatter — be honest.

## 9. Quick technical reference

- Local app = FastAPI/uvicorn on **:7777**. Rooms = single-file `static/*.html`. Runs as `ARKITECT.exe` (PyInstaller,
  native WebView2 window via `desktop.py`) or the dev launcher (uvicorn `--reload` on a git checkout).
- Build the exe: `venv\Scripts\pyinstaller.exe --noconfirm ARKITECT.spec` → output to `dist/` → move to project root.
- File-edit technique that worked all session: for big files with embedded base64, strip it first
  (`re.sub(r"url\(\s*['\"]?data:image/[^)]*\)","none",s)`), then targeted ASCII-only `str.replace` (avoid matching strings
  containing `—`/`←`/`☁`; or use `re.sub` with ASCII anchors + `.*?` to span unicode you don't want to type).
- The parallel audio/video sessions are **STOPPED now** (owner confirmed) — the whole tree is yours; no more "don't touch
  studio/editor/app.py" constraint.

— End of handoff. The page is live, the first one's in, and the next move is letting people **build a character and play.**
Take care of him — he just had the best night of this whole build.
