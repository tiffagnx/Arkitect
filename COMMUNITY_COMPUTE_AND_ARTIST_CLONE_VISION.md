# DeMartinville — New Features Vision
*Captured 2026-06-23 late night / early morning session*

---

## What Was Described Tonight (verbatim intent, cleaned up)

Three interconnected features that extend DeMartinville from a solo AI studio into a community platform:

---

### 1. Community Compute Pool

**The idea:** A group of people (a crew, a community) pools money to rent a shared GPU/cloud instance together. Everyone chips in a small amount per month. Everyone gets access to top-tier AI models — the kind that would cost $20+/month per person if each person paid individually — for maybe $3–5/month each because they're splitting it.

**Two paths:**
- **Individual path** — bring your own API key, run locally, or rent your own compute. Cheap or free depending on what you already have.
- **Pool path** — click "Join the Pool" inside the app, get added to a shared compute instance with your crew, split the bill, everyone gets the good shit.

**Why it matters:** Not everyone has a good computer. But if ten people in a group chat put in $4 each, they can rent a serious GPU and run top-tier Claude, image models, everything — and it runs "like a motherfucker" for all of them. The app handles routing their requests to the shared endpoint. Nobody has to think about infrastructure.

**Who the admin is:** Whoever sets up the pool. They probably get free access or a discount as compensation for managing the instance.

**Key:** The platform doesn't charge for this. Users choose to pool together. DeMartinville just provides the UI and routing.

---

### 2. Artist Style Training (the LLM side)

**The idea:** A rapper (or any artist) uploads their lyrics, songs, and isolated vocal stems. An agent analyzes everything:
- Rhyme schemes and syllable patterns
- Flow cadence and delivery timing
- Subject matter, vocabulary, metaphor style
- Structural preferences (how they open, close, build a verse)
- Beat energy and tempo preferences
- What makes them *them* — the shit that's hard to articulate but obvious when you hear it

The agent gives them real feedback: "This is your style. This is what it sounds like. Here's what's consistent across everything you've made."

Then the artist works *with* the agent to fill in the gaps — tell it things the audio alone can't capture. After that, the agent can write in their style. Not generic rap — their rap.

**Two use cases:**
1. Artist uses it as their own ghostwriter/creative assistant
2. Artist makes their style agent available to others (as a tool or as a feature — see marketplace below)

**This is text only — no voice required.** Style training is doable right now with Claude + a well-built system prompt constructed from the analysis.

---

### 3. Voice Clone + Digital Artist Marketplace

**The idea (tiered):**

**Tier 1 — Style Agent (text only)**
- What's described above
- No voice, no likeness
- Used for writing, brainstorming, creative direction
- Can be deployed privately or listed on the marketplace

**Tier 2 — Style Agent + Voice Clone**
- Artist also uploads clean vocal stems
- Tool (Demucs for stem separation, Whisper for transcription + timing, RVC or equivalent for voice synthesis) builds a clone
- Now the agent can write AND perform in the artist's voice
- "Feature for hire" — someone pays to get a verse written and recorded in the cloned voice

**Tier 3 — Full Digital Artist (voice + likeness + video)**
- Artist also licenses their visual appearance
- Buyer gets: verse written in style → performed in cloned voice → AI video of the artist on the track
- Priced by artist's demand — big artist clone costs more per use
- Artist sets the terms, revocation rights, approved use cases

**Marketplace mechanics:**
- Artists list themselves (free to list)
- Buyers pay per use (per verse, per song, per video)
- Artist keeps 100% — DeMartinville takes nothing
- Artist controls it: they can pull their clone at any time, reject specific use cases, set minimum prices
- Consent is built in at the architecture level — you can ONLY clone your own voice here

**The music collaboration angle:**
Someone wants a feature from an artist they don't know personally. Instead of cold DMing and hoping: they go to the marketplace, find that artist's clone, pay the listed rate, get a verse written in that artist's style and voice, with licensed rights to use it on the song. If they want a video with the artist's likeness too, that's Tier 3 pricing.

---

## The Business Model (as stated)

- **DeMartinville is free.** Always. No subscription, no platform cut.
- **Users pay for actual compute** — API keys they bring, or compute they rent, or pool contributions they choose. The platform passes these costs through at cost, no markup.
- **Artists charge for their creative services.** The marketplace enables this — DeMartinville provides the rails, artists set the prices, artists keep the money.
- **The owner himself participates as an artist** — charging for his own vocals, mixing, videos, etc. He's a user of his own platform.
- **Monetization comes later, from the community** — not extracting from individuals, but figuring out what the community wants to pay for once there are enough people to ask. Growth stages: 10 → prove it works. 100 → understand usage. 1,000–2,000 → execute on what's learned.

---

## Competitive Landscape (researched 2026-06-23)

### Voice Cloning / AI Music Tools

**Musicfy** ($0–$70/month)
- Voice cloning exists, 100k+ voices, AI rapper features
- Fatal flaw: messy licensing, unvetted celebrity clones, no real artist revenue share
- Legal risk for users, especially on commercial projects

