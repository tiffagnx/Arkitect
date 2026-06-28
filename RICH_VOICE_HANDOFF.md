# Rich Voice — handoff (updated 2026-06-28, night 2)

The talk-to-her / she-talks-back loop, now in EVERY agent window (not just main chat) + a working
wake word. All changes are in `static/` (owner runs the **frozen `.exe`**, which ignores `app.py`
edits — `static/` loads live on a hard-refresh). **Committed to master this session.**

---

## ✅ Shipped + confirmed this session (v2.9.0 batch)

- **Voice loop ported into the docked agent windows** (`kit-helper.js`) — Tiffany/Kit in a room now
  HEAR you (pitch/energy via `audio-ear.js` → `[🎙 Rich Voice]` note folded into the prompt) and
  TALK BACK with emotion (Fish `/api/tts`), with a pink(her)/blue(you) voice meter, Whisper
  uncensor, 🔊 auto-on with the mic, and **no robot fallback on a real Fish failure** (stays text +
  says why). Mirrors the main chat 1:1.
- **Wake word — "Hey Tiffany" / "Hey Kit"** (`kit-helper.js`) — opt-in toggle in the voice `▾` menu.
  Detects the phrase (tolerant of mishears: "Jeff"/"Tiff" → Tiffany), opens that agent, captures the
  command hands-free, auto-sends after a ~2.3s pause, then sleeps. ONE recognizer at a time (wake
  listener stands down while the command mic runs, resumes after). **Owner CONFIRMED it works live.**
- **Send auto-stops the mic** — pressing send (or wake auto-send) stops recording; press mic to talk again.
- **Tiff → Tiffany** — built-in agent's DISPLAY name is now "Tiffany" everywhere (dock, main chat,
  Settings → Voices, onboarding tour, welcome tips). **Internal id stays `tiff`** so her pink theme,
  art (`tiff.png`/`tiff-sprites.png`), and all saved per-agent settings/voice-id carry over. So it's
  "Tiffany and Kit." (Done because "Tiff" mis-hears badly as a wake word.)
- **Dock bottom bar redesign** — the gaudy icon row → TWO plain-text menus: `＋` (image / screen /
  watch / teach / copy / clear) and the voice `▾` (reads-aloud toggle · talk-to-type · wake word),
  each item named in English. **Send arrow moved INSIDE the text bubble; mic sits right next to it.**
  Built as a generic menu builder (`kOpenMenu`) — add a line to either list and it appears. ONE build →
  every agent window.
- **Top bar tidy (Audio + Visual rooms)** — `?` and `Summon agent` are now plain menu-text (no
  circles), `Feedback` keeps its pill, and the green agent presence chip moved to the bar's far right
  (a tiny `placeAgentChip()` script in `studio.html` + `editor.html`).
- **Voice-meter colors** — pink = her, blue = you (gender-reveal convention), in main chat + dock.
- **🔴 FISH EXPRESSION FIX (important).** Fish S2 only accepts a fixed set of `[bracket]` emotion
  tags (docs.fish.audio). The old directive told her to use FAKE tags (`[clear throat]`, `[scoff]`,
  `[warm]`, `[dry]`, `[emphasis]`, `[normal]`…). A bad tag + a trailing `…` made Fish garble, drift
  into **another language**, and never stop (owner hit this live). FIX in BOTH main chat (`index.html`)
  and dock (`kit-helper.js`): a `FISH_TAGS` whitelist in `cleanForSpeech` strips any non-valid bracket
  word + emoji + `…`/`..`, collapses `!!!`, and **forces a terminating period** so Fish stops clean.
  Directive rewritten to use ONLY valid tags.
