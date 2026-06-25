# Recording clean & gain staging

## What level should I record at — the tracking sweet spot

Aim for peaks landing around -18 to -12 dBFS while you track, with the loudest moments touching maybe -10 dBFS. That is NOT a quietness rule — it leaves headroom so a sudden loud word or snare hit does not slam into 0 dBFS and clip. Set this with the gain knob on your audio interface (the analog gain BEFORE the converter), not with a fader inside the DAW. Watch the track meter and the Record-level coach as you do a loud rehearsal pass, then back the interface gain off until the hottest peaks sit under -10. The exact target is taste and source: aggressive rap vocals run hotter and more consistent, a dynamic singer needs more room. The point is room to spare, not a magic number.

## Why is 0 dBFS the ceiling and what is headroom

In digital audio 0 dBFS (decibels Full Scale) is the absolute top — the loudest number the file can hold. There is nothing above it; the meter cannot go past 0. Headroom is simply the empty space between your loudest peak and that 0 ceiling. If your peaks hit -12 dBFS you have 12 dB of headroom. You want headroom while tracking and mixing so transients, plugin overshoots, and summing don't run out of room and distort. Old analog gear had soft, forgiving headroom above its "0"; digital does not — once you hit 0 dBFS the sample is just clamped. Treat 0 as a wall, not a target.

## Why does digital clipping sound so bad and can I undo it

When a signal tries to go past 0 dBFS, the converter or DAW simply chops the tops off the waveform into flat lines. Those flat tops add harsh high-frequency harmonics — a crackly, fizzy, ugly distortion, very different from the smooth saturation of overdriven analog gear. The worst part: it is permanent. The information above 0 was never recorded, so no plugin can rebuild it. Lowering the fader afterward just gives you a quieter version of the same distorted file. The only real fix is to re-record with more headroom. If you can't re-record, the Saturator (to soften the harsh edges), a gentle DeMartin EQ dip in the fizzy 3-8 kHz region, and Cleanup (denoise) to reduce crackle can mask mild clipping — but they can't truly repair it. Prevention is the whole game.

## How does the Record-level coach help me set my gain

The Record-level coach watches your live input in real dBFS and tells you, in plain language, whether your interface gain is in the sweet spot before you commit a take. Play or sing your LOUDEST part while it watches — the loud part is what decides your gain, not the quiet part. It flags when peaks are too hot (creeping toward 0 dBFS, risk of clipping) or too quiet (buried near the noise floor). Adjust the gain knob on your interface, not a DAW fader, until the coach reports you're parked around -18 to -12 with the hottest peaks under -10. Because clipping is irreversible and a quiet-but-clean track can always be turned up later, the coach biases you slightly conservative on purpose.

## What is the difference between true-peak and sample-peak

A normal peak meter shows sample-peak — the highest individual sample value in the file. True-peak estimates the level of the actual analog waveform reconstructed BETWEEN those samples, which can ride higher than any single sample (these are inter-sample peaks). A file can read -0.1 dBFS sample-peak yet have true peaks over 0 dBTP, which then distort in MP3/AAC encoders, streaming players, and cheap D/A converters. While tracking it barely matters — your -12 dBFS headroom covers it. It matters at the master: leave -1 dBTP of true-peak headroom so the file survives lossy encoding. Set the output ceiling on the Maximizer/limiter to around -1.0 dBTP rather than 0.

## Should I set gain before or after my plugins

Get the level right at the FRONT of the chain, before processing. Many plugins — compressors, saturators, tube/tape emulations, and EQ with drive — react to how hard you hit them, so feeding a wildly hot or weak signal changes the sound and the threshold math. The clean order is: good tracked level → a gain/trim stage if needed → then EQ, compressor, etc. If a take came in too quiet or too hot, fix the level first so every downstream plugin sees what it expects. In Studio there's no inline trim insert — instead ride clip gain (drag the dB badge on the bottom-left of the clip; non-destructive) or bake a fixed change in with the Gain processor. Both land on the clip BEFORE the insert chain, so your EQ-6 / DeMartin EQ, Compressor, and the rest then process an already-correct level.

## What is unity gain and how do I keep my levels honest

Unity gain means a plugin or fader passes signal through without changing its overall level — what goes in comes out at the same loudness. It matters because we judge "better" partly by "louder": if a plugin makes the signal hotter, it can fool you into thinking it improved the sound. To compare fairly, match the plugin's output to its input (use the plugin's output/makeup gain so bypassed and active sound equally loud), then decide by tone alone. After a compressor, use its makeup gain to bring the output back to roughly where the input was — that is unity. Keep your channel faders near 0 dB (unity) during tracking and early mixing so you're not fighting an extreme fader position from the start.

## How do I leave room before the limiter on my master

The Maximizer/limiter on the master raises loudness and stops peaks from passing a ceiling — but it works best when the mix arriving at it is controlled, not already maxed out. Aim for your full mix to peak around -6 dBFS into the limiter so it has clean material to work with, then let the limiter do the final lift. Set the limiter's output ceiling to about -1.0 dBTP (true-peak) so the file survives streaming and MP3 conversion. How loud the final master should be is taste and platform: many streaming targets land around -14 LUFS integrated, while club/loud genres push louder and accept more limiting. Push the limiter only until it starts squashing transients and pumping — then back off.

## How do I fix a recording that came in too quiet

A quiet but CLEAN take is easy to save — turning it up just turns up a faithful signal, though it also raises the noise floor (hiss, room hum). First raise it with clip gain (drag the dB badge on the clip) or the Gain processor to bring peaks back into the -18 to -12 range, then process normally. If the lifted level exposes hiss, use the Cleanup (denoise) plugin and a Gate to tame the gaps between phrases. If the dynamics are now uneven, a Compressor evens them out. The trade-off: every dB you add also adds that much noise, so denoise and gate AFTER you've set the level. For next time, re-track with more interface gain — a clean louder source always beats lifting a weak one.

## How do I fix a recording that is too hot or clipped

First check whether it actually clipped (flat-topped, audibly crackly) or is just loud-but-clean. If it's only loud, pull it down with clip gain (the dB badge on the clip) or the Gain processor to restore headroom and move on. If it truly clipped at 0 dBFS, the distortion is baked in — lowering the level only makes it quieter, not cleaner — so the honest fix is to re-record with the interface gain backed off until peaks sit under -10 dBFS. If re-recording is impossible, you can soften mild clipping: tame the harsh artifacts with the DeMartin EQ (gently dip the fizzy 3-8 kHz region by ear), smear the edges a touch with the Saturator, and use Cleanup to reduce crackle. These mask, they don't repair — set the input right at the source.
