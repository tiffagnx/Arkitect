# DeMartinville — Launch Kit
*Drafted 2026-06-25. Researched real channels + fact-checked against the actual product (no invented features). The maker takes $0; everything below is honest about what ships vs. what's roadmap.*

> ⚠️ **The repo's current `README.md` is STALE** — it still says "ARKITECT," calls Tiff "the AI," lists a `bit16.html` room that doesn't exist, and claims "no API keys, no cloud." It contradicts the product. **Replace it with the README below.** (Say the word and I'll drop it in.)

---

## 1. README (paste-ready)

```markdown
# DeMartinville

**Cancel Pro Tools. Cancel Melodyne. Cancel FL Studio. Cancel After Effects.**

It's all free here.

I'm a vocal engineer — 25 years behind the console, real records, real artists. I got
tired of watching broke artists get priced out of the tools they need to make their stuff.
So I built the studio I wish they had, and I'm giving it away. No subscription. No account.
No middleman taking a cut. It runs on **your** machine, and your audio stays on it.

Free. Open source (MIT). Read every line if you want — nothing's hidden.

> **Try it in your browser right now — nothing to install:** [demartinlabs.com](https://demartinlabs.com)
> (The browser version runs the core rooms + AI. The full feature set is the desktop download — see *The honest part* below.)

---

## What it is

An AI creative studio that runs on your own computer — Windows `.exe`, Mac `.app`, and the
core rooms in the browser. I take **$0**. No subscription, no upsell, no account wall.

It's an indie project, early and rough. 13 releases in, zero stars so far. I'm not hiding
that. The work is the proof — go touch it.

---

## The rooms

**🎙 DeMartin Audio Labs** — a real Pro-Tools-style DAW in your browser. Record, edit, mix,
master. Actual native plugins: EQ, compressor, de-esser, saturator, reverb, slap/tape delay.
**Vocal Doctor** is a one-click vocal chain that *measures* your take, sets a safe starting
point, and shows you the before/after numbers — not vibes. There's a Melodyne-style pitch
editor too. Bounce to WAV or MP3.

**🎛 The Kitchen (Beat Lab)** — an FL-Studio-style beat maker. 808s, synths, step sequencer,
piano roll, mixer + FX, .wav export. There's an AI brain in every plugin if you want one.

**🎬 LePrince Visual Labs** — an After-Effects-style video editor. A large effects library
(120+), keyframes, masks, MP4 export.

**🖼 Imagination Station** — AI image and video generation. Bring your own key (pay-as-you-go
on your own account). Nothing runs without your key — no model is bundled.

**🤖 Agent Forge** — build your own AI agents and feed them your own craft notes.

**📡 The Stream** — publish music and video in-app. Artists keep **100%** — the "Support / Buy"
button links straight out to *your* Cash App, PayPal, or Ko-fi. I never touch the money,
because there's no money to touch. No accounts.

**Tiff + Kit** — two AI helpers you **drag into any room**. Tiff's the laid-back artist,
Kit's the technical robot. They actually **hear** your audio (real measurement), **act** on it
(safe, clamped mixing moves — a 25-year engineer set the guardrails), and **prove** what they
did with measured before/after numbers. The AI is **optional**. The studio works fully without it.

---

## How it's free

Because I'm a working engineer, not a startup — and artists are broke. I know, because I am one.

- **$0.** No subscription, no upsell, no "pro tier."
- **No account.** Nothing to sign up for. No email capture.
- **Open source, MIT.** The code is public. Nothing to monetize, no catch to find.
- **Runs on your machine.** Your audio and your projects stay on your computer.
- **AI is bring-your-own-key and optional.** Use a free local model, a free cloud key, or
  your own frontier key. Or use none — the studio still works.

There's no catch because there's nothing to sell you.

---

## The honest part

I'd rather tell you the warts myself than have you find them.

- **The Mac app isn't code-signed.** Signing costs $99/yr I'm not charging you for, so macOS
  throws a scary warning, and on newer M-series Macs it may not open from a double-click at all.
  **The fix: just use the browser version** ([demartinlabs.com](https://demartinlabs.com)) —
  nothing to install, no warning. On older Macs there's a one-time right-click → Open / Terminal
  `xattr` step.
- **The browser version is the core, not the whole desktop app.** Chat and every room's AI
  brain run in-browser, but full Studio save/load + MP3 export, the video editor's media
  import/MP4 export, and native VST/AU plugin hosting live in the desktop download. (My own
  built-in plugins work everywhere.) If you want the complete thing, grab the desktop build.
- **The AI is optional + BYO-key.** No frontier model is bundled, and a local model is slow on
  a weak / no-GPU machine. The AI is a second set of ears — not the engineer. It does the boring
  technical pass so you start from a real place instead of a blank one. It can't mix your record.
  It doesn't know your intent. You do.

---

## Get it

- **Try it free in your browser:** **[demartinlabs.com](https://demartinlabs.com)** — zero install
- **Download (Windows `.exe` / Mac `.app`):** [GitHub Releases](https://github.com/tiffagnx/DeMartinville/releases)

Mac builds (Intel + Apple Silicon) attach automatically to each release.

---

## Who built this

One person. A vocal-mixing engineer, 25 years in, with real credits — mixed for regional rap
artists, opened for major acts, toured Texas. Built the whole thing solo with Claude, because
the artists I work with shouldn't have to bleed $30–80 a month to Avid, Adobe, Image-Line, and
Celemony just to make their music.

Keep your setup. But if you're paying rent on tools every month, try canceling one and see if
this covers it. WAV/MP3 in, WAV/MP3 out — it plays nice with whatever you've already got.

It's free. It's open. It's real. Go make something.

**License:** MIT — do what you want with it.
```

---

## 2. 60-Second Demo Script (record the BROWSER version → sidesteps the unsigned-Mac wall)

**The whole thing lands or dies on the before/after numbers being visible and legible. Hold on that readout 2–3 full seconds. Use the ACTUAL number the dock outputs — a faked number is the one thing this audience never forgives.**

- **0:00–0:05 — Cold open, no logo.** Raw harsh vocal plays ~2s. *"This is a raw vocal. No EQ, no compression, nothing. Listen — it's harsh, it's spitty."*
- **0:05–0:12 — It's a real DAW.** Pan across the channel strip / meters / waveform. *"This is a full studio. Record, mix, master — real plugins. Runs right in the browser. Nothing to install."* Caption: `Real DAW · runs on your machine · $0`
- **0:12–0:20 — Drag the helper in.** Grab Kit, drag onto the vocal track, drop. *"Now watch. I drag my helper onto the vocal."* Caption: `These hear your audio — for real`
- **0:20–0:30 — ⭐ Plain English.** Type: **"fix it — it's too harsh."** The chain populates live (HPF → EQ → de-ess → comp → light saturation, verb send). *"I just tell it what I hear. It built the chain — the same moves I'd make by hand."*
- **0:30–0:42 — ⭐⭐ The proof.** The dock prints the real before/after numbers. **HOLD 3 SECONDS.** *"Here's the part nobody else does. It shows you the numbers. Measured. Before and after. It's not guessing — it measured your take and it's proving exactly what it changed."* Caption: `It PROVES every move. Meters, not vibes.`
- **0:42–0:50 — Play the result.** Same vocal, processed, ~3s. *"Same vocal. Smooth, sits right. And every move stayed inside the guardrails a 25-year engineer set — it can't over-cook it."*
- **0:50–0:57 — The line.** *"I'm a vocal engineer. 25 years. I built the studio I wish broke artists had, and I'm giving it away. Cancel Pro Tools. Cancel Melodyne. It's free here."*
- **0:57–1:00 — Punch + link.** Full-screen URL. *"demartinlabs.com. Try it in your browser right now."*

---

## 3. Post Copy

### Channel 1 — r/SideProject (Reddit)
**Title:** I'm a 25-year vocal-mixing engineer. I built a free, open-source Pro Tools / Melodyne / FL / After Effects so broke artists don't have to pay rent on their tools.

I'm 47, live rural, mix vocals for a living — about 25 years of it (regional rap, opened for some bigger acts, toured Texas). The artists I work with are broke, and watching them get squeezed every month by Avid, Adobe, Image-Line, and Celemony just wore me down. So I built the thing I wish they had.

It's called DeMartinville. Runs on your own machine, MIT open-source, and I take $0 — no subscription, no account, nothing to sign up for.

What's actually in it right now:
- A Pro-Tools-style DAW — record, edit, mix, master, real plugins (EQ, compressor, de-esser, saturator, reverb, tape/slap delay), bounce to WAV/MP3
- A "Vocal Doctor" one-click vocal chain that *measures* your vocal, builds a safe chain from it, and shows you the before/after numbers — not vibes
- A Melodyne-style pitch editor
- An FL-style beat maker, an After-Effects-style video editor, and a couple AI helpers you drag into a room

Honest catches, up front:
- It's early. 13 releases in, **zero stars so far.** No traction yet — not gonna pretend otherwise.
- The Mac app is **unsigned** (signing's $99/yr I'm not charging anyone for), so Mac throws a scary Gatekeeper warning, and on newer M-series it may not open from a double-click. **Or just run it in your browser — nothing to install.**
- The browser version is the **core rooms + AI**; full Studio save/load, MP3 export, and the video editor's MP4 export are in the desktop download. Not hiding the split.
- The AI is **optional and bring-your-own-key.** The studio works fully with no AI at all.

Try it in the browser, no download: **https://demartinlabs.com**

The question I actually need answered: if you opened the audio room and tried to mix one vocal — where did it confuse you or feel broken? I'm a one-man shop and I can't see my own blind spots. Rip it apart.

### Channel 2 — KVR Audio (Hosts & Applications sub-forum)
**Title:** Free + open-source (MIT) browser/desktop studio — looking for DSP feedback on the vocal chain

Long-time vocal engineer here (~25 years, mostly rap/vocal work), first time posting a tool of my own. I built a free, open-source studio — runs in the browser and as a desktop app — and I'd rather show it to people who'll actually poke at the DSP than people who'll clap politely.

Why free / why open: I'm not a startup, there's no business model. The code's public (MIT), it runs on your own machine, no account, no telemetry. I built it because the artists I work with can't keep paying monthly for Avid + Celemony + Image-Line + Adobe.

The audio room is real Web-Audio DSP, not a wrapper:
- Native plugins: 6-band EQ, de-esser, compressor, saturator, slap/tape delay, reverb
- Bounce to WAV/MP3 (MP3 via an ffmpeg backend on the desktop build)
- A Melodyne-style pitch editor

The piece I'd most like eyes on is the **"Vocal Doctor"** — a one-click vocal chain. It runs an actual measurement pass on the vocal, then builds HPF → EQ → de-ess → compression → light saturation + a reverb send from that measurement, and every macro is **clamped to a safe band** so it can't over-cook. It re-measures after and reports the real before/after change per band.

Straight about the limits: it's early and indie (zero stars, I'll own it), the Mac desktop build isn't code-signed yet (browser version sidesteps that), and the AI helpers are optional + BYO-key — none of that touches the DSP, which runs with no AI at all.

