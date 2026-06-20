# Phase & Polarity — Why It Cancels and How to Fix It

## What's the difference between phase and polarity

Polarity is a hard flip: every sample's value gets multiplied by −1, so the whole waveform mirrors instantly. Phase is a time relationship — one signal arriving slightly later than another, which shifts different frequencies by different amounts. A polarity flip is one switch; a phase issue is about timing/delay between tracks. People say "flip the phase" but they almost always mean flip polarity. Real phase problems come from distance and delay (two mics, a delayed copy, a slow plugin) and you fix them by moving the track in time, not just by flipping. In Studio there's no dedicated polarity button yet, so most phase issues you fix the better way anyway: nudge the clip in Slip mode until transients line up and check by ear. A true polarity (−1) toggle is on the gaps list.

## Why does my mix sound thin or hollow when I combine two mics

That hollow, phasey sound is comb filtering: two copies of the same source arrive at slightly different times, so some frequencies add and others cancel in a repeating comb pattern. The closer the delay, the higher the notch frequency; a 1 ms offset notches around 500 Hz and its odd multiples, a 0.5 ms offset notches near 1 kHz. You hear it as thin, papery, or "down a tube." The fix is to time-align the two tracks so their transients line up, or flip polarity on one if they're roughly 180° opposed. Zoom way in on a shared transient (a kick beater, a snare hit) in Slip mode and slide one clip until the peaks stack. Then trust your ears — sometimes a small offset sounds fuller than perfect alignment.

## How do I phase-align kick in and kick out mics

Kick in (beater/click) and kick out (low boom) are usually a few inches apart, so the out mic lags by roughly 0.3–0.6 ms. Zoom into a single kick transient in Slip mode and nudge the out-mic clip earlier until the initial spikes line up — that timing fix is usually all it takes. (The classic shortcut is a polarity flip on the out mic when it sits near-opposite the in mic, but Studio has no polarity button yet — gaps list — so a half-cycle slip gets you the same low-end recovery.) Listen for the lowest, punchiest result, not the most "aligned-looking" — the goal is max low-end and attack, judged by ear. Bounce a short loop and compare a couple of clip positions before committing, since the sweet spot is small. Studio lets you drag clips sample-close in Slip mode, which is exactly how you dial this in.

## How do I fix snare top and bottom mic phase

