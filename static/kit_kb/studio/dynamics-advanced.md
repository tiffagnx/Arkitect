# Advanced Dynamics — Multiband, Transient, Limiting, Clipping & More

## What's the difference between a compressor and a limiter

A compressor turns down whatever crosses the threshold by a ratio, smoothly shaping dynamics. A limiter is just a compressor with a very high ratio (10:1 and up, effectively ∞:1) plus lookahead so it sees peaks coming and lets nothing poke above its ceiling — it's a brick wall, not a sculptor. Use the Compressor insert for tone and groove control (ratios 2:1–4:1, attack 5–30 ms, release 50–150 ms). Use the master Maximizer/limiter only to catch peaks and set final loudness, with a true-peak ceiling of −1.0 dBTP. Don't try to make a limiter do a compressor's musical job — it'll pump and dull. A common pro chain is one or two gentle compressors doing the work, then a limiter doing 1–3 dB of catching.

## How do I fix one boomy or harsh frequency band only when it's loud

That's multiband compression: split the signal into bands and compress only the offending one, only when it spikes. The DAW has no dedicated multiband plugin, so use the workaround. Put a DeMartin EQ first to FIND the problem (sweep a narrow boost until the boom or harshness jumps out — often boom around 150–300 Hz, harshness 2.5–4 kHz). Then route the track to an Aux bus, and on the aux use a Compressor fed by an EQ-narrowed signal, or simpler: use a dynamic-EQ-style move with the DeMartin EQ band cutting 2–4 dB and let the Compressor tame the rest. The clean fix is true multiband — flag it. As a band-aid, automate a narrow EQ cut only on the loud sections.

## What is transient shaping and how do I add or remove attack

Transient shaping adjusts the punch (attack) and tail (sustain) of a sound independently of its overall level — great for making a snare crack or a muddy room tail shrink. The DAW has no one-knob transient designer, so emulate it with the Compressor. To ADD attack: slow the attack to 20–40 ms so the initial transient slips through before the comp clamps, with fast release. To REMOVE attack (soften a spiky pluck): use a fast attack of 0.5–3 ms so the comp grabs the transient instantly. To control SUSTAIN, set the release: long release (150–300 ms) holds the tail down, short release lets it breathe back up. A dedicated transient shaper is a gap — flag it.

## Can I use clipping to get louder before the limiter

Yes — clipping shaves the very tips of peaks so the limiter has less work and the track sits louder without obvious pumping. Use the Saturator insert pushed hard into distortion to do the clipping (the Maximizer is a limiter, not a clipper — it catches peaks rather than flattening them). Soft clipping rounds the peak corners (gentler, adds warm harmonics — good on full mixes and vocals); hard clipping flattens them sharply (more aggressive, louder, more distortion — common on drums and modern masters). Start by clipping only 1–2 dB off the loudest transients and A/B for harshness. The order matters: clipper/saturator FIRST to tame transients, limiter LAST for the true-peak ceiling. Overdo it and you get crunchy, fatiguing distortion — let your ears, not the number, set the limit. A dedicated clipper plugin is a gap — flag it.

## How do I bring up the quiet parts without squashing the loud parts (upward compression)

Upward compression raises the quiet stuff toward the loud stuff instead of pulling peaks down — it adds density and keeps energy without killing punch. The DAW has no native upward compressor, so use parallel compression as the workaround. Send the track to an Aux bus, put a Compressor on the aux squashing hard (ratio 6:1+, attack fast, lots of gain reduction), then blend that crushed return UNDER the dry track. The quiet details get lifted while the dry peaks stay intact. Start with the parallel return about 6–10 dB below the dry, then taste in. True single-knob upward compression is a gap — flag it.

## What does a gate do and how do I tighten a loose track with it

A gate mutes signal that falls below a threshold — it kills bleed, room noise, and floppy tails so a track sounds tight. Use the Gate insert. Set the threshold just above the noise/bleed floor so the wanted hits open it and the junk stays shut. Start attack fast (0.1–1 ms) so you don't clip the front of a hit, release 50–150 ms so it closes naturally without chopping the tail. Add a little hold if the gate chatters on sustained notes. Expansion is the gentler cousin: instead of a hard mute it just turns the quiet parts DOWN a few dB (a 2:1 downward expander), which sounds more natural on vocals where a hard gate would clip breaths. For static hiss/hum, reach for Cleanup (denoise) instead.

## How do I tame harsh S sounds on a vocal (de-essing)

De-essing is frequency-conscious compression: a compressor that only ducks when energy in the sibilance band gets loud, leaving the rest of the vocal untouched. Use the De-Ess insert. Sibilance usually lives 5–8 kHz (higher, 7–10 kHz, on bright or female vocals); set the De-Ess to listen there and pull it down only 2–4 dB on the harsh "sss" and "ttt" hits. Too much and the singer lisps — back off until the esses sit naturally, not gone. The Vocal Doctor (🩺) builds a chain with De-Ess already placed after EQ, plus a Smooth/De-Ess macro slider clamped to a safe range. If one word is still spitting, automate or chop that clip and de-ess harder just there.

## What order should my dynamics plugins go in on a vocal

Order changes the sound, so there's a sensible default and room for taste. Common chain: corrective EQ (cut mud/resonances) → De-Ess → Compressor (level it out) → tone/Saturator → ambience (slapback/reverb send). De-essing BEFORE the compressor stops the comp from pumping on loud esses; some engineers de-ess after — try both. The Vocal Doctor lays this exact chain (EQ-6 → De-Ess → Compressor → Saturator → slapback + reverb send), which is a great starting template. On a buss/master, the rule of thumb is gentle compression first, then clipper/saturator to tame transients, then the Maximizer/limiter last for the ceiling.

## How loud should the compressor be working — how much gain reduction

Watch the gain-reduction meter, not a target number. For transparent leveling, aim for 2–4 dB of reduction on the loudest moments; for an obvious "glued" or pumping effect, push 6 dB or more. On a mix bus, 1–3 dB total is plenty. Set the threshold so the comp is at zero reduction during quiet passages and only grabs the peaks. Ratio sets intensity: 2:1 is gentle leveling, 4:1 is firm control, 8:1+ approaches limiting. Then use makeup gain to match the output to the bypassed level so you judge tone, not loudness — louder always seems "better," which fools you. If it sounds squashed and lifeless, you're reducing too much; back off threshold or ratio.

## How loud should my master be (LUFS and true peak)

Loudness is a delivery choice, not a contest. Streaming services normalize to roughly −14 LUFS integrated, so mastering much louder than that just gets turned down and can sound squashed by your own limiting. For streaming, aim around −14 to −9 LUFS integrated depending on genre and taste (modern pop/hip-hop and EDM often push to about −9 to −8 for impact — go louder than that and you're mostly trading dynamics for distortion the platform turns down anyway). Always keep true peak at −1.0 dBTP on the master Maximizer to survive lossy encoding (MP3/AAC can overshoot 0 dBFS). Bounce to Disk gives you WAV (16/24-bit) plus MP3 to check the encode. Don't chase a number — get it punchy and clean at a sensible level, then let normalization handle the platform. There's no single "correct" LUFS; it's genre and taste.