Try it in-browser, nothing to install: **https://demartinlabs.com**

Real question for this room: does the clamped/measured approach to an auto vocal chain hold up, or are the bands too conservative / too aggressive? Where would *you* let it move more, and where would you lock it down harder?

### Channel 3 — Short-video caption (TikTok / Reels / Shorts)
I'm a vocal engineer — 25 years behind the console. I got tired of watching broke artists pay monthly rent on Pro Tools, Melodyne, FL, and After Effects just to make a song. So I built a free one.

Runs on your own machine. Your audio never leaves your computer. Open source, no account, no subscription — I take $0. It's a real DAW: record, mix, master, real plugins, a one-click vocal chain that shows you the before/after numbers instead of just promising.

Real talk: it's early (literally zero stars right now), and the Mac app isn't signed yet so it throws a warning — but you can run the whole thing in your browser, nothing to install. AI's optional too — works without it.

Link in bio → demartinlabs.com. Try it on one vocal and tell me in the comments where it tripped you up. I built this solo and I'm fixing it live based on what y'all break.

`#mixing #vocalengineer #musicproduction #homestudio #indieartist #freeplugins #protools #foryou`

---

## 4. Where to post — the order (tested cheap → spend the one-shot venues last)

**The play:** dry-run on **r/SideProject** → use what lands to craft the **Show HN** → go helpful-first in **r/makinghiphop** (your actual people) → then **KVR / REAPER / r/audioengineering** as a craftsman showing work.