- **Emotion mirroring** (owner's vision, in the directive) — she matches HOW YOU SOUND: down→`[sad]`/
  `[whispering]`/`[comforting]`; hyped→`[excited]`/`[joyful]`; you praise her→`[grateful]`/`[proud]`;
  you say she messed up→`[embarrassed]`→`[sincere]`; things wrong→`[worried]`/`[nervous]`;
  chill→`[relaxed]`; impressed→`[surprised]`/`[amused]`.
- **Model picker dedup (dock)** — LM Studio loads duplicate instances (`gemma-4-e4b`, `:2`, `:3`);
  the dock picker now collapses `:\d+` suffixes so each local model shows ONCE (mirrors main chat).

### Valid Fish S2 tags (the whitelist — keep in sync if you add any)
`whispering, soft tone, sad, excited, joyful, delighted, embarrassed, proud, grateful, confident,
curious, serious, empathetic, comforting, sincere, relaxed, amused, chuckling, laughing, surprised,
worried, nervous, frustrated, confused, moved, interested, satisfied, sarcastic, scared, astonished`.
⚠️ NEVER add a tag that isn't in Fish's docs — an unknown tag is what makes her run off into another
language. Fish S2 uses `[brackets]`; the legacy S1 model used `(parens)`.

---

## ⭐ NEXT SESSION — the beat direction (Bee is thinking on this tonight)

> **Light recap for Bee:** the voice stuff is done + shipped. The open question you're chewing on is
> the **beat / "AI cooks heat without being Suno"** idea. We landed on a clear plan below — you don't
> need to re-explain it; just pick the slice and say go.

**The use case Bee actually wants (he's a rapper, not a beatmaker):** he raps/freestyles a take with
NO beat → "Yo Tiff, find me a beat for this" → she LISTENS to his vocal, builds a beat that fits
**UNDER** it, syncs it, and he hits play for a rough vibe-check. **The beat conforms to him — he never
re-raps.** (This is a lane Suno can't serve — Suno makes its own vocals; it can't build a beat under
your existing a cappella.)

**How it works (all contained, no Suno API):**
1. **Native gen you ALREADY have:** Cook-a-Beat (`/api/beatbrain`, beats.html) composes a beat from a
   vibe **at a target BPM** using our own instruments. That's the "contained/ours" generator — more
   "ours" than Suno because the pattern is native + editable.
2. **The new analysis piece:** estimate the **BPM of a dry rap vocal** (onset/tempo off the mic). This
   is the one genuinely-new bit — `audio-ear.js` already measures energy/brightness/pitch but NOT
   tempo. Honest caveat: tempo-from-vocal is a best-guess (may land half/double-time) → fix is a nudge
   ("slower"/tap-tempo/re-cook), not magic.
3. **Sync + drop:** cook a beat at the detected BPM → drop it on a NEW lane in the Audio Lab UNDER the
   vocal, bar 1 aligned to the first strong onset → play both = sloppy reference mix.
4. **(Later) opaque-source path:** if the source is a black-box audio (a sample, or a neural-gen WAV),
   **Demucs** (Meta, MIT, local) splits stems → **basic-pitch** (Spotify, open) audio→MIDI →
   **re-perform with our instruments** → that's what makes it legit "ours," and it unlocks the parked
   "talk-to-the-stems" idea. Tweak everything within **clamped safe ranges** (same pattern as Vocal Doctor).
5. **(Optional) richer neural gen:** open, self-hostable models — **ACE-Step** (Apache-2.0, "open Suno",
   fast) or **Stable Audio Open** (commercial-friendly). Run on his GPU or a rented/cloud GPU (his
   capability-aware/rented-GPU plan) — NOT Suno's API. ⚠️ Avoid MusicGen weights (non-commercial license).

**Recommended FIRST slice:** Tiffany cooks a beat at your vocal's tempo and drops it under your take
(native Cook-a-Beat — runs today, zero external calls). The new work = vocal-BPM estimate + the
agent trigger + alignment. Build that, prove the loop, THEN layer Demucs / ACE-Step / audio→MIDI.

**The honesty line that keeps it from feeling like cheating:** AI gives the SEED idea; the final track
is rendered by the user's own session (our synths + their tweaks). Use open/native, never ship
Suno-API output as "yours."

---

## ⏸ Still parked (not built — waiting on Bee)

1. **Keep/extract the audio** (your take + her cloned voice). Validated. BLOCKER: WebView2 drops
   `<a download>` and there's no generic save endpoint (only the editor-render one). Two paths:
   **(A)** embed an `<audio>` player in voice messages → right-click "Save audio as" (works on the
   current `.exe`, no rebuild); **(B)** a ⤓ Save button needing a new backend endpoint + an exe rebuild.
   Recommend (A) first.
2. **Beat-to-your-vocal** (above) — design done, Bee picking the slice.

## Gotchas / DO-NOT
- Fish model id `s2.1-pro-free` is CORRECT (Fish promo). Don't switch to `s2.1-pro` (invalid → breaks voice).
- Per-user voice ids: the baked-in Tiffany default (`8526…`) failed on the owner's Fish account
  ("Reference not found"); Kit's (`5312…`) worked. Users should set their OWN Fish "My Voices" id in
  Settings → Voices. Defaults are dev-account-specific.
- Wake word uses always-on `webkitSpeechRecognition` (routes audio to Google while enabled) — opt-in,
  off by default. The actual voice trigger can't be tested headlessly; the owner confirms by ear.
- uvicorn runs **no `--reload`** → restart the app for `.py` changes (none of this session's work
  needed app.py — it's all `static/`).