The snare bottom mic points up into the wires while the top points down at the head, so they capture the same drum from opposite sides — the bottom is almost always polarity-inverted relative to the top. The classic move is a polarity flip on the bottom track — the body and crack jump back in because un-flipped they cancel the fundamental (around 150–250 Hz). Studio has no polarity button yet (it's on the gaps list), so do it by timing instead: zoom a transient in Slip mode and slide the bottom clip about half a wavelength of that fundamental (~2–3 ms) so its dip lines up with the top mic's peak — same low-end recovery, no flip needed. Then fine-nudge for the fattest snare. Then balance: bottom mic is mostly for wire snap up around 3–8 kHz, so high-pass it (DeMartin EQ, HPF near 200–300 Hz) so its low end doesn't fight the top. Always decide by ear with both faders up.

## How do I line up a DI and a mic'd amp

A guitar or bass DI is electrically instant, but the amp mic is delayed by the speaker cabinet plus the air gap to the mic — typically 0.5–3 ms late, which combs against the DI. Zoom into a clear pick attack in Slip mode and slide the DI clip later (or the amp clip earlier) until the transients stack, then sweep the offset by ear for the fullest tone — with no polarity button (gaps list), this time-slide is your main lever, and a half-cycle shift covers the case a flip would. For re-amped or parallel tones, even a 1 ms slip noticeably changes the low-mid weight, so audition a couple of positions. Commit the move with the clip in place once it sounds right; small differences here make or break a tight low end.

## Why does my wide mix collapse or disappear in mono

A mix sounds huge in stereo when the left and right channels differ a lot — wide reverbs, hard-panned doubles, stereo wideners, micro-delays between L and R. In mono, L and R sum together, and anything that's out-of-phase between them cancels: the wide part vanishes or goes thin and weird. The worst offenders are stereo-widening plugins and Haas/very short delays used for width, because they rely on phase differences that don't survive summing. If a synth or vocal double "feels" wide but gets quieter in mono, that's phase cancellation, not magic. Keep your core elements (lead vocal, kick, snare, bass) mono or near-mono, and reserve extreme width for things that can afford to fade in mono, like ear-candy and ambience.

## How do I check my mix in mono

Mono-check constantly — clubs, phones, Bluetooth speakers, and many laptops play mono or near-mono, so what cancels there disappears for a lot of listeners. In Studio, the practical check is to pan every track hard to center so L and R carry the same signal, then listen — anything that drops out or goes hollow was living on stereo phase differences. For a true summed check, print a quick mono Bounce to Disk and play it back. Listen for elements that drop in level or go hollow — that flags phase trouble in a stereo source. A one-click mono-monitor button is on the gaps list; until then, center-panning is the fast approximation. If the mix stays balanced and the lead stays loud in mono, your phase is healthy.

## How do I tell if it's a polarity problem or just EQ

The tell: a phase/polarity problem makes whole bands (usually the low end) vanish when two tracks combine but sound fine soloed; an EQ problem is there even on a single track. Quick test in Studio — solo the two related tracks (e.g., the two kick mics) and mute one, then unmute: if the low end collapses when both play together, that's cancellation, not tone. Nudge one clip in Slip mode and watch the low end come back as the timing lines up. Only reach for the DeMartin EQ to clean up tone after the phase relationship is locked. Reaching for EQ first to fix a cancellation just buries the symptom and wastes headroom.

## Why does parallel processing or layering kill my low end

When you split a track to a parallel bus (an Aux Input in Studio) and process it, plugins can add latency or shift phase, so the parallel copy combs against the dry track on the low end. Compressors, saturators, and especially linear-phase or convolution-style plugins delay the signal differently, so the summed bass can thin out. First check by muting the parallel Aux return — if the low end gets fuller when it's gone, you have cancellation. The cleanest fixes in Studio: keep low-latency plugins on the parallel chain, high-pass the parallel return (DeMartin EQ) so the bass stays on the dry track only, or nudge the return a hair in time and keep the fuller result. (A polarity flip would be the quick test, but there's no polarity button yet — gaps list.) Heavy chains can still phase-smear even with latency compensation, so trust the mono check and your ears on the combined low end.

## How do I avoid phase problems when layering kicks or 808s

Stacking two kick samples (or a kick under an 808) is the most common phase trap in modern production: if their low-frequency cycles don't start together, they partly cancel and the sub gets weaker, not bigger. Zoom into the start of each sample in Slip mode and align the first downward (or upward) swing of the waveforms, not just the visual onsets — that alignment is what stops the sub from cancelling. (A polarity flip on one layer is the other classic test, but Studio has no polarity button yet — gaps list — so sliding the clip by half a sub-cycle does the same job.) High-pass one layer (DeMartin EQ) so only one element owns the very low sub (below ~60–80 Hz) and they stop fighting. Always confirm in mono, since the sub is where cancellation hurts most.

## How do I use polarity and timing as a creative tool

Beyond fixing problems, phase is a tone control: slightly slipping a doubled guitar or a room mic in time changes its color and width, so you can dial weight in or out on purpose. Drag a room or overhead track a few ms in Slip mode to make drums sound closer or more distant. Use deliberate L/R micro-offsets only on parts that can collapse safely in mono (pads, ear-candy), never on the lead vocal or bass. Slipping a re-amp or reverb-printed copy a few ms also reshapes how it sits — a free A/B you can dial by ear. Treat these as taste moves: there's no "correct" amount, only what serves the song, so always re-check mono before you commit.