**Respeecher** ($166+/month billed yearly)
- Professional grade, Hollywood quality (Aloe Blacc, Avicii's "Wake Me Up" multilingual versions)
- Consent-first, requires explicit permission for all cloning
- Aimed at film/TV/pro studios — not indie rappers, too expensive

**HeyGen** ($24+/month)
- Video/avatar focused, voice cloning for speech NOT singing
- Not a music tool — wrong category

**ElevenLabs — the real competitor**
- Launched **Eleven Music** (January 2026) with the **Iconic Voice Marketplace**
- $11M already paid out to voice creators via their Voice Library
- 50/50 royalty split between composition and recording rights
- Deals with Merlin (indie labels) and Kobalt (publishers) — NOT the major labels yet
- Taylor Swift's lawyers are actively opposing them
- Named artists: Liza Minnelli, Art Garfunkel, IAMSU!, etc.
- **The gap they're not filling:** underground/indie/emerging artists. They're going upmarket.

**Kits.ai** — royalty-free voice models, cleaner licensing than Musicfy, growing

**Suno / Udio** — AI music generation (not voice cloning per se), got sued by major labels (June 2024), both settling with Warner/UMG with licensed frameworks, artist opt-in now required

### Industry Legal Developments (Critical)

**The lawsuit wave (2024-2025):**
- UMG + Sony + WMG sued Suno and Udio (June 2024) for training on copyrighted recordings
- Both settled: Warner/Suno (Nov 2025), UMG/Udio (Oct 2025)
- The settled deals all have: **mandatory artist opt-in, two-layer compensation (training + creation), walled garden outputs**

**Major deals that followed:**
- All three majors signed with **Klay** simultaneously (Nov 20, 2025) — first time ever
- Spotify partnered with all three majors + Merlin + Believe (Oct 2025) — artist opt-in, paid add-on, revenue share
- UMG + SoundLabs/MicDrop — artists get DAW plugin to clone their OWN voice, full ownership, not public

**Laws:**
- **ELVIS Act** (Tennessee, July 2024) — first U.S. law protecting voice from AI cloning without consent. Makes unauthorized cloning a crime.
- **AI Transparency and Voice Rights Act** (U.S., early 2026) — disclosure required when AI voices used commercially
- FTC moving toward holding platforms liable for tools used in unauthorized voice impersonation
- At least 12 states now have voice cloning laws

**Key legal pattern:** Every deal announced from Oct 2025 onward requires **artist opt-in**. This is now industry standard, not optional.

### Community Compute Pool

**Nobody is doing this** with a simple, community-friendly UI targeted at creatives and musicians. The closest things:
- Akash Network, io.net, Bittensor — decentralized GPU networks, too complex, crypto-native
- RunPod, Vast.ai, Lambda Labs — individual GPU rental, no group/community model
- The "join your crew in a shared compute pool, split the bill, everyone gets top-tier AI" concept with a one-click UI inside a music/creative app **does not exist yet.**

---

## What's Already Built (DeMartinville v1.9.1)

- Desktop app (Windows exe + Mac .app) — auto-builds on every GitHub release
- Beat Lab — full beat maker with Warp Sampler, chop-to-slices, MPC swing, Smart Pads, AI drummer, chord stamps, auto-key
- Studio — mixing knowledge base, EQ/compression/reverb guides, vocal production
- Imagination Station — cloud image generation (Atlas API)
- Agent system — Tiff (main AI), Kit (in-room), user-buildable agents, shared AGENT_TOOL_RULES toolbelt
- Copy UX — right-click menu, per-message ghost copy icon, fenced copy-blocks for prompts/code
- Website — demartinlabs.com (gh-pages, CNAME, auto-served downloads)
- Encrypted API key storage (DPAPI)

This is the foundation the new features sit on.

---

## Recommended Build Sequence

**Phase 1 — Community Compute Pool** (build first)
- Most novel, least legal risk, builds community density
- "Join the Pool" button: create or join a shared compute endpoint
- Per-user rate limiting on shared instances
- Simple payment splitting UI (or just use Stripe/Open Collective externally)
- Individual path still works (own API key or local)

**Phase 2 — Artist Style Training** (builds stickiness)
- Upload lyrics → agent analyzes style
- Artist conversation to fill in what audio can't capture
- Outputs a persistent "style agent" the artist can use for writing
- Text only first — no voice complexity yet

**Phase 3 — Voice Clone + Marketplace** (the monetization flywheel)
- Vocal stem upload → Demucs separation → Whisper transcription → RVC/ElevenLabs synthesis
- Tiered: writing agent → voice clone → full digital artist
- Marketplace listing: artist sets price, keeps 100%, controls terms
- Consent gates at every step — legally clean by design
- Start with artists cloning their OWN voice only (matches ELVIS Act safe harbor)

---

## The Real Opportunity

ElevenLabs is going after Liza Minnelli. The major labels are going after Spotify and YouTube.

Nobody is going after the rapper with 500 followers who wants to train an agent on how they write, clone their voice, and make it available to their community — for free to list, with no middleman taking a cut.

That's the opening. The consent-first, artist-controls-everything, platform-takes-nothing model isn't just the ethical play. It's the one that survives legally AND builds the kind of loyalty that makes a scene last.

The window is open. ElevenLabs moves fast.
