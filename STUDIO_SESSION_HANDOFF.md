# Studio + Front-Door session handoff (2026-06-22) — shipped v1.7.0

*This session owned the **front door** (`static/index.html` + `tec-mascot.js`) and the **Studio DAW** (`static/studio.html`). A parallel session owns native-plugins / `START_HERE.md` (v1.6.0) — left untouched.*

## Front door (`index.html`, `tec-mascot.js`)
- **Click-to-switch** the main chat: click the Tiff/Kit card → header avatar+name flip, message avatar shows **T/K**, `/api/chat` gets a `character` param (Kit answers blunt/builder, Tiff creative — cache-safe).
- **Character shelf** at the top (the marketplace seed): "CHARACTERS" band with Tiff, Kit, **+ Build your own** — shown on the welcome screen, **collapses to a compact switcher** in the top bar once you're chatting. Cards pulled out of the center. ("Characters" removed from the sidebar More menu.)
- **Per-character THEME flip** on switch: Tiff = **pink**, Kit = **blue** (`--pink` + `--accent2` swap → all buttons/accents re-tint), plus a **color flash** + a **sound** (`charDing`/`charFlash`) — Tiff's tone lifts, Kit's drops. Theme flips on switch (boots in default teal — could default to pink later).
- **Tiff is animated:** `tiff-sprites.png` (9 frames, owner-made on Nano Banana, transparent). `tec-mascot.js` is now per-character (`window.setMascotChar`), Tiff fps slowed to 1.6 (the 9-frame loop). Kit = `kit-sprites.png`.
- Wall easter-egg = a small round dot by the logo (don't re-expose).

## Studio (`studio.html`) — see memory `studio-bounce-spindown-session`
- **🔴 Bounce FIXED + owner-verified** — WebView2 was silently dropping the detached-anchor blob download; now appends to DOM + WebView2-detect + backend-write fallback so a file always lands.
- **"Bounce Down"** rename (dialog + `pt-menus.js` menu, flattened to `File ▸ Bounce Down…`). **Choose-folder** works (File System Access API).
- **Multi-clip Shift+select** → Bounce "Selected clips · N" (mutes the rest for the render).
- **DeMartin Spindown** replaced trademark "Vari-Fi" — `fxSpindown` varispeed with curve/momentum/target + character (sat/darken/wow/flutter/fade). v1 = AudioSuite sliders; **v2 TODO = the custom plugin card + live curve preview + AI brain** (spec in workflow `wxk3ajhdb`).
- Clip **dB scales the waveform**; **cut+fade glitch** fixed (clamp fades to clip length).
- **Toolbar reordered** (Transport↔Tools, Tempo↔View).

## Pending / next
- **Spindown v2**: the custom plugin card (live rate-curve preview) + the AI-brain smart-baseline (per the spec). Plus the advanced params (tempo-sync, zone, vinyl/hum, wet-dry) the v1 slider version skipped.
- **Front-door**: the character shelf is the marketplace seed — search + scroll as the roster grows (owner's idea, deferred).
- Front-door changes are in the app ZIP; the website page (`join.html`) is the marketing page (unchanged this session).
