# Stereo width and depth — making a mix wide and three-dimensional

## How do I pan my tracks — what goes where (LCR)

Panning places each sound on the left-right axis so parts stop fighting for the center. The classic starting frame is LCR: lead vocal, kick, snare, and bass live dead center; everything else leans hard left or hard right, or sits at a few fixed spots (like L50 / R50). Use the pan knob on each Mix strip. A simple recipe: vocal center, hi-hat 30 percent one side, overheads/rhythm guitars hard L/R, a tambourine or shaker opposite the hat to balance. The goal is balance, not symmetry by genre rule — if the left feels heavy, nudge a midrange element right. Pan by what frees up the center for the lead, then check the whole picture feels even.

## Why should bass and sub stay mono and centered

Low frequencies carry most of the energy and have long wavelengths, so panning them wastes headroom and can cause phase cancellation on systems that sum to mono (club PAs, phones, Bluetooth speakers). Keep kick and bass panned center. To force the low end mono, insert DeMartin EQ or EQ-6 and high-pass everything else off the bottom, then keep the bass/kick pan at 12 o'clock. If a stereo synth or sample has wide lows, the cleanest fix is a mono-below crossover — the DAW has no one-click "mono maker," so the workaround is to high-pass the wide stereo part around 100–150 Hz and let a separate centered mono sub carry below that. Always confirm the bass doesn't disappear when you mono-check.

## What is mid-side and how do I use it

Mid-side splits a stereo signal into the Mid (what's common to both channels, i.e. the center) and the Side (the difference, i.e. the width). Thinking this way lets you treat the center and the edges separately: bring up Side for width, bring up Mid for focus. In this DAW you don't get a dedicated M/S knob on every plugin, so you work it via routing — keep centered elements (vocal, bass, kick) mono and panned center for a strong Mid, and pan/widen the supporting parts for Side energy. For EQ moves, the practical version is: high-pass the wide/side-heavy parts so the low end stays in the Mid. Mono-check often — if a part vanishes in mono it lived entirely in the Side.

## How do I make a track sound wider

Easiest real width comes from two performances, not a plugin. Record (or duplicate and slightly vary) a part twice and hard-pan them L and R — a true double sounds huge and stays mono-compatible. Use Duplicate (Ctrl+D) on a clip, then Tune or nudge timing slightly so the two takes differ. Other moves: pan a chorus/reverb return wide, or use a short stereo delay. A wide pad can be sent to an Aux with TIFF VERB for stereo ambience. Avoid leaning on artificial wideners as a first move — they often hollow out the mono sum. Whatever you do, A/B in mono before you commit.

## What is the Haas effect (short delay for width)

Haas uses a very short delay on one side to create width from a single mono source: pan the dry signal one way, send a copy 10–35 ms late to the other side, and the ear fuses them into one wide image instead of hearing two events. In this DAW, duplicate the clip, pan the copy opposite, and put the slapback delay or Tape Delay on it set to roughly 10–35 ms with zero feedback. Push past ~40 ms and it starts to read as a distinct slap echo, not width. Haas is fragile in mono — the delayed copy can comb-filter and thin the sound — so this is the move where mono-checking matters most. Great on backing vocals and guitars, risky on a lead vocal.

## Why does my mix collapse or sound thin in mono

That's phase cancellation: wide tricks (Haas delays, stereo wideners, hard-panned doubles that aren't identical) create out-of-phase content that disappears or thins when left and right sum together. Many listeners hear mono (single phone speaker, club mono sub, smart speakers), so this matters. Test it: route the master through a mono check, or temporarily pan everything center, and listen for parts that drop in level or go hollow. If something collapses, reduce the widener amount, shorten the Haas delay, or make the two doubled takes less identical. The rule isn't "never go wide" — it's "go wide, then prove it survives mono."

## How do I make a vocal or instrument sound far away (depth)

Depth is front-to-back distance, built mostly with four cues. Distant sounds are quieter, more reverberant, duller on top, and arrive with less attack. Starting recipe for a "back of the room" part: drop its level a few dB, send more of it to a reverb Aux (TIFF VERB / DeMartin Reverb), roll off highs above ~6–10 kHz with DeMartin EQ, and use a short reverb pre-delay (or none) so the wet sound hugs the dry. Close, in-your-face parts get the opposite: louder, drier, bright, with longer pre-delay (20–40 ms) to keep them up front. Move the most important element (usually the lead vocal) forward and push pads, ear-candy, and doubles back.

## What does reverb pre-delay actually do

Pre-delay is the gap (in ms) between the dry sound and the start of its reverb tail. A longer pre-delay separates the tail from the dry hit, so the dry sound stays clear and intelligible up front while still being wet — the reverb arrives as a distinct event after it. Short or zero pre-delay glues the tail right onto the sound, which blurs the attack and lets the part sink back into the space. Starting points: 20–40 ms pre-delay on a lead vocal to keep it forward and articulate; near-0 ms on a part you want to sit deep in the room. Tempo-sync the pre-delay to an eighth or sixteenth for rhythmic clarity. Set it in TIFF VERB / DeMartin Reverb and tune by ear.

## How do I build a 3D mix (width and depth together)

Think of the mix as a stage: panning sets left-right, level plus reverb plus EQ sets front-to-back. Put the most important, driest, brightest elements front-and-center (lead vocal, kick, snare, bass). Spread rhythm and ear-candy out wide with panning and doubles. Push atmospheric parts back with more reverb send, high-frequency rolloff, and short pre-delay. Use a shared reverb Aux (one "room" everything visits) so the whole mix feels like one space, plus a tighter slapback for parts you want closer. Keep the low end mono and centered as the foundation. Then mono-check the whole stage — a real 3D mix still reads clearly when it folds to mono.

## How loud / wide should the final master be

Width on the master is taste, but balance and translation come first. Don't slam a stereo widener across the whole mix to sound "big" — it usually weakens the mono sum and the center. If you want the master wider, widen individual parts in the mix instead. For loudness, common streaming targets land around −14 LUFS integrated with true-peak at or below −1 dBTP, set with the Maximizer/limiter on the master; club/loud genres push louder by taste at the cost of dynamics. There is no magic single LUFS or width number — reference a commercial track you like, match its perceived loudness and width by ear, and verify in mono and on a phone speaker.
