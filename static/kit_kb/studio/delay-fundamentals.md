# Delay explained — echoes, slapback, and tempo-synced throws

## What do Time, Feedback, and Mix actually do on a delay

Three knobs control almost every delay. Time sets how long after the original sound the echo arrives, in milliseconds (or a tempo-synced note value). Feedback (sometimes "regeneration") routes the echo back into itself so it repeats — 0% gives one echo, ~30% gives a few fading repeats, 70%+ gives long trails that can pile up and smear. Mix (or Wet/Dry) is the loudness of the echoes versus the original. Start with Feedback around 20–30% and Mix low (10–20% wet) so you hear the effect without burying the dry sound. On an insert, keep Mix modest; if you put the delay on an Aux send instead, set the plugin to 100% wet and control the level with the send knob. Use Tape Delay or the slapback plugin as inserts; for whole/word throws use the FX-Throw bar.

## How do I sync delay time to my song's BPM (note values)

Tempo-synced delay locks the echo to the beat so repeats fall musically instead of randomly. The math is simple: a quarter-note delay in milliseconds = 60000 / BPM. So at 120 BPM a 1/4 note = 500 ms, 1/8 = 250 ms, 1/16 = 125 ms. A dotted value is 1.5× the base (dotted 1/8 = 375 ms at 120 BPM), and a triplet is 2/3× the base (1/8 triplet ≈ 167 ms at 120 BPM). In Studio you usually don't do the math by hand: BPM Delay (a clip op) and the FX-Throw bar already read the session tempo from the BARS|BEATS / TEMPO bar, so you pick the note value and it computes the ms. If you're typing ms manually into Tape Delay, use the formula above. Set your session tempo first so the sync is correct.

## Which delay note value should I use — 1/8, dotted 1/8, or triplet

The note value sets the rhythmic feel of the repeats. A straight 1/8 is the safe default — repeats land squarely on the off-beats and sit cleanly in most songs. Dotted 1/8 (the "U2 / The Edge" sound) repeats slightly off the grid and creates a galloping, wide motion that's great for lead vocals and guitars in pop and rock. 1/8 triplets give a rolling, swung bounce that suits hip-hop, trap, and shuffle feels. Quarter-note delay is slower and more obvious — good for sparse sections or dub-style throws. Pick by ear against the drums: if the repeats fight the groove, switch the note value. In Studio, change the value in BPM Delay or the FX-Throw bar and audition against the beat.

## What is slapback delay and how do I set it (80–140ms)

Slapback is a single, fast echo with almost no feedback — it sounds like a quick doubling or a "thicker" version of the source rather than a rhythmic echo. Set Time around 80–140 ms (rockabilly vocals and electric guitar live near 100–120 ms), Feedback at 0% (one repeat only), and Mix low so it adds body without an obvious echo. It's a defining sound on classic rock-and-roll and country vocals and adds vintage attitude and width without washing the track out. In Studio, reach for the slapback delay plugin as an insert, or the slapback stage in a Vocal Doctor chain. Because the time is short and feedback is off, slapback rarely muddies a mix the way long reverb tails can. Nudge the time longer for a looser, more obvious double; shorter for a tight thickening.

## Mono vs stereo delay — which one and when

A mono delay places its repeats at the same pan position as the source (centered if the source is centered), so it stays tight and doesn't widen — best when you want the delay to reinforce a lead vocal without spreading it, or on a mono mix. Stereo delay can pan the wet repeats out to the sides (or "ping-pong" them left-right), which widens the image and opens space around a centered vocal. Use stereo delay to make a chorus feel big or to keep echoes out of the way of the dry vocal in the center. Watch mono compatibility: hard-panned ping-pong can partly cancel or shift when summed to mono (phones, club PAs), so check a mono fold-down. A common pro move is mono slapback for thickness plus a wider stereo 1/8 throw for size — two different jobs.

## When does delay keep a vocal clearer than reverb

Reverb adds a continuous wash of reflections that fills the gaps in a performance — beautiful, but it can blur consonants and push a vocal back so it sounds distant. Delay produces discrete repeats with silence between them, so it adds depth and space while leaving the dry vocal's transients and intelligibility intact. For a vocal that needs to stay up-front and crisp (modern pop, rap, anything lyric-forward), a tempo-synced 1/4 or dotted-1/8 delay often reads as "space" better than a long reverb. A classic combo: a touch of slapback for body, a tempo delay for size, and only a small amount of reverb to glue. If a vocal sounds muddy or far away, try pulling reverb down and adding delay instead.

## How do I stop my delay from muddying the mix (EQ the repeats)

Long or bright echoes pile up energy and clutter the mix, especially in the low-mids and harsh highs. The fix is to EQ the wet signal so the repeats sit behind the dry sound. The cleanest way is to put the delay on an Aux Input (a bus return): make an Aux, send the track to it, set the delay 100% wet on the aux, then add an EQ (EQ-6 or DeMartin EQ) after it. High-pass the returns around 150–300 Hz to clear low-mud and low-pass around 5–8 kHz so the echoes feel darker and further back. Pulling a few dB out of 2–4 kHz on the repeats keeps them from competing with the vocal's presence. Tape Delay also naturally darkens repeats via its feedback path, which is why tape echoes blend so easily.

## How do I do tempo-synced delay throws on just one word

A "throw" is a delay that catches only a single word or phrase — the end of a line echoes out while the rest stays dry. The easy way in Studio is the FX-Throw bar: select one word (or a whole selection) and apply a tempo-synced delay throw, so only that bit gets repeats. Doing it the manual automation way, you'd send to a delay aux and ride the send up for just that word, then back down — Studio's word-level throw does this for you. Keep feedback moderate (30–50%) so the throw trails off over a bar or two, and use a stereo or dotted-1/8 setting so the echo opens up after the dry word. This is the go-to ad-lib and hook effect in modern vocals.

## How do I get the warm vintage tape-echo sound

Tape delay emulates an old tape machine: each repeat is slightly darker, a touch saturated, and subtly pitch-wobbly (wow and flutter), which is why tape echoes sound warm and "blend" instead of sounding sterile. Use Tape Delay (insert) and set a note value plus moderate feedback (30–50%) so the repeats decay and lose top end naturally with each pass — that self-filtering is what keeps long tape trails from getting harsh. Push the saturation/drive for grit on guitars and synths, or keep it gentle on vocals. For extra vintage motion, lean into the flutter slightly. If you want a cleaner, more modern digital echo instead, a straight BPM Delay with EQ on the repeats stays brighter and more precise — it's a taste call.

## Insert vs send (Aux) delay — which routing should I use

Putting a delay as an insert on the track is fast and fine for slapback or one quick effect — you control the blend with the plugin's Mix knob. But for vocals it's often better to use a send: make an Aux Input (which creates a bus), send the track to it, set the delay 100% wet on the aux, and blend with the send level. The send approach lets you EQ and compress the delay separately, share one delay across several tracks (backing vocals, doubles), and automate the throw amount per word. Pre-fader vs post-fader matters: post-fader (the usual choice) means the echo level follows the track fader, so it stays balanced when you ride the vocal. Use inserts for slapback, sends for tempo throws and reverb-style depth.
