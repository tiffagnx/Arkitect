# Surgical & Advanced EQ

## How do I find and kill a ringing resonance (sweep and destroy)

A resonance is one narrow frequency that rings louder than its neighbors — it makes things sound "honky," "boxy," or like a bad note is buried in the part. Open DeMartin EQ, grab a band, set it narrow (high Q, roughly 6–10), boost it big (+10 to +15 dB), and slowly sweep it left and right while the part plays. The ugliest, most piercing spot you hit IS the resonance. Now flip that band to a cut and pull it down — start at −3 to −6 dB and back off until the ringing is gone but the tone still sounds full. Cut as little as the problem needs; a narrow surgical notch usually beats a wide gouge. Watch the live spectrum in DeMartin EQ — real resonances often show as a tall spike that stays put.

## Why does my low end sound muddy (the 200–500Hz mud zone)

Mud lives roughly 200–500 Hz, where every instrument's body energy stacks up and the mix turns thick and unclear. The fastest fix is on whatever owns the low-mids — usually rhythm guitar, keys, pads, or a too-warm vocal — not the kick or bass. Use DeMartin EQ or EQ-6 with a wide-ish bell (Q around 1) and cut 2–4 dB somewhere between 250 and 400 Hz, sweeping to find the thickest spot. Judge it against the full mix, not the soloed track, so you hear mud in context. Don't strip every track here or the mix goes thin; pick the one or two muddiest sources and let the rest keep their warmth. If only the very bottom is woofy, a high-pass at 30–80 Hz on non-bass tracks clears headroom too.

## My mix sounds harsh and tiring — how do I fix 2–5kHz

Harshness and ear-fatigue usually live 2–5 kHz, the range your ears are most sensitive to. It shows up as a vocal that "spits," cymbals that sting, or a mix you can't turn up without wincing. Sweep a narrow boost (Q 4–6) through 2–5 kHz in DeMartin EQ to find the exact sore spot, then cut 2–4 dB there. If the harshness rides up only on loud peaks, a static cut will dull the quiet parts — instead make the cut act only when it's loud: automate the EQ band over the harsh sections, or (since the DAW has no general dynamic EQ yet) follow a gentle static cut with the Compressor so the peaks lean down. On sibilant vocals (sharp "s" and "t" sounds, usually 5–10 kHz, higher on bright voices), use the De-Ess plugin rather than a fixed cut. Trust your ears at a moderate volume; harshness lies to you when you mix loud.

## Why does my track sound boxy or honky (300–600Hz vs 1kHz)

"Boxy" and "honky" are two different colors. Boxy is a hollow, cardboard tone living around 300–600 Hz — common on close-mic'd drums, acoustic guitar, and small-room vocals. Honk is a nasal, "talking-into-a-cup" tone centered near 800 Hz–1.2 kHz. Find either with the sweep-and-destroy move in DeMartin EQ: narrow boost, sweep, find the worst spot, then cut. Start with a cut of 2–4 dB at a moderate Q (2–4) and adjust by ear until the part opens up without going thin. Boxiness and honk often hide the clarity that lives higher up, so fixing them can make a track sound "brighter" without any high boost at all.

## How do I add air and brightness without harshness (the 10kHz+ shelf)

"Air" is the open, expensive sheen on top — breath on a vocal, shimmer on cymbals, sparkle on acoustics. Add it with a high shelf in DeMartin EQ starting around 10–12 kHz, boosted a gentle 1.5–3 dB. A shelf lifts everything above the corner smoothly, which sounds more natural than a peaky boost. Keep it subtle: too much air turns into hiss, sibilance, and fatigue fast. If the source is dull or noisy, EQ can't invent detail that was never recorded — clean it with the Cleanup denoiser first, then add air. Air is partly taste and genre; modern pop loves it bright, while a vintage or warm record may want little or none.

## How do I make two clashing tracks fit together (complementary / mirror EQ)

