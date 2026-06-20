# EQ from Scratch: Carving Frequencies in Studio

## What does an EQ actually do and when should I reach for one

An EQ (equalizer) turns specific frequency ranges up or down so a sound takes up the right space in the mix. You use it for two jobs: corrective (remove what's wrong — rumble, mud, harshness, a resonant honk) and creative (shape tone — add air, weight, presence). Reach for it when something sounds boomy, dull, boxy, harsh, or thin, or when two parts are fighting in the same range. In Studio, drop an EQ-6 or a DeMartin EQ on the track via the + insert. EQ-6 is the fast 6-band workhorse; DeMartin EQ is the 8-band with a live spectrum and draggable bands when you want to see what you're doing. Always listen in the context of the full mix, not soloed — a sound that's "right" alone often isn't right in the song.

## Should I cut or boost — subtractive vs additive EQ

Both are valid; the old "always cut, never boost" rule is dogma, not science. The useful pattern: cut narrow to fix problems, boost wide to add character. A specific ugly resonance (a ringing note, a nasal honk) is a narrow problem, so use a tight notch. Tone — "more air," "warmer" — is broad, so a wide gentle boost sounds natural where a wide cut would sound hollow. A practical move: to make something brighter you can either boost the highs or cut the lows that mask them — try both and keep what sounds better. Make changes in 1–3 dB steps; if you're pulling more than 6 dB to fix something, the source or arrangement is usually the real problem. Use any band in EQ-6 or DeMartin EQ for both — set the gain positive to boost, negative to cut.

## What is Q and bandwidth and how wide should my EQ band be

Q controls how wide or narrow a band is. High Q = narrow (affects a thin slice of frequencies); low Q = wide (affects a broad range). For surgical problem-solving — killing a single resonant frequency — use a high Q (roughly 4–10) so you only touch the offender. For musical tone-shaping use a low/medium Q (roughly 0.7–1.5) so the boost or cut blends smoothly. A fast way to find a problem: set a band to a big boost with a high Q, sweep its frequency until the ugliness jumps out, then flip the gain to a cut and back off the Q a touch. In DeMartin EQ you can grab a band on the spectrum and drag its width directly; in EQ-6 set the Q value per band.

## Bell vs shelf vs high-pass and low-pass — which filter type when

Each band has a shape, and the shape matters as much as the frequency. A bell (peak) boosts or cuts around a center frequency and tapers off both sides — use it for targeted moves anywhere in the spectrum. A shelf raises or lowers everything above (high shelf) or below (low shelf) a point — use it for broad tone, like a high shelf at 8–10 kHz for air or a low shelf at 100–150 Hz for warmth. A high-pass filter (HPF) removes everything below its cutoff (lets highs pass); a low-pass filter (LPF) removes everything above. Use HPF to clean rumble and mud, LPF to tame fizz or push a part back. Set the filter type per band in EQ-6 or DeMartin EQ; the edge bands are your filters and shelves, the middle bands are bells.

## The full frequency map — what lives where from sub to air

Knowing where things live lets you aim instead of guess. Rough map:
- Sub (20–60 Hz): felt more than heard — kick weight, 808 rumble. Clutters fast.
- Low (60–120 Hz): bass body, kick punch, the "weight" of a mix.
- Low-mid (120–400 Hz): warmth — but also where mud and boxiness pile up.
- Mid (400 Hz–1 kHz): body and "honk"/boxy tones; thin if scooped too hard.
- High-mid (1–4 kHz): attack, presence, intelligibility — and ear fatigue if overdone.
- Presence (4–7 kHz): clarity, consonants, vocal forwardness; harsh/sibilant if pushed.
- Air (8–20 kHz): sparkle, openness, "expensive" sheen.
These are guides, not laws — sweep with a band in DeMartin EQ to confirm by ear where your specific sound's energy sits.

## Why does my low end sound muddy or boomy

Mud is too much energy stacked in the low-mids, usually 150–400 Hz, where everything (vocals, guitars, bass, room tone) overlaps. First, high-pass anything that isn't bass or kick — set an HPF and slide the cutoff up until the part thins, then back off. Then on the muddiest tracks pull a wide bell of 2–4 dB somewhere in 200–400 Hz; sweep to find the worst spot. Boominess lower down (60–120 Hz) is too much bass body — cut there or check that kick and bass aren't both filling the same note. Do this with EQ-6 or DeMartin EQ on each offending track, not just on the master. If many tracks share the mud, route them to an Aux (which creates a bus), send the tracks to it, and EQ the bus once.

## Why should I high-pass everything that isn't bass

Most instruments produce useless low-frequency junk — mic rumble, stage thumps, breath, proximity buildup — below their actual musical range. Left in, it stacks up across many tracks and eats headroom and clarity even though no single track sounds bad alone. So put a high-pass on vocals, guitars, synths, overheads, and pads. Starting cutoffs: vocals 80–100 Hz, electric guitar 80–120 Hz, hi-hats/overheads 200–400 Hz, pianos/pads to taste. The right way to set it: raise the cutoff until you hear the part lose body, then back down a bit. Leave the kick and bass alone (or HPF them very low, 20–30 Hz, just to kill sub-rumble). Add a high-pass band in EQ-6 or DeMartin EQ on each track. This single habit cleans up more mixes than any other EQ move.

## How do I make a vocal cut through and sound clear and bright

Clarity is high-mid and presence; brightness/air is the top. Quick path: in Studio click the 🩺 Vocal Doctor on the vocal's Mix strip — it builds EQ-6 → De-Ess → Compressor → Saturator → slapback with a reverb send, then gives you 6 safe macro sliders (Bright, Warm, Smooth, De-Ess, Space, Throw) you can't push into ugliness — Bright and Smooth are the tone ones here. By hand: high-pass at 80–100 Hz, cut 2–3 dB of mud around 250–350 Hz, add 2–3 dB presence around 3–5 kHz so words read, and a gentle high shelf at 10 kHz (+1 to +3 dB) for air. If presence makes it harsh or sibilant, that's the De-Ess's job around 5–10 kHz, not more EQ. Do all this with EQ-6 or DeMartin EQ inserts and trust your ears over the numbers.

## How do I fix harshness sibilance or a resonant ring

Harshness, sibilance, and ringing are narrow problems — find and notch them. To hunt a resonance: in DeMartin EQ set a band to a high Q with a big boost, sweep the frequency until the ugly note screams, then flip to a cut of 3–6 dB and widen the Q slightly so it doesn't sound surgical. Harsh "brittle" vocal/cymbal energy usually sits 2–5 kHz; cymbal/fizz harshness higher, 6–10 kHz. Pure sibilance ("ess" sounds) lives 5–10 kHz (higher and brighter on female/airy vocals), but a static EQ cut there dulls the whole vocal — use the De-Ess plugin instead, which only ducks those frequencies when the "ess" actually hits. For a single resonant note in a recording, an EQ notch beats turning everything down.

## How do I A/B my EQ honestly with gain matching

Boosting frequencies makes a track louder, and louder almost always sounds "better" to your ear even when it's worse — that's the trap. To judge honestly, gain-match: after EQ'ing, lower the track or plugin output so the bypassed and active versions hit the same loudness, then toggle the EQ in and out and ask "different" not "louder." A boost-heavy EQ should usually come down a touch; a cut-heavy one may come up. Compare with the bypass on the EQ-6 / DeMartin EQ insert, and trim level on the track fader or the plugin's output. Bounce a quick reference with Bounce to Disk if you want to compare away from the session. If the EQ'd version only wins because it's louder, you haven't improved the tone.

## What are some pro EQ moves beyond fixing problems

Once the corrective work is done, EQ becomes a balancing and depth tool. Carve complementary pockets: if two parts mask each other, boost one where you cut the other (a small dip in the guitar at 3 kHz makes room for the vocal's presence). Push parts back in depth with a gentle low-pass and slightly less air; pull parts forward with presence and air. Brighten before reverb so the tail sparkles, or darken before reverb for a smoky tail (EQ insert before a reverb send). For glue on a group, route tracks to an Aux/bus and apply one wide musical move to the whole stack. And remember arrangement beats EQ — if two sounds always fight, sometimes the fix is muting or re-voicing one, not endless filtering.
