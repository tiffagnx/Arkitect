# Compression Recipes by Source

## How do I compress a lead vocal — starting point

For a pop/rap lead, drop a Compressor insert and start at ratio 3:1, attack ~10-20 ms, release ~80-150 ms (or Auto), threshold low enough for 3-6 dB of gain reduction on the loud words. That tames the level so the vocal sits steady without sounding crushed. Set attack by ear: a faster attack (3-5 ms) softens hard consonant peaks, a slower attack (20-30 ms) lets the front of each word punch through. Set release so the meter recovers between phrases — too fast pumps, too slow stays clamped. If you just want it done, hit the Vocal Doctor 🩺 button: it builds EQ-6 → De-Ess → Compressor → Saturator → slapback with a safe Compressor baseline you can then nudge with the Smooth macro.

## Serial compression — stacking two light compressors on vocals

Instead of one compressor doing 8 dB of work (which sounds squashed), use two Compressor inserts in series each doing 2-4 dB. The first catches the loudest peaks (fast-ish attack ~5-10 ms, higher ratio 4:1), the second gently levels what's left (slower attack ~20 ms, low ratio 2:1, ~2-3 dB reduction). The result is a vocal that's very controlled but still breathes, because no single stage is straining. This is the classic trick for upfront, modern lead vocals that stay glued at every volume. Dial each stage by ear and watch that total reduction stays musical — if it sounds lifeless, back off the second stage first.

## How to compress drums — snap vs glue

There are two jobs, and they want opposite settings. For SNAP/punch on a snare or kick, use a Compressor with a slow attack (10-30 ms) so the transient passes through before the compressor grabs, then a fast release (40-80 ms) and ratio 4:1 for 4-8 dB of reduction — this exaggerates the hit. For GLUE across a drum bus, make an Aux Input (it creates a bus), send all the drum tracks to it, and put one Compressor on the aux at a low ratio (2:1), slower attack (~30 ms), release timed to the groove (or Auto), pulling only 2-4 dB. Glue makes the kit feel like one instrument; snap makes one drum hit harder. Decide which problem you're solving before you touch a knob.

## What compressor settings for bass

Bass needs consistency more than character — every note should land at the same level so the low end is solid. Start with a Compressor at ratio 4:1, attack ~15-30 ms (slow enough to keep the note's initial pluck/pick attack), release ~100-200 ms, threshold for 4-6 dB of reduction on the loudest notes. If notes still jump around, that's a performance/level issue — try a second light Compressor in series rather than one stage crushing hard. Watch the attack: too fast and the bass loses its front-end definition and gets dull. For very uneven playing, automate the clip gain or use Strip Silence/clip-gain edits before compressing so the compressor isn't fighting a wild performance.

## How to compress acoustic guitar and acoustic instruments

Acoustic sources have wide dynamics and a delicate attack you usually want to preserve, so go gentle. Start with a Compressor at ratio 2:1 to 3:1, a slower attack (20-40 ms) to keep the pick/string transient and the natural snap, release ~150-300 ms, aiming for only 2-4 dB of reduction. Heavy compression on acoustic guitar pulls up finger noise, room, and breaths and flattens the dynamics that make it feel real — so less is more. If you only need to even out a few loud strums, ride clip gain or automate the fader instead of compressing the whole take. For a strummed part that needs to sit under a vocal, a touch more (3:1, ~4 dB) helps it stay consistent in the bed.

## How do I compress the full mix or master bus

Mix-bus/master compression is for gentle gluing and leveling, not loudness — that's the limiter's job. On a created Master Fader, use a Compressor at a low ratio (1.5:1 to 2:1), slow attack (~30 ms so transients survive), release on Auto or timed to the song, pulling just 1-3 dB on the loudest sections. You're looking for the mix to feel slightly more cohesive and "together," not pumping. Do final loudness separately with the Maximizer/limiter as the last insert. If 1-2 dB of bus compression makes the mix sound worse or smaller, take it off — not every mix needs it, and over-compressing the master is hard to undo later.

## How do I set attack and release by ear

Forget chasing numbers — listen to what the compressor does to the shape of the sound. Attack controls how much of the initial transient gets through: faster attack = softer, rounder, more controlled front; slower attack = more punch and click preserved. If your drums lost their hit, slow the attack; if a vocal's S/T/K consonants are spitting, speed it up. Release controls how fast it lets go: too fast and you hear pumping/distortion on bass-heavy material, too slow and the compressor stays clamped and chokes the next note. A good default is to start with Auto release, then switch to manual and tune until the gain-reduction meter "breathes" in time with the music — moving with the groove, fully recovering between hits or words.

## How much gain reduction is too much

There's no fixed rule, but use these ranges as sanity checks: lead vocal 3-6 dB (or split across serial stages), drum bus glue 2-4 dB, individual drum for snap 4-8 dB, bass 4-6 dB, acoustic 2-4 dB, mix bus 1-3 dB. If the meter is pinned at 10+ dB constantly and the source sounds smaller, duller, or pumping, you've gone too far — lower the ratio or raise the threshold. Always level-match with makeup gain before judging: a louder version almost always sounds "better" at first, which fools you into over-compressing. Bypass the Compressor and match levels by ear, then decide if it's actually an improvement.

## When should I NOT compress

Compression fixes inconsistent level and shapes transients — if those aren't the problem, don't reach for it. A well-performed source that's already even (a steady synth pad, a programmed 808, a tight rap take) may need zero compression. Don't use a compressor to fix tone (that's EQ-6 / DeMartin EQ), to remove noise (Cleanup), to control sibilance (De-Ess), or to stop a single loud word (just ride clip gain or automate the fader). Compressing already-compressed or already-loud material (mastered samples, a limited loop) usually just adds pumping. And if you can't hear a clear improvement when you A/B with bypass at matched level, leave it off — an unneeded compressor only adds noise and squash.

## Parallel compression — power without losing dynamics

Parallel ("New York") compression blends a heavily-crushed copy under the natural signal, so you add weight and density while keeping the original transients and dynamics. The clean way in Studio: make an Aux Input (creates a bus), send the drum or vocal track to it pre-fader, and put one Compressor on the aux smashing hard — ratio 8:1+, fast attack (~5 ms), 8-15 dB of reduction. Use a pre-fader send so the crushed blend stays put when you ride the dry fader. Then bring the aux return up under the dry track until it thickens without dominating. This is gold on drum buses (huge, punchy, still dynamic) and on vocals (density and presence without flattening). Roll some lows off the crushed bus with an EQ if it gets muddy.

## Vocal Doctor — the fast way to a finished vocal chain

If you want a pro vocal compression starting point in one click, hit the 🩺 Vocal Doctor button on the vocal's Mix strip. It analyzes the take and builds EQ-6 → De-Ess → Compressor → Saturator → slapback delay plus a reverb send, with the Compressor already set to a safe leveling baseline. Then use the "Your Edge" panel's six macro sliders — Bright, Warm, Smooth, De-Ess, Space, Throw — to taste; Smooth pushes the compression harder within a safe clamped range, so you can't accidentally crush it. Use this to get 90% there fast, then open the Compressor insert directly if you want to fine-tune attack/release by ear using the recipes above. It's the easy way; manual serial compression is the deeper way.