When two sources fight for the same space — vocal vs. lead synth, kick vs. bass, two guitars — carve a pocket so each owns a band. This is complementary (mirror) EQ: where you BOOST one source, you CUT the other at the same frequency. Example for kick and bass: cut the bass a few dB around 60–80 Hz and let the kick punch there, then cut the kick around 100–120 Hz and let the bass fill it. For vocal vs. a busy instrument, find where the vocal needs presence (say 3 kHz), gently boost the vocal and cut the instrument 2–3 dB at that same spot. Use DeMartin EQ on both tracks and toggle them together so you hear the trade. Small moves win; you're sculpting space, not gutting either part.

## What is mid-side EQ and how do I use it (mono the lows, brighten the sides)

Mid-side EQ treats the center (mono) and the stereo sides separately. Two classic moves: cut the lows on the SIDES so all the bass energy sits mono in the center, and add brightness/air on the SIDES to widen the top without making the vocal harsh. Mono lows below ~120 Hz keep the mix tight, translate to club/phone speakers, and prevent phase problems — this matters most on the master bus or a stereo bus. The DeMartin DAW has no true mid/side EQ (no per-band M/S switch, no built-in mono-maker), so you can't do real M/S processing here yet. The practical stand-in is at the source: pan all low-end (kick, bass, sub) dead center so the bass is already mono, and route only the genuinely wide, airy elements to a shared Aux/bus where you add a high shelf for top-end width. That gets you most of the same result — tight centered lows, brightness on the wide stuff — without literal mid/side encoding. Use it gently; overdoing width hollows out the center and collapses in mono.

## When should I use dynamic EQ vs static EQ

Static EQ applies the same cut or boost all the time — it's the right tool for a problem that's always there, like a constant resonance, a dull source that needs air, or a mud zone that never lets up. Dynamic EQ only acts when a band crosses a threshold, so it leaves the rest of the time untouched — perfect for problems that come and go: a vocal that only gets harsh at 3 kHz on loud notes, a bass note that booms on one pitch, or sibilance that flares unpredictably. Rule of thumb: if the problem is constant, use static (DeMartin EQ / EQ-6); if it's intermittent or level-dependent, use dynamic so quiet passages keep their tone. A De-Ess is essentially a dynamic EQ aimed at sibilance. The DAW doesn't have a full general-purpose dynamic-EQ plugin one-click yet — for now, approximate with a static cut plus the Compressor or De-Ess, or automate the EQ band over the loud sections.

## What order should I EQ in — cut first or boost first

There's no law that says cut before boost — that's a myth. A practical order does help, though: first high-pass away rumble and sub-junk you don't need, then cut the clear problems (resonances, mud, harshness) with narrow surgical moves, then make broad tonal "shaping" boosts last with wide bells or shelves. Cutting first cleans up the signal so your boosts aren't amplifying garbage. Subtractive moves (cuts) tend to sound transparent; additive moves (boosts) add character but also raise level, so trim the track's output or fader after a big boost so you're comparing tone, not loudness. Both cutting and boosting are valid — choose whichever gets the sound, and always A/B at matched volume.

## How do I EQ a vocal fast without overthinking it

For a quick, solid vocal start, hit the Vocal Doctor (🩺) on the vocal's Mix strip — it builds EQ-6 → De-Ess → Compressor → Saturator → slapback plus a reverb send, then gives you six safe macro sliders (Bright / Warm / Smooth / De-Ess / Space / Throw) that can't be pushed into ugly territory. Use Bright for air, Warm to fix thinness, Smooth to tame harshness, and De-Ess for sharp "s" sounds. If you'd rather go by hand: high-pass at 80–100 Hz, cut any mud at 200–400 Hz, notch out any honk near 1 kHz, add presence with a gentle 2–4 dB lift around 3–5 kHz, and a small air shelf at 10–12 kHz. De-Ess the sibilance rather than cutting the highs flat. Then refine each move by ear in the actual mix.