1. **r/SideProject** (~250k) — ★ best first move. Its whole purpose is "I built a thing." Zero-stars admission is a *trust asset* here. Lowest-risk first impression; harvest the wording that lands.
2. **Hacker News — Show HN** — overindexes on open-source + runs-on-your-machine + privacy. Title must start `Show HN:`, URL in the URL field, backstory in the first comment, **zero marketing language**, reply to everyone. You get one good shot — do it *after* the r/SideProject dry run.
3. **r/makinghiphop** (~500k) — your actual people (broke rap/hip-hop producers). Give-before-you-take culture: answer a few "how do I make my vocals sit?" questions as the engineer you are, *then* mention the tool. Helpful-first, tool-second.
4. **KVR Audio — Hosts & Applications** — built around free/indie audio devs; they'll poke the DSP (your plugins are real). Show work to peers, stick around to answer.
5. **Cockos REAPER forum + r/Reaper** — the most ideologically aligned crowd (already chose the anti-Avid path). Frame it as kin to REAPER's philosophy.
6. **r/audioengineering** (~645k) — strict; weekly threads only, helpful-first. The measured/clamped vocal chain is a genuinely interesting talking point here.
7. **r/musicproduction + its Discord** (~452k) — broad bedroom-producer base; Discord lets you have ongoing convos, not a one-shot.

**Avoid / handle with care:** Product Hunt (pay-to-win, VC-dominated — skip for now), Lobsters (invite-only), r/programming (off-topic, strict). **Universal rule:** never drop a bare link to a main feed — the post must be worth reading even if nobody clicks. Your edge everywhere = **25-yr engineer + $0 + open-source + runs-on-your-machine**; lead with the human and state the caveats (unsigned Mac, BYO-key) yourself.
