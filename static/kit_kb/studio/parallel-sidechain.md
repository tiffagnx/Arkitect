# Parallel & sidechain compression

## What is parallel (New York) compression and when do I use it

Parallel compression means blending a heavily-crushed copy of a track UNDER the clean original, so you add weight and sustain without squashing the transients you love. The dry track stays open and punchy; the smashed copy fills in the body and glues everything together. Use it when a vocal, drum bus, or full mix feels thin and inconsistent but you don't want to flatten it with one hard compressor. It's a confidence trick: you keep the dynamic peaks AND the dense floor. Start by mixing the crushed copy roughly 15-25 dB down, then bring it up until the track sounds fuller, and back off the moment it starts to sound lifeless.

## How do I set up parallel compression in the DAW

Use a send to an Aux Input, not a duplicate clip, so one fader controls the blend. On the source track add a send (bank A-E, pick a free letter) and route it to a new bus; make an Aux Input track as that bus's return. Put a Compressor on the Aux and crush it hard. Then ride the Aux fader UP under the dry track until it thickens. Keep the source send POST-fader so the parallel blend tracks your dry-level moves and rides automation. (Vocal Doctor builds a SERIAL insert chain plus a reverb send, not a parallel-comp aux — so set parallel up by hand as above.)

## What compressor settings for parallel drum compression

On the parallel Aux Compressor, go aggressive because you only hear it blended underneath. Start ratio 4:1 to 10:1, threshold low enough for 10-20 dB of gain reduction on the loudest hits, and release fast-to-medium (50-150 ms) so it breathes with the groove. Attack is a taste call: a fast attack (1-10 ms) crushes everything for max density, while a medium attack (10-30 ms) lets the stick transient slip through so you keep snap on top of a swelling body — try both. Then blend the Aux up under the dry drum bus until the kit sounds bigger and more "in your face," and back off a hair. Add a touch of Saturator on the Aux for extra grit if you want it nastier.

## How do I make a thin vocal sound fuller with parallel compression

Send the vocal to an Aux and put a Compressor on it with ratio 4:1-8:1, threshold for about 8-15 dB of reduction, medium attack (5-15 ms), medium release (80-150 ms). Blend this crushed copy under the lead at maybe -18 dB and raise it until quiet words sit forward and the vocal feels consistent without you hearing the compression "working." Roll a little low end off the parallel copy first with EQ-6 or DeMartin EQ (high-pass around 100-150 Hz) so it adds presence, not mud. A bit of Saturator on the Aux adds harmonics that help the vocal cut on small speakers. This is gentler than crushing the dry vocal directly.

## What is sidechain compression and ducking

Sidechain compression makes one sound automatically turn DOWN whenever another sound plays, by feeding the second sound into the compressor's detector instead of the audio being compressed. The classic use is "ducking": a music bed dips under a voiceover, or a bass dips out of the way of a kick so both stay clear. Heads-up on THIS DAW: the Compressor self-keys (it reacts to its own input) and there is no UI control to pick an external trigger track yet, so true external sidechain isn't a one-click feature here. The reliable way to get the same result is volume automation — see "What if I can't route a sidechain trigger." The settings below still teach you the target shape (depth = threshold/ratio, speed = attack/release) so you know what to dial in by hand.

## How do I duck the bass under the kick

Goal: the bass briefly steps aside on each kick hit, clearing the low end. Because this DAW's Compressor can't take the kick as an external key, do it with volume automation on the bass — dip the bass level down on every kick and let it spring back. Target shape: about 3-6 dB of dip, drop nearly instant, recovery 80-150 ms so the bass is back right before the next hit (faster tempo = shorter recovery). Draw one move, then Duplicate (Ctrl+D) it across the section. Often cleaner alongside EQ, not instead: carve a small dip in the bass around the kick's fundamental (50-100 Hz) AND duck. Tune the recovery by ear until the bass breathes in time without choking. Subtle unless you want it obvious.

## How do I duck a music bed under a vocal or voiceover

This is the easiest ducking to do by hand here, since program-bed ducking is slow and forgiving. Automate the music/instrumental bus volume DOWN whenever the vocal speaks and back UP in the gaps. Target shape: dip 2-4 dB (a voiceover over a podcast bed can go 4-6 dB), ease it down over ~10-30 ms so it doesn't snap, and let it swell back over ~200-400 ms between phrases. The point is intelligibility: the listener should feel the vocal is clearer, not consciously hear the music jumping. Set the dip depth so the words are always on top without the music feeling like it disappears. (If you ever bus the music so the compressor's self-key tracks the loud vocal sitting in it, that's a hack — automation is the dependable route.)

## How do I get the EDM sidechain pump effect

The pump is ducking pushed hard for groove: pads, bass, and chords all dip on every kick and breathe back in, creating that rhythmic "in-out" feel. Since there's no external-key picker here, build it with volume automation on the synth/pad bus, one shape per beat. Target shape: dip 6-12 dB, drop near-instant (~0-3 ms feel), and tune the recovery to the tempo so it's fully back by the next beat — roughly 100-300 ms depending on BPM. The recovery curve IS the groove, so adjust it by ear against the beat. Draw one beat's move, then Duplicate (Ctrl+D) it across the bar/section so every downbeat pumps identically. Keep the kick itself OFF that bus so it doesn't get ducked too.

## How do I make reverb and delay only bloom in the gaps (ducked FX)

Ducked reverb/delay keeps your FX out of the way while the vocal is dry and busy, then lets the tail bloom in the spaces between phrases — clarity plus depth. Send the vocal to a reverb/delay Aux (TIFF VERB / DeMartin Reverb or Tape Delay). To duck it without an external key, automate the FX return's volume DOWN while the vocal is singing and UP in the gaps — pull it down ~4-8 dB during phrases, then let it spring back over ~150-300 ms so the tail rushes in as soon as the singer pauses. Because it's hidden under the dry vocal, you can run the wet level louder than normal and only hear it surface in the gaps. Tune the recovery so the tail re-enters smoothly, not as an abrupt swell.

## What if I can't route a sidechain trigger in the DAW

You usually can't here: the Compressor self-keys and there's no UI to feed it an external trigger, so don't expect a one-click sidechain. The dependable answer is volume automation — draw the ducked track's level DOWN on each kick or phrase and let it spring back. This gives exact control over depth and shape and is rock-solid for slow program-bed ducking (music under a voiceover). For a rhythmic pump, draw ONE beat's dip-and-recover move, then Duplicate (Ctrl+D) it across the bar so every downbeat ducks identically. It's manual, but it's precise and never breaks. A bus-based hack — letting a loud source already on the bus self-key the compressor — can sometimes fake it, but it's fiddly; reach for automation first.

## Common mistakes with parallel and sidechain compression

Blending the parallel copy too loud kills your transients and makes things sound smaller, not bigger — bring it up until it helps, then back off. Forgetting to high-pass the parallel copy adds boom and mud; roll off below ~100 Hz on vocals. On sidechain ducking, too slow an attack lets the trigger bleed through before ducking, and too long a release leaves a hole that never recovers, so tune release to the tempo. Over-ducking the music bed under a vocal makes the track lurch — 2-4 dB is plenty for most program ducking. And remember none of these are required: reach for them when a track needs glue, space, or groove, not on every channel by reflex.
