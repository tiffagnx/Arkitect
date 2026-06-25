# Reverb explained — rooms, sends, and pro depth tricks

## What reverb actually is and the easy way to add it

Reverb is the sound of a space: hundreds of reflections smearing a dry signal into a tail. The easy way in Studio is to NOT slap a verb on every track. Instead make one Aux Input track (that creates a bus), drop TIFF VERB / DeMartin Reverb on it, then use a Send (banks A-E / F-J) on each vocal or instrument to feed that aux. Start the send around -15 dB and the aux's wet/mix at 100%. The dry track stays bone dry on its own fader; you blend in space by raising the send. This is the "send/return" approach and it's how pros work.

## Insert vs send/return — which one do I use

An INSERT puts the reverb in-line on one track, so you set its Mix knob to blend dry+wet (start ~15-25% wet). Use an insert only for a special one-off, like a totally drenched effect or a print. A SEND/RETURN routes a copy of the track to a shared reverb on an Aux; the aux runs 100% wet and you control depth with the send level. Sends are the default for music: cheaper on CPU, and you can feed many tracks into the same space so they sound like they're in one room. Default to POST-fader sends so the wet level tracks your volume rides and fades; switch a send PRE-fader only when you want the reverb to stay constant independent of the fader (e.g. fading a dry vocal out into its own tail).

## Why one shared reverb bus beats a verb on every track

A separate reverb on every track puts each element in a slightly different room, which sounds disjointed and eats CPU. One Aux with one TIFF VERB, fed by sends, glues everything into the SAME space — that's the "gel" engineers chase. It's also faster to mix: tweak one decay/pre-delay and the whole mix's depth moves together. Practical setup in Studio: create an Aux (it makes a bus), insert DeMartin Reverb on it at 100% wet, send your vocals/snare/keys to it, then ride each send. Most mixes only need a couple of reverb auxes (e.g. a short plate and a long hall) — that's a workflow habit, not a hard limit, but a separate verb on every track is what to avoid.

## Room vs hall vs plate vs spring vs chamber vs convolution

Each algorithm suits different jobs. ROOM = short, tight, 0.3-1.2 s; adds realism without obvious tail, great for drums and glue. HALL = big and lush, 1.8-4 s; orchestral, ballad vocals, pads. PLATE = bright, dense, fast-building, ~1-3 s; the classic pop vocal and snare verb, smooth and flattering. SPRING = boingy and resonant, the guitar-amp sound, characterful not realistic. CHAMBER = between room and hall, smooth and dense, warm vocals. CONVOLUTION uses a real recorded space (an impulse) for ultra-realistic ambience but is less tweakable. In Studio, dial decay/size in TIFF VERB to emulate these; pick the mode if one is offered.

## Pre-delay — the trick to keep vocals clear with reverb

Pre-delay is the gap (in ms) between the dry sound and the start of the tail. It's the single most useful clarity control. With 0 ms the reverb smears right on the word; push pre-delay to 20-40 ms and the dry vocal stays up front and intelligible while the tail blooms behind it. For slow ballads try 40-80 ms; for tight drums keep it 5-15 ms. A tempo trick: set pre-delay to a 1/32 or 1/64 note of the song so the tail breathes in time (a 1/16 note runs ~125 ms at 120 BPM — usually too long for clarity pre-delay, more of a rhythmic gap). Adjust by ear — raise it until the words are clear, back off if it sounds disconnected.

## Decay / RT time — how long should the tail be

Decay (RT60) is how long the tail takes to fade ~60 dB. Match it to tempo and density. Fast/busy songs (120+ BPM, dense arrangement) want SHORT decays, ~0.8-1.5 s, or the mix turns to mush. Slow/sparse songs can take 2-4 s for drama. A reliable rule: the tail should mostly die before the next strong beat — tune decay so it doesn't bleed across chord changes. For lead vocals, 1.2-2 s plate is a safe start. Long decays (4 s+) are a special-effect, not a default. Trim decay shorter the moment things sound washed out.

## Size, diffusion and damping — shaping the character

SIZE sets the perceived dimensions of the space and the spacing of early reflections; bigger size = grander but boomier, smaller = tighter and more intimate. DIFFUSION controls how smooth vs grainy the tail is — high diffusion (smooth wall of sound) flatters vocals and pads; low diffusion gives discrete echoes good for percussion. DAMPING rolls off the highs in the tail over time, mimicking soft rooms (curtains, carpet); more damping = darker, warmer, less harsh. If the verb sounds brittle or splashy, add damping. If it sounds dead, reduce damping. Set these by ear after decay and pre-delay are in the ballpark.

## My reverb sounds muddy or washed out — how to fix it

Muddy reverb is almost always too much low-mid tail. Fix it by EQ-ing the reverb RETURN: insert DeMartin EQ on the aux and high-pass the wet signal at 200-400 Hz so the tail stops adding boom under the vocal. Also dip 300-500 Hz on the return if it's boxy. Then tame harsh splash with a gentle shelf or cut around 6-10 kHz, or add damping in TIFF VERB. Other muddy culprits: decay too long (shorten it) or pre-delay at 0 (push it to 20-30 ms). Lowering the send a few dB often does more than any EQ — less reverb is usually the real fix.

## Reverb on the vocal — the fast pro starting point

Quickest path in Studio: hit the Vocal Doctor (🩺) on the vocal's Mix strip. It builds EQ-6 to De-Ess to Compressor to Saturator to slapback PLUS a reverb send, then gives you a "Space" macro slider clamped to a safe range — just push Space to taste. Doing it by hand: send the vocal POST-fader to a plate aux at -15 dB, pre-delay 20-30 ms, decay 1.5-2 s, and high-pass the return at 250-300 Hz. For modern pop, keep the verb subtle and lean on slapback/throws for size. De-ess BEFORE the reverb send so sibilance doesn't trigger harsh tails.

## Tempo-synced reverb throws and reverse reverb swells

For drama, don't drench the whole vocal — THROW reverb on one word or phrase. Use the FX-Throw bar: select a whole phrase or a single word and apply a tempo-synced reverb/delay throw so the tail rides on a 1/4 or 1/8 of the beat at the end of a line. Reverse reverb (the swell that builds INTO a word) is a manual move here: copy the clip, Reverse it, Print VERB to bake the tail in, Reverse it back, then slide that pre-swell so it crescendos into the downbeat. Layer it under the dry word and ride the level. It's the classic "sucking-in" intro before a hook.

## Print VERB and bouncing — committing reverb to audio

Print VERB (a clip op) bakes the current reverb tail INTO the audio clip, turning the effect into permanent waveform. Use it to commit a sound you love, to free CPU, to render a reverse-reverb swell, or to hand off stems that already contain the space. Before printing, make sure the verb is exactly right — it's destructive on that clip (keep an un-printed Duplicate, Ctrl+D, as a safety copy). For final delivery, Bounce to Disk (mix/stem/bus, WAV/MP3, 16/24-bit) captures the aux reverb in context. Print is for a single clip; Bounce is for the whole mix or a stem.
